import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Eraser,
  Hammer,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Award,
  Layers
} from 'lucide-react';

interface CognitiveDlcProps {
  onComplete: () => void;
  isSolved: boolean;
}

export default function CognitiveDlc({ onComplete, isSolved }: CognitiveDlcProps) {
  const [currentAct, setCurrentAct] = useState<number>(0); // 0: Start, 1: Act 1, 2: Act 2, 3: Act 3, 4: Clear
  
  // Inventory items
  const [hasLighter, setHasLighter] = useState(true);
  const [hasEraser, setHasEraser] = useState(true);
  const [hasHammer, setHasHammer] = useState(true);
  
  // Custom statistics/buffs earned in this DLC
  const [cognitivePenetration, setCognitivePenetration] = useState<number>(() => {
    return Number(localStorage.getItem('dlc_cognitive_penetration') || 0);
  });
  const [nihilismResistance, setNihilismResistance] = useState<number>(() => {
    return Number(localStorage.getItem('dlc_nihilism_resistance') || 0);
  });
  const [hasWoolenWearAchievement, setHasWoolenWearAchievement] = useState<boolean>(() => {
    return localStorage.getItem('dlc_woolen_wear_badge') === 'true';
  });

  // Reset progress helper
  const handleResetDLC = () => {
    setCurrentAct(1);
    setGateWarning(null);
    setSelectedGate(null);
    setLighterUsed(false);
    setWipedCount(0);
    setWipeLogs([]);
    setSandPushed(false);
    setSandRevealed(false);
    setConnectedPairs([]);
    setSelectedLeft(null);
    setSelectedMid(null);
    setDebateStep(0);
    setDebateLogs([]);
    setShowXiaoJiu(false);
  };

  // --- ACT 1 STATES ---
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [gateWarning, setGateWarning] = useState<string | null>(null);
  const [isLighterUsed, setLighterUsed] = useState<boolean>(false);
  const [smokingEffect, setSmokingEffect] = useState<boolean>(false);

  // --- ACT 2 STATES ---
  // Sub-game 1: Eraser
  const [wipedCount, setWipedCount] = useState<number>(0);
  const [wipeLogs, setWipeLogs] = useState<string[]>([]);
  const examPapers = [
    { id: 'p1', title: '一年级小测验：一加一等于几？', grade: 1, wiped: false, cantWipe: false, log: '✨ 成功擦去：一年级算数过失（1 + 1 算成 3）！' },
    { id: 'p2', title: '二年级画图课：我心目中的老师', grade: 2, wiped: false, cantWipe: false, log: '🖍️ 成功擦去：二年级图画涂鸦（把老师画成小花猫）！' },
    { id: 'p3', title: '三年级期末考：奥数逻辑除法练习', grade: 3, wiped: false, cantWipe: true, log: '❌ 擦不掉。三年级的试卷上，错题已经干透了。不是长大以后就不犯错了，是长大以后，橡皮擦不管用了。' },
    { id: 'p4', title: '高级车规控制：APA路径姿态容灾设计', grade: 5, wiped: false, cantWipe: true, log: '❌ 擦不掉。高等级标定缺陷没法撤销。不过后来的二维码比条形码抗造多了——有些错，改了就行。' }
  ];
  // Sub-game 2: Hammer Sand
  const [isSandPushed, setSandPushed] = useState(false);
  const [isSandRevealed, setSandRevealed] = useState(false);
  // Sub-game 3: Logic pairs
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedMid, setSelectedMid] = useState<string | null>(null);
  const [connectedPairs, setConnectedPairs] = useState<{left: string, mid: string, right: string}[]>([]);

  const leftTerms = [
    { id: 'l1', text: '沙雕' },
    { id: 'l2', text: '菊花' },
    { id: 'l3', text: '2B' }
  ];

  const midTerms = [
    { id: 'm1', text: '沙滩上用沙子堆起来的泰罗奥特曼', pairLeft: 'l1' },
    { id: 'm2', text: '周董歌里唱的一种纯洁的花', pairLeft: 'l2' },
    { id: 'm3', text: '六年级前老师不准用的考试铅笔', pairLeft: 'l3' }
  ];

  const rightTerms = [
    { id: 'r1', text: '某种网络乐子人的统称', pairMid: 'm1' },
    { id: 'r2', text: '带有恶俗隐喻的网络词汇', pairMid: 'm2' },
    { id: 'r3', text: '同桌妹妹用来制裁你的口头禅', pairMid: 'm3' }
  ];

  const handlePairSelection = (type: 'left' | 'mid' | 'right', id: string) => {
    if (type === 'left') {
      setSelectedLeft(id);
    } else if (type === 'mid') {
      setSelectedMid(id);
    } else if (type === 'right') {
      if (selectedLeft && selectedMid) {
        // Find if this is correct pairs
        const currentLeft = leftTerms.find(l => l.id === selectedLeft);
        const currentMid = midTerms.find(m => m.id === selectedMid);
        const currentRight = rightTerms.find(r => r.id === id);

        if (currentMid?.pairLeft === selectedLeft && currentRight?.pairMid === selectedMid) {
          // Correct match
          setConnectedPairs([...connectedPairs, { 
            left: currentLeft!.text, 
            mid: currentMid!.text, 
            right: currentRight!.text 
          }]);
        } else {
          // Play a buzzer vibration
          alert("⚡ 没连对。这个词在童年不是这个意思，你想想。");
        }
        setSelectedLeft(null);
        setSelectedMid(null);
      }
    }
  };

  // --- ACT 3 DEBATE STATES ---
  const [debateStep, setDebateStep] = useState<number>(0);
  const [debateLogs, setDebateLogs] = useState<{sender: 'boss' | 'player', text: string}[]>([]);
  const [showXiaoJiu, setShowXiaoJiu] = useState(false);
  // 成分镜（climax 后、小九出场前的三步：照对手 → 照另一个 NPC → 照自己）
  const [showMirror, setShowMirror] = useState(false);
  const [mirrorStep, setMirrorStep] = useState<number>(0);

  const advanceMirror = () => {
    if (mirrorStep < 2) {
      setMirrorStep(mirrorStep + 1);
    } else {
      setShowMirror(false);
      setShowXiaoJiu(true);
    }
  };

  const startDebate = () => {
    setDebateStep(1);
    setDebateLogs([
      { sender: 'boss', text: '"不妨想想，为什么要剪这份盆栽？"' }
    ]);
  };

  const handleDebateChoice = (optionType: 'wrong' | 'correct' | 'climax') => {
    if (debateStep === 1) {
      if (optionType === 'wrong') {
        setDebateLogs(prev => [
          ...prev,
          { sender: 'player', text: '为了去除杂质，留下纯粹的、本真的自我。' },
          { sender: 'boss', text: '...你确定这话是你自己想的，还是小学课本上《石头与雕像》教你的？你所谓的"本真"，有没有可能只是一个被灌输了三十年的默认设置？' }
        ]);
        setDebateStep(2);
      } else {
        setDebateLogs(prev => [
          ...prev,
          { sender: 'player', text: '不是为了去除杂质。是为了在乱七八糟的枝桠里，留一处不骗自己的地方。' },
          { sender: 'boss', text: '有点意思。但你有没有想过——你的审美、你的道德、你的理想，哪一样不是这个时代喂给你的？你怎么知道你"不骗自己"的那部分，不是另一层钢印？' }
        ]);
        setDebateStep(2);
      }
    } else if (debateStep === 2) {
      if (optionType === 'wrong') {
        setDebateLogs(prev => [
          ...prev,
          { sender: 'player', text: '大家都受外界影响，等于大家都没受影响。扯平了。' },
          { sender: 'boss', text: '扯不平。有的人被碾成小镇做题家的铅笔屑，有的人在互联网上长成了魅魔。每个人被印上的钢印完全不同。你连自己的钢印是什么成分都不知道，就敢说扯平？' }
        ]);
        setDebateStep(3);
      } else {
        setDebateLogs(prev => [
          ...prev,
          { sender: 'player', text: '我确实被烙上了时代的钢印。但零下四十度在车底下爬、被车轮甩了一脸泥、熬夜给新人写带教案——这些是我自己流的血。钢印是别人打的，伤疤是我自己的。' },
          { sender: 'boss', text: '...（顿了顿）有意思。你这个"第一人称"本身，有没有可能也是被训练出来的？你的不服输、你的硬扛、你所谓的"实践出真知"，是不是也是某种钢印？' }
        ]);
        setDebateStep(3);
      }
    } else if (debateStep === 3) {
      setDebateLogs(prev => [
        ...prev,
        { sender: 'player', text: '你说得都对。但我要停在这里了。——我来不是要赢这场辩论的，我是来告诉你：我已经选了。选了具体的人，选了泥水里的实践，选了哪怕是被钢印打过的、但属于我自己的伤疤。你拆得再漂亮，我还是要往前走。' },
        { sender: 'boss', text: '...（沉默了很久）\n\n原来如此。解构到最后，你选择的是不再需要解构了。不是因为解构不对，而是因为你决定去活。...这确实是解构无法战胜的东西。' }
      ]);

      setTimeout(() => {
        setShowMirror(true);
      }, 1500);
    }
  };
  const handleFinishDlc = () => {
    // Reward calculation
    const newPenetration = 50;
    const newResistance = 30;
    
    setCognitivePenetration(newPenetration);
    setNihilismResistance(newResistance);
    setHasWoolenWearAchievement(true);

    localStorage.setItem('dlc_cognitive_penetration', '50');
    localStorage.setItem('dlc_nihilism_resistance', '30');
    localStorage.setItem('dlc_woolen_wear_badge', 'true');
    localStorage.setItem('resonance_gold_solved', 'true'); // Retroactive clear the Gold Star!

    setCurrentAct(4);
    onComplete();
  };

  // Cartesian heart layout math formulas
  // Generate a neat string of points
  const points = Array.from({ length: 120 }, (_, i) => {
    const theta = (i / 119) * Math.PI * 2;
    const r = 32 * (1 - Math.sin(theta));
    return `${100 + r * Math.cos(theta)},${110 - r * Math.sin(theta)}`;
  }).join(' ');

  return (
    <div id="cognitive-dlc-container" className="bg-stone-900 border border-amber-500/30 rounded-2xl p-4.5 space-y-4 shadow-2xl overflow-hidden relative">
      
      {/* GLOWING AMBIENCE ACCENT */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-stone-850 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-spin-slow">🟡</span>
          <div>
            <span className="text-xs font-black text-amber-400 block tracking-tight">🎮 【金星ㆍ认知】核心补充DLC</span>
            <span className="text-[8px] font-mono font-bold text-stone-500 uppercase tracking-widest mt-0.5 block">盆栽、毛线与认知之茧 ㆍ 戏剧副本</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-stone-950 px-2 py-0.5 rounded border border-stone-850">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[7.5px] text-stone-400 uppercase font-mono font-bold tracking-wider">Mortal Mind Expansion v1.0</span>
        </div>
      </div>

      {/* --- INVENTORY DISPLAY PANEL --- */}
      {currentAct > 0 && currentAct < 4 && (
        <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-850 flex items-center justify-between">
          <span className="text-[8px] font-mono uppercase text-stone-500 font-extrabold flex items-center gap-1">
            <Layers className="w-2.5 h-2.5 text-stone-600" /> 背包法宝：
          </span>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all ${hasLighter ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-stone-900 text-stone-650'}`}>
              <Flame className="w-3 h-3" /> 打火机 {isLighterUsed && '(已点燃)'}
            </span>
            <span className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all ${hasEraser ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-stone-900 text-stone-650'}`}>
              <Eraser className="w-3 h-3" /> 万能橡皮擦
            </span>
            <span className={`px-2 py-1 rounded text-[9.5px] font-mono flex items-center gap-1 transition-all ${hasHammer ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-stone-900 text-stone-650'}`}>
              <Hammer className="w-3 h-3" /> 小小锤
            </span>
          </div>
        </div>
      )}

      {/* --- ACTUATOR FLOWS --- */}
      <AnimatePresence mode="wait">
        
        {/* ACT 0: INTRO SCREEN */}
        {currentAct === 0 && (
          <motion.div 
            key="act0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 text-center py-6"
          >
            <div className="flex justify-center">
              <div className="relative p-4 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse">
                <span className="text-4xl">🪴</span>
                <span className="absolute -bottom-1 -right-1 text-base animate-bounce">🧶</span>
              </div>
            </div>

            <div className="space-y-2 max-w-[325px] mx-auto">
              <h3 className="text-xs font-black text-stone-200 uppercase tracking-widest">思想钢印与认知之茧</h3>
              <p className="text-[10px] text-stone-400 leading-relaxed text-justify">
                每个人脑子里都有一层茧。它由你成长的环境、接受的观念、消费的文化一层层包裹而成。这个副本的任务不是把它撕掉——而是先看清它长什么样，再决定要不要把它织成一件能御寒的毛衣。
              </p>
            </div>

            <div className="flex gap-2.5 justify-center max-w-[280px] mx-auto pt-2">
              <button
                onClick={() => setCurrentAct(1)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-955 font-black py-2 rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>🚀 降落并激活金星 DLC 关卡</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {hasWoolenWearAchievement && (
              <div className="bg-stone-950 p-2.5 rounded-xl border border-amber-500/10 text-[9px] text-amber-300 font-mono inline-block">
                🏆 已获成就徽章：【未被穿透的毛线衣】 ㆍ 虚无抗性 100%
              </div>
            )}
          </motion.div>
        )}

        {/* ACT 1: GATES OF CARTESIAN LINE */}
        {currentAct === 1 && (
          <motion.div 
            key="act1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 relative">
              <span className="text-[8px] font-bold text-amber-500 block font-mono">第一幕：战争迷雾与"笛卡尔"心向线</span>
              <p className="text-[10px] text-stone-300 italic text-justify leading-relaxed mt-1">
                你进入关卡后，四周是一片白茫茫的、缺乏坐标与热度的虚空。没有地貌，只有蓝色的系统规划轨迹。
              </p>
              
              {/* CARTESIAN HEART PLOT */}
              <div className="flex justify-center py-4 bg-stone-900/40 rounded-xl border border-stone-850/65 mt-2.5 relative">
                <svg width="200" height="150" className="opacity-80">
                  {/* Grid lines */}
                  <line x1="100" y1="0" x2="100" y2="150" stroke="#333" strokeDasharray="3,3" />
                  <line x1="0" y1="75" x2="200" y2="75" stroke="#333" strokeDasharray="3,3" />
                  
                  {/* Cartesian Heart Curve */}
                  <polygon 
                    points={points} 
                    fill="none" 
                    stroke={smokingEffect ? "#ff0044" : "#10b981"} 
                    strokeWidth="1.5" 
                    strokeDasharray={smokingEffect ? "none" : "5,3"}
                    className={smokingEffect ? 'animate-ping' : ''}
                  />
                  {/* Cartesian Heart Math Indicator */}
                  <text x="110" y="25" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    r = a(1 - sinθ)
                  </text>
                </svg>
                
                {smokingEffect && (
                  <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center text-center p-3">
                    <span className="text-3xl animate-bounce">🌫️🌫️</span>
                    <p className="text-[10.5px] font-mono text-orange-400 font-extrabold mt-1.5 leading-snug animate-pulse">
                      系统指令：两根点起... 烟雾弥漫过载！系统进程崩塌！
                    </p>
                  </div>
                )}
              </div>
              
              <div className="text-[9px] text-stone-400 font-serif leading-normal italic text-center mt-2.5">
                【系统旁白】："正在为您拼贴最优解人生。瞧，这根笛卡尔心形线条正在精准地压迫你的气管。它提醒你，一颗标准符合出厂设置的公司制心脏，应该被修剪成何等得体的形状。"
              </div>
            </div>

            {/* THREE GATES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'A',
                  title: '门 A【三十岁退休】',
                  desc: '高薪延迟满足，极速燃烧折旧。',
                  conclude: '终点：坐吃山空，到站后找个坑把自己浅浅地埋了。'
                },
                {
                  id: 'B',
                  title: '门 B【经世致用】',
                  desc: '朝阳行业，升职加薪，相亲娶妻。',
                  conclude: '终点：成为极度规范且优雅降级的合格系统社会人。'
                },
                {
                  id: 'C',
                  title: '门 C【三千月薪赛博病】',
                  desc: '刚需避重，开发外包。',
                  conclude: '终点：开启码农烧烤与网暴狂欢等下班混沌副业。'
                }
              ].map((gate) => (
                <button
                  key={gate.id}
                  onClick={() => {
                    setSelectedGate(gate.id);
                    setGateWarning(`你选了一条路。系统就帮你把其他路全叉掉了。\n\n三条路，三个终点，其实指向同一个东西——被规划好的人生。你不是在选择，你是在被选择。\n\n现在你能动吗？不能。因为你已经是一个关掉了战争迷雾的玩家了，地图一览无余，但你哪儿也去不了。`);
                  }}
                  className={`p-3 text-left rounded-xl transition-all border outline-none select-none cursor-pointer flex flex-col justify-between ${
                    selectedGate === gate.id 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 scale-102 shadow' 
                      : 'bg-stone-950 hover:bg-stone-900 border-stone-850 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black block text-amber-500 uppercase font-mono tracking-wider mb-1">{gate.title}</span>
                    <p className="text-[9px] text-stone-300 leading-normal">{gate.desc}</p>
                  </div>
                  <p className="text-[8px] text-stone-500 mt-2 font-mono border-t border-stone-900 pt-1">{gate.conclude}</p>
                </button>
              ))}
            </div>

            {/* WARNING & UNLOCK ACTION */}
            {gateWarning && (
              <div className="bg-rose-950/20 border-2 border-rose-500/20 p-3 rounded-xl space-y-3 animate-pulse">
                <span className="text-[9px] text-rose-400 font-extrabold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  系统安全拦截触发：被降格的人机警告
                </span>
                <p className="text-[9.5px] text-stone-300 leading-relaxed text-justify italic">
                  "{gateWarning}"
                </p>
                
                {/* BACKPACK REBELLION KEY ACTION */}
                <div className="bg-stone-950 p-2 border border-stone-850 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-amber-500 font-bold block">💡 动不了？</span>
                    <p className="text-[9px] text-stone-400">试试背包里的东西。</p>
                  </div>
                  <button
                    onClick={() => {
                      setLighterUsed(true);
                      setSmokingEffect(true);
                      setTimeout(() => {
                        setSmokingEffect(false);
                        setGateWarning(null);
                        setSelectedGate(null);
                        // Advance to Act 2 with log overlay
                        setCurrentAct(2);
                      }, 2500);
                    }}
                    className="bg-orange-500 hover:bg-orange-400 font-black text-stone-955 text-[9.5px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>点两根并排抽。不写规划，改写日寄！</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ACT 2: RETRO CLASSROOM & REDUCTIONIST LOGICS */}
        {currentAct === 2 && (
          <motion.div 
            key="act2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-850">
              <span className="text-[8px] font-bold text-amber-400 block font-mono">第二幕：符号消消乐与碎裂的奥特曼</span>
              
              {/* SCROLLING MARQUEE ACCENTS */}
              <div className="bg-stone-900 border border-stone-850 p-1.5 rounded-lg text-[8px] font-mono text-stone-500 flex gap-2 overflow-hidden mt-1.5 relative">
                <span className="shrink-0 text-amber-500 font-black">【360安全浏览器一角】</span>
                <div className="animate-[scroll_12s_linear_infinite] whitespace-nowrap text-[9px] text-stone-400 flex gap-4 absolute left-32">
                  <span>📢 滚动播放：神曲《伤不起》正在后街热播中...</span>
                  <span>🔍 八卦精选：同桌妹妹正趴在课桌一角为《终极一班》大结局大哭</span>
                  <span>📟 2008 盛夏蝉鸣如暴雨洗刷乡村中学教室...</span>
                </div>
                <div className="h-3" /> {/* Spacer for absolute positioning layout stability */}
              </div>
            </div>

            {/* INTERACTIVE MINI PUZZLES STACK */}
            <div className="bg-stone-900 border border-stone-850 rounded-xl p-3.5 space-y-4">
              
              {/* MINI-GAME 1: ERASE THE ASSIGNMENTS */}
              <div className="space-y-2 border-b border-stone-850/60 pb-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-stone-300 font-black flex items-center gap-1">
                    <Eraser className="w-3.5 h-3.5 text-teal-400" />
                    课外消消乐一：消失的橡皮擦
                  </span>
                  <span className="text-[8px] font-mono text-stone-500">已清理/尝试: {wipedCount}/4</span>
                </div>
                <p className="text-[9px] text-stone-400 leading-normal">
                  试卷上布满由于大风和墨笔乱画的错漏污点，使用【万能橡皮擦】将其逐个擦除：
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {examPapers.map((paper) => {
                    const isWiped = wipeLogs.some(log => log.includes(paper.title) && !log.includes('无法'));
                    const isTriedAndFailed = wipeLogs.some(log => log.includes(paper.title) && log.includes('无法'));
                    return (
                      <button
                        key={paper.id}
                        disabled={isWiped}
                        onClick={() => {
                          setWipedCount(prev => prev + 1);
                          setWipeLogs(prev => [paper.log, ...prev]);
                        }}
                        className={`p-2.5 rounded-lg text-left border outline-none select-none transition-all text-[9.5px] relative ${
                          isWiped 
                            ? 'bg-teal-950/10 border-teal-500/30 text-teal-300 font-mono italic opacity-60' 
                            : isTriedAndFailed 
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' 
                            : 'bg-stone-950 hover:bg-stone-850 border-stone-850 hover:border-stone-700 text-stone-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold leading-none select-none block mb-1">📄 {paper.title}</span>
                        </div>
                        <span className="text-[7.5px] font-mono text-stone-500 uppercase tracking-widest leading-none block">
                          {isWiped ? '✓ 已抹除岁痕' : isTriedAndFailed ? '⚡ 错误持久化' : '点击擦除此过失'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Display logs of erasure */}
                {wipeLogs.length > 0 && (
                  <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-850 max-h-[80px] overflow-y-auto text-[8.5px] font-mono space-y-1 text-stone-400">
                    {wipeLogs.map((log, idx) => (
                      <div key={idx} className={log.includes('无法') ? 'text-rose-400 font-bold' : 'text-teal-400'}>
                        ▶ {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MINI-GAME 2: ULTRAMAN BROKEN IDOL */}
              <div className="space-y-2 border-b border-stone-850/60 pb-3">
                <span className="text-[10px] text-stone-300 font-black flex items-center gap-1">
                  <Hammer className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  课外消消乐二：碎裂的童年奥特曼结构
                </span>
                <p className="text-[9px] text-stone-400 leading-normal">
                  用你的【小锤锤】对着桌上的沙堆重击。双目紧闭，许愿并渴望它能凝聚成你儿时保护伞——红蓝相间的"泰罗奥特曼"。
                </p>

                <div className="flex gap-3.5 items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-850/60">
                  <div className="flex-1">
                    {!isSandPushed ? (
                      <span className="text-3xl select-none animate-bounce block">🏜️</span>
                    ) : isSandRevealed ? (
                      <span className="text-3xl select-none block">💨 🕳️</span>
                    ) : (
                      <span className="text-3xl select-none animate-ping block">🔨⏳</span>
                    )}
                    <span className="text-[8.5px] font-mono font-bold uppercase text-stone-500 tracking-wider">
                      {!isSandPushed ? '一堆略带湿气的温润黄沙' : isSandRevealed ? '一堆塌落的凡泥散沙' : '正在紧闭双眼合十发愿...'}
                    </span>
                  </div>

                  <button
                    disabled={isSandPushed}
                    onClick={() => {
                      setSandPushed(true);
                      setTimeout(() => {
                        setSandRevealed(true);
                      }, 1200);
                    }}
                    className="bg-rose-500 hover:bg-rose-400 text-stone-955 font-black text-[10px] px-3.5 py-2 rounded-xl transition-all outline-none flex items-center gap-1 disabled:opacity-40"
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    <span>敲击并闭眼许愿</span>
                  </button>
                </div>

                {isSandRevealed && (
                  <div className="p-2.5 bg-rose-500/5 border border-rose-500/15 rounded-lg text-[9.5px] leading-relaxed text-rose-300 font-mono text-justify">
                    🍂 <span className="font-bold underline">获得认知打击：</span>世界上根本就没有奥特曼。沙堆塌了。但你的手心碰到了泥沙——是被太阳暴晒过的，热的，真的。
                  </div>
                )}
              </div>

              {/* MINI-GAME 3: SYMBOL SEMANTIC HELIX */}
              <div className="space-y-2">
                <span className="text-[10px] text-stone-300 font-black flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  课外消消乐三：符号语义的网络异化
                </span>
                <p className="text-[9px] text-stone-400 leading-normal">
                  连线：将三个'初始纯洁词汇'通过'童年意境'，重新连结到它们在'后现代互联网'被恶作剧异化的结局中（全连对可破局）。
                </p>

                <div className="grid grid-cols-3 gap-2 text-center pt-1.5">
                  {/* Left Column */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-stone-500 font-extrabold uppercase tracking-wide block">初始词语</span>
                    {leftTerms.map(t => {
                      const complete = connectedPairs.some(p => p.left === t.text);
                      return (
                        <button
                          key={t.id}
                          disabled={complete}
                          onClick={() => handlePairSelection('left', t.id)}
                          className={`w-full p-2 text-[10px] font-black rounded-lg transition-all outlines-none border ${
                            complete 
                              ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-400' 
                              : selectedLeft === t.id 
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                              : 'bg-stone-950 hover:bg-stone-850 border-stone-850 text-stone-300'
                          }`}
                        >
                          {t.text}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mid Column */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-stone-500 font-extrabold uppercase tracking-wide block">童年记忆</span>
                    {midTerms.map(t => {
                      const complete = connectedPairs.some(p => p.mid === t.text);
                      return (
                        <button
                          key={t.id}
                          disabled={complete || !selectedLeft}
                          onClick={() => handlePairSelection('mid', t.id)}
                          className={`w-full p-2 text-[8px] rounded-lg transition-all outlines-none border min-h-[45px] leading-tight ${
                            complete 
                              ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400' 
                              : selectedMid === t.id 
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                              : 'bg-stone-950 hover:bg-stone-850 border-stone-850 text-stone-400'
                          }`}
                        >
                          {t.text}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-stone-500 font-extrabold uppercase tracking-wide block">今日异化</span>
                    {rightTerms.map(t => {
                      const complete = connectedPairs.some(p => p.right === t.text);
                      return (
                        <button
                          key={t.id}
                          disabled={complete || !selectedMid}
                          onClick={() => handlePairSelection('right', t.id)}
                          className={`w-full p-2 text-[8.5px] rounded-lg transition-all outlines-none border min-h-[45px] leading-tight ${
                            complete 
                              ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-stone-950 hover:bg-stone-850 border-stone-850 text-stone-400'
                          }`}
                        >
                          {t.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Display connected pairs */}
                {connectedPairs.length > 0 && (
                  <div className="bg-stone-950/80 p-2 rounded-xl border border-stone-850/60 mt-2 space-y-1 text-[8.5px] font-mono text-stone-400">
                    <span className="font-extrabold text-[8px] text-stone-500 block uppercase">🔗 语义连结日志:</span>
                    {connectedPairs.map((p, i) => (
                      <div key={i} className="text-emerald-400 flex items-center gap-1">
                        <span>✓</span>
                        <span className="font-bold underline">{p.left}</span>
                        <span>➔</span>
                        <span>{p.mid}</span>
                        <span>➔</span>
                        <span className="italic">{p.right}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* 成分对照墙 —— 同一把剪刀，每个人剪出的形状不同（vault 原文里被 DLC 软化的那段对照） */}
            {connectedPairs.length === 3 && isSandRevealed && (
              <div className="bg-stone-950 border-2 border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="border-b border-amber-500/15 pb-2">
                  <span className="text-[9px] font-extrabold text-amber-400 font-mono uppercase tracking-widest block">
                    🪞 同一把剪刀，每个人剪出的形状不同
                  </span>
                  <p className="text-[10px] text-stone-400 leading-relaxed text-justify mt-0.5">
                    词义会漂——但更扎心的是，同一把剪刀，落在不同人手里，剪出来的形状暴露了你是谁：
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-stone-900/60 border border-stone-850 rounded-lg p-2.5 space-y-1.5 text-center">
                    <span className="text-2xl block select-none">📚</span>
                    <span className="text-[9.5px] font-bold text-stone-300 block">小镇做题家</span>
                    <span className="text-[9px] text-stone-500 italic block leading-tight">
                      把 2B 铅笔
                      <br />
                      剪成了
                      <br />
                      <strong className="text-amber-400 not-italic">考试机器</strong>
                    </span>
                  </div>

                  <div className="bg-stone-900/60 border border-stone-850 rounded-lg p-2.5 space-y-1.5 text-center">
                    <span className="text-2xl block select-none">🦗</span>
                    <span className="text-[9.5px] font-bold text-stone-300 block">恶臭蝈蝻</span>
                    <span className="text-[9px] text-stone-500 italic block leading-tight">
                      把菊花
                      <br />
                      雕成了
                      <br />
                      <strong className="text-rose-400 not-italic">恶意</strong>
                    </span>
                  </div>

                  <div className="bg-stone-900/60 border border-stone-850 rounded-lg p-2.5 space-y-1.5 text-center">
                    <span className="text-2xl block select-none">🃏</span>
                    <span className="text-[9.5px] font-bold text-stone-300 block">乐子人</span>
                    <span className="text-[9px] text-stone-500 italic block leading-tight">
                      把魅魔
                      <br />
                      剪成了
                      <br />
                      <strong className="text-emerald-400 not-italic">符号货币</strong>
                    </span>
                  </div>
                </div>

                <div className="bg-stone-900/40 border border-stone-900 rounded-lg p-2.5 space-y-1">
                  <p className="text-[10.5px] text-stone-200 italic leading-relaxed text-justify font-mono">
                    🗒️ 千岑：每个人都剪过盆栽。但盆栽剪出来的形状，暴露了你是谁。
                  </p>
                  <p className="text-[10px] text-amber-300 italic leading-relaxed text-justify font-mono pt-1 border-t border-stone-900">
                    ——盆栽不是你的内心。盆栽是你的成分单。
                  </p>
                </div>
              </div>
            )}

            {/* ACT FINISHING TRIGGER */}
            {connectedPairs.length === 3 && isSandRevealed && (
              <button
                onClick={() => setCurrentAct(3)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-955 font-black py-2.5 rounded-xl text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow animate-bounce"
              >
                <span>破除语义幻象，进入第三幕：思想高地上的人神对决</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}

        {/* ACT 3: DEBATE WITH DECONSTRUCTIVE PERSONA */}
        {currentAct === 3 && (
          <motion.div 
            key="act3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 flex gap-4 items-center">
              <span className="text-4xl animate-pulse shrink-0 select-none">🪴</span>
              <div>
                <span className="text-[8px] font-bold text-amber-500 block font-mono">第三幕（终局）：盆栽与剪刀</span>
                <p className="text-[10px] text-stone-300 leading-relaxed text-justify italic mt-0.5">
                  正中浮现一盆静默的盆栽。对面坐着一个人——不是别人，是你自己脑子里的那个声音：<strong>【解构主义人格】</strong>。他手持剪刀，语气平静。他说的每句话，你都觉得有道理。这才是他最危险的地方。
                </p>
              </div>
            </div>

            {/* MAIN DEBATE BOX */}
            <div className="bg-stone-900 border border-stone-850 p-4 rounded-2xl relative space-y-4 min-h-[180px] shadow-xl">
              {debateStep === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <p className="text-[10.5px] italic text-stone-400 text-center text-justify max-w-[280px]">
                    本辩论共分三轮。对方不是敌人——是你自己的另一面。他说的每句话，你都会觉得有道理。
                  </p>
                  <button
                    onClick={startDebate}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-955 font-black text-xs px-5 py-2 rounded-xl active:scale-95 transition-all outline-none"
                  >
                    ⚔️ 执剑！开始思想答辩对决
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Dialogue Logs */}
                  <div className="max-h-[140px] overflow-y-auto space-y-2.5 pr-1 font-sans">
                    {debateLogs.map((log, idx) => (
                      <div 
                        key={idx}
                        className={`flex gap-2 items-start ${log.sender === 'player' ? 'flex-row-reverse text-right' : 'text-left'}`}
                      >
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                          log.sender === 'player' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-stone-950 border-stone-850'
                        }`}>
                          {log.sender === 'player' ? '👤' : '👓'}
                        </div>
                        <div className={`p-2 rounded-xl text-[10px] text-justify leading-relaxed max-w-[80%] border ${
                          log.sender === 'player' 
                            ? 'bg-amber-500/10 border-amber-500/25 text-amber-200 rounded-tr-none' 
                            : 'bg-stone-950 border-stone-850 text-stone-300 rounded-tl-none font-mono'
                        }`}>
                          {log.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTIVE CHOICES FOR CURRENT TURN */}
                  {!showXiaoJiu && (
                    <div className="border-t border-stone-850 pt-3 space-y-2.5">
                      <span className="text-[8.5px] font-mono text-stone-500 uppercase tracking-widest block font-extrabold">你的回应：</span>
                      
                      {debateStep === 1 && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleDebateChoice('wrong')}
                            className="text-left w-full p-2 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-850 hover:border-stone-700 text-[10px] text-stone-300 transition-all cursor-pointer active:scale-99"
                          >
                            🅰️ 为了去除杂质，留下纯粹的、本真的自我。
                          </button>
                          <button
                            onClick={() => handleDebateChoice('correct')}
                            className="text-left w-full p-2 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-850 hover:border-amber-500/30 text-[10px] text-stone-300 transition-all cursor-pointer active:scale-99"
                          >
                            🅱️ 不是为了去除杂质。是为了在乱七八糟的枝桠里，留一处不骗自己的地方。 (💡 实践立场)
                          </button>
                        </div>
                      )}

                      {debateStep === 2 && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleDebateChoice('wrong')}
                            className="text-left w-full p-2 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-850 hover:border-stone-700 text-[10px] text-stone-300 transition-all cursor-pointer active:scale-99"
                          >
                            🅰️ 大家都受外界影响，等于大家都没受影响。扯平了。
                          </button>
                          <button
                            onClick={() => handleDebateChoice('correct')}
                            className="text-left w-full p-2 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-850 hover:border-amber-500/30 text-[10px] text-stone-300 transition-all cursor-pointer active:scale-99"
                          >
                            🅱️ 我确实被烙上了钢印。但零下四十度在车底下爬、被车轮甩泥、熬夜写带教案——这些是我自己流的血。钢印是别人打的，伤疤是我自己的。 (💡 第一人称)
                          </button>
                        </div>
                      )}

                      {debateStep === 3 && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleDebateChoice('climax')}
                            className="text-left w-full p-2 rounded-xl border border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-[10px] text-amber-200 transition-all cursor-pointer font-black animate-pulse"
                          >
                            ⚔️ 你说得都对。但我不辩了。——我已经选了。
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 成分镜 —— climax 选完后、小九出场前的中间桥段 */}
            {showMirror && !showXiaoJiu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-stone-950 border-2 border-amber-500/30 p-4 rounded-2xl space-y-3 shadow-md"
              >
                <div className="border-b border-amber-500/15 pb-2 flex items-start gap-2.5">
                  <span className="text-2xl select-none shrink-0">🪞</span>
                  <div className="flex-1">
                    <span className="text-[9px] font-extrabold text-amber-400 font-mono uppercase tracking-widest block">
                      成分镜 ㆍ {mirrorStep === 0 ? '照对手' : mirrorStep === 1 ? '照另一个 NPC' : '照自己'}
                    </span>
                    <p className="text-[10px] text-stone-400 leading-relaxed mt-0.5 italic">
                      {mirrorStep === 0 &&
                        '辩论结束后，他从盆栽底下递过来一面镜子。"先照照我——看看我是什么做的。"'}
                      {mirrorStep === 1 &&
                        '挺好玩。再照一个——刚才 Act 1 三门里那个走"经世致用"的 NPC。'}
                      {mirrorStep === 2 && '......接下来呢？镜子转向你自己。'}
                    </p>
                  </div>
                </div>

                {/* 镜中成分 */}
                <div className="bg-stone-900/40 border border-stone-900 rounded-lg p-3 space-y-1.5 font-mono text-[10px]">
                  {mirrorStep === 0 && (
                    <>
                      <div className="flex justify-between text-stone-300">
                        <span>📚 学院派话术</span>
                        <span className="text-amber-400 font-bold">70%</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>🎲 抖机灵</span>
                        <span className="text-amber-400 font-bold">15%</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>📜 二手存在主义</span>
                        <span className="text-amber-400 font-bold">10%</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>🎸 摇滚乐 (Sonic Youth)</span>
                        <span className="text-amber-400 font-bold">5%</span>
                      </div>
                    </>
                  )}

                  {mirrorStep === 1 && (
                    <>
                      <div className="flex justify-between text-stone-300">
                        <span>🪪 父辈期待</span>
                        <span className="text-amber-400 font-bold">60%</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>📝 高考志愿表</span>
                        <span className="text-amber-400 font-bold">20%</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>💼 LinkedIn 头像</span>
                        <span className="text-amber-400 font-bold">15%</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>📅 朋友圈年终总结</span>
                        <span className="text-amber-400 font-bold">5%</span>
                      </div>
                    </>
                  )}

                  {mirrorStep === 2 && (
                    <div className="max-h-[200px] overflow-y-auto space-y-1.5 pr-1">
                      {[
                        ['⚙️ 自动驾驶冗余系统', '15%'],
                        ['📖 老陀的"爱具体的人"', '12%'],
                        ['📕 《实践论》读到第三遍那次', '10%'],
                        ['❄️ 黑河冰雪路试零下 40 度', '9%'],
                        ['🌠 小学夏天那个流星雨 QQ', '8%'],
                        ['🔨 四年级听到的"心如钢铁"', '7%'],
                        ['🚿 惠州大平层热水澡那一刻', '6%'],
                        ['🪪 父亲第一次说"咱家小弟可了不得"', '5%'],
                        ['🐻 多洛特送信士兵的一人一熊', '4%'],
                        ['🍵 ±0.5°C 的茉莉花茶', '4%'],
                        ['👕 穿补丁校服的那个我', '3%'],
                        ['📺 孙楠和韩红在唱', '3%'],
                        ['📓 备忘录里没敢发出去的"我们"', '3%'],
                        ['🌙 ……（继续滚动，永远不会停）', '——'],
                      ].map(([label, val], i) => (
                        <div
                          key={i}
                          className="flex justify-between text-stone-300 animate-[fadeIn_0.3s_ease_1]"
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          <span className="truncate pr-2">{label}</span>
                          <span className="text-amber-400 font-bold shrink-0">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 千岑独白 —— 仅最后一步 */}
                {mirrorStep === 2 && (
                  <div className="bg-stone-900/40 border border-stone-900 rounded-lg p-3 font-mono text-[10.5px] text-stone-200 leading-relaxed text-justify space-y-2">
                    <p className="italic">
                      🗒️ 千岑：我以为我能挑出"真正的我"——其实我看到的只是一份成分表。
                    </p>
                    <p className="text-amber-300 not-italic pt-1.5 border-t border-stone-900 font-bold">
                      但成分表不是讨债清单——是肖像画。
                    </p>
                    <p className="italic">
                      我不能也不必撕掉任何一行。我只需要知道：哪些是我选择留下的，哪些是被风吹进来的。
                    </p>
                  </div>
                )}

                <button
                  onClick={advanceMirror}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-955 font-black rounded-xl text-[10.5px] cursor-pointer active:scale-99 transition-all"
                >
                  {mirrorStep === 0
                    ? '🪞 挺好玩，再照一个'
                    : mirrorStep === 1
                    ? '🪞 接下来呢？'
                    : '✓ 我看清了 → 召唤小九'}
                </button>
              </motion.div>
            )}

            {/* XIAO JIU COMES IN */}
            {showXiaoJiu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-stone-950 border border-amber-500/30 p-3.5 rounded-xl space-y-2.5 relative"
              >
                <div className="absolute top-2 right-3 flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5">
                  <span className="text-xl">🦊</span>
                  <span className="text-[7.5px] text-amber-400 font-mono font-bold uppercase tracking-wider">灵狐小九</span>
                </div>
                
                <span className="text-[8.5px] font-mono text-stone-500 uppercase tracking-widest block font-bold mt-1"></span>
                
                <div className="text-[11px] leading-relaxed text-stone-300 text-justify italic">
                  "你们俩争了这么久，结论就是——脑子确实会长茧。行。

那我拿这些茧纺线去，给千岑织条毛裤。冬天深圳虽然不冷，但他心里冷。"
                </div>

                <div className="border-t border-stone-850 pt-2.5 flex justify-end">
                  <button
                    onClick={handleFinishDlc}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-955 font-black text-xs px-4 py-2 rounded-xl hover:from-amber-400 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>🎯 收起毛裤以温热大度征服虚无 (领取特典奖励)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ACT 4: CLEAR SCREEN WITH REWARDS */}
        {currentAct === 4 && (
          <motion.div 
            key="act4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 text-center py-4"
          >
            <div className="flex justify-center flex-col items-center gap-2">
              <div className="p-3 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full animate-bounce">
                <Award className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">金星 ㆍ 认知补全核心补充 DLC 完美合拢！</h3>
              <p className="text-[9.5px] text-stone-400 max-w-[300px]">
                千岑完成了这趟认知副本。看清了茧，但没有被困在里面——反而把它纺成了能御寒的毛线。
              </p>
            </div>

            {/* STATS INCREASE */}
            <div className="bg-stone-950 p-4.5 rounded-2xl border border-stone-850 max-w-[320px] mx-auto space-y-3">
              <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest block font-extrabold border-b border-stone-900 pb-1.5">★ 心智终极数值进化增幅 ★</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-bold">🧠 【认知穿透】 (Insight)</span>
                <span className="text-emerald-400 font-mono font-black animate-pulse">+{cognitivePenetration}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-bold">🛡️ 【虚无抗性】 (Nihilis-Resis)</span>
                <span className="text-emerald-400 font-mono font-black animate-pulse">+{nihilismResistance}</span>
              </div>
              
              {/* HIDDEN BADGE REVEAL */}
              <div className="bg-amber-500/5 border border-amber-500/25 p-3 rounded-xl mt-3 text-left relative overflow-hidden">
                <div className="absolute top-1 right-2 text-xl select-none opacity-20">🧶</div>
                <span className="text-[10px] text-amber-400 font-black flex items-center gap-1.5">
                  🛡️ 获得隐藏成就徽章：【未被穿透的毛线衣】
                </span>
                <p className="text-[8.5px] text-stone-300 mt-1.5 leading-relaxed text-justify italic">
                  "虽然心智混乱交织得像拉扯不断的一团乱七八糟的毛线，但已经无所属、无畏惧。你要永远记得 —— 虽然风大天也冷，但是穿上这毛衣，心里就会无比温热安全。"
                </p>
              </div>
            </div>

            <button
              onClick={handleResetDLC}
              className="bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-stone-700 text-[10px] font-mono text-stone-400 px-4 py-1.5 rounded-xl transition-all"
            >
              🔄 重新体验本幕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
