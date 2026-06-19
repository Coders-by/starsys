import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * 人间烟火共享指标 —— humanValue / resonancePoints / unlockedAchievements。
 *
 * 5 个 sub-mode（合租 / 禅意朋友圈 / KTV / 深夜骑行 / 穿针引线）共用这三件事，
 * 之前都通过同一棵组件树里的 useState + 重复的 setter 注入。现在用 Context 包一层，
 * 子组件 useLifeMetrics() 即用即取。
 *
 * 重要：triggerAchievement 会同时给 humanValue +15 —— 这条规则保留原样，
 * 任何 sub-mode 调它一次都按一次成就计。
 */

interface LifeMetricsValue {
  humanValue: number;
  resonancePoints: number;
  unlockedAchievements: string[];
  addHumanValue: (delta: number) => void;
  addResonancePoints: (delta: number) => void;
  triggerAchievement: (name: string) => void;
}

const LifeMetricsContext = createContext<LifeMetricsValue | null>(null);

export function LifeMetricsProvider({ children }: { children: ReactNode }) {
  const [humanValue, setHumanValue] = useState<number>(35);
  const [resonancePoints, setResonancePoints] = useState<number>(10);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  const addHumanValue = (delta: number) => setHumanValue(p => p + delta);
  const addResonancePoints = (delta: number) => setResonancePoints(p => p + delta);
  const triggerAchievement = (name: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(name)) return prev;
      setHumanValue(p => p + 15);
      return [...prev, name];
    });
  };

  return (
    <LifeMetricsContext.Provider
      value={{
        humanValue,
        resonancePoints,
        unlockedAchievements,
        addHumanValue,
        addResonancePoints,
        triggerAchievement,
      }}
    >
      {children}
    </LifeMetricsContext.Provider>
  );
}

export function useLifeMetrics(): LifeMetricsValue {
  const ctx = useContext(LifeMetricsContext);
  if (!ctx) {
    throw new Error('useLifeMetrics must be used inside <LifeMetricsProvider>');
  }
  return ctx;
}
