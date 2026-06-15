import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Shield, BookOpen, AlertCircle, RefreshCw, X, HelpCircle } from 'lucide-react';

interface Fragment {
  id: string;
  icon: string;
  name: string;
  phrase: string;
  category: string;
  originPlanet: 'red' | 'blue' | 'gold';
  story: string;
  details: string;
}

const FRAGMENT_DATABASE: Fragment[] = [
  // Red planet (Emotion)
  {
    id: 'meteor_shower',
    icon: '🌠',
    name: '流星雨的微语',
    phrase: '“算了，下次吧。”',
    category: '情感之茧',
    originPlanet: 'red',
    story: '2010年夏夜，流星掠过。傲慢的第三人称自保防御，推托了看星星的邀约：『算了，下次吧。』',
    details: '这句简短的回绝是自卫的第一块砖。你以为你只是在避开一节麻烦的交往，其实是开始将自我上锁。'
  },
  {
    id: 'soul_girl',
    icon: '🌸',
    name: '远方书友的寄信歌单',
    phrase: '“再等等。”',
    category: '情感之茧',
    originPlanet: 'red',
    story: '2020盛夏，手抄格桑花、隔屏特藏检索的心灵女孩。对亲密摩擦恐惧使大坝闭锁。你轻叹：『再等等。』',
    details: '‘等’是一个最得体的伪装。我们在虚假的等待里，看着花儿慢慢凋谢，然后耸耸肩膀，说这就是无常。'
  },
  {
    id: 'relationship_2024',
    icon: '💔',
    name: '2024关系的疤痕',
    phrase: '“解盔涉险。”',
    category: '情感之茧',
    originPlanet: 'red',
    story: '2024年，彻底撕碎安全玻璃，敞着血肉真心去痛、去牵绊。虽然风暴掠过，却第一次真切听见自己的心跳。',
    details: '不再隔岸观火。纵被撕扯得遍体鳞伤，那种带血的刺痛和自省，却证明你作为一个活物，还在高频共振。'
  },

  // Blue planet (Action)
  {
    id: 'gesture_summon',
    icon: '🖐️',
    name: '手势召唤采样',
    phrase: '“不断试错。”',
    category: '实践之茧',
    originPlanet: 'blue',
    story: '2023年线控底盘与APA开发，在凌晨三点的测试场，盯着5Hz传感器噪音反复折腾与回退防御。',
    details: '完美的代码不长在电脑屏幕上。在成百上千次“重构-崩坏-再跑通”里得到的硬度，构成了功能安全的Fail-safe底线。'
  },
  {
    id: 'knowledge_radar',
    icon: '📡',
    name: '知识雷达图谱',
    phrase: '“创造。”',
    category: '实践之茧',
    originPlanet: 'blue',
    story: '2025年，重构ComfyUI流体节点连线，把枯燥的算法转成有触感的创作机器。',
    details: '不要寄生在大众的风口叙事里，也不在完美的思想沙盒中坐而论道。扎紧自己的竹筏，动手往这粗糙的世界抛出火种。'
  },
  {
    id: 'mentor_doc',
    icon: '🤝',
    name: '带教外部战友',
    phrase: '“带教新人。”',
    category: '实践之茧',
    originPlanet: 'blue',
    story: '2025车规白夜，无保留整理极寒教案渡新人、深夜扒底盘。用温存把零和算盘转化为并肩血肉。',
    details: '多算计一分，世界便冷一分；能渡过一人，便点亮一处篝火。你终于知道，“我们”这个词，比“自己”更稳、更深健。'
  },

  // Gold planet (Wisdom/Cognition)
  {
    id: 'gap_year',
    icon: '🍃',
    name: 'Gap Year的独白',
    phrase: '“还没准备好。”',
    category: '认知之茧',
    originPlanet: 'gold',
    story: '大半年无考核的旷野。在书架与浪汐间深呼吸。你对那个追赶成功的塞博社会说：『还没准备好。』',
    details: '承认‘没完成’，反倒推开了真实的虚空。这是你白净简历上的裂缝，更是你最厚实饱满的黄金矿藏。'
  },
  {
    id: 'dream_red_chamber',
    icon: '🥀',
    name: '红楼情根书墨',
    phrase: '“执念。”',
    category: '认知之茧',
    originPlanet: 'gold',
    story: '读红楼如看白雪大荒。看穿世俗一切虚设估价与利益纠缠，见相非相，独留猩红“情根”在泥土交缠。',
    details: '情根是没有理智收益的。可是在被大厂坐标、KPI算盘归一统辖的冷酷塞博时代，它是唯一能让我们不气干、不沦为废铁的花蕊。'
  },
  {
    id: 'dostoevsky',
    icon: '📖',
    name: '卡拉马佐夫苦修',
    phrase: '“孤独。”',
    category: '认知之茧',
    originPlanet: 'gold',
    story: '一年苦读陀氏。看穿神圣高尚的高台黑板，抱起德米特里和阿尔沙的泪，去具体爱一个普通人人。',
    details: '伊万爱‘全人类’，对具体的人却报以厌恶和逃避。你踩在街头大口吃麻辣烫时，终于解下了看透世界真相的伪圣傲骨。'
  },
  {
    id: 'practice_unity',
    icon: '🔥',
    name: '实践论顿悟',
    phrase: '“下水捞鱼。”',
    category: '认知之茧',
    originPlanet: 'gold',
    story: '毛泽东《实践论》的大无畏战意。放弃在岸边高悬脑算，穿着湿鞋、赤着脚到生活的江海泥水里扑击。',
    details: '推演一万次完美，不如狠狠扔出一颗带痛的火石。任何理论上的隔离高地都会氧化生锈，只有去摩擦、去受伤、去真干，矛盾才会转化。'
  }
];

