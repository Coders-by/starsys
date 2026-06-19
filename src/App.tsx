import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Compass,
  History,
  Flame,
  X
} from 'lucide-react';
import StarSysGame from './components/StarSysGame';
import EchoSystem from './components/EchoSystem';
import AmbientMusic from './components/AmbientMusic';
import LifeWalk from './components/LifeWalk';
import TeaRoom from './components/TeaRoom';
import { Achievement, ACHIEVEMENTS } from './achievements';

export default function App() {
  // --- Core Tabs ---
  const [currentTab, setCurrentTab] = useState(0); // 0: StarSys Game, 1: Timeline, 2: Chat & Tea Room, 3: LifeWalk (凡间漫游)

  // --- Star System Progress State ---
  const [starProgress, setStarProgress] = useState({
    red: false,
    blue: false,
    gold: false,
    central: false
  });

  // --- Discovered Resonances (Echo Alchemy) ---
  const [discoveredResonances, setDiscoveredResonances] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('qiancen_discovered_resonances_v3') || '[]');
    } catch {
      return [];
    }
  });

  // --- Achievement modal queue (奖励回路) ---
  // 队列而不是单值：例如作弊路径会一次性翻多个 starProgress，按队列顺序逐个弹。
  const [modalQueue, setModalQueue] = useState<Achievement[]>([]);
  const openedAchievement = modalQueue[0] || null;
  const closeAchievement = () => setModalQueue(q => q.slice(1));
  const enqueueAchievement = useCallback((id: string) => {
    const ach = ACHIEVEMENTS[id];
    if (!ach) return;
    setModalQueue(q => (q.some(a => a.id === id) ? q : [...q, ach]));
  }, []);

  // StarSysGame 在 mount 时会从自己的 localStorage 把已解锁状态再 emit 一次回来——
  // 那一次属于"恢复"不是"刚刚解锁"，不能弹 modal。用 ref 吃掉首次同步。
  const isStarsInitialized = useRef(false);
  const prevStarProgress = useRef(starProgress);
  const handleSyncProgress = useCallback((next: typeof starProgress) => {
    setStarProgress(next);
    if (!isStarsInitialized.current) {
      isStarsInitialized.current = true;
      prevStarProgress.current = next;
      return;
    }
    (Object.keys(next) as Array<'red' | 'blue' | 'gold' | 'central'>).forEach(k => {
      if (next[k] && !prevStarProgress.current[k]) {
        enqueueAchievement(`${k}_star`);
      }
    });
    prevStarProgress.current = next;
  }, [enqueueAchievement]);

  const handleResonanceComplete = (id: string) => {
    if (!discoveredResonances.includes(id)) {
      setDiscoveredResonances(prev => [...prev, id]);
      enqueueAchievement(`resonance_${id}`);
    }
  };

  useEffect(() => {
    localStorage.setItem('qiancen_discovered_resonances_v3', JSON.stringify(discoveredResonances));
  }, [discoveredResonances]);

  // Computed resonance percentage from Star system and Echo board combinations (Ultimate 5-Layers)
  const resonanceRate = (() => {
    let rate = 0;
    if (starProgress.red) rate += 15;
    if (starProgress.blue) rate += 15;
    if (starProgress.gold) rate += 15;
    
    if (discoveredResonances.includes('escape')) rate += 10;
    if (discoveredResonances.includes('waiting')) rate += 10;
    if (discoveredResonances.includes('stay')) rate += 15;
    
    if (starProgress.central) rate += 20;
    return Math.min(rate, 100);
  })();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center p-0 md:p-4 font-sans antialiased">
      
      {/* CENTRAL MOBILE CONTAINER SHELL (Pristine Visual Canvas) */}
      <div className="w-full max-w-md bg-stone-900 md:rounded-3xl border border-stone-850/70 h-screen md:h-[840px] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* TOP STATUS BAR: Global Resonance Ratio */}
        <div className="bg-stone-950 p-4 shrink-0 border-b border-stone-850/60 z-20 space-y-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌌</span>
              <div>
                <h1 className="text-sm font-bold text-stone-100 tracking-tight leading-none">千岑 ㆍ 心智共振档案</h1>
                <span className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-widest mt-1 inline-block">Active Resonance System</span>
              </div>
            </div>
            
            {/* Resonance count badge */}
            <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-center flex items-center gap-1.5 shadow-sm">
              <span className="text-amber-400 text-[10px] uppercase font-mono font-bold tracking-wider">共鸣率:</span>
              <span className="text-amber-300 text-xs font-black font-mono">{resonanceRate}%</span>
            </div>
          </div>

          {/* Dynamic Sync Progress Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-mono text-stone-500 uppercase font-bold leading-none">
              <span>零点隔离</span>
              <span>100% 同频共振合一</span>
            </div>
            <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${resonanceRate}%` }}
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              />
            </div>
          </div>
        </div>

        {/* --- MAIN SCROLLABLE WRAPPER --- */}
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
          
          <AmbientMusic />
          
          {/* TAB 0: THE PLANETARY ADVENTURE 《星系档案》 */}
          {currentTab === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <StarSysGame
                onSyncProgress={handleSyncProgress}
                isMaxedCheat={starProgress.central}
                isStaySynthesized={discoveredResonances.includes('stay')}
              />
            </motion.div>
          )}

          {/* TAB 1: RESONANCE ECHOS SYSTEM */}
          {currentTab === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <EchoSystem 
                starProgress={starProgress} 
                discoveredResonances={discoveredResonances} 
                onResonanceComplete={handleResonanceComplete} 
              />
            </motion.div>
          )}

          {/* TAB 2: MORTAL WANDERING 《人间烟火》 */}
          {currentTab === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <LifeWalk />
            </motion.div>
          )}

          {/* TAB 3: COZY TEA ROOM, CHAT & GUESTBOOK 《茗茶闲叙》 */}
          {currentTab === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <TeaRoom />
            </motion.div>
          )}

        </div>

        {/* BOTTOM NAV BAR */}
        <div className="bg-stone-950 border-t border-stone-850/65 grid grid-cols-4 shrink-0 pb-[env(safe-area-inset-bottom,0)] z-20 shadow-lg">
          <button 
            onClick={() => setCurrentTab(0)}
            className={`py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold transition-all ${
              currentTab === 0 ? 'text-amber-400 bg-stone-900/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="tracking-wider text-[9px]">星系档案</span>
          </button>

          <button 
            onClick={() => setCurrentTab(1)}
            className={`py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold transition-all ${
              currentTab === 1 ? 'text-amber-400 bg-stone-900/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="tracking-wider text-[9px]">回响星图</span>
          </button>

          <button 
            onClick={() => setCurrentTab(2)}
            className={`py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold transition-all ${
              currentTab === 2 ? 'text-amber-400 bg-stone-900/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span className="tracking-wider text-[9px]">人间烟火</span>
          </button>

          <button 
            onClick={() => setCurrentTab(3)}
            className={`py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold transition-all ${
              currentTab === 3 ? 'text-amber-400 bg-stone-900/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="tracking-wider text-[9px]">茗茶闲叙</span>
          </button>
        </div>

      </div>

      {/* --- 成就 modal（解锁瞬间的"纸背后的墨迹私信"） --- */}
      <AnimatePresence>
        {openedAchievement && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div
              key={openedAchievement.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative"
            >
              <button
                onClick={closeAchievement}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 outline-none"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-stone-850 pb-3">
                <span className="text-3xl bg-amber-500/10 p-2 rounded-xl text-amber-400">{openedAchievement.icon}</span>
                <div>
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-amber-500 font-mono">精神勋章已收割 · {openedAchievement.time}</span>
                  <h3 className="text-sm font-bold text-stone-100 mt-1">{openedAchievement.name}</h3>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{openedAchievement.desc}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 block font-mono">纸背后的墨迹私信</span>
                <p className="text-[11.5px] text-stone-300 leading-relaxed text-justify bg-stone-950 p-3.5 rounded-xl border border-stone-850/50">
                  {openedAchievement.story}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-2.5 rounded-xl">
                  <span className="text-emerald-400 font-bold block mb-1">🌱 获得：</span>
                  <ul className="space-y-0.5 text-[9.5px] text-stone-400 list-disc list-inside leading-relaxed">
                    {openedAchievement.gain.map((g, gi) => <li key={gi}>{g}</li>)}
                  </ul>
                </div>

                <div className="bg-rose-950/10 border border-rose-500/10 p-2.5 rounded-xl">
                  <span className="text-rose-400 font-bold block mb-1">🍂 损耗代价：</span>
                  <ul className="space-y-0.5 text-[9.5px] text-stone-400 list-disc list-inside leading-relaxed">
                    {openedAchievement.cost.map((c, ci) => <li key={ci}>{c}</li>)}
                  </ul>
                </div>
              </div>

              {modalQueue.length > 1 && (
                <div className="text-[9px] text-stone-500 font-mono text-right">
                  + 还有 {modalQueue.length - 1} 个解锁瞬间在排队
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
