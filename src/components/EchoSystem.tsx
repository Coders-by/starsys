import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

/**
 * 回响星图 ㆍ 把不相关的事连成同一句话
 *
 * 玩家从 11 个 fragment 池选 3 个进拼图区，命中 5 个公式之一就解锁回响。
 * 回响是"把这个人过去十几年里看似没关系的事件连成同一种模式"的元层洞察。
 *
 * user-centered 重构第二版（取代之前 vault 内部隐喻满屏的版本）：
 *   - 每个 fragment 加白话副标题（让访客 30 秒 get 到这是什么事）
 *   - details 改第三人称（"他/千岑"，避免"你"在不同语境切换造成困惑）
 *   - banner / section 标题 / 按钮 / overlay 全部去自造词
 *   - 加 1 个新 fragment（alt_self）+ 2 个新公式（mirror / text_mirror）
 *   - 加轻量提示系统：选 2 个之后第 3 候选 fragment 卡上浮 💫 提示
 *     —— 但仅在玩家解锁过 1 个回响后开启（保留初次摸索的纯净感）
 */

interface Fragment {
  id: string;
  icon: string;
  name: string;        // 诗化主标
  subtitle: string;    // 白话副标 —— 直接说这是什么事
  phrase: string;      // 一句话锚点
  category: string;
  originPlanet: 'red' | 'blue' | 'gold';
  story: string;       // 客观史实（普通话）
  details: string;     // 第三人称的反思（"他"/"千岑"）
}

