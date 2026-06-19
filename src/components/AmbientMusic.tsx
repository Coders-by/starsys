import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function AmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [soundMode, setSoundMode] = useState<'tea' | 'cosmos'>('tea');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lowDroneOscRef = useRef<OscillatorNode | null>(null);
  const lowDroneOsc2Ref = useRef<OscillatorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const timerRef = useRef<any>(null);

  // Initialize Web Audio graph
  const startAudio = () => {
    try {
      if (!audioCtxRef.current) {
        // Create AudioContext (fallback for older browsers)
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master output gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Filter for low-pass warm analog feel
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(soundMode === 'tea' ? 320 : 220, ctx.currentTime);
      lowpass.connect(masterGain);
      filterNodeRef.current = lowpass;

      // 1. Warm background drone oscillator 1 (Root note: D2 / A2)
      const drone1 = ctx.createOscillator();
      drone1.type = 'triangle';
      drone1.frequency.setValueAtTime(soundMode === 'tea' ? 146.83 : 110.00, ctx.currentTime); // D3 or A2
      
      const droneGain1 = ctx.createGain();
      droneGain1.gain.setValueAtTime(0.12, ctx.currentTime);

      drone1.connect(droneGain1);
      droneGain1.connect(lowpass);
      drone1.start();
      lowDroneOscRef.current = drone1;

      // 2. Warm background drone oscillator 2 (Fifth interval for harmony)
      const drone2 = ctx.createOscillator();
      drone2.type = 'sine';
      drone2.frequency.setValueAtTime(soundMode === 'tea' ? 220.00 : 164.81, ctx.currentTime); // A3 or E3
      
      const droneGain2 = ctx.createGain();
      droneGain2.gain.setValueAtTime(0.08, ctx.currentTime);

      drone2.connect(droneGain2);
      droneGain2.connect(lowpass);
      drone2.start();
      lowDroneOsc2Ref.current = drone2;

      // 3. Play randomized gentle chimes/notes on a pentatonic scale periodically
      const scale = soundMode === 'tea' 
        ? [293.66, 329.63, 392.00, 440.00, 523.25, 587.33] // D4, E4, G4, A4, C5, D5
        : [220.00, 277.18, 329.63, 440.00, 554.37, 659.25]; // A3, C#4, E4, A4, C#5, E5

      const triggerChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
        
        const now = audioCtxRef.current.currentTime;
        const noteFreq = scale[Math.floor(Math.random() * scale.length)];
        
        // Chime Oscillator
        const osc = audioCtxRef.current.createOscillator();
        osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(noteFreq, now);

        // Chime Gain envelope (Slow attack, very long decay)
        const chimeGain = audioCtxRef.current.createGain();
        chimeGain.gain.setValueAtTime(0, now);
        chimeGain.gain.linearRampToValueAtTime(0.06 + Math.random() * 0.05, now + 1.2); // Slow rise
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5 + Math.random() * 3); // Extremely long decay

        // Connect through lowpass so it sounds gentle
        osc.connect(chimeGain);
        chimeGain.connect(lowpass);
        
        osc.start(now);
        osc.stop(now + 9);
      };

      // Set chime scheduler interval (chimes trigger every 3 to 6 seconds randomly)
      const scheduleNextChime = () => {
        triggerChime();
        const randDelay = 3000 + Math.random() * 3500;
        timerRef.current = setTimeout(scheduleNextChime, randDelay);
      };

      scheduleNextChime();
      setIsPlaying(true);
    } catch (e) {
      console.warn("Failed to start AudioContext:", e);
    }
  };

  const stopAudio = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    try {
      if (lowDroneOscRef.current) {
        lowDroneOscRef.current.stop();
        lowDroneOscRef.current.disconnect();
        lowDroneOscRef.current = null;
      }
      if (lowDroneOsc2Ref.current) {
        lowDroneOsc2Ref.current.stop();
        lowDroneOsc2Ref.current.disconnect();
        lowDroneOsc2Ref.current = null;
      }
    } catch {}
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Handle live volume updates
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Handle safe cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      try {
        if (lowDroneOscRef.current) lowDroneOscRef.current.stop();
        if (lowDroneOsc2Ref.current) lowDroneOsc2Ref.current.stop();
      } catch {}
    };
  }, []);

  // Update filter on mode change
  useEffect(() => {
    if (isPlaying) {
      stopAudio();
      setTimeout(() => {
        startAudio();
      }, 50);
    }
  }, [soundMode]);

  return (
    <div className="bg-stone-950/70 border border-stone-850 p-3 rounded-2xl flex items-center justify-between text-[11px] text-stone-400 gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlayback}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
            isPlaying 
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.25)] animate-pulse' 
              : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
          }`}
          aria-label={isPlaying ? 'Pause Ambient Synth' : 'Play Ambient Synth'}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-bounce-slow" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
        <div>
          <span className="text-[10px] font-bold text-stone-300 block leading-none flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-rose-400" />
            <span>宇宙白茶背景心流音</span>
          </span>
          <span className="text-[8px] text-stone-500 font-mono">
            {isPlaying ? '🎧 正在轻柔伴奏 - Web Audio' : '🔇 点击左侧喇叭，开启温馨和声'}
          </span>
        </div>
      </div>

      {/* Control sliders and mode selectors */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex gap-1 bg-stone-900/60 p-0.5 rounded-lg border border-stone-850">
          <button
            onClick={() => setSoundMode('tea')}
            className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold transition-all ${
              soundMode === 'tea' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'text-stone-600 hover:text-stone-400 border border-transparent'
            }`}
          >
            🍵 茗香
          </button>
          <button
            onClick={() => setSoundMode('cosmos')}
            className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold transition-all ${
              soundMode === 'cosmos' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/15' : 'text-stone-600 hover:text-stone-400 border border-transparent'
            }`}
          >
            🌌 星宇
          </button>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[8px] text-stone-600">音量</span>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-12 h-1 accent-rose-500 rounded-lg cursor-pointer bg-stone-800"
          />
        </div>
      </div>
    </div>
  );
}