interface Resonance {
  id: string;
  name: string;
  icon: string;
  description: string;
  story: string;
  comment: string;
  nodes: string[]; // required Fragment IDs
}

const RESONANCE_FORMULAS: Resonance[] = [
  {
    id: 'escape',
    name: '隐藏回响 ㆍ 【逃跑】',
    icon: '🚪',
    description: '审视被你的理性防护遮蔽起来的真实自我规律。',
    story: '原来这些年，你说的是同一句话。',
    comment: '2010年流星在夜里静悬降落，你推托傲慢，留下一句『算了，下次吧』；\n2020年盛夏懂你的远方书友，你害怕纠缠自损防御，推开并微叹『再等等』；\n旷野空白、大半年简历留空的大浪前，你躲进反思的书阁，喃喃『还没准备好』……\n\n其实那些完美而严苛的“脑力一骑绝尘”与“优雅功能安全”，不过是你在漫漫人生路里，一次次练习【逃跑】的体面注脚。\n因为怕无法控制局势，我们宁可永远在起点打转。',
    nodes: ['meteor_shower', 'soul_girl', 'gap_year']
  },
  {
    id: 'waiting',
    name: '隐藏回响 ㆍ 《等》',
    icon: '⏳',
    description: '看穿在重重ASIL优雅安全降级背后的等待姿态。',
    story: '你似乎一直在等。',
    comment: '等一颗终会坠入地表、看破天荒的荒原流星，\n等着高频波形毫秒对齐、过滤故障的自动泊车数据，\n等着大雪茫漫、猩红“情根”交缠、全然不计利益自变量的那个红楼契机。\n你在你的生命引擎里，写满了Fail-safe。一有异常风吹，立马退让到隔绝、绝对自省的安全落锁区域。\n你一直，在等待那个一万分安全的完美对齐。却不知完美是生活最大的腐蚀剂。',
    nodes: ['meteor_shower', 'gesture_summon', 'dream_red_chamber']
  },
  {
    id: 'stay',
    name: '隐藏回响 ㆍ 【留下】',
    icon: '🔥',
    description: '点亮内心深处的傲骨部族，生根踩地，痛快破局。',
    story: '这一章，你终于脱去面罩，决意留下。',
    comment: '在2024情感的磨折泥污里，你真实大哭大笑、第一视角痛切纠葛；\n在重工业泊车的极寒深夜中，你不计零和，把带教案本一字一页渡教合作新友；\n在《实践论》的大无畏感召下，你斩去那无用清玄，穿着泥鞋狠狠跳进凡尘世俗中捞鱼！\n你在关系里涉险、在群落里点起燃薪、在泥巴里交付产品……\n你不愿再退，不再逃跑。你决定在这个数据冰凉的塞博时代，自造竹筏、踩在大地上生根，具体地爱，真实地创造。',
    nodes: ['relationship_2024', 'mentor_doc', 'practice_unity']
  }
];