const FRAGMENT_DATABASE: Fragment[] = [
  // 红星 / 情感
  {
    id: 'meteor_shower',
    icon: '🌠',
    name: '流星雨的 QQ 申请',
    subtitle: '小学夏夜，她说"今晚有流星，把我认作哥哥吧"——他装作没看到，叉掉了对话框',
    phrase: '"我假装没看到。"',
    category: '情感线',
    originPlanet: 'red',
    story: '小学的某个夏夜。家里的电脑刚来不久，他在和朋友打《魔兽争霸》。QQ 弹出来一个女孩说『今晚有流星，把我认作哥哥吧』。他在朋友面前装作没看到，叉掉了对话框。',
    details: '他事后追悔得无力——不是不喜欢她，是怕被朋友看穿他是个穿补丁校服的小偷。这是他自卫的第一块砖。',
  },
  {
    id: 'soul_girl',
    icon: '🌸',
    name: 'soul 上的图书馆员',
    subtitle: '2020 年疫情困乡下时，他在 soul 上遇到的女孩——理性像一堵透明的墙',
    phrase: '"我退后一步。"',
    category: '情感线',
    originPlanet: 'red',
    story: '2020 年疫情困乡下的夏天。他在 soul 上遇到一个想当图书馆员的女孩。她爱研究古董、想去西藏，住在成都。两人聊算法课大作业的"骑士救公主"，回溯、动态规划。期末忙起来时——他一星期没上线。再回去时她问起学车的事，他认真回了许多细节。她说，"好的好的，谢谢你。"',
    details: '他后来想明白：那一星期没上线是他自卫的标准动作。理性像一堵透明的墙——他用"认真回学车细节"代替了"我有点想念你"。',
  },
  {
    id: 'relationship_2024',
    icon: '🍵',
    name: '没尝的那杯茶',
    subtitle: '2024 深冬校友会之后，那段几乎可以发生、但终究没有的关系',
    phrase: '"还是不了。"',
    category: '情感线',
    originPlanet: 'red',
    story: '2024 深冬校友会签到处，她抬头那一眼。后来他们聊东南亚房产、聊 TIA 的歌、聊她想做的开店游戏。他买来同款茶，泡到 80°C 焖 30 秒，拍照发过去："要尝尝吗？"三小时后她回："还是不了。"烟花在外面响。对话框停在那杯没尝的茶。',
    details: '他翻译她分享的那首歌时，偷偷把"你独行"改成了"我们"——但他从来没告诉她。这不是失去，是从未发生。他用 ±0.5°C 的精度，把一个具体的人安全地放进了自己熟悉的刻度里。',
  },

  // 蓝星 / 实践
  {
    id: 'gesture_summon',
    icon: '🖐️',
    name: '手势召唤的 5Hz 噪音',
    subtitle: '自动驾驶实车日志的反复试错',
    phrase: '"再调一遍。"',
    category: '实践线',
    originPlanet: 'blue',
    story: '2023 年线控底盘开发，凌晨三点的测试场，盯着 5Hz 的传感器噪音反复调参，每一版崩坏后再跑一遍。',
    details: '完美的代码不长在屏幕上。在成百上千次"重构-崩坏-再跑通"里得到的硬度，是他对"工程"的真正定义。',
  },
  {
    id: 'knowledge_radar',
    icon: '📡',
    name: '知识雷达 + ComfyUI',
    subtitle: '把雷达 bug 调清、把节点连成创作机器',
    phrase: '"动手就能做。"',
    category: '实践线',
    originPlanet: 'blue',
    story: '2025 年他在重构 ComfyUI 的流体节点，把抽象的算法变成有手感的创作工具。',
    details: '他不再寄生在"风口叙事"或"完美思想沙盒"里坐而论道。扎紧自己的小竹筏，往粗糙的世界里扔火种。',
  },
  {
    id: 'mentor_doc',
    icon: '🤝',
    name: '给新人的带教文档',
    subtitle: '把极寒标定的经验毫无保留地交给合作团队的新人',
    phrase: '"我陪你调过去。"',
    category: '实践线',
    originPlanet: 'blue',
    story: '2025 年，他在车规交付节点最紧的时候，把整理过的极寒标定教案毫无保留地交给合作方新人，深夜陪他扒底盘。',
    details: '多算计一分，世界便冷一分。能渡一个人，就多点亮一处篝火。他终于知道，"我们"这个词比"自己"更稳。',
  },

  // 金星 / 认知
  {
    id: 'gap_year',
    icon: '🍃',
    name: '大半年的简历空白',
    subtitle: '离开主流路径的那大半年——书架与海浪',
    phrase: '"还没准备好。"',
    category: '认知线',
    originPlanet: 'gold',
    story: '大半年没考核的旷野期。在书架与海浪间深呼吸，他对"必须立刻找下家"的社会节奏说了一句"等等"。',
    details: '承认"我没完成"反倒推开了真实的虚空。这是他白净简历上的裂缝，也是他后来最厚实的那块矿藏。',
  },
  {
    id: 'dream_red_chamber',
    icon: '🥀',
    name: '红楼里的情根',
    subtitle: '高中读《红楼梦》读到痛哭的那年',
    phrase: '"情根。"',
    category: '认知线',
    originPlanet: 'gold',
    story: '高中读《红楼梦》如看大荒。看穿世俗的估价与利益缠斗，独留猩红"情根"在泥土里交缠。',
    details: '情根是没有理智收益的。但他后来发现——在 KPI、坐标、算盘统辖的世界里，正是这个"没用"的东西，让人不至于风干成废铁。',
  },
  {
    id: 'dostoevsky',
    icon: '📖',
    name: '卡拉马佐夫',
    subtitle: '苦读陀思妥耶夫斯基的那一年——爱具体的人胜过爱抽象的人类',
    phrase: '"爱具体的人。"',
    category: '认知线',
    originPlanet: 'gold',
    story: '一年苦读陀氏。看穿"爱全人类"那个高台，决定放下抽象，去爱面前一个具体普通的人。',
    details: '伊万爱"全人类"，对具体的人却报以厌恶和逃避。他踩在街头大口吃麻辣烫的那一刻，终于解下了"看透世界真相"的伪圣面具。',
  },
  {
    id: 'practice_unity',
    icon: '🔥',
    name: '实践论第三遍',
    subtitle: '重读毛泽东《实践论》——他放弃在岸边推演',
    phrase: '"下水捞鱼。"',
    category: '认知线',
    originPlanet: 'gold',
    story: '重读《实践论》第三遍。他放弃在岸边推演完美方案，决定穿着湿鞋、赤着脚下到生活的江海里去摸鱼。',
    details: '推演一万次完美，不如扔一颗带痛的火石。任何理论上的隔离高地都会氧化生锈——只有去摩擦、受伤、真干，矛盾才会转化。',
  },

  // 金星 / 认知（新增）
  {
    id: 'alt_self',
    icon: '🪞',
    name: '面试官里的另一个我',
    subtitle: '2025 年某次面试，对面坐的"专家"是没 gap 的那个我',
    phrase: '"走得很远，但已经不认识自己。"',
    category: '认知线',
    originPlanet: 'gold',
    story: '2025 年某次面试，对方反复提的几个题让他突然看见——如果当年没 gap、没离开，自己会变成怎样一个"技术专家"。他看不下去那个版本。',
    details: '镜像不是路标——是警告。他以为自己跟"那个版本"完全不同，其实只是少做了几个选择而已。',
  },
];

