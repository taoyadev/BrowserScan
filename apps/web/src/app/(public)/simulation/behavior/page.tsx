'use client';

import { useEffect, useRef, useState } from 'react';

export default function BehaviorSimPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [entropy, setEntropy] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.beginPath();

    let started = false;

    function handleMove(event: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      setEntropy((prev) => Math.min(100, prev + Math.random() * 2));
    }

    canvas.addEventListener('mousemove', handleMove);
    return () => canvas.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Simulation</p>
        <h1 className="text-3xl font-semibold text-zinc-50">Behavioral Telemetry</h1>
        <p className="text-sm text-zinc-400">Move your cursor to visualize pathing. Entropy score approximates randomness quality.</p>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-zinc-400">Entropy Score: {entropy.toFixed(1)}</p>
        <canvas ref={canvasRef} width={600} height={300} className="w-full rounded-2xl border border-zinc-800/80 bg-black/60">
          Browser does not support canvas.
        </canvas>
      </div>
    </div>
  );
}
