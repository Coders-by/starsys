import React, { useState } from 'react';
import { Flame, Bike, Coffee, Music, MessageSquare, Workflow, Award } from 'lucide-react';
import { LifeMetricsProvider, useLifeMetrics } from './lifewalk/LifeMetricsContext';
import CoLiving from './lifewalk/CoLiving';
import ZenMoments from './lifewalk/ZenMoments';
import KTV from './lifewalk/KTV';
import MidnightRide from './lifewalk/MidnightRide';
import Nexus from './lifewalk/Nexus';

/**
 * 人间烟火 —— 凡间漫游 tab。
 *
 * 这层只做：
 *   - 顶部 header（人格温度 / 缘分共振 数值显示）
 *   - 子模式切换 tab
 *   - 把对应子模式渲染出来
 *   - footer 收割已解锁的人间烟火成就
 *
 * 共享指标走 LifeMetricsContext，每个子模式自管自己的内部 state。
 * 切 tab 不再粗暴重置子状态——子组件 unmount 自然清理。
 */

type SubTab = 'co_living' | 'zen_moments' | 'ktv' | 'midnight' | 'nexus';

const SUB_TABS: { id: SubTab; label: string; icon: typeof Coffee }[] = [
  { id: 'co_living', label: '🏠 合租碎片', icon: Coffee },
  { id: 'zen_moments', label: '🍵 禅意朋友圈', icon: MessageSquare },
  { id: 'ktv', label: '🎤 KTV歌痕', icon: Music },
  { id: 'midnight', label: '🚴 深夜漫游', icon: Bike },
  { id: 'nexus', label: '🕸️ 缘分网络', icon: Workflow },
];

function LifeWalkInner() {
  const { humanValue, resonancePoints, unlockedAchievements } = useLifeMetrics();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('co_living');

  const renderActive = () => {
    switch (activeSubTab) {
      case 'co_living':
        return <CoLiving />;
      case 'zen_moments':
        return <ZenMoments />;
      case 'ktv':
        return <KTV />;
      case 'midnight':
        return <MidnightRide />;
      case 'nexus':
        return <Nexus />;
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER CARD: Human Heat and Resonance Panel */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-stone-850 p-4 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <Flame className="w-40 h-40 text-amber-500" />
        </div>

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs">
            <span>🦊 🌸【人间烟火 ㆍ 尘世慢游与烟火温度】</span>
          </div>
          <p className="text-[10px] text-stone-400 max-w-[240px] leading-relaxed text-justify">
            在星系的三条叙事线（红星、蓝星、金星）里，我们反思、寻找、调试，一直向内寻找宇宙答案。而真正的千岑，是选择踏实涉入具体的生活：在深圳南山夜风之下，吃一碗溏心荷包蛋、唱一曲久违的深情老歌、撮合落地的硬核共赢项目，在万家烟火中活出生命的真实体温。
          </p>
        </div>

        <div className="flex flex-col gap-2 relative z-10 shrink-0 text-right">
          <div className="bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-xl text-center">
            <span className="text-[8px] font-mono font-bold text-amber-400 block uppercase">🌡️ 人格温度 (Warmth)</span>
            <span className="text-sm font-black font-mono text-amber-300">{humanValue}°C</span>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-xl text-center">
            <span className="text-[8px] font-mono font-bold text-rose-400 block uppercase">🧬 缘分共振 (Resonance)</span>
            <span className="text-sm font-black font-mono text-rose-300">{resonancePoints} PTS</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL TAB MENU */}
      <div className="bg-stone-900/80 p-1 rounded-xl border border-stone-850 flex gap-1 overflow-x-auto scrollbar-none shrink-0 flex-nowrap">
        {SUB_TABS.map((sub) => {
          const Icon = sub.icon;
          const isSelected = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {renderActive()}

      {/* FOOTER ACHIEVEMENTS REVEAL CATERING */}
      {unlockedAchievements.length > 0 && (
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 text-left space-y-2 animate-pulse">
          <span className="text-[8.5px] font-extrabold text-amber-400 font-mono block uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            已解锁的人间成就 ({unlockedAchievements.length})：
          </span>
          <div className="flex flex-wrap gap-1.5">
            {unlockedAchievements.map((ach, ai) => (
              <span
                key={ai}
                className="bg-amber-500/15 border border-amber-500/30 text-amber-200 px-2.5 py-1 rounded-lg text-[9.5px] font-bold font-mono"
              >
                📌 {ach}
              </span>
            ))}
            {typeof window !== 'undefined' && localStorage.getItem('dlc_woolen_wear_badge') === 'true' && (
              <span className="bg-amber-500/25 border-2 border-amber-500/40 text-amber-200 px-2.5 py-1 rounded-lg text-[9.5px] font-bold font-mono shadow-[0_0_8px_rgba(245,158,11,0.25)] flex items-center gap-1 animate-pulse">
                🧶 未被穿透的毛线衣 (DLC 核心勋章)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LifeWalk() {
  return (
    <LifeMetricsProvider>
      <LifeWalkInner />
    </LifeMetricsProvider>
  );
}
