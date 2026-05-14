"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

type Ripple = {
  cx: number;
  cy: number;
  born: number;
  strength: number;
};

const MAX_RIPPLES = 8;
const RIPPLE_LIFETIME_MS = 5200;

/** Pointer: higher = calmer (less ripple spam while moving). */
const MOVE_EMIT_MIN_DIST_PX = 120;
const MOVE_EMIT_MIN_INTERVAL_MS = 240;
const CLICK_RIPPLE_STRENGTH = 0.62;
const MOVE_RIPPLE_STRENGTH = 0.12;

/** Wave amplitude (lower = subtler distortion). */
const WAVE_DISP_SCALE = 8;
const HALO_RADIUS = 220;
const HALO_STRENGTH = 0.2;
const HALO_DISP_SCALE = 3.5;

/** Stroke: lower = more translucent grid + glow. */
const GLOW_MIX_K = 0.16;
const GLOW_MIX_FLOOR = 0.03;
const ALPHA_CAP = 0.26;
const LINE_WIDTH_GLOW = 0.45;

function parseColor(input: string): { r: number; g: number; b: number; a: number } {
  const s = input.trim();
  const rgba = s.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/i,
  );
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  const hex = s.replace("#", "");
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return { r, g, b, a: 1 };
  }
  if (hex.length === 6) {
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  return { r: 200, g: 210, b: 220, a: 0.08 };
}

