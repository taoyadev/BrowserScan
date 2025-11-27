'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MouseStats {
  entropy: number;
  pointCount: number;
  avgSpeed: number;
  linearity: number;
  verdict: 'human' | 'suspicious' | 'bot';
}

export default function BehaviorSimPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stats, setStats] = useState<MouseStats>({
    entropy: 0,
    pointCount: 0,
    avgSpeed: 0,
    linearity: 100,
    verdict: 'bot'
  });
  const [isTracking, setIsTracking] = useState(false);
  const pointsRef = useRef<{ x: number; y: number; t: number }[]>([]);

  const calculateStats = useCallback((points: { x: number; y: number; t: number }[]) => {
    if (points.length < 2) return;

    // Calculate speeds
    let totalSpeed = 0;
    let speedVariance = 0;
    const speeds: number[] = [];

    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const dt = points[i].t - points[i - 1].t;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dt > 0 ? dist / dt : 0;
      speeds.push(speed);
      totalSpeed += speed;
    }

    const avgSpeed = speeds.length > 0 ? totalSpeed / speeds.length : 0;

    // Calculate speed variance (entropy indicator)
    if (speeds.length > 1) {
      for (const speed of speeds) {
        speedVariance += Math.pow(speed - avgSpeed, 2);
      }
      speedVariance = Math.sqrt(speedVariance / speeds.length);
    }

    // Calculate linearity (how straight the path is)
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const directDist = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
    );
    let totalDist = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      totalDist += Math.sqrt(dx * dx + dy * dy);
    }
    const linearity = totalDist > 0 ? Math.min(100, (directDist / totalDist) * 100) : 100;

    // Calculate entropy score (higher is more human-like)
    const entropy = Math.min(100, speedVariance * 10 + (100 - linearity) * 0.5);

    // Determine verdict
    let verdict: 'human' | 'suspicious' | 'bot' = 'bot';
    if (entropy > 40 && linearity < 90 && points.length > 20) {
      verdict = 'human';
    } else if (entropy > 20 || (linearity < 95 && points.length > 10)) {
      verdict = 'suspicious';
    }

    setStats({
      entropy,
      pointCount: points.length,
      avgSpeed: avgSpeed * 1000, // Convert to px/s
      linearity,
      verdict
    });
  }, []);

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 0.5;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    pointsRef.current = [];
    setStats({ entropy: 0, pointCount: 0, avgSpeed: 0, linearity: 100, verdict: 'bot' });
    setIsTracking(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial canvas setup
    resetCanvas();

    let lastPoint: { x: number; y: number } | null = null;

    function handleMove(event: MouseEvent) {
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * (canvas.width / rect.width);
      const y = (event.clientY - rect.top) * (canvas.height / rect.height);

      // Add point
      pointsRef.current.push({ x, y, t: Date.now() });
      setIsTracking(true);

      // Draw line
      if (lastPoint) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw point
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      lastPoint = { x, y };

      // Update stats every 5 points
      if (pointsRef.current.length % 5 === 0) {
        calculateStats(pointsRef.current);
      }
    }

    function handleLeave() {
      lastPoint = null;
      if (pointsRef.current.length > 0) {
        calculateStats(pointsRef.current);
      }
    }

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
    };
  }, [calculateStats, resetCanvas]);

  const verdictColors = {
    human: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    suspicious: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    bot: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* Header */}
      <div>
        <Link href="/simulation" className="text-xs text-zinc-500 hover:text-zinc-400">← Back to Simulations</Link>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-zinc-500">BrowserScan Simulation</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Behavioral Telemetry</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Move your cursor in the canvas below to analyze mouse trajectory patterns.
          Real-time entropy calculation detects human vs automated movement.
        </p>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-5"
      >
        <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-center">
          <p className="text-xs text-zinc-500">Entropy</p>
          <p className="text-lg font-semibold text-emerald-400">{stats.entropy.toFixed(1)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-center">
          <p className="text-xs text-zinc-500">Points</p>
          <p className="text-lg font-semibold text-zinc-200">{stats.pointCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-center">
          <p className="text-xs text-zinc-500">Avg Speed</p>
          <p className="text-lg font-semibold text-zinc-200">{stats.avgSpeed.toFixed(0)} px/s</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-black/40 p-3 text-center">
          <p className="text-xs text-zinc-500">Linearity</p>
          <p className="text-lg font-semibold text-zinc-200">{stats.linearity.toFixed(1)}%</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${verdictColors[stats.verdict]}`}>
          <p className="text-xs opacity-70">Verdict</p>
          <p className="text-lg font-semibold capitalize">{stats.verdict}</p>
        </div>
      </motion.div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full rounded-2xl border border-zinc-800/80 cursor-crosshair"
        />
        {!isTracking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-zinc-600 text-sm">Move your cursor here to start tracking</p>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={resetCanvas}
        className="w-full rounded-xl border border-zinc-700 bg-black/40 py-3 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-300"
      >
        Reset Canvas
      </button>

      {/* Detection Factors */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-5">
          <h3 className="text-sm font-semibold text-zinc-100">Human Indicators</h3>
          <ul className="mt-3 space-y-2 text-xs text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">+</span>
              High speed variance (natural hesitation)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">+</span>
              Curved, non-linear trajectories
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">+</span>
              Micro-corrections and overshoots
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">+</span>
              Variable dwell times
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-black/40 p-5">
          <h3 className="text-sm font-semibold text-zinc-100">Bot Indicators</h3>
          <ul className="mt-3 space-y-2 text-xs text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-rose-400">-</span>
              Constant movement speed
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-400">-</span>
              Perfect straight lines
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-400">-</span>
              Precise pixel-perfect targeting
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-400">-</span>
              No natural jitter or noise
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
