import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  RotateCcw
} from 'lucide-react';
import CognitiveDlc from './CognitiveDlc';
import GoldStarReflection from './starsys/GoldStarReflection';
import BlueStarReflection from './starsys/BlueStarReflection';
import GoldStarChapter from './starsys/GoldStarChapter';
import RedStarChapter from './starsys/RedStarChapter';
import BlueStarChapter from './starsys/BlueStarChapter';

interface StarSysGameProps {
  onSyncProgress: (progress: { red: boolean; blue: boolean; gold: boolean; central: boolean }) => void;
  isMaxedCheat?: boolean; // dynamic fallback
  isStaySynthesized?: boolean; // NEW: Alchemical Stay resonance solved
}

export default function StarSysGame({ onSyncProgress, isMaxedCheat, isStaySynthesized }: StarSysGameProps) {
  // --- Orbit View & Currently Selected Cosmic Star ---
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null); // 'red', 'blue', 'gold', 'central', 'gold_satellite', null
  const [centralLockAlert, setCentralLockAlert] = useState(false);
  const [foxCommentary, setFoxCommentary] = useState<string | null>(null); // 灵狐小九冷幽默弹幕
  const [dlcSolved, setDlcSolved] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dlc_woolen_wear_badge') === 'true';
    } catch { return false; }
  });

  // --- Resonance completion states ---
  const [redSolved, setRedSolved] = useState<boolean>(() => {
    try {
      return localStorage.getItem('resonance_red_solved') === 'true';
    } catch { return false; }
  });
  const [blueSolved, setBlueSolved] = useState<boolean>(() => {
    try {
      return localStorage.getItem('resonance_blue_solved') === 'true';
    } catch { return false; }
  });
  const [goldSolved, setGoldSolved] = useState<boolean>(() => {
    try {
      return localStorage.getItem('resonance_gold_solved') === 'true';
    } catch { return false; }
  });
  const [centralSolved, setCentralSolved] = useState<boolean>(() => {
    try {
      return localStorage.getItem('resonance_central_solved') === 'true';
    } catch { return false; }
  });
  // 重置信号：handleGlobalReset 时 +1，各章子组件 useEffect 监听自清内部 state
  // （破除 handleGlobalReset 直接伸手进各章 setter 的耦合）
  const [resetNonce, setResetNonce] = useState<number>(0);

  // Keep progress parent synced
  useEffect(() => {
    onSyncProgress({
      red: redSolved,
      blue: blueSolved,
      gold: goldSolved,
      central: centralSolved
    });
  }, [redSolved, blueSolved, goldSolved, centralSolved]);

  // Synchronize on external test cheats
  useEffect(() => {
    if (isMaxedCheat) {
      setRedSolved(true);
      setBlueSolved(true);
      setGoldSolved(true);
      setCentralSolved(true);
    }
  }, [isMaxedCheat]);

  // Handle local state tracking with persistence
  const markPlanetSolved = (planet: string, status: boolean) => {
    if (planet === 'red') {
      setRedSolved(status);
      localStorage.setItem('resonance_red_solved', String(status));
    } else if (planet === 'blue') {
      setBlueSolved(status);
      localStorage.setItem('resonance_blue_solved', String(status));
    } else if (planet === 'gold') {
      setGoldSolved(status);
      localStorage.setItem('resonance_gold_solved', String(status));
    } else if (planet === 'central') {
      setCentralSolved(status);
      localStorage.setItem('resonance_central_solved', String(status));
    }
  };

  const handleGlobalReset = () => {
    setRedSolved(false);
    setBlueSolved(false);
    setGoldSolved(false);
    setCentralSolved(false);
    setDlcSolved(false);
    localStorage.removeItem('resonance_red_solved');
    localStorage.removeItem('resonance_blue_solved');
    localStorage.removeItem('resonance_gold_solved');
    localStorage.removeItem('resonance_central_solved');
    localStorage.removeItem('dlc_woolen_wear_badge');
    // 红/蓝/金星章节均已抽成子组件，靠 resetNonce 自清内部 state
    setClimaxOutcome(null);
    setFoxCommentary(null);
    setSelectedPlanet(null);
    setResetNonce((n) => n + 1);
  };

  // 灵狐小九出场触发器
  useEffect(() => {
    if (!selectedPlanet && !foxCommentary) {
      const timer = setTimeout(() => {
        setFoxCommentary('三颗星。一颗关于一段QQ消息，一颗关于一辆车，一颗关于一本书。——你猜哪颗最难？');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedPlanet]);

  // --- SUB-GAME 1: 红星 (Emotion) → 已抽出到 RedStarChapter.tsx ---
  // --- SUB-GAME 2: 蓝星 (Action) → 已抽出到 BlueStarChapter.tsx ---

  // --- SUB-GAME 3: 金星 (Wisdom/Cognition) ---
  // Drag/Select stage concept tree
  // Stages: age18, age22, age24, age26
  // --- FINAL CLIMAX: 中央恒星 (Resonance Climax) ---
  const [climaxOutcome, setClimaxOutcome] = useState<string | null>(null);

  const triggerClimaxResonance = (type: string) => {
    setClimaxOutcome(type);
    if (type === 'all') {
      markPlanetSolved('central', true);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* HEADER STATEMENT OF RESONANCE */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-stone-850 p-4 rounded-2xl relative overflow-hidden flex flex-col gap-1 shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block leading-none mb-1">Interactive Galactic Saga</span>
        <div className="flex justify-between items-center">
          <h2 className="text-base font-extrabold text-stone-100 flex items-center gap-1.5 font-sans">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>三维叙事链：《共振》废弃星域</span>
          </h2>
          <button 
            onClick={handleGlobalReset}
            className="text-[9px] text-stone-500 hover:text-stone-300 border border-stone-850/60 hover:border-stone-700 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>重置星域</span>
          </button>
        </div>
        <p className="text-[11px] text-stone-400 leading-relaxed text-left text-justify mt-1">
          《星系档案》由三颗代表成长叙事线的主星组成（红星、蓝星、金星）。解开每条叙事链背后他循环的模式，便能点亮中心融汇的恒星，释放出流向"人间烟火"的具体生活温存。
        </p>
      </div>

      {/* THE CELESTIAL MAP VIEW (Only shown if no planet is currently landed) */}
      <AnimatePresence mode="wait">
        {!selectedPlanet ? (
          <motion.div 
            key="orbit-map"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-stone-950/80 border border-stone-900/60 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[290px] overflow-hidden"
          >
            {/* Ambient nebulas glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/10 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-52 h-52 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Orbit lines */}
            <div className="absolute w-[220px] h-[220px] border border-dashed border-stone-850 rounded-full animate-spin-slow opacity-30 flex items-center justify-center">
              <div className="absolute -top-1 w-2 h-2 rounded-full bg-stone-700" />
              <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-stone-700" />
            </div>
            <div className="absolute w-[140px] h-[140px] border border-dotted border-stone-850 rounded-full animate-reverse-spin opacity-40" />

            {/* THE GALACTIC OBJECTS DISPLAY */}
            <div className="relative w-full h-[220px] flex items-center justify-center">
              
              {/* 1. RED STAR: Emotion (Left) */}
              <button 
                onClick={() => setSelectedPlanet('red')}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-300 ${
                  redSolved 
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                    : 'bg-stone-900 border border-red-500/40 hover:border-red-500 group-hover:scale-115'
                }`}>
                  <span className="text-xl">❤️</span>
                  {redSolved && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-stone-950 rounded-full p-0.5 text-[8px] font-bold">✓</span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-stone-200 mt-2 font-mono group-hover:text-red-400">红星 ㆍ 连接</span>
                <span className="text-[7.5px] text-stone-500 uppercase tracking-wider leading-none">Emotion</span>
              </button>

              {/* 2. BLUE STAR: Action (Right) */}
              <button 
                onClick={() => setSelectedPlanet('blue')}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-300 ${
                  blueSolved 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                    : 'bg-stone-900 border border-blue-500/40 hover:border-blue-500 group-hover:scale-115'
                }`}>
                  <span className="text-xl">⚡</span>
                  {blueSolved && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-stone-950 rounded-full p-0.5 text-[8px] font-bold">✓</span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-stone-200 mt-2 font-mono group-hover:text-blue-400">蓝星 ㆍ 实践</span>
                <span className="text-[7.5px] text-stone-500 uppercase tracking-wider leading-none">Action</span>
              </button>

              {/* 3. GOLD STAR: Wisdom (Top Center) */}
              <button 
                onClick={() => setSelectedPlanet('gold')}
                className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-300 ${
                  goldSolved 
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-[0_0_20px_rgba(251,191,36,0.5)]' 
                    : 'bg-stone-900 border border-amber-500/40 hover:border-amber-500 group-hover:scale-115'
                }`}>
                  <span className="text-xl">🔍</span>
                  {goldSolved && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-stone-950 rounded-full p-0.5 text-[8px] font-bold">✓</span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-stone-200 mt-2 font-mono group-hover:text-amber-400">金星 ㆍ 认知</span>
                <span className="text-[7.5px] text-stone-500 uppercase tracking-wider leading-none">Wisdom</span>
              </button>

              {/* 3.1 GOLD SATELLITE: Cognition DLC (Only visible post-central star clearing) */}
              {centralSolved && (
                <>
                  {/* Delicate orbital connection line */}
                  <div className="absolute top-[22px] left-[52%] w-[6%] h-[20px] border-t border-r border-dashed border-amber-500/20 rounded-tr-xl pointer-events-none" />
                  
                  {/* Satellite button */}
                  <button 
                    onClick={() => setSelectedPlanet('gold_satellite')}
                    className="absolute top-[6px] left-[58%] flex flex-col items-center group focus:outline-none animate-[bounce_4s_infinite_ease-in-out]"
                  >
                    <div className="w-8 h-8 rounded-full bg-stone-900 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center justify-center relative transition-all duration-300 group-hover:scale-110">
                      <span className="text-xs">🪐</span>
                      {dlcSolved && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-stone-950 rounded-full p-0.5 text-[7px] font-black leading-none">✓</span>
                      )}
                    </div>
                    <span className="text-[8.5px] font-bold text-stone-300 mt-1 font-mono group-hover:text-amber-400 leading-none">金星卫星</span>
                    <span className="text-[6.5px] text-amber-500/80 uppercase tracking-widest leading-none mt-0.5">DLC 茧</span>
                  </button>
                </>
              )}

              {/* 4. CENTRAL RESONANCE STAR (Center of everything) */}
              <button 
                onClick={() => {
                  if (redSolved && blueSolved && goldSolved) {
                    if (isStaySynthesized || isMaxedCheat) {
                      setSelectedPlanet('central');
                      setCentralLockAlert(false);
                    } else {
                      setCentralLockAlert(true);
                    }
                  }
                }}
                disabled={!(redSolved && blueSolved && goldSolved)}
                className={`absolute flex flex-col items-center group focus:outline-none transition-all duration-500 ${
                  (redSolved && blueSolved && goldSolved) ? 'scale-105 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center relative transition-all duration-500 ${
                  centralSolved 
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 shadow-[0_0_30px_rgba(245,158,11,0.7)] animate-pulse' 
                    : (redSolved && blueSolved && goldSolved && (isStaySynthesized || isMaxedCheat)) 
                      ? 'bg-yellow-500/80 border-2 border-yellow-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-bounce'
                      : 'bg-stone-900 border border-stone-800'
                }`}>
                  <span className="text-2xl">
                    {centralSolved ? '🌟' : (redSolved && blueSolved && goldSolved && (isStaySynthesized || isMaxedCheat)) ? '✨' : '🔒'}
                  </span>
                  {centralSolved && (
                    <span className="absolute -bottom-1 text-[7px] bg-emerald-500 text-stone-950 px-1 rounded-full font-extrabold uppercase animate-pulse">
                      res_on
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-extrabold text-amber-400 mt-2 font-mono">中央恒星 ㆍ 共鸣</span>
                <span className="text-[7.5px] text-stone-400 uppercase tracking-wider leading-none">Central Star</span>
              </button>

            </div>

            {centralLockAlert && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-amber-955/15 border border-amber-500/15 p-3 rounded-xl flex flex-col gap-1 text-[10.5px] text-justify text-stone-200 mb-2 relative z-20"
              >
                <div className="flex justify-between items-center text-amber-400 font-bold font-mono">
                  <span className="flex items-center gap-1 text-[10px]">🔒 生命恒星自发阻断 (System Locked)</span>
                  <button 
                    onClick={() => setCentralLockAlert(false)} 
                    className="text-stone-500 hover:text-stone-300 text-xs font-bold leading-none p-1"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-stone-400 leading-relaxed text-[10px]">
                  三星外域能量虽已解锁，但心智底层尚未闭合。
                  请前往 <span className="text-rose-400 font-bold font-mono">【回响星图】</span> 选项卡，合并你收集到的情愫、实践与认知碎片，提觉隐藏人格密码 <span className="text-amber-400 font-bold">【留下 ㆍ 宿命】</span> 核心，方可点火开启最后的终极大归宿！
                </p>
              </motion.div>
            )}

            {/* Orbit Map Status bar */}
            <div className="w-full bg-stone-900/60 border border-stone-850 p-3 rounded-xl flex items-center justify-between text-[11px] text-stone-400">
              <div className="flex gap-1.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${redSolved ? 'bg-red-500/10 text-red-400' : 'bg-stone-900 text-stone-500'}`}>共情: {redSolved ? '已解锁' : '未解锁'}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${blueSolved ? 'bg-blue-500/10 text-blue-400' : 'bg-stone-900 text-stone-500'}`}>创造: {blueSolved ? '已解锁' : '未解锁'}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${goldSolved ? 'bg-amber-500/10 text-amber-400' : 'bg-stone-900 text-stone-500'}`}>洞察: {goldSolved ? '已解锁' : '未解锁'}</span>
              </div>
              <span className="text-[10px] font-semibold text-stone-300">
                {redSolved && blueSolved && goldSolved 
                  ? (isStaySynthesized || isMaxedCheat)
                    ? '💡 三星环绕，醒觉宿命！点击中央恒星开启终章熔融！'
                    : '🔒 心锁待和：请前往【回响星图】合并碎片提觉人生「留下」'
                  : '⚙️ 依次点击着陆探索主星...'}
              </span>
            </div>

            {/* 灵狐小九冷幽默弹幕 — 无解时随机飘过 */}
            {foxCommentary && !selectedPlanet && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] text-zinc-500 italic border-t border-stone-850/50 pt-2 mt-2 text-center w-full font-mono"
              >
                🦊 {foxCommentary}
              </motion.div>
            )}

          </motion.div>
        ) : (
          <motion.div 
            key="planet-landed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-4 shadow-xl"
          >
            {/* LANDED HEADER */}
            <div className="flex justify-between items-center border-b border-stone-850/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {selectedPlanet === 'red' && '🔴'}
                  {selectedPlanet === 'blue' && '🔵'}
                  {selectedPlanet === 'gold' && '🟡'}
                  {selectedPlanet === 'gold_satellite' && '🪐'}
                  {selectedPlanet === 'central' && '🔥'}
                </span>
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-mono text-stone-500 block leading-none font-bold">Landed Mind Exploration</span>
                  <h3 className="text-sm font-bold text-stone-100">
                    {selectedPlanet === 'red' && `🪐 红星 ㆍ 情感${redSolved ? ' ㆍ 已走完' : ''}`}
                    {selectedPlanet === 'blue' && `🪐 蓝星 ㆍ 实践${blueSolved ? ' ㆍ 已走完' : ''}`}
                    {selectedPlanet === 'gold' && '金星书房：多维观念碎片组装'}
                    {selectedPlanet === 'gold_satellite' && '金星卫星 ㆍ 认知之茧 (核心补充 DLC)'}
                    {selectedPlanet === 'central' && '中央恒星：灵魂三相共振对流'}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlanet(null)}
                className="bg-stone-950 border border-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-200 px-2.5 py-1 rounded-xl text-[10.5px] shadow transition-all outline-none"
              >
                ← 返回星空
              </button>
            </div>

            {/* --- RED STAR: EMOTION GAMEPLAY --- */}
            {selectedPlanet === 'red' && (
              <RedStarChapter
                solved={redSolved}
                onSolved={() => markPlanetSolved('red', true)}
                resetNonce={resetNonce}
                foxCommentary={foxCommentary}
              />
            )}

            {/* --- BLUE STAR: ACTION GAMEPLAY (Progressive) --- */}
            {selectedPlanet === 'blue' && (
              <BlueStarChapter
                solved={blueSolved}
                onSolved={() => markPlanetSolved('blue', true)}
                resetNonce={resetNonce}
              />
            )}

            {/* --- GOLD STAR: WISDOM GAMEPLAY --- */}
            {selectedPlanet === 'gold' && (
              <GoldStarChapter
                solved={goldSolved}
                onSolved={() => markPlanetSolved('gold', true)}
                resetNonce={resetNonce}
              />
            )}

            {/* --- GOLD SATELLITE: COGNITION DLC GAMEPLAY --- */}
            {selectedPlanet === 'gold_satellite' && (
              <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                <CognitiveDlc 
                  onComplete={() => {
                    setDlcSolved(true);
                    localStorage.setItem('dlc_woolen_wear_badge', 'true');
                  }}
                  isSolved={dlcSolved}
                />
              </div>
            )}

            {/* --- FINAL CLIMAX: CENTRAL STAR RESONANCE --- */}
            {selectedPlanet === 'central' && (
              <div className="space-y-4">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-850/60 leading-relaxed text-[11px] space-y-2 relative">
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-500 animate-ping rounded-full" />
                  <span className="text-[8.5px] font-bold text-amber-400 uppercase tracking-widest block font-mono">Galactic Core Resonance Climax</span>
                  <h4 className="text-xs font-bold text-stone-100 flex items-center gap-1">
                    <span>👑</span>
                    <span>【真实命题：合作方新人突发性精神崩溃】</span>
                  </h4>
                  <p className="text-stone-400 text-justify leading-relaxed">
                    合作方项目突发巨变、绩效打压、代码被无理全盘推倒、遭遇投诉。带教的新人瘫在电脑前掩面大哭，试图全盘删除工作成果，大喊：‘我真一无是处！系统冷血吃人！我永远不配在这个高楼赛博世界留下过活！我想毁掉这一切！’
                  </p>
                  <p className="text-stone-500 text-[10px] pt-1 border-t border-stone-900 leading-snug">
                    你现在胸膛里搏击着三项淬炼成的星系人格频率。请调试并选择引导本局的融汇法则：
                  </p>
                </div>

                {/* Grid selection options */}
                <div className="grid grid-cols-1 gap-2.5 text-[10px]">
                  
                  {/* Single option 1 */}
                  <button 
                    onClick={() => triggerClimaxResonance('empathy_only')}
                    className="p-3 rounded-xl border text-left bg-stone-950 border-stone-850 hover:border-red-500/40 focus:outline-none transition-all"
                  >
                    <span className="font-bold text-red-400 block">① 仅启用【共情】碎片进行抚顺</span>
                    <p className="text-stone-500 mt-1">只握他的手、安慰他‘这不是你的错，你辛苦了，你做得够好了’。</p>
                  </button>

                  {/* Single option 2 */}
                  <button 
                    onClick={() => triggerClimaxResonance('insight_only')}
                    className="p-3 rounded-xl border text-left bg-stone-950 border-stone-850 hover:border-amber-500/40 focus:outline-none transition-all"
                  >
                    <span className="font-bold text-amber-400 block">② 仅启用【洞察】碎片进行解构</span>
                    <p className="text-stone-500 mt-1">冷峻地剖开大组织剥削和异化新人的资本本质，告诉他‘这是必然，别太作茧自缚’。</p>
                  </button>

                  {/* Single option 3 */}
                  <button 
                    onClick={() => triggerClimaxResonance('creation_only')}
                    className="p-3 rounded-xl border text-left bg-stone-950 border-stone-850 hover:border-blue-500/40 focus:outline-none transition-all"
                  >
                    <span className="font-bold text-blue-400 block">③ 仅启用【创造】碎片进行施工</span>
                    <p className="text-stone-500 mt-1">强硬塞给他一张24小时不喘息的代码重写和ASIL安全功能降级规避逻辑计划表。</p>
                  </button>

                  {/* The ultimate combination */}
                  <button 
                    onClick={() => triggerClimaxResonance('all')}
                    className="p-3.5 rounded-xl border-2 border-yellow-500/60 text-left bg-gradient-to-r from-yellow-500/5 via-amber-500/10 to-emerald-500/5 hover:border-yellow-400 focus:outline-none transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  >
                    <span className="font-extrabold text-yellow-300 flex items-center gap-1.5 uppercase tracking-wide">
                      ⚡ 开启 【三相共振】 ―― 理解 ㆍ 创造 ㆍ 连接 同频共振！
                    </span>
                    <p className="text-stone-300 mt-1 leading-snug">
                      拉他坐入被茶具和白烟包围的走廊（连接人魂），帮他剖去企业毒霸说词的蒙蔽（洞察），并陪他一条代码、一页日志地写成优雅软降级failsafe（创造）。
                    </p>
                  </button>
                </div>

                {/* Interactive payoff visual-novel terminal output */}
                <AnimatePresence mode="wait">
                  {climaxOutcome && (
                    <motion.div 
                      key={climaxOutcome}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-stone-950 p-4 border border-stone-850/80 rounded-xl text-[11px] leading-relaxed space-y-2.5 text-justify"
                    >
                      {climaxOutcome === 'empathy_only' && (
                        <p className="text-red-300 italic">
                          ● <b>共鸣受阻：</b>新人擦干了眼泪，感动得心里暖融，甚至发誓他是最懂你的人。但当他第二天重新面对一片乱码的编译机和逼命的产品上线死线时，双手依旧发抖、恐惧，依然交还账号选择了退缩逃跑。
                        </p>
                      )}
                      
                      {climaxOutcome === 'insight_only' && (
                        <p className="text-amber-300 italic">
                          ● <b>共鸣受阻：</b>新人在你的宏论前听得目瞪口呆，茅塞顿开。可面对着冰冷的代码报错黑箱和五小时后的全车急退退坡，他的心灵空洞愈发巨大：‘师父，大厦虽将倾，但我眼前这个具体的bug到底如何解决呀？’
                        </p>
                      )}

                      {climaxOutcome === 'creation_only' && (
                        <p className="text-blue-300 italic">
                          ● <b>共鸣受阻：</b>严酷冰冷的派工时间表格摔在新人的脸上，如同千百个催赶他的机器。在极度缺氧窒息的最后一根弦崩断之下，他掩面嚎啕大哭关机：‘我也只想做一个活着的、有体温的普通人啊！’ 辞职退场。
                        </p>
                      )}

                      {climaxOutcome === 'all' && (
                        <div className="space-y-3.5 animate-[fadeIn_0.5s_ease_1]">
                          <div className="border-b border-stone-850 pb-2">
                            <span className="text-emerald-400 font-extrabold text-xs block">🌌 【大圆满集成：星系完全同频同心！】</span>
                            <span className="text-[8px] text-stone-500 font-bold tracking-widest font-mono">100% Core Synchronized Success</span>
                          </div>

                          <div className="space-y-2.5 text-stone-200">
                            <p>
                              千岑终于拉新人坐回走廊上。白日喧嚣的底盘敲打退去，地下室折过的两根白雾在台前袅热，一壶隔年白茶泡出澄澈亮黄。
                            </p>
                            <p>
                              你帮他擦干悔恨的眼泪（共情连接），带着他从冗余和故障的因果网里看透所谓的“大厂神话吹水”（洞察虚妄），接着，你坐在他旁边，指头摩挲在静电容键盘上面，手把手教他把车辆超声波优雅软防线退坡降级写进MCU的闪存大区（创造改造）。
                            </p>
                            <p className="font-normal text-stone-300">
                              他坐在你旁边，看着屏幕上那行编译通过的日志，突然说了一句：『原来代码也可以是有温度的。』
                            </p>
                            <p className="font-semibold text-amber-300 border-l-2 border-yellow-400 pl-3 italic text-[11.5px] py-1">
                              他的孤独、你的回避，在这个深夜的茶室里，与流星雨、自动驾驶、千百张淘宝报价、老陀的悔恨悔意，全部在同一个生命坐标激荡咬合，融化成一叶能载众生渡深水的大河木筏！
                            </p>
                          </div>

                          <div className="bg-stone-900 border border-stone-850 p-4.5 rounded-xl space-y-1 bg-gradient-to-r from-stone-950 to-stone-900">
                            <span className="text-[10px] uppercase font-bold text-yellow-400 block tracking-widest font-mono">Resonance Creed</span>
                            <blockquote className="text-[12px] font-bold text-stone-200 leading-relaxed text-justify space-y-2 py-1.5 px-0.5">
                              <p className="text-amber-400">“理解世界，是为了不被世界欺骗。</p>
                              <p className="text-blue-400">创造价值，是为了在世界留下痕迹。</p>
                              <p className="text-pink-400">连接他人，是为了让这些痕迹拥有意义。”</p>
                            </blockquote>
                            <p className="text-[10.5px] text-stone-400 dẫn quotes leading-relaxed pt-1.5 border-t border-stone-850/50">
                              成长并不是说去成为一种完美高配的假人模型，而是让我的理解力、我的创造技、我的连接诚，在我血肉的心跳身上，同时交融爆发！
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