export function RippleLineGridBackdrop({
  themeKey,
  baseLine,
  glow,
  background,
}: {
  themeKey: string;
  baseLine: string;
  glow: string;
  background: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const lastEmitRef = useRef({ x: 0, y: 0, t: 0 });
  const rafRef = useRef(0);
  const lineColorRef = useRef(parseColor(baseLine));
  const glowColorRef = useRef(parseColor(glow));

  useEffect(() => {
    lineColorRef.current = parseColor(baseLine);
    glowColorRef.current = parseColor(glow);
  }, [baseLine, glow]);

  useEffect(() => {
    ripplesRef.current = [];
  }, [themeKey]);

  const sampleWave = useCallback(
    (px: number, py: number, now: number, phaseT: number) => {
      let disp = 0;
      let energy = 0;
      for (const r of ripplesRef.current) {
        const age = (now - r.born) / 1000;
        const dx = px - r.cx;
        const dy = py - r.cy;
        const dist = Math.hypot(dx, dy);
        const ring = dist - age * 260;
        const env = Math.exp(-dist / 480) * Math.exp(-age * 0.42);
        const w = Math.sin(ring * 0.085 - age * 6.5);
        disp += r.strength * env * w * WAVE_DISP_SCALE;
        energy += r.strength * env * Math.abs(w);
      }
      if (pointerRef.current.active) {
        const dx = px - pointerRef.current.x;
        const dy = py - pointerRef.current.y;
        const d = Math.hypot(dx, dy);
        const halo = Math.exp(-d / HALO_RADIUS) * HALO_STRENGTH;
        disp += Math.sin(d * 0.048 - phaseT * 4) * halo * HALO_DISP_SCALE;
        energy += halo * 0.65;
      }
      return { disp, energy };
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(width * dpr));
      const h = Math.max(1, Math.floor(height * dpr));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const addRipple = (cx: number, cy: number, strength: number) => {
      ripplesRef.current.push({
        cx,
        cy,
        born: performance.now(),
        strength,
      });
      while (ripplesRef.current.length > MAX_RIPPLES) {
        ripplesRef.current.shift();
      }
    };

    const inWrap = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      return (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      );
    };

    const toLocal = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("button, a, input, textarea, select, [data-no-swipe]")) {
        return;
      }
      if (!inWrap(e)) return;
      const { x, y } = toLocal(e);
      addRipple(x, y, CLICK_RIPPLE_STRENGTH);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!inWrap(e)) {
        pointerRef.current.active = false;
        return;
      }
      pointerRef.current.active = true;
      const { x, y } = toLocal(e);
      pointerRef.current.x = x;
      pointerRef.current.y = y;
      const now = performance.now();
      const lx = lastEmitRef.current.x;
      const ly = lastEmitRef.current.y;
      const dt = now - lastEmitRef.current.t;
      if (
        Math.hypot(x - lx, y - ly) > MOVE_EMIT_MIN_DIST_PX &&
        dt > MOVE_EMIT_MIN_INTERVAL_MS
      ) {
        addRipple(x, y, MOVE_RIPPLE_STRENGTH);
        lastEmitRef.current = { x, y, t: now };
      }
    };

    const onLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointercancel", onLeave);
    window.addEventListener("blur", onLeave);

    const grid = 52;
    const step = 8;
    const t0 = performance.now();

    const strokeForEnergy = (energy: number) => {
      const { r: br, g: bg, b: bb, a: ba } = lineColorRef.current;
      const { r: gr, g: gg, b: gb } = glowColorRef.current;
      const glowMix = Math.min(1, energy * GLOW_MIX_K + GLOW_MIX_FLOOR);
      const r = br + (gr - br) * glowMix;
      const g = bg + (gg - bg) * glowMix;
      const b = bb + (gb - bb) * glowMix;
      const a = Math.min(
        ALPHA_CAP,
        (ba * 0.92 + (0.22 - ba * 0.35) * glowMix) * 0.88,
      );
      return {
        stroke: `rgba(${r | 0},${g | 0},${b | 0},${a})`,
        lw: 1 + glowMix * LINE_WIDTH_GLOW,
      };
    };

    const frame = (now: number) => {
      ripplesRef.current = ripplesRef.current.filter(
        (r) => now - r.born < RIPPLE_LIFETIME_MS,
      );
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const phaseT = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let y = 0; y <= h + grid; y += grid) {
        ctx.beginPath();
        let first = true;
        let eAcc = 0;
        let n = 0;
        for (let x = 0; x <= w; x += step) {
          const { disp, energy } = sampleWave(x, y, now, phaseT);
          eAcc += energy;
          n += 1;
          if (first) {
            ctx.moveTo(x, y + disp);
            first = false;
          } else {
            ctx.lineTo(x, y + disp);
          }
        }
        const { stroke, lw } = strokeForEnergy(n ? eAcc / n : 0);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lw;
        ctx.stroke();
      }

      for (let x = 0; x <= w + grid; x += grid) {
        ctx.beginPath();
        let first = true;
        let eAcc = 0;
        let n = 0;
        for (let y = 0; y <= h; y += step) {
          const { disp, energy } = sampleWave(x, y, now, phaseT);
          const alt = sampleWave(y, x, now, phaseT + 0.35);
          const off = disp * 0.82 + alt.disp * 0.18;
          eAcc += energy + alt.energy * 0.15;
          n += 1;
          if (first) {
            ctx.moveTo(x + off, y);
            first = false;
          } else {
            ctx.lineTo(x + off, y);
          }
        }
        const { stroke, lw } = strokeForEnergy(n ? eAcc / n : 0);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lw;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [sampleWave, themeKey]);

  const isDark = themeKey === "dark";
  const vignetteCenter = isDark
    ? "rgba(0,0,0,0.28)"
    : "rgba(15,23,34,0.08)";
  const bg = parseColor(background);
  const edge = `rgba(${bg.r},${bg.g},${bg.b},${isDark ? 0.42 : 0.26})`;

  return (
    <motion.div
      key={themeKey}
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.72 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 78% 70% at 50% 42%, transparent 24%, ${vignetteCenter} 100%),
            linear-gradient(to bottom, ${edge} 0%, transparent 16%, transparent 84%, ${edge} 100%),
            linear-gradient(to right, ${edge} 0%, transparent 12%, transparent 88%, ${edge} 100%)`,
        }}
        aria-hidden
      />
    </motion.div>
  );
}
