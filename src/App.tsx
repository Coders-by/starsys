import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Globe, 
  Zap, 
  Briefcase, 
  Trophy, 
  MessageSquare, 
  Compass, 
  History, 
  Sparkles, 
  Heart, 
  Check, 
  Send, 
  X, 
  Calendar,
  Award,
  BookOpen,
  ChevronRight,
  Eye,
  Sliders,
  RotateCcw,
  Scissors,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import {
  USER_BASE,
  DOSSIER,
  GEAR,
  TENSIONS,
  ACHIEVEMENTS,
  ATTRIBUTES_CONFIG,
  CROSSROADS,
  CHAT_KB,
  CHAT_FALLBACK
} from './data';
import { 
  UserAttributes, 
  Gear as GearType, 
  Achievement, 
  Crossroad, 
  ChatMessage, 
  GuestComment 
} from './types';
import { QIAN_CE_REGRETS, QIAN_CE_BONSAI_DIALOGS } from './narrativeData';

export default function App() {
  // --- Core Onboarding & Narrative Acts ---
  const [inQuiz, setInQuiz] = useState(true);
  const [quizSelection, setQuizSelection] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0); // 0: Dual Acts (Intro + Games), 1: Time Journey, 2: Chat & Tea Room

  // --- Resonance Metrics (Gamification & Payoff points of interest) ---
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('qiancen_completed_actions_v3') || '{}');
    } catch {
      return {};
    }
  });

  // Calculate resonance based on completed gamified actions
  const getResonanceRate = () => {
    let rate = 0;
    if (completedActions['quiz']) rate += 10;
    if (completedActions['failsafe_run']) rate += 15;
    if (completedActions['regret_latiao']) rate += 15;
    if (completedActions['regret_meteor']) rate += 15;
    if (completedActions['regret_python']) rate += 15;
    if (completedActions['bonsai_prune']) rate += 15;
    if (completedActions['leave_comment']) rate += 15;
    return Math.min(rate, 100);
  };

  const resonanceRate = getResonanceRate();

  const markActionComplete = (actionId: string) => {
    const updated = { ...completedActions, [actionId]: true };
    setCompletedActions(updated);
    localStorage.setItem('qiancen_completed_actions_v3', JSON.stringify(updated));
  };

  // --- Game 1 Dynamic State: APA Fail-safe Calibration System ---
  const [calibrationEvent, setCalibrationEvent] = useState<string>('chassis');
  const [armorValue, setArmorValue] = useState<number>(55); // Armor slider from 0 to 100
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibrationReport, setCalibrationReport] = useState<any | null>(null);

  // --- Game 2 Dynamic State: Shards of Regret Restoration ---
  const [selectedRegretSpecimen, setSelectedRegretSpecimen] = useState<string | null>(null);
  const [regretRepairChoice, setRegretRepairChoice] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('qiancen_regret_repairs_v3') || '{}');
    } catch {
      return {};
    }
  });

  // --- Game 3 Dynamic State: Mirror Mind Bonsai Pruning ---
  const [prunedBranches, setPrunedBranches] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('qiancen_pruned_branches_v3') || '{}');
    } catch {
      return {};
    }
  });
  const [activeBonsaiDialogueIdx, setActiveBonsaiDialogueIdx] = useState<number | null>(null);

  // --- Shared states ---
  const [selectedDomainNode, setSelectedDomainNode] = useState<string>('center');
  const [showDossierDetails, setShowDossierDetails] = useState(false);
  const [equippedGearPopup, setEquippedGearPopup] = useState<GearType | null>(null);
  const [openedAchievement, setOpenedAchievement] = useState<Achievement | null>(null);

  // --- Back-door cheat to max resonance quickly for fast testing ---
  const maxOutResonance = () => {
    const updated = {
      quiz: true,
      failsafe_run: true,
      regret_latiao: true,
      regret_meteor: true,
      regret_python: true,
      bonsai_prune: true,
      leave_comment: true
    };
    setCompletedActions(updated);
    localStorage.setItem('qiancen_completed_actions_v3', JSON.stringify(updated));
  };

  // Reset progress
  const resetResonance = () => {
    setCompletedActions({});
    setRegretRepairChoice({});
    setPrunedBranches({});
    localStorage.removeItem('qiancen_completed_actions_v3');
    localStorage.removeItem('qiancen_regret_repairs_v3');
    localStorage.removeItem('qiancen_pruned_branches_v3');
  };

  // --- Tea Room Chatbot States ---
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: '茶已经沏好了，隔年老白茶，温润甘甜。🍵 欢迎来到千岑的茶室。\n我能与你聊聊他的主线职业（泊车底盘安全防护）、深夜阅读《实践论》与老陀名著的感悟，以及在亲密关系上拆除自卫面具、笨拙走向第一视角的觉醒。' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // --- Tea Room Guest Post States ---
  const [guestName, setGuestName] = useState('');
  const [guestMsg, setGuestMsg] = useState('');
  const [guestSelectedColor, setGuestSelectedColor] = useState('#fbbf24'); //amber as default
  const [guestComments, setGuestComments] = useState<GuestComment[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('guestMessages_v3') || '[]');
    } catch {
      return [
        { color: '#34d399', text: '踏访了千岑的心智折叠，在深夜读到你造竹筏的段落，备受鼓舞。 - 同行小路', time: '1小时前' },
        { color: '#fbbf24', text: '在冰冷智能车规的底线下护好自己的安全，極高标准的工程人格，敬佩！ - 重庆阿洋', time: '昨天 02:40' },
        { color: '#f472b6', text: '时光断代的流星雨写得太戳心了，那个被叉掉的对话框，就是少年时的我们啊。 - 读者悠悠', time: '今天 12:10' }
      ];
    }
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem('guestMessages_v3', JSON.stringify(guestComments));
  }, [guestComments]);

  // Handle RAG Chatbot response fallback
  const handleSendChat = async (pretrainedText?: string) => {
    const query = (pretrainedText || chatInput).trim();
    if (!query) return;

    const updatedMessages = [...chatMessages, { sender: 'user' as const, text: query }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        throw new Error('Local simulation fallback');
      }
    } catch {
      // Use CHAT_KB regex search from data.ts
      setTimeout(() => {
        const match = CHAT_KB.find(({ match: re }) => re.test(query));
        const reply = match ? match.answer : CHAT_FALLBACK[Math.floor(Math.random() * CHAT_FALLBACK.length)];
        setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      }, 600 + Math.random() * 400);
    } finally {
      setIsTyping(false);
    }
  };

  // Submit Guest Comment
  const handlePostComment = () => {
    if (!guestMsg.trim()) return;
    const author = guestName.trim() || '过客';
    const newComment: GuestComment = {
      color: guestSelectedColor,
      text: `${guestMsg.trim()} - ${author}`,
      time: '刚刚'
    };
    const updated = [newComment, ...guestComments];
    setGuestComments(updated);
    setGuestName('');
    setGuestMsg('');
    markActionComplete('leave_comment');
  };

  // Safe tab switcher
  const handleQuizEnter = () => {
    setInQuiz(false);
    markActionComplete('quiz');
  };

  // --- Dynamic Shichen Calculator ---
  const getShichenInfo = () => {
    const hour = new Date().getHours();
    let name = '';
    let color = '';
    let element = '';
    let text = '';
    
    if (hour >= 23 || hour < 1) {
      name = '子时';
      color = 'text-blue-400';
      element = '坎水至盛';
      text = '天地交泰，世界沉睡，意识最为清醒。宜收缩感知，在静谧中让白天超负荷的脑神经静息。';
    } else if (hour >= 1 && hour < 3) {
      name = '丑时';
      color = 'text-amber-600';
      element = '湿土酝酿';
      text = '黎明前的最深静穆。大地湿土力量在暗自蓄存，把心智的刀具重新敷油研磨，静候天光拂晓。';
    } else if (hour >= 3 && hour < 5) {
      name = '寅时';
      color = 'text-emerald-500';
      element = '少阳初萌';
      text = '天地微明，少阳木气在悄悄破壳，放空自己莫生杂念。';
    } else if (hour >= 5 && hour < 7) {
      name = '卯时';
      color = 'text-emerald-400';
      element = '晨光破晓';
      text = '旭日出海。清晨是一天执行力与洞察意志的黄金峰值。适合解决主线逻辑重关。';
    } else if (hour >= 7 && hour < 9) {
      name = '辰时';
      color = 'text-yellow-600';
      element = '温土生化';
      text = '艳阳攀登，万家热气。脾胃运化极好，用最切实的物理温食，拉满一整天高强度的底压。';
    } else if (hour >= 9 && hour < 11) {
      name = '巳时';
      color = 'text-rose-500';
      element = '巽风催火';
      text = '思绪奔流，运算极旺。把冗余杂音置之度外，全身心投入主线攻坚。';
    } else if (hour >= 11 && hour < 13) {
      name = '午时';
      color = 'text-red-500';
      element = '极阳生阴';
      text = '阳极生阴，心神容易过载。温茶半腕，闭目小憩，这就是肉体架构中最精妙的降级保护。';
    } else if (hour >= 13 && hour < 15) {
      name = '未时';
      color = 'text-amber-500';
      element = '燥土承载';
      text = '下午的深水攻坚战已然吹号。像刚毅耐磨的机器刀具一样，沉稳、低噪地向前一格格推进。';
    } else if (hour >= 15 && hour < 17) {
      name = '申时';
      color = 'text-amber-300';
      element = '申金肃敛';
      text = '天地磁场开始收敛。适合在脑海深处把今日的体系信息做一次编排。';
    } else if (hour >= 17 && hour < 19) {
      name = '酉时';
      color = 'text-orange-400';
      element = '晚霞归航';
      text = '残阳铺金。卸下日间业务逻辑，将感官切回第一人称：听风过耳廓，静观残霞。';
    } else if (hour >= 19 && hour < 21) {
      name = '戌时';
      color = 'text-yellow-700';
      element = '暮夜燥土';
      text = '夜幕合，烟火盛。在街角与挚友大碗吹风、讨论马克思、陀氏，在赛博世界里留下回响。';
    } else if (hour >= 21 && hour < 23) {
      name = '亥时';
      color = 'text-sky-500';
      element = '双鱼入海';
      text = '人定百虑休。最适宜温茶一壶，点亮昏黄台灯，漫游经典，温润自身。';
    }
    return { name, color, element, text };
  };

  const shichen = getShichenInfo();

  // --- Run Game 1: APA Fail-Safe Calibration Simulator ---
  const runFailSafeCalibration = () => {
    setIsCalibrating(true);
    setCalibrationReport(null);
    setTimeout(() => {
      let title = '';
      let log = '';
      let failSafeState = '';
      let vulnerabilityScore = 100 - armorValue;
      let safeFactor = armorValue;

      if (calibrationEvent === 'chassis') {
        title = '【智驾状态机：项目解体与底盘死线】';
        if (armorValue >= 75) {
          failSafeState = '硬核自保隔离 (State: SHIELD_ACTIVE)';
          log = '报警信号发出，状态机触发极限退坡隔离程序！你成功退缩到安全的第三人称完美象牙塔中，不发表公开情绪，按期提交标准算法交付。没有任何契约能折磨到你，但也失去了一同与生死之交扛枪过河、碰撞俗世商流的酣畅热度。守护了PPT，却折弯了傲骨。';
        } else if (armorValue >= 35) {
          failSafeState = '完美自存竹筏 (State: RAFT_OPTIMAL)';
          log = '高密度状态融合！既守住了底盘毫米级别的实车安全交付，戳破狂奔概念吹水的泡沫；同时脱下书生骄气，与合作伙伴在深夜街角吃着烤串吐烟，用真挚的教案文档毫无偏见地渡人过河，建立了非合同的生死同盟。这是硬核容灾的最美降落。';
        } else {
          failSafeState = '无损裸奔肉搏 (State: FULL_EXPOSURE_RISK)';
          log = '状态机由于防御等级太低宣告断路！你任由外部无脑的质疑和管理混乱直接刮擦你的胸口，虽然痛苦委屈伴随失眠，但你踩着泥滩，用肉身趟开故障，最真切地摸到大机器流俗生计的冰冷重力。身穿重伤，但收获百折不挠的野性心脏。';
        }
      } else if (calibrationEvent === 'relationship') {
        title = '【关系折变：亲密极值与自防线冲突】';
        if (armorValue >= 75) {
          failSafeState = '理性隔绝茧式闭锁 (State: AVOIDANT_GLACIER)';
          log = '警报！对方索要深度心灵对等承接，你极速启动心理容灾备份！将自我心跳翻译为“学习公式与客观计算”，以抽离、客体化的第三视角审视。对方哭诉你是一块木头。你毫发未伤、体温稳定降入冰度，却眼看流星般的相遇无声滑入荒芜的标本盒。';
        } else if (armorValue >= 35) {
          failSafeState = '镜像回声对流状态 (State: MIRROR_ECHO_SYNC)';
          log = '虽然心脏受突发变轨信号狂震，你却在桌角摆上一卷老陀反思，卸下一半冷度面罩。用克制但有体温的言辞重译自己恐惧，去和不完美的纠缠打一个太极，给彼此提供心理优雅着陆垫，完成了一次高阶的情感心智容灾。';
        } else {
          failSafeState = '拔掉所有的面具刺痛前行 (State: RAW_HEART_COLLISION)';
          log = '彻底拔掉一生高悬自保的第三人称天眼！把冷血防备打得稀碎。切入毫无防卫、任由撕裂也大无畏走上前去爱的第一视角。极速碰撞中虽负伤，但真痛、真爱、真切的心跳在你胸口留下了神圣、绝不至于干缩成干枯标本的『情根』。';
        }
      } else {
        title = '【市井商流：工业零退款日常拉扯】';
        if (armorValue >= 75) {
          failSafeState = '绝对协议隔离 (State: CONTRACT_PRISTINE)';
          log = '在淘宝店里，你选择用极标准敷衍的信息机器人回复，拉黑了纠缠几毛钱的低净值买家。你的心情没有产生任何波澜，完全高耸于市井琐细上。但你发现，你与老百姓的真实谋生热度、微薄利润背后的劳动，被玻璃墙严密隔离。你又变回了象牙塔里的理论书生。';
        } else if (armorValue >= 35) {
          failSafeState = '真实需求换轨共感 (State: GRAVITY_INTEGRATION)';
          log = '对齐成功！放下你学术做题家的傲慢清高，花一整个下午和求学窘困的少年算几块钱的运费优惠，在恶语粗鲁的客户里找出他们生活的苦。一单零配件仅挣几毛钱的琐碎，却将你从云端往下拉，彻底磨掉了虚弱的书生傲气，见到了真实的诸相。';
        } else {
          failSafeState = '感官高维过载 (State: EMOTIONAL_OVERFLOW)';
          log = '对撕到底！因为客户几块钱的拉扯情绪，你高频与各色市井在键盘上血红着眼博弈，导致你的精神上下文频繁失效。不仅耗蚀了睡眠，也感到了极度的市井粗狂。你叹息，真实尘世的矛盾真是永远荒谬、无解且泥泞！';
        }
      }

      setCalibrationReport({
        title,
        failSafeState,
        log,
        vulnerabilityScore,
        safeFactor
      });
      setIsCalibrating(false);
      markActionComplete('failsafe_run');
    }, 1000);
  };

  // --- Run Game 2: Repair Regret Specimen choice ---
  const selectRegretRepairChoice = (specimenId: string, choiceId: string) => {
    const updated = { ...regretRepairChoice, [specimenId]: choiceId };
    setRegretRepairChoice(updated);
    localStorage.setItem('qiancen_regret_repairs_v3', JSON.stringify(updated));

    // If latiao, meteor, python are complete, make sure to unlock rate
    if (specimenId === 'latiao') markActionComplete('regret_latiao');
    if (specimenId === 'meteor_qq') markActionComplete('regret_meteor');
    if (specimenId === 'college_python') markActionComplete('regret_python');
  };

  // --- Run Game 3: Prune branches ---
  const handlePruneBranch = (branchId: string) => {
    const updated = { ...prunedBranches, [branchId]: true };
    setPrunedBranches(updated);
    localStorage.setItem('qiancen_pruned_branches_v3', JSON.stringify(updated));

    if (branchId === 'elitism') setActiveBonsaiDialogueIdx(0);
    if (branchId === 'avoidant') setActiveBonsaiDialogueIdx(2);
    if (branchId === 'answers') setActiveBonsaiDialogueIdx(4);

    // If all three pruned:
    if (updated['elitism'] && updated['avoidant'] && updated['answers']) {
      markActionComplete('bonsai_prune');
    }
  };

  // Check if bonsai completely pruned
  const isBonsaiFullyPruned = prunedBranches['elitism'] && prunedBranches['avoidant'] && prunedBranches['answers'];

  // Return corresponding gears of specified domain
  const getGearsForDomain = (domainId: string): GearType[] => {
    if (domainId === 'tech') return [GEAR[0], GEAR[6]];                // 编译机, 刀具教材
    if (domainId === 'startup') return [GEAR[2], GEAR[3]];             // 降噪耳机, 键盘
    if (domainId === 'philosophy') return [GEAR[1], GEAR[5]];          // 白茶茶具, 移动书阁
    if (domainId === 'relationship') return [GEAR[4]];                 // 蒲团角落
    return [];
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 flex flex-col font-sans relative antialiased selection:bg-amber-500/30 selection:text-amber-100">
      
      {/* --- ACT OVERRIDE PROLOGUE (ONBOARDING) --- */}
      <AnimatePresence>
        {inQuiz && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-stone-950 z-[100] flex flex-col items-center justify-center p-6 text-center overflow-y-auto"
          >
            <div className="max-w-md w-full my-auto space-y-6">
              
              {/* Fox animation block */}
              <div className="relative inline-block">
                <span className="text-7xl block filter drop-shadow-[0_0_25px_rgba(251,191,36,0.25)] animate-pulse">🦊</span>
                <span className="absolute -bottom-1 -right-1 text-2xl">🍵</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-wider text-stone-100">千岑心智折叠：双轨漫游状态机</h1>
                <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                  “你好，探索者。我是心灵灵狐「小九」。这是一款集**智驾防护**、**往昔憾缺修复**与**心智修剪**于一体的叙事漫游游戏。通过游戏与抉择，你将穿透千岑的明线与暗线，与那个在尘世深水努力自造竹筏的灵魂产生共鸣。”
                </p>
              </div>

              {!quizSelection ? (
                <div className="space-y-4 pt-2">
                  <p className="text-[11px] uppercase tracking-widest text-amber-500 font-bold border-b border-stone-850/60 pb-1">
                    请校准并载入你此行降临的初始观测频率
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => setQuizSelection('tech')}
                      className="text-left bg-stone-900 border border-stone-850 hover:border-amber-500/40 p-3.5 rounded-xl transition-all group flex gap-3 items-center"
                    >
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">🛠️</span>
                      <div>
                        <div className="text-xs font-bold text-stone-200 group-hover:text-amber-400">「钢铁防护 · 明线」 · 优雅故障隔离</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">探析自动泊车、失控容灾、将工程级fail-safe防线沿用至生命安全。</div>
                      </div>
                    </button>

                    <button 
                      onClick={() => setQuizSelection('philosophy')}
                      className="text-left bg-stone-900 border border-stone-850 hover:border-amber-500/40 p-3.5 rounded-xl transition-all group flex gap-3 items-center"
                    >
                      <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center text-sm">📚</span>
                      <div>
                        <div className="text-xs font-bold text-stone-200 group-hover:text-amber-400">「见相非相 · 暗线」 · 挣脱空心自保</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">揭开尘世冰封的旧日标本，探寻陀氏苦修、挣脱回避型防御的血肉心跳。</div>
                      </div>
                    </button>

                    <button 
                      onClick={() => setQuizSelection('heart')}
                      className="text-left bg-stone-900 border border-stone-850 hover:border-amber-500/40 p-3.5 rounded-xl transition-all group flex gap-3 items-center"
                    >
                      <span className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 font-bold flex items-center justify-center text-sm">🩹</span>
                      <div>
                        <div className="text-xs font-bold text-stone-200 group-hover:text-amber-400">「破甲涉险 · 交汇点」 · 渡河竹筏筑网</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">如何在这狂奔颠沛大厂代纪中，用真诚文字与智驾AI，扎起自愈他的竹筏。</div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-stone-900 border border-stone-850 p-4 rounded-2xl text-left space-y-4 max-w-sm mx-auto shadow-xl"
                >
                  <div className="flex justify-between items-center border-b border-stone-850 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">灵狐小九的心流调试</span>
                    <button 
                      onClick={() => setQuizSelection(null)}
                      className="text-[9px] text-stone-500 hover:text-stone-300"
                    >
                      重新选择频率
                    </button>
                  </div>
                  
                  <p className="text-xs text-stone-300 leading-relaxed italic bg-stone-950 p-3.5 rounded-xl border border-stone-850/50">
                    {quizSelection === 'tech' && '“技术极重！车规故障自保（fail-safe）代码是他的白天。你会惊奇地在后续的游戏中发现：他的生活、情感程序，竟然也部署了这样一套优雅退坡降级机制……”'}
                    {quizSelection === 'philosophy' && '“暗里的灵魂太烫了！他曾因自尊自保在年少和成年的每一个心动处，冷酷掐灭对话框。在接下来的「悔缺标本解冻游戏」中，你将担任时空信差，帮他融化那些冰河标本。”'}
                    {quizSelection === 'heart' && '“在大厂巨兽呼啸、AI侵吞一切的代纪，与其坐在看客席里虚虚空空，不如去他的茶室，剪除他心灵上被社会贴附的假人钢印，为他织造一叶真正能载他渡过俗世大江的生存竹筏。”'}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleQuizEnter}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>开启心智折叠状态机</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <p className="text-[10px] text-stone-600 mt-auto pt-6">© 千岑的赛博客栈 • 视觉小说与双轨容灾交互系统</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN INTERFACE STRUCTURE --- */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col bg-stone-950 shadow-2xl border-x border-stone-900/50 relative overflow-hidden">
        
        {/* TOP STATUS BAR: DYNAMIC TIME + SYNC RESONANCE METER */}
        <div className="bg-stone-900/95 border-b border-stone-850/60 px-4 py-3 shrink-0 flex flex-col gap-2.5 z-10 shadow-lg">
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🧭</span>
              <div>
                <span className="text-[8px] text-stone-500 uppercase tracking-widest block font-bold leading-none"> 心智共鸣同步仪</span>
                <span className="text-[11px] font-bold text-stone-100 mt-0.5">千岑心镜折叠 v18.9</span>
              </div>
            </div>

            {/* Shichen Display */}
            <div className="bg-stone-950 border border-stone-850 px-2.5 py-0.5 rounded-lg text-right max-w-[150px] shrink-0">
              <span className="text-[8px] flex items-center gap-1 text-stone-400 font-bold leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span><b className={`${shichen.color}`}>{shichen.name} • {shichen.element}</b></span>
              </span>
            </div>
          </div>

          {/* SYNC RESONANCE PROGRESS ROW */}
          <div className="bg-stone-950/80 rounded-xl p-2 border border-stone-850/60 space-y-1.5">
            <div className="flex justify-between items-center text-[9px] font-semibold">
              <span className="text-stone-400 flex items-center gap-1">
                <span>⭐</span> 心灵共鸣率:
                <b className="text-amber-400 font-mono">{resonanceRate}%</b>
              </span>
              <span className="text-stone-500 text-[8.5px]">
                {resonanceRate === 0 && '（隔岸观火，未落水）'}
                {resonanceRate > 0 && resonanceRate < 35 && '（初窥门径，听雾里笛）'}
                {resonanceRate >= 35 && resonanceRate < 75 && '（深流涉险，破冷甲防）'}
                {resonanceRate >= 75 && resonanceRate < 100 && '（心灵咬合，浪聚营火）'}
                {resonanceRate === 100 && '🔥 最终救赎！已达成心灵和解！'}
              </span>
            </div>

            {/* Simulated Live LED Bar */}
            <div className="relative h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-850">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${resonanceRate}%` }}
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-500"
              />
            </div>

            {/* Hidden admin debug or clear options dynamically shown */}
            <div className="flex justify-between items-center text-[8px] font-mono text-stone-600">
              <button onClick={resetResonance} className="hover:text-amber-500">重置心智进度</button>
              <button onClick={maxOutResonance} className="hover:text-emerald-400">一键通关(调试用)</button>
            </div>
          </div>
        </div>

        {/* --- SCROLLABLE CONTAINER FOR THE SELECTED TAB --- */}
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
          
          {/* TAB 0: THE DUAL-TRACK NARRATIVE EXPLORATION */}
          {currentTab === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              
              {/* STAGE DESCRIPTION */}
              <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-850 rounded-2xl p-4 space-y-1 text-center relative py-5 overflow-hidden">
                <span className="text-[9.5px] font-bold text-amber-500 uppercase tracking-widest block leading-none mb-1">
                  Introduction of Dual-Life Machine
                </span>
                <h2 className="text-sm font-bold text-stone-100">“不退到完美的城堡里，我赤脚在水泥地上活过。”</h2>
                <p className="text-[11px] text-stone-400 leading-relaxed text-justify mt-2.5">
                  千岑是一个矛盾拼凑的人。白日，他在硬核车辆状态机里写下**“异常优雅降级 (fail-safe)”**确保钢铁不脱退防护；深夜，他却痛苦地发觉这套“自保程序”被他生搬进命运与爱里，高高悬挂于“第三人称”玻璃屋做冷酷看客，导致灵魂空置。
                </p>
                <p className="text-[11px] text-stone-300 leading-relaxed text-justify font-medium mt-1">
                  下面是他生命中最核心的**三个心智互动模块**。请你亲自动手调试他的防灾系数、解冻他的往昔悔恨、削剪他头顶的外来钢印，看清那条由他亲手扎进复杂现实的自愈竹筏。
                </p>
              </div>

              {/* GAME ACT I SLOT: Calibrating the Fail-safe (明线: 优雅降级) */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-4 shadow-md">
                
                <div className="border-b border-stone-850/60 pb-3 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 text-lg">⚙️</span>
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-emerald-400 block tracking-widest font-mono">Act I (明线游戏)</span>
                      <h3 className="text-xs font-bold text-stone-200">故障优雅降级仿真仪</h3>
                    </div>
                  </div>
                  <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 font-bold">
                    校准防御等级
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 leading-normal">
                  命运的引擎异常发生时，你会如何折算心智？在下面任选一个危机，滑动你生命外壳的“第三视角防护罩强度”，查看状态机的退坡运行蓝图。
                </p>

                {/* Event picker */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    onClick={() => { setCalibrationEvent('chassis'); setCalibrationReport(null); }}
                    className={`py-1.5 px-1 rounded-xl border text-center transition-all ${
                      calibrationEvent === 'chassis' ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    🚗 泊车项目退兵
                  </button>
                  <button
                    onClick={() => { setCalibrationEvent('relationship'); setCalibrationReport(null); }}
                    className={`py-1.5 px-1 rounded-xl border text-center transition-all ${
                      calibrationEvent === 'relationship' ? 'bg-pink-500/10 border-pink-500 text-pink-300 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    🩹 关系脆弱试炼
                  </button>
                  <button
                    onClick={() => { setCalibrationEvent('bazaar'); setCalibrationReport(null); }}
                    className={`py-1.5 px-1 rounded-xl border text-center transition-all ${
                      calibrationEvent === 'bazaar' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold' : 'bg-stone-950 border-stone-850 text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    🛍️ 市井零配买卖
                  </button>
                </div>

                {/* Slider bar */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="text-stone-400 font-bold">防御性自保 Armor ({armorValue}%)</span>
                    <span className="text-amber-500 font-bold">脆弱涉险 Experience ({100 - armorValue}%)</span>
                  </div>
                  
                  <input 
                    type="range" 
                    min="10" 
                    max="90" 
                    value={armorValue}
                    onChange={(e) => { setArmorValue(Number(e.target.value)); setCalibrationReport(null); }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />

                  <div className="flex justify-between text-[8px] text-stone-500 px-1">
                    <span>纯粹涉险 (不设防)</span>
                    <span>理想融合 (降级点)</span>
                    <span>冷酷自卫 (拒人千里)</span>
                  </div>
                </div>

                {/* Execution button */}
                <button
                  onClick={runFailSafeCalibration}
                  disabled={isCalibrating}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 disabled:opacity-50 text-stone-950 hover:from-emerald-400 hover:to-emerald-500 py-2 rounded-xl text-xs font-extrabold active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 outline-none"
                >
                  <Sliders className="w-3.5 h-3.5 shrink-0" />
                  <span>{isCalibrating ? '人机心智容灾状态求解中...' : '运行容灾断言与精神降级仿真'}</span>
                </button>

                {/* Calibration Result Evaluation printout */}
                <AnimatePresence>
                  {calibrationReport && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-stone-950 p-3.5 rounded-xl border border-stone-850/90 text-[11px] space-y-2.5"
                    >
                      <div className="flex justify-between items-center border-b border-stone-850 pb-1.5 font-mono">
                        <span className="text-[10px] text-stone-300 font-extrabold">{calibrationReport.title}</span>
                        <span className="text-[7.5px] bg-red-500/10 text-rose-400 border border-rose-500/20 px-1 py-0.5 rounded uppercase font-bold">
                          {calibrationReport.failSafeState}
                        </span>
                      </div>

                      <p className="text-justify leading-relaxed text-stone-300 italic">
                        {calibrationReport.log}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[9px] font-mono border-t border-stone-850/40 pt-2 text-stone-400">
                        <div>
                          🔒 防灾冗余度 (Defense Index): <b className="text-emerald-400 font-bold">{calibrationReport.safeFactor}%</b>
                        </div>
                        <div>
                          🥩 血肉真实度 (Vessel Contact Rate): <b className="text-pink-400 font-bold">{calibrationReport.vulnerabilityScore}%</b>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* GAME ACT II SLOT: Heart regret restoration specimen thaw (暗线: 悔意标本) */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-4 shadow-md">
                
                <div className="border-b border-stone-850/60 pb-3 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-400 text-lg">🌌</span>
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-indigo-400 block tracking-widest font-mono">Act II (暗线游戏)</span>
                      <h3 className="text-xs font-bold text-stone-200">往昔缺憾标本：时光解冻舱</h3>
                    </div>
                  </div>
                  <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-400 font-bold">
                    时空信差
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 leading-normal">
                  年少自尊与回避，曾在每一截心急、羞愧中，用最坚硬、礼貌的冰霜在心扉中筑墙退避，把爱意冷缩成密封的「缺憾标本」。
                </p>

                {/* Specimen selection frames */}
                <div className="grid grid-cols-3 gap-2">
                  {[QIAN_CE_REGRETS[1], QIAN_CE_REGRETS[0], QIAN_CE_REGRETS[10]].map((regret) => {
                    if (!regret) return null;
                    const isRepaired = !!regretRepairChoice[regret.id];
                    return (
                      <button
                        key={regret.id}
                        onClick={() => setSelectedRegretSpecimen(regret.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[90px] outline-none group ${
                          isRepaired 
                            ? 'bg-amber-400/5 hover:bg-amber-400/10 border-amber-500/60' 
                            : 'bg-stone-950 hover:bg-stone-900/40 border-stone-850'
                        }`}
                      >
                        <div>
                          <span className="text-xs block mb-1">
                            {regret.id === 'meteor_qq' ? '☄️' : regret.id === 'latiao' ? '🌶️' : '🧠'}
                          </span>
                          <span className="text-[10px] font-bold text-stone-200 line-clamp-2 leading-tight">
                            {regret.period} · {regret.标本Name}
                          </span>
                        </div>

                        {/* Status Stamp */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                            isRepaired ? 'bg-amber-500/10 text-amber-300 font-bold' : 'bg-indigo-950/40 text-indigo-400 animate-pulse'
                          }`}>
                            {isRepaired ? '✓ 已解冻' : '🔒 冻结中'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Repair dialog novel overlays inline */}
                <AnimatePresence>
                  {selectedRegretSpecimen && (() => {
                    const regret = QIAN_CE_REGRETS.find(r => r.id === selectedRegretSpecimen);
                    if (!regret) return null;
                    const currentRepair = regretRepairChoice[regret.id];
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-stone-950 p-4 rounded-xl border border-stone-850 text-[11px] space-y-3 relative"
                      >
                        <button 
                          onClick={() => setSelectedRegretSpecimen(null)}
                          className="absolute top-2.5 right-2 text-stone-500 hover:text-stone-300 outline-none"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>

                        <div className="border-b border-stone-850 pb-2">
                          <span className="text-[8.5px] uppercase font-bold text-amber-500 tracking-wider font-mono">标本封签档案: {regret.period}</span>
                          <h4 className="text-xs font-bold text-stone-100 mt-0.5">{regret.title}</h4>
                        </div>

                        <div className="space-y-2 bg-stone-900/60 p-3 rounded-lg border border-stone-850/50 leading-relaxed text-stone-300 text-justify">
                          <span className="text-[8px] font-bold text-rose-400 block lowercase leading-none">【历史事实回忆片段】：</span>
                          <p>{regret.event}</p>
                        </div>

                        <div className="bg-stone-900/30 p-2.5 rounded-lg border border-stone-850/20 text-[10px] text-stone-400 italic font-mono space-y-1">
                          <span className="text-[8px] font-bold text-stone-500 block leading-none font-mono">【原本的回避应激退避机制】:</span>
                          <p>{regret.coping}</p>
                        </div>

                        {/* Interactive Re-selection dialogue choices */}
                        <div className="space-y-2 pt-1 border-t border-stone-860/50">
                          <span className="text-[9.5px] uppercase font-extrabold text-amber-400 block">✦ 假如启动心智重组，时光流转回当时：</span>
                          
                          <div className="flex flex-col gap-2">
                            {/* Choice A - Rigid self protective */}
                            <button
                              onClick={() => selectRegretRepairChoice(regret.id, 'A')}
                              className={`p-2.5 rounded-xl text-left border leading-snug transition-all ${
                                currentRepair === 'A' 
                                  ? 'bg-red-500/10 border-red-500/50 text-red-300 font-medium' 
                                  : 'bg-stone-900 border-stone-850 text-stone-400 hover:border-stone-750'
                              }`}
                            >
                              <div className="font-bold text-[10px] text-stone-200">
                                选项 Alpha: 继续回避保护（原样降级）
                              </div>
                              <p className="text-[9.5px] text-stone-500 mt-0.5 leading-snug">
                                {regret.id === 'latiao' && '冷傲拒绝，谎称“不爱吃辣”，守好高傲学霸面具。'}
                                {regret.id === 'meteor_qq' && '在朋友前要面子，冷淡叉掉对话框，回复不当哥哥。'}
                                {regret.id === 'soulmate_chengdu' && '退隐一星期不上线，回复客规疏离的练车回复，不谈远路。'}
                              </p>
                            </button>

                            {/* Choice B - Sincere courageous contact */}
                            <button
                              onClick={() => selectRegretRepairChoice(regret.id, 'B')}
                              className={`p-2.5 rounded-xl text-left border leading-snug transition-all ${
                                currentRepair === 'B' 
                                  ? 'bg-amber-400/10 border-amber-500/50 text-amber-300 font-semibold' 
                                  : 'bg-stone-900 border-stone-850 text-stone-400 hover:border-stone-750'
                              }`}
                            >
                              <div className="font-bold text-[10px] text-stone-100 flex items-center gap-1">
                                <span>🚀</span> 选项 Beta: 卸下面具第一视角正面拥戴心跳！
                              </div>
                              <p className="text-[9.5px] text-stone-500 mt-0.5 leading-snug">
                                {regret.id === 'latiao' && '“其实我很能吃辣，辣条很香，就像我见到你时的欣喜……”'}
                                {regret.id === 'meteor_qq' && '直接回复：『好吧，其实我开心到要窒息了。今天不补魔兽，今晚咱们一起等最好的流星，好不好？』'}
                                {regret.id === 'soulmate_chengdu' && '“你是想成为乡村管理员的好姑娘，乡下天很蓝，西藏路很远，但我也好想和你一起看看，即使我一无所有。”'}
                              </p>
                            </button>
                          </div>
                        </div>

                        {/* Story payoff of choice */}
                        {currentRepair && (
                          <div className="bg-stone-900 p-3 rounded-lg border border-stone-850 italic text-[10px] text-stone-400 text-justify leading-relaxed mt-2 animate-[fadeIn_0.5s_ease_1]">
                            🦊 <b>小九重组演算纪实：</b>
                            {currentRepair === 'A' ? (
                              <span className="text-red-400">
                                「系统复现断路」标本完美封存在冷度标本仓中。水温再高你不喝，它就永远好看。可怀里除了一页不落尘灰、冰冷无错的完美契约代码，空无一人。千岑眼睁睁看着那截晚霞黄昏在空旷中熄灭。
                              </span>
                            ) : (
                              <span className="text-amber-300">
                                「缺憾标本彻底解冻！情感红线在岁月中复原连回！」冻结十余年的冰棺瞬间融化为盛夏的朝晖！虽然时空无可倒流，但你在这重选一刻吹起的勇气狂风，让千岑胸膛中高悬的“防卫第三人称”开始彻底剥落。血液流转、泪水温热——今天，他终于敢直面脆弱和爱！
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>

              {/* GAME ACT III SLOT: Bonsai Trimming & Mind pruning (交汇破局: 心智盆栽修剪) */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-4 shadow-md">
                
                <div className="border-b border-stone-850/60 pb-3 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 text-lg">🪁</span>
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-amber-400 block tracking-widest font-mono">Act III (交汇点游戏)</span>
                      <h3 className="text-xs font-bold text-stone-200">镜面剪枝：心智盆栽削减</h3>
                    </div>
                  </div>
                  <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-amber-400 font-bold">
                    信仰竹筏
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 leading-normal">
                  修剪盆栽，是闭上眼，照心里浮出的样子咔嚓剪掉杂枝。要做出第一款具身心灵显影的真实产品，他必须剪除外界钢印留给他的所谓“主流高配假人答案”之枝。
                </p>

                {/* Abstract Interactive Bonsai SVG Draw Frame */}
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                  
                  {/* Styling Bonsai Canvas representation using sheer tailwind */}
                  <div className="relative w-40 h-28 flex flex-col items-center justify-end">
                    
                    {/* Abstract Golden Light Center Trunk */}
                    <div className="w-3 h-14 bg-stone-800 rounded-full relative">
                      <div className="absolute inset-0 bg-amber-500/40 blur-[2px]" />
                      <div className="absolute bottom-0 w-3 h-7 bg-amber-600 rounded-full" />
                    </div>

                    {/* Elite Branch Left */}
                    <div className={`absolute top-6 left-4 flex flex-col items-center transition-all duration-500 ${
                      prunedBranches['elitism'] ? 'opacity-20 scale-75 filter blur-[1px]' : 'opacity-100 animate-pulse'
                    }`}>
                      <div className="w-10 h-7 bg-emerald-700/60 rounded-full border border-emerald-500 flex items-center justify-center text-[7px] text-emerald-100">
                        做题家傲慢
                      </div>
                      <div className="w-[1px] h-4 bg-lime-600 rotate-12" />
                    </div>

                    {/* Avoidant Shield Branch Right */}
                    <div className={`absolute top-4 right-2 flex flex-col items-center transition-all duration-500 ${
                      prunedBranches['avoidant'] ? 'opacity-20 scale-75 filter blur-[1px]' : 'opacity-100 animate-pulse'
                    }`}>
                      <div className="w-12 h-7 bg-indigo-700/60 rounded-full border border-indigo-500 flex items-center justify-center text-[7px] text-indigo-100">
                        冷观自保罩
                      </div>
                      <div className="w-[1px] h-6 bg-indigo-500 -rotate-12" />
                    </div>

                    {/* Standard Answers Bottom Branch */}
                    <div className={`absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ${
                      prunedBranches['answers'] ? 'opacity-20 scale-75 filter blur-[1px]' : 'opacity-100 animate-pulse'
                    }`}>
                      <div className="w-14 h-6 bg-pink-700/60 rounded-full border border-pink-500 flex items-center justify-center text-[7px] text-pink-100">
                        常规迎合套路
                      </div>
                      <div className="w-[1px] h-4 bg-pink-500" />
                    </div>

                    {/* Ceramic Base Pot */}
                    <div className="w-24 h-4 bg-stone-700 rounded-b-xl border border-stone-600 flex items-center justify-center text-[8px] text-stone-400 font-mono">
                      【千岑心源盆】
                    </div>

                    {/* Raft overlay when fully pruned */}
                    {isBonsaiFullyPruned && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center p-2 text-center rounded-xl border border-amber-500/30"
                      >
                        <span className="text-3xl">🛶</span>
                        <span className="text-xs font-bold text-amber-400 mt-1">【生存竹筏修成！】</span>
                        <p className="text-[8.5px] text-stone-300 mt-0.5 leading-tight">
                          剪除了一切社会钢印，体内淬炼出一只不靠巨轮、渡船、孤高，在深水中自划、可渡己渡人的生命竹筏。
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-[7.5px] font-mono text-stone-500 font-bold">剪枝状态比率</span>
                  </div>
                </div>

                {/* Pruning actions buttons */}
                <div className="space-y-2">
                  <span className="text-[9.5px] uppercase font-bold text-stone-500 tracking-wider block">剪刀架：可修剪的杂冗枝叶（点击修剪）：</span>
                  
                  <div className="grid grid-cols-1 gap-2 text-[10px]">
                    <button
                      onClick={() => handlePruneBranch('elitism')}
                      disabled={prunedBranches['elitism']}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all outline-none text-left ${
                        prunedBranches['elitism'] 
                          ? 'bg-stone-950 border-stone-900 text-stone-600 line-through' 
                          : 'bg-stone-950 border-stone-850 hover:border-emerald-500/40 text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                        <div>
                          <p className="font-bold text-stone-300">剪除「做题家精英傲慢之枝」</p>
                          <p className="text-[8.5px] text-stone-500 leading-none mt-0.5">觉得世事琐碎庸常，自尊高筑，不肯降泥入俗</p>
                        </div>
                      </div>
                      <span className="text-[8px] text-emerald-500 font-bold">✂️ 剪枝</span>
                    </button>

                    <button
                      onClick={() => handlePruneBranch('avoidant')}
                      disabled={prunedBranches['avoidant']}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all outline-none text-left ${
                        prunedBranches['avoidant'] 
                          ? 'bg-stone-950 border-stone-900 text-stone-600 line-through' 
                          : 'bg-stone-950 border-stone-850 hover:border-indigo-500/40 text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5 text-indigo-400" />
                        <div>
                          <p className="font-bold text-stone-300">剪除「第三视角防御孤高隔离枝」</p>
                          <p className="text-[8.5px] text-stone-500 leading-none mt-0.5">躲藏在“隔不沾人”的解构清醒中，以此抵御受伤</p>
                        </div>
                      </div>
                      <span className="text-[8px] text-indigo-500 font-bold">✂️ 剪枝</span>
                    </button>

                    <button
                      onClick={() => handlePruneBranch('answers')}
                      disabled={prunedBranches['answers']}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all outline-none text-left ${
                        prunedBranches['answers'] 
                          ? 'bg-stone-950 border-stone-900 text-stone-600 line-through' 
                          : 'bg-stone-950 border-stone-850 hover:border-pink-500/40 text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5 text-pink-400" />
                        <div>
                          <p className="font-bold text-stone-300">剪除「常规框架下的假人钢印枝」</p>
                          <p className="text-[8.5px] text-stone-500 leading-none mt-0.5">为合群、圆滑交出言不由衷、稳定体制化的假标准答案</p>
                        </div>
                      </div>
                      <span className="text-[8px] text-pink-500 font-bold">✂️ 剪枝</span>
                    </button>
                  </div>
                </div>

                {/* Bonsai dialogue printout */}
                <AnimatePresence>
                  {activeBonsaiDialogueIdx !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-stone-950 p-3.5 rounded-xl border border-stone-850 text-[10.5px] space-y-2"
                    >
                      <div className="flex justify-between items-center text-[7.5px] uppercase font-bold text-stone-500 tracking-wider border-b border-stone-850 pb-1">
                        <span>剪枝引发的镜底对流</span>
                        <button onClick={() => setActiveBonsaiDialogueIdx(null)} className="hover:text-stone-300">关闭对白</button>
                      </div>

                      <div className="space-y-1.5 leading-relaxed text-justify">
                        <p className="text-amber-400">
                          <b>千岑：</b>“{QIAN_CE_BONSAI_DIALOGS[activeBonsaiDialogueIdx].text}”
                        </p>
                        <p className="text-emerald-400">
                          <b>小九：</b>“{QIAN_CE_BONSAI_DIALOGS[activeBonsaiDialogueIdx + 1].text}”
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CORE PROFILE DOSSIER (Original Topology Map domain switches inside Act III) */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-3 shadow-md">
                <div className="flex justify-between items-center border-b border-stone-850 pb-2">
                  <span className="text-[9px] uppercase font-bold text-amber-500 tracking-widest font-mono">
                    👥 四域交错：人格详细档案副本
                  </span>
                  <button 
                    onClick={() => setShowDossierDetails(!showDossierDetails)}
                    className="text-[9px] text-stone-400 hover:text-stone-300 flex items-center gap-1"
                  >
                    <span>{showDossierDetails ? '✕ 折叠' : '👁️ 查看完整详细参数'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed text-justify">
                  千岑在物理算法（智驾车规）、市井零售（淘宝做客服报价）、灵魂思辨（陀妥氏原著、实践论）与关系打破自卫（第一视角心跳涉险）中漫游。
                </p>

                {showDossierDetails && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="space-y-2 pt-1"
                  >
                    {DOSSIER.cards.map((card, idx) => (
                      <div key={idx} className="bg-stone-950 p-3 rounded-xl border border-stone-850 text-[10.5px] space-y-1">
                        <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest leading-none block">{card.label}</span>
                        <span className="font-extrabold text-stone-200 block">{card.value}</span>
                        <p className="text-stone-400 leading-snug">{card.desc}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* SPECIAL UNLOCKED LETTER AT 100% RESONANCE (Payoff of the visual novel) */}
              <AnimatePresence>
                {resonanceRate === 100 && (
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-amber-600/10 via-amber-600/5 to-emerald-500/10 border-2 border-amber-500/40 p-4.5 rounded-2xl space-y-3 shadow-2xl relative"
                  >
                    <div className="absolute -top-3.5 -right-3.5 select-none bg-amber-500 text-stone-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full rotate-12 shadow-lg flex items-center gap-1">
                      <span>🏆</span>
                      <span>金牌竹筏勋章</span>
                    </div>

                    <div className="border-b border-amber-500/20 pb-2 flex items-center gap-2">
                      <span className="text-2xl">✉️</span>
                      <div>
                        <span className="text-[8.5px] uppercase font-bold text-amber-400 font-mono block">FINAL UNLOCKED MEMO • 最终折叠融化</span>
                        <h3 className="text-sm font-bold text-stone-100">千岑致未来的信：在深水中造好一扇属于你的竹筏</h3>
                      </div>
                    </div>

                    <div className="bg-stone-950/95 border border-stone-850 p-4 rounded-xl leading-relaxed text-[11px] text-stone-300 space-y-3 text-justify relative">
                      <p className="italic">
                        “你好，同路人。
                      </p>
                      <p>
                        如果你读到了这里，说明你已经替我按出那些卡在喉咙的心碎，修剪掉披在我肩头那些虚假的、主流大厂钢印出的光亮。
                      </p>
                      <p>
                        曾经我极度傲慢清高，用第三人称冷眼防灾，以为算清了轨迹就安全。可那场猝降的冷冰，只留下了枯萎的书签。直到我把手臂插进实体淘宝几分钱的拉扯，把带教车辆文档摊晒给每一个兄弟共生，把我高悬的天眼拔掉、走向真实的情路涉险。
                      </p>
                      <p>
                        我才终于彻悟，这个系统要把人压缩成冰冷干缩的代码。与其在完美的大船甲板上惶惶空虚，不如在这未知的惊涛骇浪里，亲自动手、用傲骨编织出一叶生存的竹筏。
                      </p>
                      <p>
                        这叶竹筏上承载不了多少黄金名望，但它的每一跟杉木都有体温。它有我白天写给智能泊车的厘米毫米防护，有深夜老白茶里照出的对撞星空，有我为了别人过河而點亮的每一根柴木营火。
                      </p>
                      <p className="border-t border-stone-850/60 pt-2 text-right italic font-semibold text-amber-400">
                        —— 二○三○年的千岑 敬上 • 镜湖竹筏上”
                      </p>
                    </div>

                    <div className="text-[10px] text-amber-300 font-semibold text-center uppercase tracking-widest pt-1 border-t border-amber-500/10">
                      ✨ 感谢你深入千岑的脑图，你已彻底完成了他的心智同步！🌟
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* TAB 1: THE STORYLINE TIMELINE */}
          {currentTab === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Timeline intro header */}
              <div className="border-b border-stone-850/60 pb-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest">🌊 时光长河：在尘折印痕中漫步</h3>
                <p className="text-[11px] text-stone-400 leading-relaxed mt-1 text-justify">
                  沿着千岑在流转岁月中的抉择与得失轨迹徐徐逆流。在历史长廊里，每一次在极端岔口处做题，他的精神底牌就添上了一枚厚重的“精神勋章”。点击勋章可读取他隐密的真实日记：
                </p>
              </div>

              {/* Timeline Contain Layout */}
              <div className="relative pl-5 border-l border-stone-850 space-y-7 py-2 selection:bg-indigo-500/20 select-none">
                
                {/* 2023 */}
                <div className="relative space-y-2.5">
                  <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/10" />
                  <div>
                    <span className="text-[10px] font-mono text-amber-500 font-bold block">2023 • 泥泞物力</span>
                    <h4 className="text-sm font-bold text-stone-200 leading-tight">老百姓生境客服修行</h4>
                  </div>
                  <p className="text-[11.5px] text-stone-400 leading-relaxed text-justify">
                    拒绝做一个轻飘飘用键盘高谈阔论的清高书生。在淘宝亲自开起零配件物理店面，面对几毛钱的琐屑、恶意退货和优惠死拉活磨，褪去智识的傲气，换来同常人谋生的重力交感。
                  </p>

                  <div className="flex gap-2.5 flex-wrap">
                    <button 
                      onClick={() => setOpenedAchievement(ACHIEVEMENTS[0])}
                      className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] text-amber-300 font-bold cursor-pointer outline-none active:scale-95 transition-all"
                    >
                      <span>🏪</span>
                      <span>里程勋章: 淘宝店主之炼</span>
                    </button>
                  </div>

                  {/* 25 Crossroads Choice 1 */}
                  <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-850/80 space-y-2.5">
                    <span className="text-[7px] bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 rounded text-amber-400 uppercase tracking-wide font-mono font-bold leading-none block w-fit">
                      2023 极限断裂面
                    </span>
                    <p className="text-[11px] text-stone-300 font-bold">若面临无数低额拉扯客户纠缠退款，你会选择逃跑还是留下较真？</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <button 
                        onClick={() => markActionComplete('quiz')}
                        className={`p-2 rounded-lg text-left border transition-all ${
                          completedActions['quiz'] ? 'bg-amber-500/10 border-amber-500 text-amber-200' : 'bg-stone-900 border-stone-850 text-stone-400'
                        }`}
                      >
                        A. 过于繁碎，关闭退款归省
                      </button>
                      <button 
                        onClick={() => markActionComplete('leave_comment')}
                        className={`p-2 rounded-lg text-left border transition-all ${
                          completedActions['leave_comment'] ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200' : 'bg-stone-900 border-stone-850 text-stone-400'
                        }`}
                      >
                        B. 咬牙到底，在低位拉扯中浸血
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2024 */}
                <div className="relative space-y-2.5">
                  <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-indigo-400/10" />
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block">2024 • 铠甲冰裂</span>
                    <h4 className="text-sm font-bold text-stone-200 leading-tight">智驾APA防灾与老陀书房</h4>
                  </div>
                  <p className="text-[11.5px] text-stone-400 leading-relaxed text-justify">
                    多款主车极限泊车毫米安全死线抢夺，把故障优雅降级 fail-safe 写进物理世界。深夜抱着《卡拉马佐夫兄弟》字字痛苦，与心灵的防御高墙死掐死砍。
                  </p>

                  <div className="flex gap-1.5 flex-wrap">
                    <button 
                      onClick={() => setOpenedAchievement(ACHIEVEMENTS[4])}
                      className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[9.5px] text-indigo-300 font-semibold cursor-pointer outline-none active:scale-95 transition-all"
                    >
                      <span>📖</span>
                      <span>勋章: 卡氏苦修冰川</span>
                    </button>

                    <button 
                      onClick={() => setOpenedAchievement(ACHIEVEMENTS[5])}
                      className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[9.5px] text-emerald-300 font-semibold cursor-pointer outline-none active:scale-95 transition-all"
                    >
                      <span>🌊</span>
                      <span>勋章: 极端失控孤筏</span>
                    </button>

                    <button 
                      onClick={() => setOpenedAchievement(ACHIEVEMENTS[6])}
                      className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[9.5px] text-pink-300 font-semibold cursor-pointer outline-none active:scale-95 transition-all"
                    >
                      <span>🩹</span>
                      <span>勋章: 卸甲情感试炼</span>
                    </button>
                  </div>
                </div>

                {/* 2025 */}
                <div className="relative space-y-2.5">
                  <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-pink-400 ring-4 ring-pink-400/10" />
                  <div>
                    <span className="text-[10px] font-mono text-pink-400 font-bold block">2025 • 融会重熔</span>
                    <h4 className="text-sm font-bold text-stone-200 leading-tight">镜像信鸽与无边界带教</h4>
                  </div>
                  <p className="text-[11.5px] text-stone-400 leading-relaxed text-justify">
                    大雪下的猩红情根纠葛。在文墨里建立「镜像回声」，不为贩卖焦虑，只把死寂理论翻译成有体温的热茶送给无望的夜归者。把智驾降级与心灵自守，在身体熔炉交织融印。
                  </p>

                  <div className="flex gap-1.5 flex-wrap">
                    <button 
                      onClick={() => setOpenedAchievement(ACHIEVEMENTS[2])}
                      className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[9.5px] text-pink-300 font-semibold cursor-pointer outline-none active:scale-95 transition-all"
                    >
                      <span>🎬</span>
                      <span>勋章: 镜像信鸽</span>
                    </button>

                    <button 
                      onClick={() => setOpenedAchievement(ACHIEVEMENTS[3])}
                      className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[9.5px] text-amber-300 font-semibold cursor-pointer outline-none active:scale-95 transition-all"
                    >
                      <span>🔮</span>
                      <span>勋章: 熔炉重铸</span>
                    </button>

                    <button 
                      onClick={() => setOpenedAchievement(ACHIEVEMENTS[9])}
                      className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[9.5px] text-yellow-300 font-semibold cursor-pointer outline-none active:scale-95 transition-all"
                    >
                      <span>🧭</span>
                      <span>勋章: 带教渡人青灯</span>
                    </button>
                  </div>
                </div>

                {/* 2026 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/10" />
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">2026 • 营火旷野</span>
                    <h4 className="text-sm font-bold text-stone-200 leading-tight">放出生存之竹筏，听因果回响</h4>
                  </div>
                  <p className="text-[11.5px] text-stone-400 leading-relaxed text-justify">
                    不再纸上谈兵，携手AI计算与温暖墨迹融合，单点爆发出具体、有痛感的解忧心灵显影产品。把自己的孤独和多洛特的傲骨，永远夯实进更开阔的生活疆域中。
                  </p>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: COZY TEA ROOM, CHAT & GUESTBOARD */}
          {currentTab === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              
              {/* Cozy Tea Room Graphic visual header */}
              <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-850 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative py-5 gap-3.5 shadow-md">
                <div className="absolute top-2 right-3 flex items-center gap-1 bg-stone-950 px-2 py-0.5 rounded border border-stone-850">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7.5px] text-stone-400 uppercase font-mono font-bold">灵狐小九 在线</span>
                </div>

                <div className="relative">
                  <span className="text-6xl block select-none drop-shadow-[0_0_12px_rgba(251,191,36,0.2)] animate-[pulse_4s_ease_infinite]">🦊</span>
                  <div className="absolute -bottom-1 -right-1 bg-stone-950 border border-stone-800 p-1 rounded-full text-xs animate-bounce">
                    🍵
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-amber-400">{USER_BASE.pet.name}的心智回音隔</h4>
                  <p className="text-[9.5px] text-stone-500">{USER_BASE.pet.type} • 隔年老白茶正热</p>
                </div>

                <div className="bg-stone-950/90 border border-stone-850 p-3 rounded-xl italic text-[11px] text-stone-300 leading-relaxed text-justify relative">
                  “大厂工位与算法冰冷刺骨。在这儿抛掉名册，咱们像有血肉的人类一样，倒一盏老茶，聊聊大桥异常、读透卡卡兄弟的虚落、或是你走过关系时的笨拙，可好？”
                </div>
              </div>

              {/* RAG Chat Terminal Block */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-stone-850/60 pb-2">
                  <span className="text-[9px] uppercase font-mono font-bold text-stone-400 tracking-wider flex items-center gap-1">
                    <span>💬</span> replica AI内心重对流
                  </span>
                  <span className="text-[8px] bg-stone-950 text-stone-500 border border-stone-850 px-1.5 py-0.5 rounded font-mono">
                    RAG-Fallback
                  </span>
                </div>

                {/* Message logs */}
                <div className="h-[210px] overflow-y-auto space-y-3.5 pr-1 text-xs scrollbar-thin scrollbar-thumb-stone-800">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex gap-2.5 items-start ${msg.sender === 'user' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <span className="text-xl shrink-0 select-none">{msg.sender === 'user' ? '👤' : '🦊'}</span>
                      <div className="space-y-0.5 max-w-[80%]">
                        <span className="text-[8px] text-stone-500 block font-bold">
                          {msg.sender === 'user' ? '探索者' : '小九'}
                        </span>
                        <div className={`p-2.5 rounded-xl border leading-relaxed text-[11px] whitespace-pre-line text-justify ${
                          msg.sender === 'user' 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-200 rounded-tr-none' 
                            : 'bg-stone-950 border-stone-850 text-stone-300 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2.5 items-center animate-pulse">
                      <span className="text-xl">🦊</span>
                      <div className="bg-stone-950 border border-stone-850 px-3 py-1.5 rounded-xl text-[10px] text-stone-500 italic">
                        小九在翻看千岑在高温和极寒车底留下的现场原笔录... 🍵
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestive chips */}
                <div className="space-y-2 pt-2 border-t border-stone-850/40">
                  <span className="text-[8.5px] text-stone-500 font-bold block uppercase tracking-wider">💡 热度心流锦囊（点击直接提问）：</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none shrink-0 flex-nowrap">
                    <button 
                      onClick={() => handleSendChat('你负责的高温极寒APA智能泊车毫米级实车控制是怎么调试的？')}
                      disabled={isTyping}
                      className="bg-stone-950 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer transition-all outline-none"
                    >
                      🚗 APA车规极限调试
                    </button>
                    <button 
                      onClick={() => handleSendChat('为什么要把故障优雅降级的逻辑生搬进生活作为防护垫？')}
                      disabled={isTyping}
                      className="bg-stone-950 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer transition-all outline-none"
                    >
                      🩹 优雅降级自保盾
                    </button>
                    <button 
                      onClick={() => handleSendChat('你在凌晨阅读卡拉马佐夫兄弟和马克思《实践论》到底看到了什么？')}
                      disabled={isTyping}
                      className="bg-stone-950 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer transition-all outline-none"
                    >
                      📖 书桌上的老陀与实践
                    </button>
                    <button 
                      onClick={() => handleSendChat('聊聊自媒体《镜像回声》背后传递体温的真相吧')}
                      disabled={isTyping}
                      className="bg-stone-950 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer transition-all outline-none"
                    >
                      🪁 镜像回声心灵之镜
                    </button>
                  </div>
                </div>

                {/* Sender bar */}
                <div className="flex gap-2 border-t border-stone-850/40 pt-2 shrink-0">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                    disabled={isTyping}
                    placeholder="问点儿底盘安全、淘宝客服纠缠或深夜对学..."
                    className="flex-1 bg-stone-950 border border-stone-850 rounded-xl px-3 py-2 text-xs focus:border-amber-500/40 outline-none text-stone-200 placeholder-stone-600 disabled:opacity-50"
                  />
                  <button 
                    onClick={() => handleSendChat()}
                    disabled={isTyping || !chatInput.trim()}
                    className="bg-amber-500 text-stone-950 font-bold px-3.5 rounded-xl text-xs hover:bg-amber-400 active:scale-95 transition-all outline-none flex items-center justify-center disabled:opacity-50 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* COZY GUESTBOOK SIGNATURE PANEL */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md">
                <div className="border-b border-stone-850/50 pb-2">
                  <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-wider block leading-none">📝 茶桌留款：挂木简刻石</span>
                  <p className="text-[10px] text-stone-500 leading-normal mt-1">
                    写下一行触及过你心智极点、或对这间赛博客栈的微温共鸣吧（可获得15%心灵共鸣率）：
                  </p>
                </div>

                {/* Comments box */}
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {guestComments.map((comment, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 rounded-xl border border-stone-850 bg-stone-950 relative"
                    >
                      <div 
                        className="absolute left-1.5 top-1.5 bottom-1.5 w-1 rounded-full" 
                        style={{ backgroundColor: comment.color }}
                      />
                      <p className="text-[10.5px] text-stone-300 pl-3 leading-snug text-justify pr-10">{comment.text}</p>
                      <span className="absolute right-2.5 bottom-1 text-[7.5px] text-stone-600 font-mono">{comment.time}</span>
                    </div>
                  ))}
                </div>

                {/* Post submission form */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-2.5">
                  <div className="flex gap-2 items-center justify-between">
                    <input 
                      type="text"
                      placeholder="客官昵称/印章"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      maxLength={10}
                      className="w-1/3 bg-stone-900 border border-stone-850 rounded-lg px-2.5 py-1 text-[11px] focus:border-amber-500/30 outline-none text-stone-200 placeholder-stone-600"
                    />

                    {/* Color seal stamp */}
                    <div className="flex items-center gap-1">
                      {['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'].map((col) => (
                        <button
                          key={col}
                          onClick={() => setGuestSelectedColor(col)}
                          className={`w-3.5 h-3.5 rounded-full transition-all border ${
                            guestSelectedColor === col ? 'scale-110 border-stone-200' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="留宿茶会，刻下共鸣（八十字内）..."
                      value={guestMsg}
                      onChange={(e) => setGuestMsg(e.target.value)}
                      maxLength={80}
                      className="flex-1 bg-stone-900 border border-stone-850 rounded-lg px-2.5 py-1.5 text-[11px] focus:border-amber-500/30 outline-none text-stone-200 placeholder-stone-600"
                    />
                    <button
                      onClick={handlePostComment}
                      disabled={!guestMsg.trim()}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 font-bold px-3.5 py-1.5 rounded-lg text-[10px] active:scale-95 disabled:opacity-50 transition-all outline-none shrink-0"
                    >
                      落款
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </div>

        {/* BOTTOM NAVIGATION: VISURE NOVEL ACTS CHANGER (Sleek tabs) */}
        <div className="bg-stone-900 border-t border-stone-850/60 grid grid-cols-3 shrink-0 select-none pb-[env(safe-area-inset-bottom,0)] z-[95]">
          <button 
            onClick={() => setCurrentTab(0)}
            className={`py-3.5 flex flex-col items-center gap-1.5 text-[10px] uppercase font-bold outline-none transition-colors border-t border-transparent ${
              currentTab === 0 ? 'text-amber-400 border-t-amber-400 bg-stone-950/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span className="tracking-wider text-[9.5px]">双轨漫游 Act I-III</span>
          </button>

          <button 
            onClick={() => setCurrentTab(1)}
            className={`py-3.5 flex flex-col items-center gap-1.5 text-[10px] uppercase font-bold outline-none transition-colors border-t border-transparent ${
              currentTab === 1 ? 'text-amber-400 border-t-amber-400 bg-stone-950/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <span className="tracking-wider text-[9.5px]">时光回廊</span>
          </button>

          <button 
            onClick={() => setCurrentTab(2)}
            className={`py-3.5 flex flex-col items-center gap-1.5 text-[10px] uppercase font-bold outline-none transition-colors border-t border-transparent ${
              currentTab === 2 ? 'text-amber-400 border-t-amber-400 bg-stone-950/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="tracking-wider text-[9.5px]">茗茶闲叙</span>
          </button>
        </div>

      </div>

      {/* --- FLOATING OVERLAYS (MODALS) --- */}

      {/* Artifact (Gear) detail modal */}
      <AnimatePresence>
        {equippedGearPopup && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setEquippedGearPopup(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">{equippedGearPopup.icon}</span>
                <div>
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-amber-500">领域心灵之物</span>
                  <h3 className="text-sm font-bold text-stone-100">{equippedGearPopup.name}</h3>
                </div>
              </div>

              <p className="text-[11.5px] text-stone-300 leading-relaxed text-justify italic bg-stone-950 p-3.5 rounded-xl border border-stone-850/50">
                {equippedGearPopup.desc}
              </p>

              <div className="flex gap-2 items-center text-[10.5px] bg-stone-950 p-2.5 rounded-lg text-stone-400 font-mono">
                <span className="text-amber-500 font-bold uppercase">精神属性补正:</span>
                <span className="flex-1 flex gap-1.5 flex-wrap">
                  {equippedGearPopup.effects.map((eff, eidx) => (
                    <span key={eidx} className="bg-stone-900 px-2 py-0.5 rounded text-stone-200">
                      {eff.attr === 'tech' ? '🛠️ 技术 +1' : eff.attr === 'insight' ? '🔮 洞察 +1' : eff.attr === 'express' ? '🎬 表达 +1' : eff.attr === 'social' ? '🩹 双向共振 +1' : '⚙️ 执力 +1'}
                    </span>
                  ))}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Achievements details modal */}
      <AnimatePresence>
        {openedAchievement && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative cursor-default"
            >
              <button 
                onClick={() => setOpenedAchievement(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-stone-850 pb-3">
                <span className="text-3xl bg-amber-500/10 p-2 rounded-xl text-amber-400">{openedAchievement.icon}</span>
                <div>
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-amber-500 leading-none font-mono">精神勋章已收割 • {openedAchievement.time}</span>
                  <h3 className="text-sm font-bold text-stone-100 mt-1">{openedAchievement.name}</h3>
                  <p className="text-[10px] text-stone-500 font-medium leading-none mt-0.5">{openedAchievement.desc}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 block leading-none">勋章背后的故事与日记</span>
                <p className="text-[11.5px] text-stone-300 leading-relaxed text-justify bg-stone-950 p-3.5 rounded-xl border border-stone-850/50">
                  {openedAchievement.story}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-2.5 rounded-xl">
                  <span className="text-emerald-400 font-bold block mb-1">🌱 获得：</span>
                  <ul className="space-y-0.5 text-[9.5px] text-stone-400 list-disc list-inside leading-snug">
                    {openedAchievement.gain?.map((g, gidx) => <li key={gidx}>{g}</li>)}
                  </ul>
                </div>

                <div className="bg-rose-950/10 border border-rose-500/10 p-2.5 rounded-xl">
                  <span className="text-rose-400 font-bold block mb-1">🍂 损耗代价：</span>
                  <ul className="space-y-0.5 text-[9.5px] text-stone-400 list-disc list-inside leading-snug">
                    {openedAchievement.cost?.map((c, cidx) => <li key={cidx}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
