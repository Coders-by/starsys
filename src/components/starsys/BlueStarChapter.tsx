import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SHICHEN_DATA, getRealShichen } from './shichen';
import BlueStarReflection from './BlueStarReflection';

/**
 * 蓝星章节 ㆍ 实践线四段（手势召唤 → 知识雷达 → 联合开发对齐 → 带教传火 → 通关）。
 *
 * 从 StarSysGame.tsx 抽出。内部 state 自洽（章节进度 + 四章各自的玩法 state +
 * 今日时辰 + stakeholders useMemo + 对齐监听 useEffect），对外只通过 props：
 *   - solved: 读 parent 的 blueSolved（一致性问题，本章节实际由 blueChapter===5 驱动结算）
 *   - onSolved: 替代 onSolved()
 *   - resetNonce: parent 重置时 +1，本组件 useEffect 监听自清内部 state
 */

interface BlueStarChapterProps {
  solved: boolean;
  onSolved: () => void;
  resetNonce: number;
}

export default function BlueStarChapter({ solved: blueSolved, onSolved, resetNonce }: BlueStarChapterProps) {
  // --- SUB-GAME 2: 蓝星 (Action) State ---
  // PROGRESSIVE CHAPTERS: 1 to 4 index
  const [blueChapter, setBlueChapter] = useState<number>(1);

  // Chapter 1: Gesture Summon
  const [gestureTimeWindow, setGestureTimeWindow] = useState<number>(500); // ms
  const [gestureThreshold, setGestureThreshold] = useState<number>(3); // Hz
  const [gestureVoting, setGestureVoting] = useState<string>('2/3'); // voting
  const [gestureMessage, setGestureMessage] = useState<string | null>(null);

  const verifyGestureSummon = () => {
    const isWindowOk = gestureTimeWindow >= 800 && gestureTimeWindow <= 1200;
    const isThresholdOk = gestureThreshold === 5;
    const isVotingOk = gestureVoting === '3/5';

    if (isWindowOk && isThresholdOk && isVotingOk) {
      setGestureMessage('success');
      setTimeout(() => {
        setBlueChapter(2);
        setGestureMessage(null);
      }, 2000);
    } else {
      let desc = '信号没对上。';
      if (!isWindowOk) desc += '窗口太长或太短都抓不到手势特征——人在自然挥动手臂时，一个完整动作大约需要800-1200ms才能被稳定捕捉。';
      if (!isThresholdOk) desc += '触发频点不对——5Hz才是标准车载手势信号的频率。';
      if (!isVotingOk) desc += '投票容灾不够稳——设成3/5多数票锁定，才能防误触。';
      setGestureMessage(desc);
    }
  };

  // Chapter 2: Knowledge Radar Document crumbs
  const [radarSelectedSource, setRadarSelectedSource] = useState<string | null>(null);
  const [radarSelectedTarget, setRadarSelectedTarget] = useState<string | null>(null);
  const [radarSelectedConsequence, setRadarSelectedConsequence] = useState<string | null>(null);
  const [radarMessage, setRadarMessage] = useState<string | null>(null);

  const verifyKnowledgeRadar = () => {
    const isCorrect = radarSelectedSource === 'cold' &&
                      radarSelectedTarget === 'distortion' &&
                      radarSelectedConsequence === 'failsafe';
    if (isCorrect) {
      setRadarMessage('success');
      setTimeout(() => {
        setBlueChapter(3);
        setRadarMessage(null);
      }, 2000);
    } else {
      setRadarMessage('探测对齐线锁死！诊断断开。提示：极寒环境被冻结的超声波雷达传感器由于波形反射畸变阻断引发了APA系统的Fail-safe优雅自动落锁故障。请根据这个线索连接。');
    }
  };

  // Chapter 3: Coordinated Dev Alignment with Metaphysical Shichen Traits
  const [selectedShichenKey, setSelectedShichenKey] = useState<string>(() => {
    return getRealShichen(new Date());
  });
  const [devDecisionApplied, setDevDecisionApplied] = useState<Record<string, boolean>>({});
  const [coordinatedMessage, setCoordinatedMessage] = useState<string | null>(null);

  // 决策影响 = 基础 30 + 4 个决策按钮 delta + 今日时辰五行加成。
  const stakeholders = useMemo(() => {
    const shichen = SHICHEN_DATA[selectedShichenKey] || SHICHEN_DATA["寅时"];
    const mods = shichen.modifiers;

    let pmDelta = 0;
    let algoDelta = 0;
    let testDelta = 0;
    let customerDelta = 0;

    if (devDecisionApplied['d1']) {
      pmDelta += 35; algoDelta += -10; testDelta += -5; customerDelta += 10;
    }
    if (devDecisionApplied['d2']) {
      algoDelta += 35; pmDelta += -10; testDelta += 15; customerDelta += -10;
    }
    if (devDecisionApplied['d3']) {
      pmDelta += 10; algoDelta += 20; testDelta += 20; customerDelta += 25;
    }
    if (devDecisionApplied['d4']) {
      testDelta += 35; pmDelta += -10; customerDelta += -10; algoDelta += 10;
    }

    return {
      pm: Math.min(Math.max(30 + pmDelta + mods.pm, 0), 100),
      algo: Math.min(Math.max(30 + algoDelta + mods.algo, 0), 100),
      test: Math.min(Math.max(30 + testDelta + mods.test, 0), 100),
      customer: Math.min(Math.max(30 + customerDelta + mods.customer, 0), 100)
    };
  }, [devDecisionApplied, selectedShichenKey]);

  // Watch for successful stakeholder alignment (all >= 50) to progress to Chapter 4
  const transitioningRef = useRef(false);
  useEffect(() => {
    if (blueChapter === 3) {
      const isAligned = stakeholders.pm >= 50 &&
                        stakeholders.algo >= 50 &&
                        stakeholders.test >= 50 &&
                        stakeholders.customer >= 50;
      if (isAligned) {
        if (!transitioningRef.current) {
          transitioningRef.current = true;
          setCoordinatedMessage('success');
          const timer = setTimeout(() => {
            setBlueChapter(4);
            setCoordinatedMessage(null);
            transitioningRef.current = false;
          }, 2000);
          return () => clearTimeout(timer);
        }
      } else {
        if (transitioningRef.current) {
          transitioningRef.current = false;
          setCoordinatedMessage(null);
        }
      }
    }
  }, [stakeholders, blueChapter]);

  const applyDevDecision = (decisionId: string) => {
    if (devDecisionApplied[decisionId]) return;
    setDevDecisionApplied(prev => ({ ...prev, [decisionId]: true }));
  };

  // Chapter 4: Mentorship coach
  const [mentorshipAnswer, setMentorshipAnswer] = useState<string | null>(null);

  const resolveMentorship = (choiceId: string) => {
    setMentorshipAnswer(choiceId);
    if (choiceId === 'B') {
      setTimeout(() => {
        setBlueChapter(5);
        onSolved();
      }, 2000);
    }
  };

  // resetNonce 机制：parent 重置时 +1，自清内部进度（跳过首次 mount）
  useEffect(() => {
    if (resetNonce === 0) return;
    setBlueChapter(1);
    setGestureTimeWindow(500);
    setGestureThreshold(3);
    setGestureVoting('2/3');
    setGestureMessage(null);
    setRadarSelectedSource(null);
    setRadarSelectedTarget(null);
    setRadarSelectedConsequence(null);
    setRadarMessage(null);
    setDevDecisionApplied({});
    setCoordinatedMessage(null);
    setMentorshipAnswer(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce]);

  return (
              <div className="space-y-4">
                
                {/* BLUE INTRO STATEMENT */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed space-y-2">
                  <span className="text-[8px] font-bold text-blue-400 block">🪐 这一关在演示什么</span>
                  <p className="text-stone-300 text-justify leading-relaxed">
                    千岑做自动驾驶。这条线分 4 章——把一段没人理顺的实车数据调对、查出一个鬼魂级别的 bug、协调 4 方在拉扯里达成共识、最后把自己的经验交给一个快崩溃的新人。
                  </p>
                  <p className="text-stone-500 text-justify leading-snug">
                    4 章一气呵成。每一章都是真实工作里发生过的事。
                  </p>
                </div>

                {/* PROGRESS FLOW STEPPER METER */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((ch) => (
                    <div 
                      key={ch}
                      className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                        blueChapter > ch 
                          ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                          : blueChapter === ch 
                            ? 'bg-amber-400 animate-pulse' 
                            : 'bg-stone-800'
                      }`}
                    />
                  ))}
                </div>

                {/* CHAPTER 1 SCREEN: 5Hz Gesture Summon */}
                {blueChapter === 1 && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                    <div className="text-[10px] text-justify space-y-1.5">
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">第一章 ㆍ 手势召唤</span>
                      <p className="text-stone-300 mt-1.5 leading-relaxed">
                        <strong className="text-blue-300">背景</strong>：千岑负责的功能叫"手势召唤"——你站在车外对车挥手，车自己开过来。
                      </p>
                      <p className="text-stone-400 leading-relaxed">
                        <strong className="text-blue-300">现场</strong>：实车日志跑回来一段裸数据，没滤波、没处理。你要自己调 3 个参数让车真的"看懂"你在挥手——采样窗口（多久算一次挥手）、触发频点（数据多密才算手势）、容灾投票（几次有效才下指令）。
                      </p>
                      <p className="text-stone-500 leading-snug text-[9.5px] italic">
                        提示就在每个参数旁边。这一关的目的不是考工程师——是让你看一次"工程现场长什么样"。
                      </p>
                    </div>

                    <div className="bg-stone-950 p-4.5 rounded-xl border border-stone-850 space-y-3">
                      {/* Time window slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono leading-none">
                          <span className="text-stone-400 font-bold">时间探测窗口 (Time Window)</span>
                          <span className="text-blue-400 font-bold">{gestureTimeWindow} ms</span>
                        </div>
                        <input 
                          type="range" 
                          min="100" 
                          max="2000" 
                          value={gestureTimeWindow}
                          onChange={(e) => { setGestureTimeWindow(Number(e.target.value)); setGestureMessage(null); }}
                          className="w-full accent-blue-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[7.5px] text-stone-600 font-mono scale-95 origin-left">
                          <span>100ms (高噪失真)</span>
                          <span>1000ms (最完美频区)</span>
                          <span>2000ms (极大传输延迟)</span>
                        </div>
                      </div>

                      {/* Hertz slider */}
                      <div className="space-y-1 pt-1.5">
                        <div className="flex justify-between text-[10px] font-mono leading-none">
                          <span className="text-stone-400 font-bold">手势特定触发阈值频点 (Hertz)</span>
                          <span className="text-blue-400 font-bold">{gestureThreshold} Hz</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={gestureThreshold}
                          onChange={(e) => { setGestureThreshold(Number(e.target.value)); setGestureMessage(null); }}
                          className="w-full accent-blue-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[7.5px] text-stone-600 font-mono scale-95 origin-left">
                          <span>1Hz (步履摇晃)</span>
                          <span>5Hz (标准车数据频)</span>
                          <span>10Hz (超频无抖)</span>
                        </div>
                      </div>

                      {/* Vote select dropdown */}
                      <div className="space-y-1 pt-1.5">
                        <label className="text-[10px] text-stone-400 font-bold font-mono">多数票投票机制 (Voting Mechanism)</label>
                        <div className="grid grid-cols-3 gap-1.5 text-[9.5px]">
                          {['1/2', '2/3', '3/5'].map((v) => (
                            <button
                              key={v}
                              onClick={() => { setGestureVoting(v); setGestureMessage(null); }}
                              className={`py-1 rounded-lg border text-center transition-all focus:outline-none ${
                                gestureVoting === v 
                                  ? 'bg-blue-500/10 border-blue-500 text-blue-300 font-bold' 
                                  : 'bg-stone-900 border-stone-850 text-stone-500'
                              }`}
                            >
                              {v === '1/2' && '1/2 (低容载)'}
                              {v === '2/3' && '2/3 (谨慎容错)'}
                              {v === '3/5' && '3/5 (冗余高全锁)'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={verifyGestureSummon}
                      className="w-full bg-blue-500 text-stone-950 hover:bg-blue-400 font-bold py-2 rounded-xl text-xs transition-all active:scale-[0.98] outline-none"
                    >
                      🚀 发送手势召唤线控锁定指令
                    </button>

                    {gestureMessage && gestureMessage !== 'success' && (
                      <div className="p-3 bg-red-950/20 border border-red-500/20 text-rose-300 rounded-xl text-[10px] leading-snug text-justify">
                        {gestureMessage}
                      </div>
                    )}

                    {gestureMessage === 'success' && (
                      <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 rounded-xl text-[11px] text-center animate-pulse font-bold font-mono">
                        ✓ 手势信号锁定了！800-1200ms窗口、5Hz频点、3/5多数票——线控底盘响应，车辆唤醒。飞入第二章... 🚓
                      </div>
                    )}
                  </div>
                )}

                {/* CHAPTER 2 SCREEN: Knowledge Radar */}
                {blueChapter === 2 && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                    <div className="text-[10px] text-justify space-y-1.5">
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">第二章 ㆍ 知识雷达</span>
                      <p className="text-stone-300 mt-1.5 leading-relaxed">
                        <strong className="text-blue-300">背景</strong>：实车在零下 30 度的黑河冰雪路试时疯狂报错。问题看起来在车身，根因可能在雷达，后果显示在系统降级。
                      </p>
                      <p className="text-stone-400 leading-relaxed">
                        <strong className="text-blue-300">任务</strong>：把"物理根因 → 探测波形畸变 → 系统降级后果"三段连起来。这是工程师调 bug 的 fundamental 动作——往上溯到根、往下推到果。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-[10.5px]">
                      
                      {/* Source Root Cause */}
                      <div className="space-y-1 flex flex-col">
                        <span className="text-[8.5px] font-bold text-amber-500 font-mono">其一：你推定的实机物理外部根本诱因：</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => { setRadarSelectedSource('cold'); setRadarMessage(null); }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              radarSelectedSource === 'cold' ? 'bg-blue-500/10 border-blue-500 text-blue-200 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500'
                            }`}
                          >
                            ❄️ 极寒冰霜覆盖在雷达表面
                          </button>
                          <button 
                            onClick={() => { setRadarSelectedSource('vibration'); setRadarMessage(null); }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              radarSelectedSource === 'vibration' ? 'bg-blue-500/10 border-blue-500 text-blue-200 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500'
                            }`}
                          >
                            🚙 车身在松软泥地上物理起跳
                          </button>
                        </div>
                      </div>

                      {/* Symptom Distortion */}
                      <div className="space-y-1 flex flex-col pt-1">
                        <span className="text-[8.5px] font-bold text-amber-500 font-mono">其二：底层雷达物理波流状态信号的表现变化：</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => { setRadarSelectedTarget('distortion'); setRadarMessage(null); }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              radarSelectedTarget === 'distortion' ? 'bg-blue-500/10 border-blue-500 text-blue-200 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500'
                            }`}
                          >
                            📡 超声波雷达反射系数呈畸变吸收
                          </button>
                          <button 
                            onClick={() => { setRadarSelectedTarget('delay'); setRadarMessage(null); }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              radarSelectedTarget === 'delay' ? 'bg-blue-500/10 border-blue-500 text-blue-200 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500'
                            }`}
                          >
                            📶 多核SOC数据链路传输重塞
                          </button>
                        </div>
                      </div>

                      {/* Outcome Consequence */}
                      <div className="space-y-1 flex flex-col pt-1">
                        <span className="text-[8.5px] font-bold text-amber-500 font-mono">其三：车辆最终触发的防灾降优冗余表现：</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => { setRadarSelectedConsequence('failsafe'); setRadarMessage(null); }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              radarSelectedConsequence === 'failsafe' ? 'bg-blue-500/10 border-blue-500 text-blue-200 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500'
                            }`}
                          >
                            🛡️ 触发防坠落全车故障优雅退坡降级
                          </button>
                          <button 
                            onClick={() => { setRadarSelectedConsequence('shutdown'); setRadarMessage(null); }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              radarSelectedConsequence === 'shutdown' ? 'bg-blue-500/10 border-blue-500 text-blue-200 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500'
                            }`}
                          >
                            💥 主板线控急停导致电机瞬间抱死
                          </button>
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={verifyKnowledgeRadar}
                      className="w-full bg-blue-500 text-stone-950 hover:bg-blue-400 font-bold py-2 rounded-xl text-xs transition-all active:scale-[0.98] outline-none"
                    >
                      🔍 连线并提交诊断雷达
                    </button>

                    {radarMessage && radarMessage !== 'success' && (
                      <div className="p-3 bg-red-950/20 border border-red-500/20 text-rose-300 rounded-xl text-[10px] leading-snug text-justify">
                        {radarMessage}
                      </div>
                    )}

                    {radarMessage === 'success' && (
                      <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 rounded-xl text-[11px] text-center animate-pulse font-bold font-mono">
                        ✓ 连线大成！诊断发现：雷达被冰霜冻结，传感器波形被冰层畸变和吸收，触发整车优雅退坡防御！进入第三章... 📡
                      </div>
                    )}
                  </div>
                )}

                {/* CHAPTER 3 SCREEN: Coordinated Dev Alignment */}
                {blueChapter === 3 && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                    <div className="text-[10px] text-justify space-y-1.5">
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">第三章 ㆍ 联合开发对齐</span>
                      <p className="text-stone-300 mt-1.5 leading-relaxed">
                        <strong className="text-blue-300">背景</strong>：上班就是一个翻译现场。PM 写文档，开发写代码，QA 写测试用例，用户负责吐槽——同一种工况被翻译成 4 种语言，每个角色都觉得自己说得最对。
                      </p>
                      <p className="text-stone-400 leading-relaxed">
                        <strong className="text-blue-300">任务</strong>：在 4 个决策里找一个"组合"，让 4 个角色都过 50%。<strong className="text-amber-400">没有标准答案</strong>——你要选的是"哪种妥协你能接受"。
                      </p>
                    </div>

                    {/* 今日时辰 ㆍ 五行加成（独特随机性 —— 不同时辰打开局面不同） */}
                    {(() => {
                      const shichen = SHICHEN_DATA[selectedShichenKey] || SHICHEN_DATA["寅时"];
                      const elementEmoji: Record<string, string> = { '木': '🌲', '火': '🔥', '土': '⛰️', '金': '⚙️', '水': '💧' };
                      const fmt = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
                      const cls = (n: number) => (n >= 0 ? 'text-emerald-400' : 'text-rose-400');
                      return (
                        <div className="bg-stone-950/60 border border-amber-500/20 rounded-lg p-2.5 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-lg select-none">{elementEmoji[shichen.element] || '⏳'}</span>
                            <div className="leading-tight">
                              <span className="text-[10px] font-bold text-amber-300 block">
                                现在是 {shichen.name} <span className="text-stone-500 font-normal">({shichen.element})</span>
                              </span>
                              <span className="text-[8.5px] text-stone-500 font-mono">{shichen.range}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 text-[8.5px] font-mono shrink-0">
                            <span className={cls(shichen.modifiers.pm)}>PM {fmt(shichen.modifiers.pm)}</span>
                            <span className={cls(shichen.modifiers.algo)}>Arch {fmt(shichen.modifiers.algo)}</span>
                            <span className={cls(shichen.modifiers.test)}>QA {fmt(shichen.modifiers.test)}</span>
                            <span className={cls(shichen.modifiers.customer)}>User {fmt(shichen.modifiers.customer)}</span>
                          </div>
                          <p className="text-[9px] text-stone-500 italic w-full leading-snug">
                            ※ 不同时辰开局加成不同——这个关卡的难度其实跟你打开它的时间点有关。
                          </p>
                        </div>
                      );
                    })()}

                    {/* Satisfactions radar columns */}
                    <div className="grid grid-cols-4 gap-2 bg-stone-950 p-3.5 rounded-xl border border-stone-850 font-mono text-[9px]">
                      
                      {/* PM */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-stone-400 font-bold font-sans">产品经理 (PM)</span>
                        <div className="w-full bg-stone-900 rounded-full h-15 relative overflow-hidden flex flex-col justify-end">
                          <div 
                            className={`w-full transition-all duration-500 ${stakeholders.pm >= 50 ? 'bg-emerald-500/60' : 'bg-red-500/40'}`}
                            style={{ height: `${stakeholders.pm}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-stone-100">{stakeholders.pm}%</span>
                        <span className="text-[7.5px] text-stone-500">(发布速率)</span>
                      </div>

                      {/* Arch */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-stone-400 font-bold font-sans">算法架构(Arch)</span>
                        <div className="w-full bg-stone-900 rounded-full h-15 relative overflow-hidden flex flex-col justify-end">
                          <div 
                            className={`w-full transition-all duration-500 ${stakeholders.algo >= 50 ? 'bg-emerald-500/60' : 'bg-red-500/40'}`}
                            style={{ height: `${stakeholders.algo}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-stone-100">{stakeholders.algo}%</span>
                        <span className="text-[7.5px] text-stone-500">(冗余安全)</span>
                      </div>

                      {/* QA */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-stone-400 font-bold font-sans">测试团队(QA)</span>
                        <div className="w-full bg-stone-900 rounded-full h-15 relative overflow-hidden flex flex-col justify-end">
                          <div 
                            className={`w-full transition-all duration-500 ${stakeholders.test >= 50 ? 'bg-emerald-500/60' : 'bg-red-500/40'}`}
                            style={{ height: `${stakeholders.test}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-stone-100">{stakeholders.test}%</span>
                        <span className="text-[7.5px] text-stone-500">(路测覆盖)</span>
                      </div>

                      {/* Customer */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-stone-400 font-bold font-sans">真实用户(User)</span>
                        <div className="w-full bg-stone-900 rounded-full h-15 relative overflow-hidden flex flex-col justify-end">
                          <div 
                            className={`w-full transition-all duration-500 ${stakeholders.customer >= 50 ? 'bg-emerald-500/60' : 'bg-red-500/40'}`}
                            style={{ height: `${stakeholders.customer}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-stone-100">{stakeholders.customer}%</span>
                        <span className="text-[7.5px] text-stone-500">(体验反馈)</span>
                      </div>

                    </div>

                    {/* Operational options (Can play once) */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest block font-mono">请调度以下紧急协同妥协措施：</span>
                      
                      <div className="grid grid-cols-1 gap-2 text-[10px]">
                        <button
                          onClick={() => applyDevDecision('d1')}
                          disabled={devDecisionApplied['d1'] || blueChapter >= 4}
                          className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all focus:outline-none ${
                            devDecisionApplied['d1'] 
                              ? 'bg-stone-950 border-stone-900 text-stone-600 line-through' 
                              : 'bg-stone-950 border-stone-850 hover:border-blue-500'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">1. 交付排期前置（先快后稳）</span>
                            <span className="text-[8.5px] text-stone-400">PM+35 / 算法-10 / 测试-5 / 用户+10 ㆍ 产品赢，架构师不爽</span>
                          </div>
                          <span className="text-[9px] text-blue-400 font-bold">{devDecisionApplied['d1'] ? "已执行" : "执行"}</span>
                        </button>

                        <button
                          onClick={() => applyDevDecision('d2')}
                          disabled={devDecisionApplied['d2'] || blueChapter >= 4}
                          className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all focus:outline-none ${
                            devDecisionApplied['d2'] 
                              ? 'bg-stone-950 border-stone-900 text-stone-600 line-through' 
                              : 'bg-stone-950 border-stone-850 hover:border-blue-500'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">2. 架构层冗余先过（先稳后快）</span>
                            <span className="text-[8.5px] text-stone-400">PM-10 / 算法+35 / 测试+15 / 用户-10 ㆍ 架构稳了，产品和用户都嫌慢</span>
                          </div>
                          <span className="text-[9px] text-blue-400 font-bold">{devDecisionApplied['d2'] ? "已执行" : "执行"}</span>
                        </button>

                        <button
                          onClick={() => applyDevDecision('d3')}
                          disabled={devDecisionApplied['d3'] || blueChapter >= 4}
                          className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all focus:outline-none ${
                            devDecisionApplied['d3'] 
                              ? 'bg-stone-950 border-stone-900 text-stone-600 line-through' 
                              : 'bg-stone-950 border-stone-850 hover:border-blue-500'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">3. 跨方协作 + 带教合作团队（一起把事做扎实）</span>
                            <span className="text-[8.5px] text-stone-400">PM+10 / 算法+20 / 测试+20 / 用户+25 ㆍ 所有人受益但需要熬夜</span>
                          </div>
                          <span className="text-[9px] text-blue-400 font-bold">{devDecisionApplied['d3'] ? "已执行" : "执行"}</span>
                        </button>

                        <button
                          onClick={() => applyDevDecision('d4')}
                          disabled={devDecisionApplied['d4'] || blueChapter >= 4}
                          className={`p-2.5 rounded-xl border text-left flex justify-between items-center transition-all focus:outline-none ${
                            devDecisionApplied['d4'] 
                              ? 'bg-stone-950 border-stone-900 text-stone-600 line-through' 
                              : 'bg-stone-950 border-stone-850 hover:border-blue-500'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">4. 测试覆盖率优先（黑河冰雪极限路测）</span>
                            <span className="text-[8.5px] text-stone-400">PM-10 / 算法+10 / 测试+35 / 用户-10 ㆍ QA 救场，产品和用户都不爽</span>
                          </div>
                          <span className="text-[9px] text-blue-400 font-bold">{devDecisionApplied['d4'] ? "已执行" : "执行"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setDevDecisionApplied({});
                          setCoordinatedMessage(null);
                        }}
                        className="p-1 px-3 border border-stone-850 text-stone-500 hover:text-stone-300 rounded-lg text-[10px] whitespace-nowrap cursor-pointer hover:border-stone-700"
                      >
                        重算利益
                      </button>
                      <p className="text-[9.5px] text-stone-500 leading-snug">
                        提示：单选某一个决策很难让 4 方全过 50%。常见组合：把【跨方协作】(3) 和【架构层冗余】(2) 都点上，再视情况补一个。
                      </p>
                    </div>

                    {coordinatedMessage === 'success' && (
                      <div className="flex flex-col gap-2 relative z-30">
                        <div className="p-3 bg-emerald-950/25 border border-emerald-500/25 text-emerald-300 rounded-xl text-[11px] text-center font-bold font-mono">
                          ✅ 4 方满意度都过线了。这不是因为你聪明——是因为你愿意接受不完美。
                        </div>
                        <button
                          onClick={() => {
                            setBlueChapter(4);
                            setCoordinatedMessage(null);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-350 text-stone-950 font-extrabold rounded-xl text-[10.5px] shadow-[0_0_12px_rgba(52,211,153,0.35)] hover:scale-[1.01] active:scale-98 transition-all"
                        >
                          ⚡ 进入第四章 ㆍ 带教
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* CHAPTER 4 SCREEN: Mentorship coaching */}
                {blueChapter === 4 && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                    <div className="text-[10px] text-justify space-y-1">
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">第四章 ㆍ 带教传火</span>
                      <p className="text-stone-400 mt-1 pb-1">
                        外部团队崩溃大哭的新人在背后问你：“师父，我是个被绩效耗蚀空心的人类，代码永远出bug，多方的对拼我怎么都招架不住，我真想放弃了……”
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5 text-[10px]">
                      
                      {/* Option A */}
                      <button
                        onClick={() => resolveMentorship('A')}
                        disabled={mentorshipAnswer !== null}
                        className={`p-3 rounded-xl border text-left leading-relaxed transition-all focus:outline-none ${
                          mentorshipAnswer === 'A' 
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' 
                            : 'bg-stone-950 border-stone-850 hover:border-blue-500/60'
                        }`}
                      >
                        <span className="font-extrabold text-[10px] text-stone-200 block">A: 契约边界——『管好自己那摊事』</span>
                        <p className="text-stone-500 mt-1">“别干多余的事。管好你分内的那点代码协议，对齐时间表格准时交卷，别人的困难与心酸我们不管也是常态，安全为主吧。”</p>
                      </button>

                      {/* Option B */}
                      <button
                        onClick={() => resolveMentorship('B')}
                        disabled={mentorshipAnswer !== null}
                        className={`p-3 rounded-xl border text-left leading-relaxed transition-all focus:outline-none ${
                          mentorshipAnswer === 'B' 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                            : 'bg-stone-950 border-stone-850 hover:border-blue-500/60'
                        }`}
                      >
                        <span className="font-extrabold text-[10px] text-stone-200 block">B: 熬夜带教——『今晚我陪你调过去』</span>
                        <p className="text-stone-500 mt-1">“没有谁生来就是假人机器。我们在泥藻里冷冰冰的，那我们师徒今天就熬夜把雷达毫米级的调试教案一笔一析全部文档化传给你！我陪你把这坐底代码给它跑过去！”</p>
                      </button>

                    </div>

                    {mentorshipAnswer && (
                      <div className="bg-stone-950 p-3.5 border border-stone-850 rounded-xl text-[10.5px] leading-relaxed text-justify space-y-1.5">
                        {mentorshipAnswer === 'A' ? (
                          <div className="text-rose-300 space-y-1.5">
                            <p>⚠️ 这个选择是合规的。契约边界你守住了，工时也省了。</p>
                            <p className="italic text-[10px] text-stone-400">
                              但 vault 里千岑写过一句话：「上班就是大型 cosplay。我清醒地看着自己入戏，演技太好——感到的是更深层的空虚。」（<code className="text-stone-500">2025-12-12.md</code>）
                            </p>
                            <p className="text-rose-400 font-semibold pt-1 border-t border-stone-900">你赢了 60 分。但这一关停在第四章，不会推进。</p>
                          </div>
                        ) : (
                          <div className="text-amber-200 space-y-1.5">
                            <p>✅ 你选了 B。</p>
                            <p className="italic text-[10px] text-stone-400">
                              这是 vault 里 <code className="text-stone-500">2026-06-13.md</code> 那句话的实操：「真正的领导力，是成为复杂系统中的一团篝火，让周围的人因为你的存在而获得成长。」
                            </p>
                            <p className="text-amber-300 font-semibold pt-1 border-t border-stone-900">你没赢这场博弈——你换了一个游戏在玩。</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* BLUE PLANET GAME SUCESS PAYOFF */}
                {blueChapter === 5 && (
                  <div className="space-y-3">
                    <div className="bg-emerald-950/20 border-2 border-emerald-500/30 rounded-xl p-3.5 space-y-2 text-[11px] text-justify text-emerald-300 animate-[fadeIn_0.5s_ease_1]">
                      <span className="text-[10px] font-bold block uppercase font-mono">🌟 蓝星亮了：</span>
                      <p className="italic">
                        从哲学的高台，摔进底盘故障、淘宝市井算账和手把手带教新人的泥水里。你没有学到怎么圆滑，但彻底砸掉了纸片教条。在实打实的尘土里，你见识到了实践本身的力量。
                      </p>
                      <p className="text-stone-300 not-italic text-[10px] leading-relaxed border-t border-emerald-500/10 pt-1.5">
                        —— 蓝星亮了。但金星之后还有新坑，蓝星之后也一样。继续往下看。
                      </p>
                      <p className="font-bold text-amber-400 border-t border-emerald-500/10 pt-1 text-[10px] uppercase font-mono">
                        🔑 获得人格碎片：【创造/CREATION】 ㆍ 不纸上谈兵，用泥水里的调试改变现实。
                      </p>
                    </div>

                    {/* 蓝星亮了之后的夹层 —— 三条河 */}
                    <BlueStarReflection />
                  </div>
                )}
              </div>
  );
}
