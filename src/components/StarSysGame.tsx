import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  RotateCcw, 
  Check, 
  X, 
  ChevronRight, 
  Sliders, 
  Cpu, 
  Activity, 
  Scissors, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Database,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import CognitiveDlc from './CognitiveDlc';

// Chinese 12 Shichens Mapping configuration for metaphysical traits
interface ShichenInfo {
  name: string;
  range: string;
  element: string;
  elementColor: string;
  elementBg: string;
  glowColor: string;
  desc: string;
  modifiers: {
    pm: number;
    algo: number;
    test: number;
    customer: number;
  };
}

const SHICHEN_DATA: Record<string, ShichenInfo> = {
  "子时": {
    name: "子时",
    range: "23:00 - 01:00",
    element: "水",
    elementColor: "text-blue-400",
    elementBg: "bg-blue-500/10 border-blue-500/20",
    glowColor: "rgba(59,130,246,0.15)",
    desc: "水德润下，智虑深沉。真实用户体验温顺提升，产品节奏缓和调护。",
    modifiers: { pm: -5, algo: 5, test: -5, customer: 15 }
  },
  "丑时": {
    name: "丑时",
    range: "01:00 - 03:00",
    element: "土",
    elementColor: "text-amber-600",
    elementBg: "bg-amber-600/10 border-amber-600/20",
    glowColor: "rgba(217,119,6,0.15)",
    desc: "湿土生金，厚德载物。底盘算法与硬件容灾底子稳固，测试狂跑亦安全。",
    modifiers: { pm: 5, algo: -5, test: 15, customer: -5 }
  },
  "寅时": {
    name: "寅时",
    range: "03:00 - 05:00",
    element: "木",
    elementColor: "text-emerald-400",
    elementBg: "bg-emerald-500/10 border-emerald-500/20",
    glowColor: "rgba(16,185,129,0.15)",
    desc: "阳气始萌，草木逢春。算法带教文档滋生如竹，设计充满生发希望。",
    modifiers: { pm: -10, algo: 15, test: -5, customer: 10 }
  },
  "卯时": {
    name: "卯时",
    range: "05:00 - 07:00",
    element: "木",
    elementColor: "text-emerald-400",
    elementBg: "bg-emerald-500/10 border-emerald-500/20",
    glowColor: "rgba(16,185,129,0.15)",
    desc: "日出东方，生机盎然。协作渡人春光明媚，真实用户反馈更显开朗。",
    modifiers: { pm: -5, algo: 10, test: -5, customer: 15 }
  },
  "辰时": {
    name: "辰时",
    range: "07:00 - 09:00",
    element: "土",
    elementColor: "text-amber-500",
    elementBg: "bg-amber-500/10 border-amber-500/20",
    glowColor: "rgba(245,158,11,0.15)",
    desc: "群贤聚首，中正平和。项目计划调配严整，各维度利益基本持平。",
    modifiers: { pm: 10, algo: -5, test: 10, customer: -5 }
  },
  "巳时": {
    name: "巳时",
    range: "09:00 - 11:00",
    element: "火",
    elementColor: "text-rose-500",
    elementBg: "bg-rose-500/10 border-rose-500/20",
    glowColor: "rgba(244,63,94,0.15)",
    desc: "骄阳似火，突击攻坚。产品经理极具动力推行加班，开发测试焦伤疲累。",
    modifiers: { pm: 15, algo: -10, test: -10, customer: 15 }
  },
  "午时": {
    name: "午时",
    range: "11:00 - 13:00",
    element: "火",
    elementColor: "text-orange-500",
    elementBg: "bg-orange-500/10 border-orange-500/20",
    glowColor: "rgba(249,115,22,0.15)",
    desc: "烈日当头，效率鼎盛。客户反馈快速回音，发布车机节奏推行至极巅。",
    modifiers: { pm: 20, algo: -15, test: -10, customer: 15 }
  },
  "未时": {
    name: "未时",
    range: "13:00 - 15:00",
    element: "土",
    elementColor: "text-amber-600",
    elementBg: "bg-amber-600/10 border-amber-600/20",
    glowColor: "rgba(217,119,6,0.15)",
    desc: "日昳修整，重归大地。系统安全路测覆盖稳打稳扎，架构设计平心沉气。",
    modifiers: { pm: 5, algo: -5, test: 15, customer: -5 }
  },
  "申时": {
    name: "申时",
    range: "15:00 - 17:00",
    element: "金",
    elementColor: "text-zinc-400",
    elementBg: "bg-zinc-500/10 border-zinc-500/20",
    glowColor: "rgba(113,113,122,0.15)",
    desc: "白帝司权，兵戈清冷。精密代码如金错刀。架构及测试极致考究，用户人情稍淡。",
    modifiers: { pm: -5, algo: 15, test: 10, customer: -5 }
  },
  "酉时": {
    name: "酉时",
    range: "17:00 - 19:00",
    element: "金",
    elementColor: "text-zinc-300",
    elementBg: "bg-zinc-500/10 border-zinc-500/20",
    glowColor: "rgba(161,161,170,0.15)",
    desc: "夕阳熔金，洗尽铅华。算法防灾策略极简高效，分析用例精确合意。",
    modifiers: { pm: -5, algo: 15, test: 15, customer: -5 }
  },
  "戌时": {
    name: "戌时",
    range: "19:00 - 21:00",
    element: "土",
    elementColor: "text-yellow-650",
    elementBg: "bg-yellow-600/10 border-yellow-600/20",
    glowColor: "rgba(202,138,4,0.15)",
    desc: "黄昏收敛，大地沉静。硬件容灾与极限泊车测试稳重结合，重整秩序。",
    modifiers: { pm: 10, algo: -10, test: 15, customer: -5 }
  },
  "亥时": {
    name: "亥时",
    range: "21:00 - 23:00",
    element: "水",
    elementColor: "text-sky-400",
    elementBg: "bg-sky-500/10 border-sky-500/20",
    glowColor: "rgba(56,189,248,0.15)",
    desc: "夜深人静，水天一色。具体的人文爱恨抚平冷铁车机，真实用户好评满载。",
    modifiers: { pm: -10, algo: 5, test: -5, customer: 20 }
  }
};

const getRealShichen = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour >= 23 || hour < 1) return "子时";
  if (hour >= 1 && hour < 3) return "丑时";
  if (hour >= 3 && hour < 5) return "寅时";
  if (hour >= 5 && hour < 7) return "卯时";
  if (hour >= 7 && hour < 9) return "辰时";
  if (hour >= 9 && hour < 11) return "巳时";
  if (hour >= 11 && hour < 13) return "午时";
  if (hour >= 13 && hour < 15) return "未时";
  if (hour >= 15 && hour < 17) return "申时";
  if (hour >= 17 && hour < 19) return "酉时";
  if (hour >= 19 && hour < 21) return "戌时";
  return "亥时";
};

interface StarSysGameProps {
  onSyncProgress: (progress: { red: boolean; blue: boolean; gold: boolean; central: boolean }) => void;
  isMaxedCheat?: boolean; // dynamic fallback
  isStaySynthesized?: boolean; // NEW: Alchemical Stay resonance solved
}

