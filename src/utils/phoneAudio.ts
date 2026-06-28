let audioCtx: AudioContext | null = null;
let ringingOscillators: OscillatorNode[] = [];
let ringingInterval: ReturnType<typeof setInterval> | null = null;
let holdInterval: ReturnType<typeof setInterval> | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playDualTone(freq1: number, freq2: number, durationSecs: number, volume: number = 0.1) {
  try {
    const ctx = getAudioContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = volume;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = freq1;
    osc2.frequency.value = freq2;

    osc1.connect(gainNode);
    osc2.connect(gainNode);

    osc1.start();
    osc2.start();

    // Smooth fade out to avoid popping clicks
    gainNode.gain.setValueAtTime(volume, ctx.currentTime + durationSecs - 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSecs);
    
    osc1.stop(ctx.currentTime + durationSecs);
    osc2.stop(ctx.currentTime + durationSecs);
  } catch (e) {
    console.warn("Web Audio API failed to play tone:", e);
  }
}

export function playTransferBeep() {
  // A quick dual beep for transfer
  playDualTone(800, 1000, 0.1, 0.05);
  setTimeout(() => playDualTone(800, 1000, 0.2, 0.05), 150);
}

export function playHangupTone() {
  // Mechanical Click
  playDualTone(100, 200, 0.05, 0.1);
  // Dial tone for 2 seconds (350Hz + 440Hz standard NA dial tone)
  setTimeout(() => {
    playDualTone(350, 440, 2.0, 0.03);
  }, 100);
}

export function startRinging() {
  stopRinging(); // Ensure no overlapping intervals
  
  const playRing = () => {
    try {
      // Premium Cisco-style double chirp: 0.4s ring, 0.2s pause, 0.4s ring
      playDualTone(440, 480, 0.4, 0.08);
      setTimeout(() => {
        playDualTone(440, 480, 0.4, 0.08);
      }, 600);
    } catch (e) {
      console.warn("Web Audio API failed to play ring:", e);
    }
  };

  playRing(); // play first ring immediately
  // repeat every 4 seconds (2s ring, 2s silence)
  ringingInterval = setInterval(playRing, 4000);
}

export function stopRinging() {
  if (ringingInterval) {
    clearInterval(ringingInterval);
    ringingInterval = null;
  }
  ringingOscillators.forEach(osc => {
    try { osc.stop(); } catch(e) {}
  });
  ringingOscillators = [];
}

export function startHoldMusic() {
  stopHoldMusic();
  const playHold = () => {
    try {
      // Classic lo-fi elevator hold arpeggio (C major chord)
      playDualTone(523, 523, 0.2, 0.04);
      setTimeout(() => playDualTone(659, 659, 0.2, 0.04), 200);
      setTimeout(() => playDualTone(783, 783, 0.4, 0.04), 400);
    } catch (e) {
      console.warn("Web Audio API failed to play hold music:", e);
    }
  };
  playHold();
  holdInterval = setInterval(playHold, 2500); // Repeat every 2.5s
}

export function stopHoldMusic() {
  if (holdInterval) {
    clearInterval(holdInterval);
    holdInterval = null;
  }
}
