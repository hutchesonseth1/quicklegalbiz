"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StatusBar() {
  const [status, setStatus] = useState("Checking...");
  const [color, setColor] = useState("gray");

  async function checkStatus() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      if (res.status === 200 && res.data.status === "ok") {
        setStatus("Brain Connected ✅");
        setColor("green");
      } else {
        setStatus("Brain Offline ⚠️");
        setColor("yellow");
      }
    } catch (err) {
      setStatus("Brain Offline ⚠️");
      setColor("red");
    }
  }

  useEffect(() => {
    checkStatus(); // initial
    const interval = setInterval(checkStatus, 15000); // every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full text-center py-2 text-sm font-medium bg-${color}-100 text-${color}-800`}
    >
      {status}
    </div>
  );
}