interface EchoSystemProps {
  starProgress: { red: boolean; blue: boolean; gold: boolean; central: boolean };
  discoveredResonances: string[];
  onResonanceComplete: (id: string) => void;
}

export default function EchoSystem({ starProgress, discoveredResonances, onResonanceComplete }: EchoSystemProps) {
  const [selectedFrags, setSelectedFrags] = useState<string[]>([]);
  const [examiningFrag, setExaminingFrag] = useState<Fragment | null>(null);
  const [activeOverlayResonance, setActiveOverlayResonance] = useState<Resonance | null>(null);
  const [resFail, setResFail] = useState(false);

  // Toggle selection of a memory shard
  const handleSelectFrag = (id: string, originPlanet: 'red' | 'blue' | 'gold') => {
    // Check if planet is completed
    if (!starProgress[originPlanet]) return;

    if (selectedFrags.includes(id)) {
      setSelectedFrags(prev => prev.filter(x => x !== id));
      setResFail(false);
    } else {
      if (selectedFrags.length >= 3) {
        setSelectedFrags(prev => [...prev.slice(1), id]);
      } else {
        setSelectedFrags(prev => [...prev, id]);
      }
      setResFail(false);
    }
  };

  // Run Synthesis in Astral Crucible
  const handleSynthesize = () => {
    if (selectedFrags.length !== 3) return;

    // Search matches in formulas
    const matched = RESONANCE_FORMULAS.find(formula => 
      formula.nodes.every(nodeId => selectedFrags.includes(nodeId))
    );

    if (matched) {
      // Trigger success resonance animation overlay
      setActiveOverlayResonance(matched);
      onResonanceComplete(matched.id);
      setSelectedFrags([]);
      setResFail(false);
    } else {
      setResFail(true);
      setTimeout(() => setResFail(false), 2000);
    }
  };

  // Helper colors
  const getPlanetTheme = (planet: 'red' | 'blue' | 'gold') => {
    switch (planet) {
      case 'red': return {
        border: 'border-red-500/30',
        text: 'text-red-400',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.2)]',
        bg: 'bg-red-950/20'
      };
      case 'blue': return {
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        glow: 'shadow-[0_0_12px_rgba(59,130,246,0.2)]',
        bg: 'bg-blue-950/20'
      };
      case 'gold': return {
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
        bg: 'bg-amber-950/20'
      };
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER STATEMENT */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-stone-850 p-4 rounded-2xl relative overflow-hidden flex flex-col gap-1.5 shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block leading-none">Personality Archaeology Board</span>
        <h2 className="text-base font-extrabold text-stone-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>回响系统 ㆍ 星图共鸣</span>
        </h2>
        <p className="text-[11px] text-stone-400 leading-relaxed text-justify mt-1">
          时光不仅是向前奔流的单向刻痕。那些散在三维主线的实践、创伤、退空与顿悟，实是不同时代的你在隔空互相对话。唤醒碎片，拖入中天进行共振，解锁隐藏的真实人格密码。
        </p>
      </div>

      {/* SECTION 1: ASTRAL CRUCIBLE (LENGJIN COUPLING) */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 flex flex-col items-center gap-3.5 relative overflow-hidden shadow-xl">
        <div className="absolute top-1.5 left-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[7.5px] uppercase font-mono font-bold text-stone-500">共鸣联链天盘 (Crucible Slots)</span>
        </div>

        {/* Selected nodes slots */}
        <div className="flex gap-4 items-center justify-center.5 mt-2.5 w-full">
          {[0, 1, 2].map(idx => {
            const fragId = selectedFrags[idx];
            const frag = fragId ? FRAGMENT_DATABASE.find(f => f.id === fragId) : null;
            const theme = frag ? getPlanetTheme(frag.originPlanet) : null;

            return (
              <div 
                key={idx}
                className={`w-14 h-14 rounded-full border flex flex-col items-center justify-center relative transition-all duration-350 ${
                  frag 
                    ? `${theme?.border} ${theme?.bg} ${theme?.glow} scale-102 cursor-pointer` 
                    : 'border-dashed border-stone-800 bg-stone-950/40 text-stone-700'
                }`}
                onClick={() => {
                  if (frag) {
                    setSelectedFrags(prev => prev.filter(x => x !== frag.id));
                  }
                }}
              >
                {frag ? (
                  <>
                    <span className="text-xl select-none">{frag.icon}</span>
                    <span className="text-[7.5px] font-extrabold text-stone-400 mt-1 block max-w-full truncate px-0.5">{frag.name}</span>
                    <span className="absolute -top-1 -right-1 bg-stone-950 text-stone-500 border border-stone-800 rounded-full w-4 h-4 flex items-center justify-center text-[7px] font-bold">✕</span>
                  </>
                ) : (
                  <span className="text-xs text-stone-700 font-mono">+{idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons / Feedback */}
        <div className="w-full flex gap-2 pt-1 border-t border-stone-850/40">
          <button 
            onClick={() => setSelectedFrags([])}
            disabled={selectedFrags.length === 0}
            className="p-1 px-3 border border-stone-850 rounded-lg text-[9.5px] font-bold text-stone-500 hover:text-stone-300 disabled:opacity-30 cursor-pointer hover:border-stone-750 shrink-0 transition-all"
          >
            清空星轨
          </button>

          <button
            onClick={handleSynthesize}
            disabled={selectedFrags.length !== 3}
            className={`flex-1 py-1 px-3 text-[10px] font-extrabold text-center rounded-lg transition-all flex items-center justify-center gap-1 ${
              selectedFrags.length === 3
                ? resFail 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30 animate-shake'
                  : 'bg-gradient-to-r from-rose-600 to-amber-500 text-stone-950 shadow-[0_0_12px_rgba(244,63,94,0.4)] cursor-pointer hover:scale-[1.02]'
                : 'bg-stone-950 hover:bg-stone-900 border border-stone-850 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{resFail ? '化学抵牾：星轨未见共鸣' : selectedFrags.length === 3 ? '组合共振 ㆍ 融融星能' : '请在下方选取三相碎片以共鸣'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: MEMORY FRAGMENTS DATABASE MAP */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-4 shadow-md">
        <div className="flex justify-between items-center border-b border-stone-850 pb-2">
          <span className="text-[10px] uppercase font-mono font-black text-rose-400 tracking-wider flex items-center gap-1 leading-none">
            <span>🪐</span> 心智之海，拾星落盘 (Frag Chest)
          </span>
          <span className="text-[8px] bg-stone-950 border border-stone-850 px-2 py-0.5 rounded text-stone-500 font-mono">
            {FRAGMENT_DATABASE.filter(f => starProgress[f.originPlanet]).length} / 10 唤醒
          </span>
        </div>

        {/* Interactive layout zones grouped by dimension */}
        <div className="space-y-4">
          
          {/* Group 1: Emotion Red (流星雨、远方女孩、2024关系) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-red-400 uppercase font-mono">情感之茧 Zone (Emotion)</span>
              <span className="text-[8px] text-stone-500">
                {starProgress.red ? '🟢 已唤醒' : '🔴 需攻破「红星连接」唤醒'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {FRAGMENT_DATABASE.filter(f => f.originPlanet === 'red').map(frag => {
                const isPlanetAwake = starProgress.red;
                const isSelected = selectedFrags.includes(frag.id);
                const theme = getPlanetTheme(frag.originPlanet);

                return (
                  <div 
                    key={frag.id}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between text-left select-none transition-all relative overflow-hidden ${
                      !isPlanetAwake
                        ? 'bg-stone-950/30 border-stone-850 text-stone-600 cursor-not-allowed opacity-50'
                        : isSelected
                          ? 'bg-red-500/10 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.25)] ring-1 ring-red-500/20 cursor-pointer transform scale-98'
                          : 'bg-stone-950 border-stone-850/70 hover:border-red-500/35 text-stone-300 cursor-pointer active:scale-97'
                    }`}
                    onClick={() => isPlanetAwake && handleSelectFrag(frag.id, frag.originPlanet)}
                  >
                    <div className="flex gap-2 items-start">
                      <span className="text-lg select-none shrink-0">{frag.icon}</span>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-extrabold text-stone-200 block truncate leading-none">{frag.name}</span>
                        <span className="text-[9.5px] italic text-red-300 block font-light truncate">{frag.phrase}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-stone-85% border-stone-850/40">
                      <span className="text-[8px] font-semibold text-stone-500 font-mono">{frag.category}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExaminingFrag(frag);
                        }}
                        className="text-[8px] text-stone-400 hover:text-stone-200 bg-stone-900 hover:bg-stone-850 px-1.5 py-0.5 rounded border border-stone-800"
                      >
                        批注
                      </button>
                    </div>

                    {!isPlanetAwake && (
                      <div className="absolute inset-x-0 bottom-0 top-0 bg-stone-950/75 flex items-center justify-center z-10 backdrop-blur-[0.5px]">
                        <span className="text-[8.5px] font-bold text-stone-500 flex items-center gap-1 font-mono">🔒 【未唤醒】</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group 2: Practice Blue (手势召唤、知识雷达、带教新人) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">实践之茧 Zone (Action)</span>
              <span className="text-[8px] text-stone-500">
                {starProgress.blue ? '🟢 已唤醒' : '🔴 需攻破「蓝星实践」唤醒'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {FRAGMENT_DATABASE.filter(f => f.originPlanet === 'blue').map(frag => {
                const isPlanetAwake = starProgress.blue;
                const isSelected = selectedFrags.includes(frag.id);

                return (
                  <div 
                    key={frag.id}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between text-left select-none transition-all relative overflow-hidden ${
                      !isPlanetAwake
                        ? 'bg-stone-950/30 border-stone-850 text-stone-600 cursor-not-allowed opacity-50'
                        : isSelected
                          ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/20 cursor-pointer transform scale-98'
                          : 'bg-stone-950 border-stone-850/70 hover:border-blue-500/35 text-stone-300 cursor-pointer active:scale-97'
                    }`}
                    onClick={() => isPlanetAwake && handleSelectFrag(frag.id, frag.originPlanet)}
                  >
                    <div className="flex gap-2 items-start">
                      <span className="text-lg select-none shrink-0">{frag.icon}</span>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-extrabold text-stone-200 block truncate leading-none">{frag.name}</span>
                        <span className="text-[9.5px] italic text-blue-300 block font-light truncate">{frag.phrase}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-stone-850/40">
                      <span className="text-[8px] font-semibold text-stone-500 font-mono">{frag.category}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExaminingFrag(frag);
                        }}
                        className="text-[8px] text-stone-400 hover:text-stone-200 bg-stone-900 hover:bg-stone-850 px-1.5 py-0.5 rounded border border-stone-800"
                      >
                        批注
                      </button>
                    </div>

                    {!isPlanetAwake && (
                      <div className="absolute inset-x-0 bottom-0 top-0 bg-stone-950/75 flex items-center justify-center z-10 backdrop-blur-[0.5px]">
                        <span className="text-[8.5px] font-bold text-stone-500 flex items-center gap-1 font-mono">🔒 【未唤醒】</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group 3: Wisdom/Cognition Gold (Gap Year、红楼、卡氏、实践论) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">认知之茧 Zone (Wisdom)</span>
              <span className="text-[8px] text-stone-500">
                {starProgress.gold ? '🟢 已唤醒' : '🔴 需攻破「金星认知」唤醒'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {FRAGMENT_DATABASE.filter(f => f.originPlanet === 'gold').map(frag => {
                const isPlanetAwake = starProgress.gold;
                const isSelected = selectedFrags.includes(frag.id);

                return (
                  <div 
                    key={frag.id}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between text-left select-none transition-all relative overflow-hidden ${
                      !isPlanetAwake
                        ? 'bg-stone-950/30 border-stone-850 text-stone-600 cursor-not-allowed opacity-50'
                        : isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20 cursor-pointer transform scale-98'
                          : 'bg-stone-950 border-stone-850/70 hover:border-amber-500/35 text-stone-300 cursor-pointer active:scale-97'
                    }`}
                    onClick={() => isPlanetAwake && handleSelectFrag(frag.id, frag.originPlanet)}
                  >
                    <div className="flex gap-2 items-start">
                      <span className="text-lg select-none shrink-0">{frag.icon}</span>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-extrabold text-stone-200 block truncate leading-none">{frag.name}</span>
                        <span className="text-[9.5px] italic text-amber-300 block font-light truncate">{frag.phrase}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-stone-850/40">
                      <span className="text-[8px] font-semibold text-stone-500 font-mono">{frag.category}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExaminingFrag(frag);
                        }}
                        className="text-[8px] text-stone-400 hover:text-stone-200 bg-stone-900 hover:bg-stone-850 px-1.5 py-0.5 rounded border border-stone-800"
                      >
                        批注
                      </button>
                    </div>

                    {!isPlanetAwake && (
                      <div className="absolute inset-x-0 bottom-0 top-0 bg-stone-950/75 flex items-center justify-center z-10 backdrop-blur-[0.5px]">
                        <span className="text-[8.5px] font-bold text-stone-500 flex items-center gap-1 font-mono">🔒 【未唤醒】</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: RESONANCE LEDGER LIST (DISCOVERED ONES) */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-3.5 shadow-md">
        <div className="border-b border-stone-850/60 pb-1.5">
          <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-widest block leading-none">📖 醒悟回响谱 (Resonances Found)</span>
          <p className="text-[9.5px] text-stone-500 mt-1">
            你通过星链合并激活出的隐藏灵魂剖白：点击重温能让头皮发麻的宿命叙事：
          </p>
        </div>

        {/* List discovered formulas */}
        <div className="space-y-2">
          {RESONANCE_FORMULAS.map(formula => {
            const isFound = discoveredResonances.includes(formula.id);

            return (
              <div 
                key={formula.id}
                className={`p-3 rounded-xl border relative transition-all flex items-center justify-between ${
                  isFound 
                    ? 'bg-stone-950 border-rose-500/20 hover:border-rose-500/40 cursor-pointer shadow-sm'
                    : 'bg-stone-950/20 border-dashed border-stone-850 text-stone-600 select-none'
                }`}
                onClick={() => isFound && setActiveOverlayResonance(formula)}
              >
                <div className="flex gap-2.5 items-center">
                  <span className={`text-2xl p-1 rounded-lg ${isFound ? 'bg-rose-500/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.15)]' : 'bg-stone-900 text-stone-700'}`}>
                    {isFound ? formula.icon : '❓'}
                  </span>
                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${isFound ? 'text-stone-200' : 'text-stone-600'}`}>
                      {isFound ? formula.name : '未知灵魂回声 (Empty Slot)'}
                    </h4>
                    <p className="text-[9px] text-stone-500 leading-none mt-1">
                      {isFound ? formula.story : '配方：合并三相特定的灵魂碎片解锁...'}
                    </p>
                  </div>
                </div>

                {isFound ? (
                  <span className="text-[9.5px] text-rose-400 font-bold font-mono shrink-0 animate-pulse bg-rose-500/5 px-2 py-0.5 rounded-full border border-rose-500/10">点墨 ㆍ 重温</span>
                ) : (
                  <span className="text-[8.5px] text-stone-700 font-mono italic shrink-0">🔒 锁定</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: EXAMINING INDIVIDUAL FRAGMENT METADATA */}
      <AnimatePresence>
        {examiningFrag && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setExaminingFrag(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-stone-850 pb-3">
                <span className="text-3xl bg-rose-500/10 p-2 rounded-xl text-rose-400">{examiningFrag.icon}</span>
                <div>
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-rose-500 font-mono">{examiningFrag.category} ㆍ 尘折回响</span>
                  <h3 className="text-sm font-bold text-stone-100 mt-1">{examiningFrag.name}</h3>
                  <p className="text-[10px] italic text-rose-300 leading-tight mt-0.5">{examiningFrag.phrase}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 block font-mono">记忆碎片史实</span>
                <p className="text-[11.5px] text-stone-300 leading-relaxed text-justify bg-stone-950 p-3 rounded-xl border border-stone-850/50">
                  {examiningFrag.story}
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 block font-mono">千岑的主观批注 📬</span>
                <p className="text-[11px] text-stone-400 leading-relaxed text-justify bg-stone-950 p-3 rounded-xl border border-l-2 border-stone-850/60 border-l-rose-500/50 italic font-light">
                  {examiningFrag.details}
                </p>
              </div>

              <button
                onClick={() => setExaminingFrag(null)}
                className="w-full py-1.5 bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-400 hover:text-stone-200 rounded-xl text-xs font-bold transition-all"
              >
                收回心鞘
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ASTRAL RESONANCE OVERLAY NARRATION CARD (HEAD NUMBING AWAKENING) */}
      <AnimatePresence>
        {activeOverlayResonance && (
          <div className="fixed inset-0 bg-stone-950/95 backdrop-blur-md z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-stone-900 border border-stone-800/80 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative text-center overflow-hidden"
            >
              {/* Star sparkles background decorations */}
              <div className="absolute top-0 inset-x-0 h-[220px] bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent blur-2xl pointer-events-none" />
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-rose-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-amber-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

              <button 
                onClick={() => setActiveOverlayResonance(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 outline-none z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 relative z-10 pt-4 flex flex-col items-center">
                <span className="text-6xl p-3 bg-gradient-to-b from-rose-500/10 to-amber-500/5 rounded-full border border-rose-500/20 text-rose-400 select-none drop-shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-[bounce_2s_infinite]">
                  {activeOverlayResonance.icon}
                </span>
                
                <div className="space-y-0.5 pt-2">
                  <span className="text-[9px] uppercase font-black tracking-widest text-amber-400 font-mono">CONST_SYNCHRONICITY OK</span>
                  <h3 className="text-base font-extrabold text-stone-100 tracking-tight">{activeOverlayResonance.name}</h3>
                </div>
              </div>

              {/* Narrator heart text (Numbing block) */}
              <div className="space-y-3 relative z-10 py-1">
                <div className="text-amber-300 font-bold font-serif text-sm tracking-wide text-center uppercase md:leading-relaxed">
                  {activeOverlayResonance.story}
                </div>

                <div className="bg-stone-950/90 border border-stone-850/80 p-4.5 rounded-2xl text-[11.5px] text-stone-300 text-justify leading-relaxed font-mono font-light shadow-inner max-h-[220px] overflow-y-auto whitespace-pre-line">
                  {activeOverlayResonance.comment}
                </div>
              </div>

              {/* Status footer button */}
              <button
                onClick={() => setActiveOverlayResonance(null)}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 text-stone-950 font-extrabold rounded-xl text-xs hover:from-rose-500 hover:to-amber-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-98 transition-all pointer-events-auto"
              >
                {activeOverlayResonance.id === 'stay' ? '🔥 终极人格觉醒 ㆍ 照亮四顾' : '收置内心星册'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