interface Resonance {
  id: string;
  name: string;
  icon: string;
  description: string;
  story: string;
  comment: string;
  nodes: string[];
}

const RESONANCE_FORMULAS: Resonance[] = [
  {
    id: 'escape',
    name: '回响 ㆍ 「跑」',
    icon: '🚪',
    description: '看清那些"理性的躲避"其实是同一个动作。',
    story: '原来这些年，他做的是同一个动作。',
    comment:
      '小学的夏夜，QQ 那头一个女孩说"今晚有流星"——他在朋友面前装作没看到，叉掉了对话框。\n\n2020 年疫情困乡下，soul 上遇到的图书馆员问起未来——他用一星期没上线代替了"我有点想念你"。\n\n大半年简历空白的旷野前——他对自己说"还没准备好"。\n\n三件事的"完美而严苛的理由"，其实都是同一个动作的体面版本。这不是怯懦——是他从小学就练熟的"应急策略，立刻逃离"。',
    nodes: ['meteor_shower', 'soul_girl', 'gap_year'],
  },
  {
    id: 'waiting',
    name: '回响 ㆍ 「等」',
    icon: '⏳',
    description: '看清"稳重"和"等待"，是同一个姿势的两面。',
    story: '他似乎一直在等。',
    comment:
      '等一颗终究会坠落的流星，\n等高频波形毫秒对齐、再没有故障的传感器数据，\n等大雪覆盖、利益清空、"情根"自己浮出来的某种纯粹时刻……\n\n他在自己的人生引擎里写满了"等"。一有异常风吹草动，就退到隔绝、自省的安全区。\n他一直在等那个一万分安全的完美对齐——却不知道，"完美"本身才是生活最大的腐蚀剂。',
    nodes: ['meteor_shower', 'gesture_summon', 'dream_red_chamber'],
  },
  {
    id: 'stay',
    name: '回响 ㆍ 「day 1」',
    icon: '🌱',
    description: '他开始想留下来——但还没真的留下。',
    story: '三件事让他第一次承认："真下场"是什么样子。',
    comment:
      '2024 深冬那杯没尝的茶，让他第一次承认：他用 ±0.5°C 的精度，把一段几乎可以发生的关系安全地放进了刻度里。\n\n2025 年合作团队的新人快崩溃时，他选了"今晚陪你调过去"——这是他第一次试着不躲，但他知道这只是 day 1。\n\n重读《实践论》第三遍，"下水捞鱼"四个字第一次没有被他归类成另一个抽象概念。\n\n他没赢这三件事的任何一件——但他第一次承认这些事比他更重要。\n\n这不是终点。这是 day 1。',
    nodes: ['relationship_2024', 'mentor_doc', 'practice_unity'],
  },
  {
    id: 'mirror',
    name: '回响 ㆍ 「另一个我」',
    icon: '🪞',
    description: '认出那条没走的路。',
    story: '他看见的"另一个自己"——是他没走的那条路。',
    comment:
      '2025 年面试桌的对面，是一个走了"主流路径"、没 gap、没离开的他。\n那个版本的他懂技术、懂行业、答题精准——但已经不认识自己最开始为什么出发了。\n\n他突然看见：所谓"自我"，不是天生的，是 N 个选择叠出来的形状。\n而 gap year 那大半年的空白，不是简历的裂缝——是他没让自己变成"那个版本"的代价。\n卡拉马佐夫读到第三遍那次他想明白：抽象的"成功人士"是个空壳，他宁可笨拙地爱具体的人。',
    nodes: ['alt_self', 'gap_year', 'dostoevsky'],
  },
  {
    id: 'text_mirror',
    name: '回响 ㆍ 「在书里认出自己」',
    icon: '📚',
    description: '同一种"被作者说中"的瞬间。',
    story: '读到某一句的时候，那一刻他愣住了——"我也是这样的人"。',
    comment:
      '红楼里的宝玉看穿世俗估价、独留情根的那一刻，\n卡拉马佐夫里"要爱具体的人胜过抽象的人类"那一句，\n《实践论》"下水捞鱼"四个字——\n\n这三本书没什么关系，写在不同的年代、不同的国度、不同的母语里。\n但他在每一本里都遇到过那种"突然被作者说中"的瞬间——心跳停一下，然后想：原来不是我一个人这样。\n伟大作品不是答案，是路标——给走到这条路上的人一个"我不是唯一一个这样想的"的回声。',
    nodes: ['dostoevsky', 'dream_red_chamber', 'practice_unity'],
  },
];

