"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseStatForAnimation(raw: string): {
  target: number;
  format: (n: number) => string;
} | null {
  const s = raw.trim();

  const currency = s.match(/^\$\s*([\d,]+)\.(\d{2})$/);
  if (currency) {
    const target = parseFloat(`${currency[1].replace(/,/g, "")}.${currency[2]}`);
    if (!Number.isFinite(target)) return null;
    return {
      target,
      format: (n) => currencyFmt.format(Math.max(0, n)),
    };
  }

  const suffixed = s.match(/^(\d+(?:\.\d+)?)\s*([MmKkBb])$/);
  if (suffixed) {
    const target = parseFloat(suffixed[1]);
    if (!Number.isFinite(target)) return null;
    const suf = suffixed[2].toUpperCase();
    return {
      target,
      format: (n) => {
        const v = Math.max(0, n);
        const t = v.toFixed(2);
        return `${t}${suf}`;
      },
    };
  }

  if (/^\d+$/.test(s)) {
    const target = parseInt(s, 10);
    return {
      target,
      format: (n) => String(Math.round(Math.max(0, n))),
    };
  }

  return null;
}

type AnimatedStatProps = {
  value: string;
  className?: string;
  style?: CSSProperties;
  /** Default ~1.2s count-up */
  duration?: number;
  /** When this changes, the counter replays from zero (e.g. slide index). */
  playKey?: string | number;
};

export function AnimatedStat({
  value,
  className,
  style,
  duration = 1.22,
  playKey = 0,
}: AnimatedStatProps) {
  const parsed = useMemo(() => parseStatForAnimation(value), [value]);
  const [display, setDisplay] = useState(() =>
    parsed ? parsed.format(0) : value,
  );

  useEffect(() => {
    if (!parsed) {
      setDisplay(value);
      return;
    }

    setDisplay(parsed.format(0));
    const controls = animate(0, parsed.target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplay(parsed.format(latest));
      },
    });

    return () => controls.stop();
  }, [value, playKey, duration, parsed]);

  return (
    <motion.span
      className={`inline-block tabular-nums ${className ?? ""}`}
      style={style}
      initial={{ opacity: 0.25, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {parsed ? display : value}
    </motion.span>
  );
}