export default function StarSysGame({ onSyncProgress, isMaxedCheat, isStaySynthesized }: StarSysGameProps) {
  // --- Orbit View & Currently Selected Cosmic Star ---
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null); // 'red', 'blue', 'gold', 'central', 'gold_satellite', null
  const [centralLockAlert, setCentralLockAlert] = useState(false);
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
    // Also reset individual sub-puzzle variables
    setRedChapter(1);
    setRedCurrentSequence(['b3', 'b1', 'b5', 'b2', 'b4']);
    setRedCheckMessage(null);
    setSoulBass(40);
    setSoulMid(800);
    setSoulTreble(5000);
    setSoulMessage(null);
    setTeaTemp(50);
    setTeaTime(15);
    setTeaVulnerable(false);
    setTeaMessage(null);
    setTeaEasterEgg(false);
    setBlueChapter(1);
    setGestureTimeWindow(500);
    setGestureThreshold(3);
    setGestureVoting('2/3');
    setGestureMessage(null);
    setRadarSelectedSource(null);
    setRadarSelectedTarget(null);
    setRadarSelectedConsequence(null);
    setRadarMessage(null);
    setStakeholders({ pm: 30, algo: 30, test: 30, customer: 30 });
    setDevDecisionApplied({});
    setCoordinatedMessage(null);
    setMentorshipAnswer(null);
    setGoldStageSolutions({});
    setGoldMessage(null);
    setClimaxOutcome(null);
    setSelectedPlanet(null);
  };

  // --- SUB-GAME 1: 红星 (Emotion) State ---
  const [redChapter, setRedChapter] = useState<number>(1);

  // Scattered QQ/chat bubbles from Qiancen's elementary/early summer regret (Chapter 1)
  const originalChatBubbles = [
    { id: 'b1', text: '她：“今晚天上有流星雨，好漂亮啊。你快看啊。”', correctIdx: 0, desc: '流星雨降临' },
    { id: 'b2', text: '千岑：“没看，我在家和哥们联机魔兽呢，别打岔。”', correctIdx: 1, desc: '傲慢的自尊防御' },
    { id: 'b3', text: '她：“哦……那我特地也下载了魔兽，可以带我一起联机么？”', correctIdx: 2, desc: '诚挚的走近' },
    { id: 'b4', text: '千岑：“你下的那个绝对是盗版，肯定跑不了联机，别折腾了。”', correctIdx: 3, desc: '紧锁的圣殿' },
    { id: 'b5', text: '她：“这样呀……可我一直没睡，会在流星下直到你想我。”', correctIdx: 4, desc: '情根封存' }
  ];

  const [redCurrentSequence, setRedCurrentSequence] = useState<string[]>(['b3', 'b1', 'b5', 'b2', 'b4']);
  const [redCheckMessage, setRedCheckMessage] = useState<'success' | 'failure' | null>(null);

  const moveRedBubble = (index: number, direction: 'up' | 'down') => {
    const nextArr = [...redCurrentSequence];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextArr.length) return;
    
    // swap
    const temp = nextArr[index];
    nextArr[index] = nextArr[targetIdx];
    nextArr[targetIdx] = temp;
    setRedCurrentSequence(nextArr);
    setRedCheckMessage(null);
  };

  const verifyRedMemory = () => {
    const isCorrect = redCurrentSequence[0] === 'b1' &&
                      redCurrentSequence[1] === 'b2' &&
                      redCurrentSequence[2] === 'b3' &&
                      redCurrentSequence[3] === 'b4' &&
                      redCurrentSequence[4] === 'b5';
    if (isCorrect) {
      setRedCheckMessage('success');
    } else {
      setRedCheckMessage('failure');
    }
  };

  // Chapter 2: Soul Playlist Frequency Tuner
  const [soulBass, setSoulBass] = useState<number>(40); // target: 70-90 (Heartbeat intimacy)
  const [soulMid, setSoulMid] = useState<number>(800); // target: 500-650 (Clear human voice)
  const [soulTreble, setSoulTreble] = useState<number>(5000); // target: 1000-1500 (Lowering defensiveness safety filter)
  const [soulMessage, setSoulMessage] = useState<string | null>(null);

  const verifySoulTuner = () => {
    const isBassOk = soulBass >= 70 && soulBass <= 90;
    const isMidOk = soulMid >= 500 && soulMid <= 650;
    const isTrebleOk = soulTreble >= 1000 && soulTreble <= 1500;
    
    if (isBassOk && isMidOk && isTrebleOk) {
      setSoulMessage('success');
    } else {
      let advice: string[] = [];
      if (!isBassOk) advice.push('古董金石年份脉络不符，请调至 70-90年 溯回上世纪遗留的岁月余温');
      if (!isMidOk) advice.push('图书分类文献检索码错位，请调至 500-650 寻回那部尘封的浪漫特藏《可遇不可求的事》');
      if (!isTrebleOk) advice.push('心灵感应宿命阻抗偏离，请调至 1000-1500 MΩ 以穿透高山风砂取得同频共振');
      setSoulMessage(`信号失调：${advice.join('；')}`);
    }
  };

  // Chapter 3: 2024 Jasmine Green Tea Brewer
  const [teaTemp, setTeaTemp] = useState<number>(50); // target: 80 - 85 (°C)
  const [teaTime, setTeaTime] = useState<number>(15); // target: 30 - 40 (seconds)
  const [teaVulnerable, setTeaVulnerable] = useState<boolean>(false); // target: true
  const [teaMessage, setTeaMessage] = useState<string | null>(null);
  const [teaEasterEgg, setTeaEasterEgg] = useState<boolean>(false);

  const verifyTeaBrewer = () => {
    const isTempOk = teaTemp >= 80 && teaTemp <= 85;
    const isTimeOk = teaTime >= 30 && teaTime <= 40;
    
    if (isTempOk && isTimeOk && teaVulnerable) {
      if (teaTemp === 85 && teaTime === 30) {
        setTeaEasterEgg(true);
      } else {
        setTeaEasterEgg(false);
      }
      setTeaMessage('success');
      markPlanetSolved('red', true); // Completing level 3 solves the Red Planet!
    } else {
      let advice: string[] = [];
      if (!isTempOk) {
        advice.push(teaTemp > 85 ? `水温过沸 (${teaTemp}°C) 烫毁了娇弱的茉莉花茶魂` : `水温过寒 (${teaTemp}°C) 沉寂了封存的茉莉花叶`);
      }
      if (!isTimeOk) {
        advice.push(teaTime > 40 ? `焖泡时间过长 (${teaTime}秒) 憋出了回避型苦涩执念` : `熏陶时间过短 (${teaTime}秒) 回响茶味未能渗透真心`);
      }
      if (!teaVulnerable) {
        advice.push('「理智自卫防线」尚未卸下 —— 如果不解盔涉险、选择放下防线，你泡出来的永远只是隔阂的理智无机水');
      }
      setTeaMessage(`冲泡失败：${advice.join('；')}`);
    }
  };


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
      let desc = '【控制流异常降级】：';
      if (!isWindowOk) desc += '5Hz数据采样时间探测窗口过短或长偏（推荐800-1200ms以内）；';
      if (!isThresholdOk) desc += '触发阈值未调节至完美5Hz特征信号频点；';
      if (!isVotingOk) desc += '投票容灾机制防御度不够（请设为3/5安全多数票状态控制安全锁）。';
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

  // Dynamically calculate stakeholder satisfaction scores from: Base 30 + Applied Decisions + Shichen Element Modifiers
  const stakeholders = React.useMemo(() => {
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

  // Safe dummy setter for backward compatibility in global resets
  const setStakeholders = (unused: any) => {
    // Computed dynamically, reset is handled by clearing devDecisionApplied
  };

  // Watch for successful stakeholder alignment (all >= 50) to progress to Chapter 4
  const transitioningRef = React.useRef(false);
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
        markPlanetSolved('blue', true);
      }, 2000);
    }
  };


  // --- SUB-GAME 3: 金星 (Wisdom/Cognition) ---
  // Drag/Select stage concept tree
  // Stages: age18, age22, age24, age26
  const [goldStageSolutions, setGoldStageSolutions] = useState<Record<string, string>>({}); // stage -> tileId
  const [goldMessage, setGoldMessage] = useState<string | null>(null);

  const setGoldSolution = (stageId: string, tileId: string) => {
    setGoldStageSolutions(prev => ({ ...prev, [stageId]: tileId }));
    setGoldMessage(null);
  };

  const verifyGoldStar = () => {
    const isCorrect = goldStageSolutions['age18'] === 'meritocracy' &&
                      goldStageSolutions['age22'] === 'nihilism' &&
                      goldStageSolutions['age24'] === 'practice' &&
                      goldStageSolutions['age26'] === 'concretelove';
    if (isCorrect) {
      setGoldMessage('success');
      markPlanetSolved('gold', true);
    } else {
      setGoldMessage('对齐失败：思想演化树的观点年份存在断层错位。请审视千岑 24 岁的实践论拼杀、以及 26 岁卡氏与红楼具体的血肉爱恨位置。');
    }
  };


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
          《星系档案》由三颗代表成长叙事线的主星组成（红星、蓝星、金星）。解开每一条叙事链的深层宿命执念，便能点亮中心融汇的恒星，释放出流向“人间烟火”的具体生活温存。
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
                    {selectedPlanet === 'red' && `红星连接仓：情感重熔与关系对流 (第${redSolved ? '三' : redChapter}/3章)`}
                    {selectedPlanet === 'blue' && `蓝星实践所：理论下场第${blueChapter === 5 ? '四' : blueChapter}章 (${blueChapter}/4)`}
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
              <div className="space-y-4">
                
                {/* Progress stepper meter */}
                <div className="flex gap-1 bg-stone-950/40 p-1.5 rounded-xl border border-stone-850">
                  {[1, 2, 3].map((ch) => {
                    const titles = ['2010ㆍ少年流星雨', '2020ㆍ可遇不可求', '2024ㆍ茗香解盔涉险'];
                    const isPassed = redSolved || redChapter > ch;
                    const isCurrent = !redSolved && redChapter === ch;
                    return (
                      <button
                        key={ch}
                        disabled={!redSolved && ch > redChapter}
                        onClick={() => {
                          if (redSolved || ch <= redChapter) {
                            setRedChapter(ch);
                          }
                        }}
                        className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold transition-all text-center flex flex-col items-center justify-center border ${
                          isPassed
                            ? 'bg-red-955/15 border-red-500/20 text-red-400 cursor-pointer hover:bg-red-955/35'
                            : isCurrent
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 animate-pulse'
                              : 'bg-stone-955/10 border-transparent text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        <span className="font-mono text-[8px] uppercase opacity-70">STAGE 0{ch}</span>
                        <span className="tracking-tight">{titles[ch - 1]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* --- CHAPTER 1: 2010 少年流星雨 (Meteor Shower) --- */}
                {(!redSolved ? redChapter === 1 : redChapter === 1) && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed relative">
                      <span className="text-[8px] font-bold text-red-400 block mb-1">【第一阶段 ㆍ 2010 少年流星雨与魔兽圣殿】</span>
                      <p className="text-stone-300 font-semibold italic text-justify">“总是在靠近的一瞬间，我就为了维护傲慢的人设，亲手叉掉你的讯号。”</p>
                      <p className="text-stone-500 mt-1 leading-snug">
                        小学那个酷烈闷热的暑假，她发来流星雨哥哥的QQ申请，连原本从不玩电脑的她都特地下了《魔兽争霸》请求联机。你明明开心到心跳几乎碎裂，极度缺爱的自卑却触发了防御：你在朋友面前摆出冷傲姿态，判定她的魔兽是“联不了机的盗版”，筑水泥高墙将心意封存。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">🛠️ 记忆对齐：重构当年那段被冰冷理智判决的QQ对话</span>
                        <button 
                          onClick={() => setRedCurrentSequence(['b3', 'b1', 'b5', 'b2', 'b4'])}
                          className="text-[9px] text-stone-500 hover:text-stone-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>🔄 重乱</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 font-mono text-[10.5px]">
                        {redCurrentSequence.map((id, index) => {
                          const bubble = originalChatBubbles.find(b => b.id === id)!;
                          const isCorrectSpot = bubble.correctIdx === index;
                          return (
                            <div 
                              key={id}
                              className={`p-2 rounded-xl border flex justify-between items-center transition-all ${
                                redCheckMessage === 'success' || redSolved
                                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' 
                                  : isCorrectSpot
                                    ? 'bg-amber-500/5 border-amber-500/30 text-amber-200 animate-pulse'
                                    : 'bg-stone-950 border-stone-850 text-stone-400'
                              }`}
                            >
                              <div className="flex-1 pr-4">
                                <span className="text-[7.5px] uppercase font-bold text-stone-500 block leading-none mb-1">
                                  节点 0{index + 1} ㆍ {bubble.desc}
                                </span>
                                <span className="leading-snug">{bubble.text}</span>
                              </div>
                              
                              {!(redCheckMessage === 'success' || redSolved) && (
                                <div className="flex items-center gap-1.5 shrink-0 select-none">
                                  <button 
                                    onClick={() => moveRedBubble(index, 'up')}
                                    disabled={index === 0}
                                    className="w-5 h-5 bg-stone-900 hover:bg-stone-850 text-[10px] disabled:opacity-30 rounded border border-stone-800 flex items-center justify-center font-bold font-mono"
                                  >
                                    ▲
                                  </button>
                                  <button 
                                    onClick={() => moveRedBubble(index, 'down')}
                                    disabled={index === redCurrentSequence.length - 1}
                                    className="w-5 h-5 bg-stone-900 hover:bg-stone-850 text-[10px] disabled:opacity-30 rounded border border-stone-800 flex items-center justify-center font-bold font-mono"
                                  >
                                    ▼
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action verification/next step */}
                    {redCheckMessage !== 'success' && !redSolved ? (
                      <button
                        onClick={verifyRedMemory}
                        className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-stone-950 hover:from-red-400 hover:to-rose-500 font-extrabold py-2.5 rounded-xl text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>✓ 验证对齐第一章记忆碎末链</span>
                      </button>
                    ) : (
                      <div className="bg-emerald-955/15 border border-emerald-500/20 p-3.5 rounded-xl space-y-2 text-[11px] text-justify text-stone-300">
                        <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
                          <span>🌠 【少年流星雨 ㆍ 真实心跳解封】</span>
                        </div>
                        <p className="italic text-stone-400 text-[10px] leading-relaxed">
                          “其实那个夏夜，我捂着心脏开心到几乎窒息。但我生怕她撞破我一无所有的贫弱，所以我把QQ对话框叉掉。我判了魔兽联机‘盗版死刑’，只是害怕和她对视时，她看穿我是个穿补丁校服的小偷。”
                        </p>
                        <button
                          onClick={() => {
                            setRedChapter(2);
                            setRedCheckMessage(null);
                          }}
                          className="w-full mt-2 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-stone-950 font-extrabold rounded-xl text-[10.5px] cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:scale-[1.01] transition-all"
                        >
                          ⚡ 立即点击：迈入第二阶段 ㆍ 2020 可遇不可求
                        </button>
                      </div>
                    )}

                    {redCheckMessage === 'failure' && !redSolved && (
                      <div className="p-3 bg-red-950/20 border border-red-500/20 text-rose-300 rounded-xl text-[10.5px] italic text-justify font-mono">
                        ❌ 顺序对齐失败：时间流转窒碍。请按“女孩发出流星雨信号、你冷傲拒绝、女孩执意下载魔兽、你用盗版审编隔绝、她凄婉自留”的真实逻辑排序。
                      </div>
                    )}
                  </div>
                )}
                {(!redSolved ? redChapter === 2 : redChapter === 2) && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed relative">
                      <span className="text-[8px] font-bold text-rose-400 block mb-1">【第二阶段 ㆍ 2020 那本《可遇不可求的事》手抄本】</span>
                      <p className="text-stone-300 font-semibold italic text-justify">“可遇不可求的事，后海有书的院子，夏代有工的玉，此时此刻的云，二十来岁的你。”</p>
                      <p className="text-stone-500 mt-1 leading-snug">
                        2020疫情困在乡下的炎夏，满天繁星。你遇到一个喜爱古旧图书、斑驳文物与金石古董，梦想去西藏当藏书阁管理员的温润女孩。她曾给你寄来纸质泛黄的《可遇不可求的事》首版手抄本，里面夹着青海祁连山的格桑花干燥标本。而当时怯弱空虚的你只是一味攀登着世俗阶梯，敷衍地把一切闪光和灵气判定为“无效率的抽象论题”。你需要将你的真情频率，与她书信中的金石断代年份、特藏图书分类码以及宿命感知频率彻底对齐，方可重新呼唤这卷荒原里的文明温存。
                      </p>
                    </div>

                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-stone-300 font-mono">🏮 金石图书 ㆍ 岁月余温共鸣仪 (Literary Resonance)</span>
                        <span className="text-[8px] font-mono text-stone-500 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-850">
                          {soulMessage === 'success' ? '⚡ RES ON' : '⚠️ UNALIGNED'}
                        </span>
                      </div>

                      {/* Wave visualization mock */}
                      <div className="h-10 bg-stone-900/80 rounded-xl border border-stone-850/80 flex items-center justify-center gap-1 px-4 relative overflow-hidden select-none">
                        <div className="absolute inset-0 bg-stone-950/20 backdrop-blur-[0.5px] pointer-events-none" />
                        {[...Array(24)].map((_, i) => {
                          const isActive = soulMessage === 'success';
                          const heightVal = isActive 
                            ? Math.sin(i * 0.4) * 16 + 20 
                            : Math.sin(i * 0.2 + (soulBass/20)) * 8 + (soulMid/100) + 6;
                          return (
                            <div 
                              key={i} 
                              style={{ height: `${Math.max(4, Math.min(36, heightVal))}px` }}
                              className={`w-1 rounded-full transition-all duration-300 ${
                                isActive ? 'bg-rose-500/80 animate-pulse' : 'bg-stone-700/60'
                              }`} 
                            />
                          );
                        })}
                        {soulMessage === 'success' && (
                          <div className="absolute bg-rose-955/90 border border-rose-500/30 text-rose-300 text-[9px] px-3 py-1 rounded-xl font-bold font-mono animate-bounce text-center leading-normal">
                            📖 尘封金石纸页缓缓舒展，重现隽永赠言
                          </div>
                        )}
                      </div>

                      {/* Inputs */}
                      <div className="space-y-3.5">
                        {/* Slider 1: Antiques Year / Chronology */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono leading-none">
                            <span className="text-stone-400 font-medium">古董金石断代 ㆍ 岁月痕迹 (Antique Year Scale)</span>
                            <span className={`font-bold ${soulBass >= 70 && soulBass <= 90 ? 'text-rose-400' : 'text-stone-500'}`}>
                              {soulBass} 年代 <span className="text-[8px] font-normal opacity-70">(目标: 70-90年)</span>
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="20" 
                            max="150" 
                            value={soulBass}
                            disabled={soulMessage === 'success'}
                            onChange={(e) => { setSoulBass(Number(e.target.value)); setSoulMessage(null); }}
                            className="w-full accent-rose-500 cursor-pointer disabled:opacity-40"
                          />
                        </div>

                        {/* Slider 2: Library Index Catalog */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono leading-none">
                            <span className="text-stone-400 font-medium">藏书馆特藏 ㆍ 图书检索类目分类码 (Library Catalog Index)</span>
                            <span className={`font-bold ${soulMid >= 500 && soulMid <= 650 ? 'text-rose-400' : 'text-stone-500'}`}>
                              {soulMid} 号架 <span className="text-[8px] font-normal opacity-70">(目标: 500-650)</span>
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="200" 
                            max="1200" 
                            value={soulMid}
                            disabled={soulMessage === 'success'}
                            onChange={(e) => { setSoulMid(Number(e.target.value)); setSoulMessage(null); }}
                            className="w-full accent-rose-500 cursor-pointer disabled:opacity-40"
                          />
                        </div>

                        {/* Slider 3: Serendipity Res Impedance */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono leading-none">
                            <span className="text-stone-400 font-medium">《可遇不可求的事》心灵感应阻抗 (Destiny Res Impedance)</span>
                            <span className={`font-bold ${soulTreble >= 1000 && soulTreble <= 1500 ? 'text-rose-400' : 'text-stone-500'}`}>
                              {soulTreble} MΩ <span className="text-[8px] font-normal opacity-70">(目标: 1000-1500)</span>
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="800" 
                            max="6000" 
                            value={soulTreble}
                            disabled={soulMessage === 'success'}
                            onChange={(e) => { setSoulTreble(Number(e.target.value)); setSoulMessage(null); }}
                            className="w-full accent-rose-500 cursor-pointer disabled:opacity-40"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action verification/next step */}
                    {soulMessage !== 'success' ? (
                      <button
                        onClick={verifySoulTuner}
                        className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-stone-950 hover:from-red-400 hover:to-rose-500 font-extrabold py-2.5 rounded-xl text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>✓ 对齐岁月金石与图书共鸣</span>
                      </button>
                    ) : (
                      <div className="bg-emerald-955/15 border border-emerald-500/20 p-3.5 rounded-xl space-y-2 text-[11px] text-justify text-stone-300">
                        <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
                          <span>📖 【可遇不可求 ㆍ 纸页生香】</span>
                        </div>
                        <p className="italic text-stone-200 text-[10.5px] leading-relaxed">
                          “那一瞬间，尘封藏书阁的老式留声机和八音盒突然缓缓自动鸣响。在 70年代古朴玉石刻痕与 520号 人文特藏检索架的共振下，泛黄的纸页悄然舒展，显现出当年的隽永诗句：『可遇不可求的事，后海有书的院子，夏代有工的玉，此时此刻的云，二十来岁的你。』你第一次为自己的逃避感到羞愧，也深刻确知，你被那一抹古典旷远的美善所彻底照亮过。”
                        </p>
                        <button
                          onClick={() => {
                            setRedChapter(3);
                            setSoulMessage(null);
                          }}
                          className="w-full mt-2 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-stone-950 font-extrabold rounded-xl text-[10.5px] cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:scale-[1.01] transition-all"
                        >
                          ⚡ 立即点击：迈入最终章 ㆍ 2024茉莉花茶
                        </button>
                      </div>
                    )}

                    {soulMessage && soulMessage !== 'success' && (
                      <div className="p-3 bg-red-950/20 border border-red-500/20 text-rose-300 rounded-xl text-[10.5px] italic text-justify font-mono">
                        ❌ {soulMessage}
                      </div>
                    )}
                  </div>
                )}

                {/* --- CHAPTER 3: 2024 茉莉花茶 (Jasmine Tea) --- */}
                {redChapter === 3 && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                    <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed relative">
                      <span className="text-[8px] font-bold text-red-400 block mb-1">【第三阶段 ㆍ 2024 茉莉花茶与带温解盔】</span>
                      <p className="text-stone-500 mt-1 leading-snug">
                      </p>
                    </div>

                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-mono text-stone-300">
                        <span className="flex items-center gap-1">🍵 茉莉花茶焖沏仪式 (Jasmine Steeper)</span>
                        <span className="text-red-400 font-bold">{redSolved ? '✓ 完美沏合' : '⚠️ 闷泡中'}</span>
                      </div>

                      {/* Visual steam effect */}
                      <div className="h-16 bg-stone-900/60 rounded-xl border border-stone-850 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                        <div className="absolute inset-0 flex justify-center items-end gap-1.5 opacity-40 pointer-events-none">
                          <span className={`w-1.5 rounded-t-full bg-gradient-to-t from-amber-400 to-transparent ${redSolved || teaTemp > 70 ? 'h-10 animate-[bounce_1.5s_infinite]' : 'h-2'}`} />
                          <span className={`w-1.5 rounded-t-full bg-gradient-to-t from-yellow-350 to-transparent ${redSolved || teaTemp > 75 ? 'h-12 animate-[bounce_2s_infinite]' : 'h-3'}`} />
                          <span className={`w-1.5 rounded-t-full bg-gradient-to-t from-amber-500 to-transparent ${redSolved || teaTemp > 80 ? 'h-8 animate-[bounce_1.2s_infinite]' : 'h-1'}`} />
                        </div>
                        
                        <div className="relative z-10 w-full">
                          <p className="text-[10px] font-mono text-stone-400">
                            {`当前状态：水温 ${teaTemp}°C ｜ 计时器 ${teaTime}s ｜ 心智装甲：${teaVulnerable ? '💔 卸盔解甲' : '🛡️ 完美防御'}`}
                          </p>
                          <p className="text-[8.5px] font-mono text-stone-500 mt-0.5">
                            {redSolved 
                              ? '✓ 茉莉花茶已焖沏完成，触发深层印记碎片！'
                              : '（注：好茶需 80-85°C 焖 30-40秒，并且不可开启理智自守）'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Temp slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono leading-none">
                            <span className="text-stone-400">冲沏水温 (Water Temperature)</span>
                            <span className={`font-bold ${teaTemp >= 80 && teaTemp <= 85 ? 'text-red-400 font-extrabold animate-pulse' : 'text-stone-500'}`}>
                              {teaTemp} °C {teaTemp >= 80 && teaTemp <= 85 ? '(完美: 80-85°C)' : ''}
                            </span>
                          </div>
                          <div className="flex gap-1.5 items-center">
                            <button
                              type="button"
                              disabled={teaTemp <= 20}
                              onClick={() => { setTeaTemp(prev => Math.max(20, prev - 5)); setTeaMessage(null); }}
                              className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none"
                            >
                              -5°
                            </button>
                            <button
                              type="button"
                              disabled={teaTemp <= 20}
                              onClick={() => { setTeaTemp(prev => Math.max(20, prev - 1)); setTeaMessage(null); }}
                              className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none"
                            >
                              -1°
                            </button>
                            <input 
                              type="range" 
                              min="20" 
                              max="100" 
                              value={teaTemp}
                              onChange={(e) => { setTeaTemp(Number(e.target.value)); setTeaMessage(null); }}
                              className="flex-1 accent-red-500 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
                            />
                            <button
                              type="button"
                              disabled={teaTemp >= 100}
                              onClick={() => { setTeaTemp(prev => Math.min(100, prev + 1)); setTeaMessage(null); }}
                              className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none"
                            >
                              +1°
                            </button>
                            <button
                              type="button"
                              disabled={teaTemp >= 100}
                              onClick={() => { setTeaTemp(prev => Math.min(100, prev + 5)); setTeaMessage(null); }}
                              className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none"
                            >
                              +5°
                            </button>
                          </div>
                          {/* Quick Set Presets */}
                          <div className="flex gap-1">
                            {[60, 75, 80, 83, 85, 95].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => { setTeaTemp(t); setTeaMessage(null); }}
                                className={`flex-1 py-1 rounded text-[9px] font-mono border transition-all ${
                                  teaTemp === t
                                    ? 'bg-red-500/10 border-red-500/40 text-red-300 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                                    : 'bg-stone-900/60 border-stone-850/80 text-stone-400 hover:text-stone-300'
                                }`}
                              >
                                {t}°C
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono leading-none">
                            <span className="text-stone-400">焖泡时间 (Steeping Duration)</span>
                            <span className={`font-bold ${teaTime >= 30 && teaTime <= 40 ? 'text-red-400 font-extrabold animate-pulse' : 'text-stone-500'}`}>
                              {teaTime} 秒 {teaTime >= 30 && teaTime <= 40 ? '(完美: 30-40秒)' : ''}
                            </span>
                          </div>
                          <div className="flex gap-1.5 items-center">
                            <button
                              type="button"
                              disabled={teaTime <= 5}
                              onClick={() => { setTeaTime(prev => Math.max(5, prev - 5)); setTeaMessage(null); }}
                              className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none"
                            >
                              -5s
                            </button>
                            <button
                              type="button"
                              disabled={teaTime <= 5}
                              onClick={() => { setTeaTime(prev => Math.max(5, prev - 1)); setTeaMessage(null); }}
                              className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none"
                            >
                              -1s
                            </button>
                            <input 
                              type="range" 
                              min="5" 
                              max="90" 
                              value={teaTime}
                              onChange={(e) => { setTeaTime(Number(e.target.value)); setTeaMessage(null); }}
                              className="flex-1 accent-red-500 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
                            />
                            <button
                              type="button"
                              disabled={teaTime >= 90}
                              onClick={() => { setTeaTime(prev => Math.min(90, prev + 1)); setTeaMessage(null); }}
                              className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none"
                            >
                              +1s
                            </button>
                            <button
                              type="button"
                              disabled={teaTime >= 90}
                              onClick={() => { setTeaTime(prev => Math.min(90, prev + 5)); setTeaMessage(null); }}
                              className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none"
                            >
                              +5s
                            </button>
                          </div>
                          {/* Quick Set Presets */}
                          <div className="flex gap-1">
                            {[10, 20, 30, 35, 40, 60].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => { setTeaTime(s); setTeaMessage(null); }}
                                className={`flex-1 py-1 rounded text-[9px] font-mono border transition-all ${
                                  teaTime === s
                                    ? 'bg-red-500/10 border-red-500/40 text-red-300 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                                    : 'bg-stone-900/60 border-stone-850/80 text-stone-400 hover:text-stone-300'
                                }`}
                              >
                                {s}s
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Two-option mindset layout selector */}



                        {/* Two-option mindset layout selector */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono text-stone-400 block">
                            心智姿态选择 (Mindset Pose Calibration)
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={redSolved}
                              onClick={() => {
                                if (!redSolved) {
                                  setTeaVulnerable(false);
                                  setTeaMessage(null);
                                }
                              }}
                              className={`py-2 px-2.5 rounded-xl border text-[10px] font-bold font-mono transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer ${
                                !teaVulnerable && !redSolved
                                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                                  : 'bg-stone-900/60 border-stone-850 text-stone-500 hover:text-stone-400 disabled:opacity-40'
                              }`}
                            >
                              <span>🛡️ 理智自卫</span>
                              <span className="text-[7.5px] font-normal opacity-75">坚守逻辑，客套防摩擦</span>
                            </button>
                            <button
                              type="button"
                              disabled={redSolved}
                              onClick={() => {
                                if (!redSolved) {
                                  setTeaVulnerable(true);
                                  setTeaMessage(null);
                                }
                              }}
                              className={`py-2 px-2.5 rounded-xl border text-[10px] font-bold font-mono transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer ${
                                teaVulnerable || redSolved
                                  ? 'bg-red-500/20 border-red-500/40 text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                                  : 'bg-stone-900/60 border-stone-850 text-stone-500 hover:text-stone-400 disabled:opacity-40'
                              }`}
                            >
                              <span>💔 卸盔解甲</span>
                              <span className="text-[7.5px] font-normal opacity-75">放下防线，痛快去痛</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action verification */}
                    {!redSolved ? (
                      <button
                        onClick={verifyTeaBrewer}
                        className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-stone-950 hover:from-red-400 hover:to-rose-500 font-extrabold py-2.5 rounded-xl text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-bounce"
                      >
                        <span>✓ 注入滚烫真心，焖泡此杯</span>
                      </button>
                    ) : (
                      <div className="bg-emerald-955/20 border-2 border-emerald-500/35 rounded-xl p-3.5 space-y-2 text-[11px] text-justify text-emerald-300 animate-[fadeIn_0.5s_ease_1]">
                        <span className="text-[10px] font-bold block uppercase font-mono text-emerald-400">🌟 情感线三大遗憾 ㆍ 全线重熔合流完成！</span>
                        <p className="italic text-stone-200">
                          “那一杯在冬雪中捧着的茉莉花茶，哪怕余温极苦、烫得我浑身战栗，但我第一次真正落落大方地拥抱了对方，而不是像条冷血虫子一般退回服务器。我爱过了，我痛过了。我认领我的热度，在碎裂中我得到了完整的人格共情。”
                        </p>
                        {teaEasterEgg && (
                          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl mt-2.5 mb-2.5 space-y-1.5 animate-pulse text-left">
                            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                              <span>🦊 🌸【灵狐小九 ㆍ 特别清芳彩蛋】</span>
                            </div>
                            <p className="text-[10px] text-amber-200/90 leading-relaxed italic">
                              “瞧！灵巧的小狐狸小九捧着一束带露的清新茉莉花，轻巧地跃过星光月台。她眨着亮晶晶的大眼睛，将一壶温沏、香气四溢的 85°C 极品茉莉花茶稳稳呈现。小九嘻嘻一笑：『千岑呀！恭喜你在 85°C 水温、30秒 极准刹那，彻彻底底卸下了理智自卫。这是全宇宙最可遇不可求的深层香气，愿你们携手前行，干杯！』”
                            </p>
                          </div>
                        )}
                        <p className="font-bold text-amber-400 border-t border-emerald-500/10 pt-1 text-[10px] uppercase font-mono">
                          🔑 获得终极情感印记碎片：【共情/EMPATHY】 ── 与他人血肉对流、不惧受伤痛快去爱去活的能力。
                        </p>
                      </div>
                    )}

                    {teaMessage && !redSolved && (
                      <div className="p-3 bg-red-950/20 border border-red-500/20 text-rose-300 rounded-xl text-[10.5px] italic text-justify font-mono">
                        ❌ {teaMessage}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* --- BLUE STAR: ACTION GAMEPLAY (Progressive) --- */}
            {selectedPlanet === 'blue' && (
              <div className="space-y-4">
                
                {/* BLUE INTRO STATEMENT */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed">
                  <span className="text-[8px] font-bold text-blue-400 block mb-1">【核心终置拷问】</span>
                  <p className="text-stone-300 font-semibold italic text-justify">“当我们在书房里彻底解构跟理解了这个世界，你将如何落手改造它？”</p>
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
                    <div className="text-[10px] text-justify space-y-1">
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">第一章 ㆍ 手势召唤</span>
                      <p className="text-stone-400 mt-1">
                        你获得了实车一端 5Hz 高频无过滤手势数据流。需要自己调整时间采样探测窗口 (ms) 和判定判定频点 (Hz) 及容灾多数票机制召唤汽车（激活线控防抱死底盘）。
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
                        ✓ 5Hz 采样比准成功对齐！线控底盘油门防抱死机制通过防灾锁！车辆手势召唤成功响应！已飞入第二章... 🚓
                      </div>
                    )}
                  </div>
                )}

                {/* CHAPTER 2 SCREEN: Knowledge Radar */}
                {blueChapter === 2 && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                    <div className="text-[10px] text-justify space-y-1">
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">第二章 ㆍ 知识雷达</span>
                      <p className="text-stone-400 mt-1">
                        实车调试遇到极其棘手的避障报错问题。请像硬核侦探一样，从下面的技术卡片中选取「物理根本根源」→「系统探测波畸变」→「Fail-safe降级后果」三个节点对立连接，查清大车报错漏洞。
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
                    <div className="text-[10px] text-justify space-y-1">
                      <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">第三章 ㆍ 联合开发对齐</span>
                      <p className="text-stone-400 mt-1 pb-1">
                        项目各方利益高度拉扯矛盾。产品要快，架构要绝对稳，测试要极致完整，用户要快和省。你必须运用工程智慧协调他们，并借助时辰五行气运偏加，使四方满意度同时达到合格红线 **(≥50%)** 才能通过！
                      </p>
                    </div>

                    {/* Chinese Shichen Alignment Compass */}
                    <div className="bg-stone-950/70 border border-stone-850 rounded-xl p-3.5 space-y-2.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/[0.03] rounded-full blur-xl pointer-events-none" />
                      <div className="flex justify-between items-center border-b border-stone-850/40 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm select-none">☯️</span>
                          <span className="text-[10px] font-bold text-amber-400 tracking-wider font-sans">
                            玄学时辰五行罗盘 ㆍ 时流乘气
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            const realKey = getRealShichen(new Date());
                            setSelectedShichenKey(realKey);
                          }}
                          className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 px-2 py-0.5 rounded text-[8px] text-stone-400 font-mono flex items-center gap-1 transition-all"
                        >
                          <span>⏳ 同步当前系统时辰</span>
                        </button>
                      </div>

                      {/* Info description Card depending on active element */}
                      {(() => {
                        const shichen = SHICHEN_DATA[selectedShichenKey] || SHICHEN_DATA["寅时"];
                        return (
                          <div className="space-y-1.5 text-[9.5px]">
                            <div className="flex justify-between items-center">
                              <span className="text-stone-300 font-bold font-mono">
                                当前时局：<span className="text-stone-100 font-extrabold">{shichen.name}</span> ({shichen.range})
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[8.5px] font-black font-mono uppercase ${shichen.elementBg} ${shichen.elementColor}`}>
                                {shichen.element}之气运
                              </span>
                            </div>
                            <p className="text-stone-400 leading-relaxed text-justify">
                              {shichen.desc}
                            </p>
                            
                            {/* Elemental modifier numbers */}
                            <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono text-[8px]">
                              <div className="bg-stone-900/60 p-1.5 rounded border border-stone-850/30">
                                <span className="text-stone-500 block">PM(产品)</span>
                                <span className={shichen.modifiers.pm >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                  {shichen.modifiers.pm >= 0 ? `+${shichen.modifiers.pm}` : shichen.modifiers.pm}%
                                </span>
                              </div>
                              <div className="bg-stone-900/60 p-1.5 rounded border border-stone-850/30">
                                <span className="text-stone-500 block">Arch(架构)</span>
                                <span className={shichen.modifiers.algo >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                  {shichen.modifiers.algo >= 0 ? `+${shichen.modifiers.algo}` : shichen.modifiers.algo}%
                                </span>
                              </div>
                              <div className="bg-stone-900/60 p-1.5 rounded border border-stone-850/30">
                                <span className="text-stone-500 block">QA(测试)</span>
                                <span className={shichen.modifiers.test >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                  {shichen.modifiers.test >= 0 ? `+${shichen.modifiers.test}` : shichen.modifiers.test}%
                                </span>
                              </div>
                              <div className="bg-stone-900/60 p-1.5 rounded border border-stone-850/30">
                                <span className="text-stone-500 block">User(用户)</span>
                                <span className={shichen.modifiers.customer >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                  {shichen.modifiers.customer >= 0 ? `+${shichen.modifiers.customer}` : shichen.modifiers.customer}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Shichen selector grid */}
                      <div className="space-y-1">
                        <span className="text-[7.5px] font-mono text-stone-500 tracking-wider uppercase font-bold block">金口命理 ㆍ 拨转时针罗盘：</span>
                        <div className="grid grid-cols-6 gap-1">
                          {Object.keys(SHICHEN_DATA).map((key) => {
                            const data = SHICHEN_DATA[key];
                            const isSelected = selectedShichenKey === key;
                            return (
                              <button
                                key={key}
                                onClick={() => setSelectedShichenKey(key)}
                                className={`py-1 text-[8px] font-bold rounded-lg border text-center transition-all cursor-pointer focus:outline-none ${
                                  isSelected 
                                    ? `${data.elementBg} border-stone-400 ${data.elementColor} shadow-[0_0_8px_rgba(245,158,11,0.15)] scale-[1.03]` 
                                    : 'bg-stone-900/40 border-stone-850/50 text-stone-500 hover:border-stone-800'
                                }`}
                              >
                                {data.name}
                                <span className="text-[6.5px] block font-normal opacity-75">({data.element})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

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
                            <span className="font-bold block">1. 缩短超声波判定范围并强制加班</span>
                            <span className="text-[8.5px] text-stone-400">PM+35 / 算法-10 / 测试-5 / 用户+10</span>
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
                            <span className="font-bold block">2. 预部署三套Soc重算与软件故障容灾</span>
                            <span className="text-[8.5px] text-stone-400">PM-10 / 算法+35 / 测试+15 / 用户-10</span>
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
                            <span className="font-bold block">3. 跨越合同边界，对合作团队无私带教教案</span>
                            <span className="text-[8.5px] text-stone-400">PM+10 / 算法+20 / 测试+20 / 用户+25</span>
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
                            <span className="font-bold block">4. 极寒冰面上疯狂测试暴跑1000公里</span>
                            <span className="text-[8.5px] text-stone-400">PM-10 / 算法+10 / 测试+35 / 用户-10</span>
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
                        提示：普通天盘可先后执行【教案带教】(3) 与【冗余容灾】(2) 稳固架构及测试底盘，然后结合【强制加班】(1) 协调过关。在木、水之运时，通过更容易！
                      </p>
                    </div>

                    {coordinatedMessage === 'success' && (
                      <div className="flex flex-col gap-2 relative z-30">
                        <div className="p-3 bg-emerald-950/25 border border-emerald-500/25 text-emerald-300 rounded-xl text-[11px] text-center animate-pulse font-bold font-mono">
                          ✓ 完美时天共振！所有人的心都被摆渡过去，满意率安全越过50%中水位！
                        </div>
                        <button
                          onClick={() => {
                            setBlueChapter(4);
                            setCoordinatedMessage(null);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-350 text-stone-950 font-extrabold rounded-xl text-[10.5px] shadow-[0_0_12px_rgba(52,211,153,0.35)] hover:scale-[1.01] active:scale-98 transition-all"
                        >
                          ⚡ 立即点击：进入第四章 ㆍ 传火带教师门
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
                        <span className="font-extrabold text-[10px] text-stone-200 block">偏方 Alpha: 精巧契约隔离</span>
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
                        <span className="font-extrabold text-[10px] text-stone-200 block">良方 Beta: 点燃篝火同舟共生</span>
                        <p className="text-stone-500 mt-1">“没有谁生来就是假人机器。我们在泥藻里冷冰冰的，那我们师徒今天就熬夜把雷达毫米级的调试教案一笔一析全部文档化传给你！我陪你把这坐底代码给它跑过去！”</p>
                      </button>

                    </div>

                    {mentorshipAnswer && (
                      <div className="bg-stone-950 p-3.5 border border-stone-850 rounded-xl italic text-[10.5px] leading-relaxed text-justify">
                        <b>小九演算评价：</b>
                        {mentorshipAnswer === 'A' ? (
                          <span className="text-rose-400 block mt-1">
                            “防线极度坚硬，虽然符合死人眼里的完好契约规范，可你怀里空荡荡。新人在无声的孤绝里失落关机离班，你又退缩回了那个骄傲的第三人称城堡，冷眼漠视他的流离，傲骨开始锈蚀……”
                          </span>
                        ) : (
                          <span className="text-amber-300 block mt-1">
                            “太烫了！你彻底用血肉融穿了零和博弈的那架冷金属天平。通过把个人宝贵的隐性经验显性传化、毫无偏倚地渡人过河，那个对你挑挑拣拣的新人瞬间落成了你首批最保驾护航的盟友战友！恭喜你打通蓝星明线！”
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* BLUE PLANET GAME SUCESS PAYOFF */}
                {blueChapter === 5 && (
                  <div className="bg-emerald-950/20 border-2 border-emerald-500/30 rounded-xl p-3.5 space-y-2 text-[11px] text-justify text-emerald-300 animate-[fadeIn_0.5s_ease_1]">
                    <span className="text-[10px] font-bold block uppercase font-mono">🌟 实践的英雄旅程终点：</span>
                    <p className="italic">
                      从哲学修辞的高台，深坠进底盘故障防灾隔离、淘宝市井算账和手把手真挚渡人、带教新人的塞博长征。你没有学到如何圆滑，但彻底砸掉了纸片教条，在尘土实打实的泥水里，见识到了实践矛盾奇妙的转易温能！
                    </p>
                    <p className="font-bold text-amber-400 border-t border-emerald-500/10 pt-1 text-[10px] uppercase font-mono">
                      🔑 获得人格碎片：【创造/CREATION】 ㆍ 不纸上谈兵，用泥涂调试的力量深深改变现实。
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* --- GOLD STAR: WISDOM GAMEPLAY --- */}
            {selectedPlanet === 'gold' && (
              <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed">
                  <span className="text-[8px] font-bold text-amber-400 block mb-1">【核心终置拷问】</span>
                  <p className="text-stone-300 font-semibold italic text-justify">“在经历了被时代系统疯狂压扁、祛魅、喧哗的起伏之后，你该如何理解世界？”</p>
                  <p className="text-stone-500 mt-1 leading-snug">
                    不要单纯说教。让千岑的思想演化重现。请在下方对应年龄的心智孔位中，对齐匹配他曾经留下的那几片厚重的哲学理念拼图：
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {[
                    { id: 'age18', label: '18岁 ㆍ 走出高中的象牙塔', correct: 'meritocracy', hint: '对绝对高分标准答案的极度追崇' },
                    { id: 'age22', label: '22岁 ㆍ 大学的迷茫与灵魂孤冷', correct: 'nihilism', hint: '挣脱不掉的体制钢印，认为一切在冷空虚无中' },
                    { id: 'age24', label: '24岁 ㆍ 实车泊车降温与挫折搏杀', correct: 'practice', hint: '实践论突击：踩着烂泥矛盾才会磨砺优雅容灾' },
                    { id: 'age26', label: '26岁 ㆍ 书生漫步关系涉危险破防', correct: 'concretelove', hint: '卡拉马佐夫的具体爱，即便风雪漫天也拥抱血肉情根' }
                  ].map((stage) => {
                    const currentTileId = goldStageSolutions[stage.id];
                    return (
                      <div 
                        key={stage.id}
                        className="bg-stone-950/90 border border-stone-850/60 p-3 rounded-xl flex gap-3.5 items-center justify-between"
                      >
                        <div className="flex-1">
                          <span className="text-[8.5px] uppercase font-mono tracking-widest text-amber-500 font-bold leading-none block mb-1">{stage.label}</span>
                          <span className="text-[10px] text-stone-500 italic block">{stage.hint}</span>
                          {currentTileId && (
                            <span className="text-[11px] text-amber-300 mt-1 font-bold inline-block border-l-2 border-amber-500 pl-2 leading-none">
                              对齐为 ➔ {
                                currentTileId === 'meritocracy' && '🔑 『绩优主义与成功学高塔』' ||
                                currentTileId === 'nihilism' && '🔑 『清高抽离与学术冷虚无』' ||
                                currentTileId === 'practice' && '🔑 『实践突围与优雅降级容灾论』' ||
                                currentTileId === 'concretelove' && '🔑 『真实血肉与大陀具体之爱』'
                              }
                            </span>
                          )}
                        </div>

                        {/* Interactive drop selections */}
                        <select 
                          className="bg-stone-900 border border-stone-800 text-[10px] p-1.5 rounded text-stone-300 font-mono outline-none max-w-[120px] focus:border-amber-500 cursor-pointer"
                          value={currentTileId || ''} 
                          onChange={(e) => setGoldSolution(stage.id, e.target.value)}
                        >
                          <option value="">-- 选择拼贴 --</option>
                          <option value="meritocracy">绩优主义高塔</option>
                          <option value="nihilism">学术清冷虚无</option>
                          <option value="practice">实践与防灾突围</option>
                          <option value="concretelove">具体爱与赤红情根</option>
                        </select>
                      </div>
                    );
                  })}
                </div>

                {/* Validation button */}
                {!goldSolved ? (
                  <button
                    onClick={verifyGoldStar}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 font-extrabold py-2.5 rounded-xl text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <span>✓ 编译并校验观念演化树</span>
                  </button>
                ) : (
                  <div className="bg-emerald-950/20 border-2 border-emerald-500/30 rounded-xl p-3.5 space-y-2 text-[11px] text-justify text-emerald-300 animate-[fadeIn_0.5s_ease_1]">
                    <span className="text-[10px] font-bold block uppercase font-mono">🌟 观念思索树对准成功：</span>
                    <p className="italic">
                      “十八岁，我执着对答标准卷子的自傲；廿二岁，我冷眼审判诸般功利却一无所获的虚寂；廿四岁，我在泥潭里明白，不落泥涂终难跨江，我用实践磨砺我的心灵容灾；廿六岁，我终于敢走上前去，去爱具体的、微小的生命，爱到满腔愧悔但也满盘无悔。”
                    </p>
                    <p className="font-bold text-amber-400 border-t border-emerald-500/10 pt-1 text-[10px] uppercase font-mono">
                      🔑 获得人格碎片：【洞察/INSIGHT】 ㆍ 穿透纷冗迷雾，洞悉人性幽廊与规律原型的锐眼。
                    </p>
                  </div>
                )}

                {goldMessage && goldMessage !== 'success' && (
                  <div className="p-3 bg-red-950/20 border border-red-500/20 text-rose-300 rounded-xl text-[10px] leading-snug text-justify">
                    {goldMessage}
                  </div>
                )}
              </div>
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
                              此时此刻，他觉得那冰冷的代码和繁大的城市，原来并不是冷酷吃人的机械巨墙。
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