interface EchoSystemProps {
  starProgress: { red: boolean; blue: boolean; gold: boolean; central: boolean };
  discoveredResonances: string[];
  onResonanceComplete: (id: string) => void;
}

const getPlanetTheme = (planet: 'red' | 'blue' | 'gold') => {
  switch (planet) {
    case 'red':
      return {
        border: 'border-red-500/30',
        text: 'text-red-400',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.2)]',
        bg: 'bg-red-950/20',
        phraseText: 'text-red-300',
        selectedRing: 'ring-red-500/20',
        selectedShadow: 'shadow-[0_0_8px_rgba(239,68,68,0.25)]',
        selectedBorder: 'border-red-500',
        selectedBg: 'bg-red-500/10',
        hoverBorder: 'hover:border-red-500/35',
      };
    case 'blue':
      return {
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        glow: 'shadow-[0_0_12px_rgba(59,130,246,0.2)]',
        bg: 'bg-blue-950/20',
        phraseText: 'text-blue-300',
        selectedRing: 'ring-blue-500/20',
        selectedShadow: 'shadow-[0_0_8px_rgba(59,130,246,0.25)]',
        selectedBorder: 'border-blue-500',
        selectedBg: 'bg-blue-500/10',
        hoverBorder: 'hover:border-blue-500/35',
      };
    case 'gold':
      return {
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
        bg: 'bg-amber-950/20',
        phraseText: 'text-amber-300',
        selectedRing: 'ring-amber-500/20',
        selectedShadow: 'shadow-[0_0_8px_rgba(245,158,11,0.25)]',
        selectedBorder: 'border-amber-500',
        selectedBg: 'bg-amber-500/10',
        hoverBorder: 'hover:border-amber-500/35',
      };
  }
};

interface FragmentCardProps {
  key?: React.Key;
  frag: Fragment;
  isPlanetAwake: boolean;
  isSelected: boolean;
  isHinted: boolean;
  onSelect: () => void;
  onExamine: () => void;
}

function FragmentCard({ frag, isPlanetAwake, isSelected, isHinted, onSelect, onExamine }: FragmentCardProps) {
  const theme = getPlanetTheme(frag.originPlanet);

  return (
    <div
      className={`p-2.5 rounded-xl border flex flex-col justify-between text-left select-none transition-all relative overflow-hidden ${
        !isPlanetAwake
          ? 'bg-stone-950/30 border-stone-850 text-stone-600 cursor-not-allowed opacity-50'
          : isSelected
          ? `${theme.selectedBg} ${theme.selectedBorder} ${theme.selectedShadow} ring-1 ${theme.selectedRing} cursor-pointer transform scale-98`
          : `bg-stone-950 border-stone-850/70 ${theme.hoverBorder} text-stone-300 cursor-pointer active:scale-97`
      }`}
      onClick={() => isPlanetAwake && onSelect()}
    >
      {/* 提示 hint dot —— 选 2 个后第 3 候选会发光 */}
      {isHinted && isPlanetAwake && !isSelected && (
        <span
          className="absolute top-1 right-1 text-[12px] z-20 animate-pulse pointer-events-none"
          title="可能跟你已选的 2 个有共振"
        >
          💫
        </span>
      )}

      <div className="flex gap-2 items-start">
        <span className="text-lg select-none shrink-0">{frag.icon}</span>
        <div className="space-y-0.5 min-w-0 flex-1">
          <span className="text-[10px] font-extrabold text-stone-200 block leading-tight">{frag.name}</span>
          <span className="text-[8.5px] text-stone-500 block leading-snug">{frag.subtitle}</span>
          <span className={`text-[9.5px] italic ${theme.phraseText} block font-light truncate pt-0.5`}>{frag.phrase}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 pt-1 border-t border-stone-850/40">
        <span className="text-[8px] font-semibold text-stone-500 font-mono">{frag.category}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExamine();
          }}
          className="text-[8px] text-stone-400 hover:text-stone-200 bg-stone-900 hover:bg-stone-850 px-1.5 py-0.5 rounded border border-stone-800"
        >
          细看
        </button>
      </div>

      {!isPlanetAwake && (
        <div className="absolute inset-0 bg-stone-950/75 flex items-center justify-center z-10 backdrop-blur-[0.5px]">
          <span className="text-[8.5px] font-bold text-stone-500 flex items-center gap-1 font-mono">🔒 未唤醒</span>
        </div>
      )}
    </div>
  );
}

