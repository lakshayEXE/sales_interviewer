import React, { useRef, useEffect } from 'react';

import { AudioPlayer } from '../services/AudioPlayer';
import { AudioRecorder } from '../services/AudioRecorder';

interface VisualizerProps {
  audioPlayerRef: React.RefObject<AudioPlayer | null>;
  audioRecorderRef: React.RefObject<AudioRecorder | null>;
  showAura?: boolean;
}

interface Ripple {
  radius: number;
  alpha: number;
  speaker: 'ai' | 'user';
}

const AI_COLOR = { r: 204, g: 120, b: 92 };   // clay
const USER_COLOR = { r: 106, g: 155, b: 204 }; // sky

export const Visualizer: React.FC<VisualizerProps> = ({ audioPlayerRef, audioRecorderRef, showAura = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;
    let smoothAi = 0;
    let smoothMic = 0;
    const ripples: Ripple[] = [];
    let frame = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Keep the drawing buffer in sync with the displayed size every frame.
      // This stays correct even while the PiP card is animating its size.
      const dpr = window.devicePixelRatio || 1;
      const bufW = Math.round(w * dpr);
      const bufH = Math.round(h * dpr);
      if (canvas.width !== bufW || canvas.height !== bufH) {
        canvas.width = bufW;
        canvas.height = bufH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      phase += 0.02;
      frame++;

      // Pull volumes directly from the refs instead of React state
      const rawAi = audioPlayerRef.current?.getVolume() || 0;
      const rawMic = audioRecorderRef.current?.getVolume() || 0;

      // Update the Aura div directly via DOM for zero-render performance
      if (auraRef.current) {
        auraRef.current.style.opacity = `${0.35 + Math.min(0.55, rawAi * 0.012)}`;
        const child = auraRef.current.firstChild as HTMLElement;
        if (child) {
          const size = 340 + Math.min(140, rawAi * 2.4);
          child.style.width = `${size}px`;
          child.style.height = `${size}px`;
          child.style.filter = `blur(${36 + Math.min(28, rawAi * 0.5)}px)`;
        }
      }

      // Smooth the incoming volumes (0..~128 typical)
      const targetAi = Math.min(1, rawAi / 70);
      const targetMic = Math.min(1, rawMic / 70);
      smoothAi = lerp(smoothAi, targetAi, 0.12);
      smoothMic = lerp(smoothMic, targetMic, 0.12);

      const aiActive = smoothAi > smoothMic;
      const level = Math.max(smoothAi, smoothMic);
      const color = aiActive ? AI_COLOR : USER_COLOR;
      const colStr = (a: number) => `rgba(${color.r}, ${color.g}, ${color.b}, ${a})`;

      const baseRadius = Math.min(w, h) * 0.16;
      const breathe = Math.sin(phase * 1.5) * 0.04 + 1;
      const radius = baseRadius * breathe * (1 + level * 0.9);

      // Emit ripples while someone is actively speaking
      if (level > 0.12 && frame % 18 === 0) {
        ripples.push({ radius: radius, alpha: 0.5, speaker: aiActive ? 'ai' : 'user' });
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += 1.6 + level * 2;
        rp.alpha -= 0.006;
        if (rp.alpha <= 0) { ripples.splice(i, 1); continue; }
        const rc = rp.speaker === 'ai' ? AI_COLOR : USER_COLOR;
        ctx.beginPath();
        ctx.arc(cx, cy, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rc.r}, ${rc.g}, ${rc.b}, ${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Outer ambient glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 3);
      glow.addColorStop(0, colStr(0.18 + level * 0.25));
      glow.addColorStop(1, colStr(0));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Core orb with soft gradient
      const orb = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, radius * 0.1,
        cx, cy, radius
      );
      orb.addColorStop(0, colStr(0.95));
      orb.addColorStop(0.6, colStr(0.55));
      orb.addColorStop(1, colStr(0.15));
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = orb;
      ctx.shadowBlur = 30 + level * 50;
      ctx.shadowColor = colStr(0.6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Thin reactive ring around the orb
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = colStr(0.2 + level * 0.3);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
      {/* Audio-reactive aura: softly breathes with the AI's voice */}
      {showAura && (
        <div
          ref={auraRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: 0.35 }}
        >
          <div
            className="rounded-full transition-[width,height,filter] duration-200"
            style={{
              width: '340px',
              height: '340px',
              background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.35), rgba(56, 189, 248, 0) 70%)',
              filter: 'blur(36px)',
            }}
          />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full relative z-10" />
    </div>
  );
};
