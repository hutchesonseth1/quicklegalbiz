"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

const KEY = "lp_unlock_until";

export default function useIdleLock(ttlMs = 15 * 60 * 1000) {
  const now = () => Date.now();

  const readExpiry = () => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  };

  const [expiry, setExpiry] = useState<number>(0);

  // initialize from localStorage
  useEffect(() => { setExpiry(readExpiry()); }, []);

  const unlocked = useMemo(() => expiry > now(), [expiry]);

  const lock = useCallback(() => {
    localStorage.removeItem(KEY);
    setExpiry(0);
  }, []);

  const unlock = useCallback(() => {
    const e = now() + ttlMs;
    localStorage.setItem(KEY, String(e));
    setExpiry(e);
  }, [ttlMs]);

  // while unlocked, extend on user activity
  useEffect(() => {
    if (!unlocked) return;
    const bump = () => {
      const e = now() + ttlMs;
      localStorage.setItem(KEY, String(e));
      setExpiry(e);
      const [remain, setRemain] = useState(0);
useEffect(() => {
  const id = setInterval(() => setRemain(Math.max(0, (expiry - Date.now())/1000|0)), 1000);
  return () => clearInterval(id);
}, [expiry]);
// ...
<span className="text-xs opacity-60">
  Auto-lock in {Math.floor(remain/60)}:{String(remain%60).padStart(2,"0")}
</span>

    };
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach(ev => window.addEventListener(ev, bump, { passive: true }));
    return () => events.forEach(ev => window.removeEventListener(ev, bump));
  }, [unlocked, ttlMs]);

  // poll so UI updates when expiry lapses
  useEffect(() => {
    const id = setInterval(() => {
      const e = readExpiry();
      if (e !== expiry) setExpiry(e);
    }, 5000);
    return () => clearInterval(id);
  }, [expiry]);
useEffect(() => {
  const onHide = () => document.visibilityState === "hidden" && lock();
  document.addEventListener("visibilitychange", onHide);
  return () => document.removeEventListener("visibilitychange", onHide);
}, [lock]);


  return { unlocked, lock, unlock, ttlMs, expiry };
}