export default function EchoSystem({ starProgress, discoveredResonances, onResonanceComplete }: EchoSystemProps) {
  const [selectedFrags, setSelectedFrags] = useState<string[]>([]);
  const [examiningFrag, setExaminingFrag] = useState<Fragment | null>(null);
  const [activeOverlayResonance, setActiveOverlayResonance] = useState<Resonance | null>(null);
  const [resFail, setResFail] = useState(false);

  // 提示系统：选 2 个 fragment 后，找出"至少在某个公式里跟已选 2 个一起出现的"第 3 个 fragment
  // 仅在玩家解锁过 1 个回响后开启（保留初次摸索的纯净）
  const hintsEnabled = discoveredResonances.length >= 1;
  const hintedThirdIds = useMemo(() => {
    if (!hintsEnabled || selectedFrags.length !== 2) return new Set<string>();
    const hints = new Set<string>();
    for (const formula of RESONANCE_FORMULAS) {
      const matchCount = selectedFrags.filter((id) => formula.nodes.includes(id)).length;
      if (matchCount === 2) {
        formula.nodes.forEach((n) => {
          if (!selectedFrags.includes(n)) hints.add(n);
        });
      }
    }
    return hints;
  }, [hintsEnabled, selectedFrags]);

  const handleSelectFrag = (id: string, originPlanet: 'red' | 'blue' | 'gold') => {
    if (!starProgress[originPlanet]) return;
    if (selectedFrags.includes(id)) {
      setSelectedFrags((prev) => prev.filter((x) => x !== id));
      setResFail(false);
    } else {
      if (selectedFrags.length >= 3) {
        setSelectedFrags((prev) => [...prev.slice(1), id]);
      } else {
        setSelectedFrags((prev) => [...prev, id]);
      }
      setResFail(false);
    }
  };

  const handleSynthesize = () => {
    if (selectedFrags.length !== 3) return;
    const matched = RESONANCE_FORMULAS.find((formula) =>
      formula.nodes.every((nodeId) => selectedFrags.includes(nodeId)),
    );
    if (matched) {
      setActiveOverlayResonance(matched);
      onResonanceComplete(matched.id);
      setSelectedFrags([]);
      setResFail(false);
    } else {
      setResFail(true);
      setTimeout(() => setResFail(false), 2000);
    }
  };

  const awokenFragmentsCount = FRAGMENT_DATABASE.filter((f) => starProgress[f.originPlanet]).length;

  return (
    <div className="space-y-4">
      {/* HEADER —— 直接说这一关在干什么 */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-stone-850 p-4 rounded-2xl relative overflow-hidden flex flex-col gap-1.5 shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-base font-extrabold text-stone-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>🌌 回响星图 ㆍ 把不相关的事连成同一句话</span>
        </h2>
        <p className="text-[10.5px] text-stone-300 leading-relaxed text-justify mt-1">
          这一关在做什么：把这个人过去十几年里 N 个"看似没关系"的事件，3 个 3 个地组合起来。
        </p>
        <p className="text-[10.5px] text-stone-300 leading-relaxed text-justify">
          如果它们其实是同一种模式——会撞出"<strong className="text-rose-300">回响</strong>"。
        </p>
        <p className="text-[10px] text-stone-500 leading-relaxed text-justify mt-0.5">
          每解锁一个回响，你就更看清这个人是怎么循环的。一共 5 个回响，藏在 11 个片段的组合里。
        </p>
      </div>

      {/* SECTION 1: 拼图区 */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 flex flex-col items-center gap-3.5 relative overflow-hidden shadow-xl">
        <div className="absolute top-1.5 left-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[8px] uppercase font-mono font-bold text-stone-500">🔬 拼图区 ㆍ 把 3 个片段放进来试试</span>
        </div>

        <div className="flex gap-4 items-center justify-center mt-2.5 w-full">
          {[0, 1, 2].map((idx) => {
            const fragId = selectedFrags[idx];
            const frag = fragId ? FRAGMENT_DATABASE.find((f) => f.id === fragId) : null;
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
                    setSelectedFrags((prev) => prev.filter((x) => x !== frag.id));
                  }
                }}
              >
                {frag ? (
                  <>
                    <span className="text-xl select-none">{frag.icon}</span>
                    <span className="text-[7.5px] font-extrabold text-stone-400 mt-1 block max-w-full truncate px-0.5">
                      {frag.name}
                    </span>
                    <span className="absolute -top-1 -right-1 bg-stone-950 text-stone-500 border border-stone-800 rounded-full w-4 h-4 flex items-center justify-center text-[7px] font-bold">
                      ✕
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-stone-700 font-mono">+{idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full flex gap-2 pt-1 border-t border-stone-850/40">
          <button
            onClick={() => setSelectedFrags([])}
            disabled={selectedFrags.length === 0}
            className="p-1 px-3 border border-stone-850 rounded-lg text-[9.5px] font-bold text-stone-500 hover:text-stone-300 disabled:opacity-30 cursor-pointer hover:border-stone-750 shrink-0 transition-all"
          >
            重新选
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
            <span>
              {resFail
                ? '✗ 这 3 个没共振。再换一组试试。'
                : selectedFrags.length === 3
                ? '✨ 组合，看看会发生什么'
                : '请从下方挑 3 个片段放进拼图区'}
            </span>
          </button>
        </div>

        {/* 提示模式 hint banner */}
        {hintsEnabled && selectedFrags.length === 2 && hintedThirdIds.size > 0 && (
          <div className="w-full text-[9px] text-amber-400/90 italic font-mono text-center">
            💫 下面亮起的片段，跟你已选的 2 个可能是同组
          </div>
        )}
      </div>

      {/* SECTION 2: 片段池 */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-4 shadow-md">
        <div className="flex justify-between items-center border-b border-stone-850 pb-2">
          <span className="text-[10px] uppercase font-mono font-black text-rose-400 tracking-wider flex items-center gap-1 leading-none">
            <span>📜</span> 片段池 ㆍ 这 11 件事是从他过去十几年里挑出来的
          </span>
          <span className="text-[8px] bg-stone-950 border border-stone-850 px-2 py-0.5 rounded text-stone-500 font-mono">
            {awokenFragmentsCount} / {FRAGMENT_DATABASE.length} 唤醒
          </span>
        </div>

        <div className="space-y-4">
          {/* 红 / 情感线 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-red-400 uppercase font-mono">情感线</span>
              <span className="text-[8px] text-stone-500">
                {starProgress.red ? '🟢 已唤醒' : '🔴 需先打通「红星」'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FRAGMENT_DATABASE.filter((f) => f.originPlanet === 'red').map((frag) => (
                <FragmentCard
                  key={frag.id}
                  frag={frag}
                  isPlanetAwake={starProgress.red}
                  isSelected={selectedFrags.includes(frag.id)}
                  isHinted={hintedThirdIds.has(frag.id)}
                  onSelect={() => handleSelectFrag(frag.id, frag.originPlanet)}
                  onExamine={() => setExaminingFrag(frag)}
                />
              ))}
            </div>
          </div>

          {/* 蓝 / 实践线 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">实践线</span>
              <span className="text-[8px] text-stone-500">
                {starProgress.blue ? '🟢 已唤醒' : '🔴 需先打通「蓝星」'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FRAGMENT_DATABASE.filter((f) => f.originPlanet === 'blue').map((frag) => (
                <FragmentCard
                  key={frag.id}
                  frag={frag}
                  isPlanetAwake={starProgress.blue}
                  isSelected={selectedFrags.includes(frag.id)}
                  isHinted={hintedThirdIds.has(frag.id)}
                  onSelect={() => handleSelectFrag(frag.id, frag.originPlanet)}
                  onExamine={() => setExaminingFrag(frag)}
                />
              ))}
            </div>
          </div>

          {/* 金 / 认知线 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">认知线</span>
              <span className="text-[8px] text-stone-500">
                {starProgress.gold ? '🟢 已唤醒' : '🔴 需先打通「金星」'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FRAGMENT_DATABASE.filter((f) => f.originPlanet === 'gold').map((frag) => (
                <FragmentCard
                  key={frag.id}
                  frag={frag}
                  isPlanetAwake={starProgress.gold}
                  isSelected={selectedFrags.includes(frag.id)}
                  isHinted={hintedThirdIds.has(frag.id)}
                  onSelect={() => handleSelectFrag(frag.id, frag.originPlanet)}
                  onExamine={() => setExaminingFrag(frag)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: 已解锁回响 */}
      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-3.5 shadow-md">
        <div className="border-b border-stone-850/60 pb-1.5">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block leading-none">
            🗂️ 已解锁的回响（{discoveredResonances.length} / {RESONANCE_FORMULAS.length}）
          </span>
          <p className="text-[9.5px] text-stone-500 mt-1">
            点已解锁的条目可以重温。
            {!hintsEnabled && ' 解锁第 1 个之后，组合时会获得提示。'}
          </p>
        </div>

        <div className="space-y-2">
          {RESONANCE_FORMULAS.map((formula) => {
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
                  <span
                    className={`text-2xl p-1 rounded-lg ${
                      isFound
                        ? 'bg-rose-500/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.15)]'
                        : 'bg-stone-900 text-stone-700'
                    }`}
                  >
                    {isFound ? formula.icon : '❓'}
                  </span>
                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${isFound ? 'text-stone-200' : 'text-stone-600'}`}>
                      {isFound ? formula.name : '未解锁的回响'}
                    </h4>
                    <p className="text-[9px] text-stone-500 leading-snug mt-1">
                      {isFound ? formula.story : '挑 3 个片段试试组合，命中就解锁。'}
                    </p>
                  </div>
                </div>

                {isFound ? (
                  <span className="text-[9.5px] text-rose-400 font-bold font-mono shrink-0 bg-rose-500/5 px-2 py-0.5 rounded-full border border-rose-500/10">
                    重温
                  </span>
                ) : (
                  <span className="text-[8.5px] text-stone-700 font-mono italic shrink-0">🔒 锁定</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: 单 fragment 细看 */}
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
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-rose-500 font-mono">
                    {examiningFrag.category}
                  </span>
                  <h3 className="text-sm font-bold text-stone-100 mt-1">{examiningFrag.name}</h3>
                  <p className="text-[10px] text-stone-400 leading-tight mt-0.5">{examiningFrag.subtitle}</p>
                  <p className="text-[10px] italic text-rose-300 leading-tight mt-1">{examiningFrag.phrase}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 block font-mono">
                  事件
                </span>
                <p className="text-[11.5px] text-stone-300 leading-relaxed text-justify bg-stone-950 p-3 rounded-xl border border-stone-850/50">
                  {examiningFrag.story}
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 block font-mono">
                  千岑后来想明白的事
                </span>
                <p className="text-[11px] text-stone-400 leading-relaxed text-justify bg-stone-950 p-3 rounded-xl border border-l-2 border-stone-850/60 border-l-rose-500/50 italic font-light">
                  {examiningFrag.details}
                </p>
              </div>

              <button
                onClick={() => setExaminingFrag(null)}
                className="w-full py-1.5 bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-400 hover:text-stone-200 rounded-xl text-xs font-bold transition-all"
              >
                关上
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: 共鸣解锁/重温 overlay */}
      <AnimatePresence>
        {activeOverlayResonance && (
          <div className="fixed inset-0 bg-stone-950/95 backdrop-blur-md z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-stone-900 border border-stone-800/80 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative text-center overflow-hidden"
            >
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
                  <span className="text-[9px] uppercase font-black tracking-widest text-amber-400 font-mono">
                    回响命中
                  </span>
                  <h3 className="text-base font-extrabold text-stone-100 tracking-tight">{activeOverlayResonance.name}</h3>
                </div>
              </div>

              <div className="space-y-3 relative z-10 py-1">
                <div className="text-amber-300 font-bold text-[13px] tracking-wide text-center md:leading-relaxed">
                  {activeOverlayResonance.story}
                </div>

                <div className="bg-stone-950/90 border border-stone-850/80 p-4.5 rounded-2xl text-[11.5px] text-stone-300 text-justify leading-relaxed font-mono font-light shadow-inner max-h-[260px] overflow-y-auto whitespace-pre-line">
                  {activeOverlayResonance.comment}
                </div>
              </div>

              <button
                onClick={() => setActiveOverlayResonance(null)}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 text-stone-950 font-extrabold rounded-xl text-xs hover:from-rose-500 hover:to-amber-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-98 transition-all pointer-events-auto"
              >
                {activeOverlayResonance.id === 'stay' ? '🔥 收下这一刻' : '收起'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
