import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 金星亮了之后 ㆍ 又遇到的 2 个新问题
 *
 * user-centered 第三版：原 5 张精简到 3 张后，又把"三条河"挪去蓝星——
 * 因为"工作的本质是在卖什么"是实践线的次生悖论，不是认知线的悖论。
 *
 * 现在剩 2 张：
 *   I.  我以为我变了，但根没动过 ← 随想/2025-08-04.md（树/扎根）
 *   II. 我看穿了套路，但"看穿"本身又是套路 ← 随想/2025-07-31.md（地下室人/觉察的悖论）
 *
 * 三条河（"我到底在做哪种生意"）→ 见 BlueStarReflection.tsx
 *
 * 不触发新成就，不写 localStorage——探索状态只在 session 内。
 */

const CARD_IDS = ['tree', 'cage'] as const;
type CardId = (typeof CARD_IDS)[number];

interface CardState {
  expanded: boolean;
  interacted: boolean;
}

export default function GoldStarReflection() {
  const [cards, setCards] = useState<Record<CardId, CardState>>({
    tree: { expanded: false, interacted: false },
    cage: { expanded: false, interacted: false },
  });

  const toggle = (id: CardId) =>
    setCards((c) => ({ ...c, [id]: { ...c[id], expanded: !c[id].expanded } }));
  const markInteracted = (id: CardId) =>
    setCards((c) => ({ ...c, [id]: { ...c[id], interacted: true } }));

  const allInteracted = CARD_IDS.every((id) => cards[id].interacted);

  return (
    <div className="space-y-3 mt-4">
      <div className="border-t-2 border-amber-500/30 pt-4 space-y-2">
        <span className="text-[9px] font-extrabold text-amber-400 font-mono uppercase tracking-widest block">
          🌌 金星亮了之后 ㆍ 又遇到的 2 个新问题
        </span>
        <p className="text-[10.5px] text-stone-300 leading-relaxed text-justify">
          廿六岁的"我终于敢走上前去爱具体的、微小的生命"——是金星主线的终点。
        </p>
        <p className="text-[10.5px] text-stone-300 leading-relaxed text-justify">
          但写下这句话的那个人，下一秒又遇到了新问题。<strong className="text-amber-300">金星亮了，不是答案找到了——是你能继续问下一个问题了。</strong>
        </p>
        <p className="text-[10px] text-stone-500 leading-relaxed text-justify">
          下面是 2 个亮了之后才看见的"新坑"。可以一张一张展开看，不必都做完。
        </p>
        <p className="text-[9.5px] text-stone-600 leading-relaxed text-justify italic">
          ※ 还有第 3 个新坑（关于"你做的工作到底在卖什么"）和实践更直接相关，挪到了蓝星亮完之后。
        </p>
      </div>

      <TreeRootsCard
        expanded={cards.tree.expanded}
        onToggle={() => toggle('tree')}
        onInteract={() => markInteracted('tree')}
      />
      <AwarenessCageCard
        expanded={cards.cage.expanded}
        onToggle={() => toggle('cage')}
        onInteract={() => markInteracted('cage')}
      />

      <AnimatePresence>{allInteracted && <FinaleSection />}</AnimatePresence>
    </div>
  );
}

// ============================================================
// 共用 wrapper —— 折叠/展开 + 标题
// ============================================================

interface CardProps {
  icon: string;
  title: string;
  subtitle: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function ReflectionCard({ icon, title, subtitle, expanded, onToggle, children }: CardProps) {
  return (
    <div className="bg-stone-950 border border-stone-850 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-stone-900/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-left">
          <span className="text-lg select-none">{icon}</span>
          <div>
            <span className="text-[11px] font-bold text-amber-300 block leading-tight">{title}</span>
            <span className="text-[8.5px] text-stone-500 font-mono mt-0.5 block">{subtitle}</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-2 space-y-3 border-t border-stone-900">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlainOpening({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10.5px] text-stone-300 leading-relaxed text-justify bg-stone-900/30 p-2.5 rounded-lg border-l-2 border-amber-500/30">
      {children}
    </p>
  );
}

function MonologueBox({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10.5px] text-stone-300 italic leading-relaxed text-justify font-mono bg-stone-900/40 p-2.5 rounded-lg border border-stone-900">
      🗒️ 千岑：{children}
    </p>
  );
}

// ============================================================
// 卡 1：我以为我变了，但根没动过
// ============================================================

interface CardSubProps {
  expanded: boolean;
  onToggle: () => void;
  onInteract: () => void;
}

function TreeRootsCard({ expanded, onToggle, onInteract }: CardSubProps) {
  const [pruned, setPruned] = useState<boolean[]>([false, false, false, false]);

  const prune = (i: number) => {
    setPruned((p) => p.map((v, idx) => (idx === i ? true : v)));
    onInteract();
  };

  const allPruned = pruned.every(Boolean);

  return (
    <ReflectionCard
      icon="🌳"
      title="I · 我以为我变了，但根没动过"
      subtitle="一年前的选择和一年后的选择长得一模一样"
      expanded={expanded}
      onToggle={onToggle}
    >
      <PlainOpening>
        我口口声声说要重新选择。但站在原地一年后回头看——新选择和旧选择长得一模一样。这怎么回事？
      </PlainOpening>

      <div className="bg-stone-900/40 p-4 rounded-lg border border-stone-900 space-y-3">
        <p className="text-[9.5px] text-stone-500 font-mono text-center italic leading-relaxed">
          点击叶子可以剪掉。试试看。
        </p>

        {/* 树冠：4 个枝叶按钮 */}
        <div className="flex justify-around items-end gap-1">
          {pruned.map((isPruned, i) => (
            <button
              key={i}
              onClick={() => !isPruned && prune(i)}
              disabled={isPruned}
              className={`text-2xl transition-all cursor-pointer disabled:cursor-default ${
                isPruned ? 'opacity-15 grayscale' : 'hover:scale-110 hover:rotate-12'
              }`}
              aria-label={isPruned ? '已剪' : '剪掉这片叶子'}
            >
              🍃
            </button>
          ))}
        </div>

        {/* 树干 */}
        <div className="flex justify-center select-none">
          <span className="text-3xl">🪵</span>
        </div>

        {/* 树根 —— pointer-events-none 永远不能选中 */}
        <div
          className="flex justify-center select-none pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-3xl opacity-90">🌱</span>
        </div>

        {allPruned && (
          <p className="text-[10px] text-amber-300 italic text-center leading-relaxed pt-2 border-t border-stone-900">
            ⚠️ 枝叶可以变。根没动过——你试试点根，根点不动。
          </p>
        )}
      </div>

      <MonologueBox>
        就像一棵树。叶子可以多些、少些，但根扎在哪几乎改不了。我以为我在"选择保持入世"——其实只是因为我已经长在了这里。"想逃"是潜意识，"选择留下"也是。两个都是真的。
      </MonologueBox>
    </ReflectionCard>
  );
}

// ============================================================
// 卡 2：我看穿了套路，但"看穿"本身又是套路
// ============================================================

const CAGE_LAYERS = [
  '你觉察到了。',
  '你觉察到了——你刚才在觉察。',
  '你觉察到了你在觉察刚才的觉察。',
  '你觉察到了你在觉察你在觉察刚才的觉察。',
  '你已经觉察了 5 次。再多一次也走不出去——出口不在镜子里。',
];

function AwarenessCageCard({ expanded, onToggle, onInteract }: CardSubProps) {
  const [layers, setLayers] = useState<string[]>([]);

  const click = () => {
    if (layers.length < CAGE_LAYERS.length) {
      setLayers((l) => [...l, CAGE_LAYERS[l.length]]);
      onInteract();
    }
  };

  return (
    <ReflectionCard
      icon="🪞"
      title="II · 我看穿了套路，但「看穿」本身又是套路"
      subtitle="觉察过头之后没法做决定了"
      expanded={expanded}
      onToggle={onToggle}
    >
      <PlainOpening>
        看清自己是怎么回事，本来是好事。但如果你时时刻刻都在看清自己——你就没力气真的去"活"了。这是觉察的反作用。试试连续点几次"觉察"。
      </PlainOpening>

      <div className="bg-stone-900/40 p-3 rounded-lg border border-stone-900 space-y-2">
        <button
          onClick={click}
          disabled={layers.length >= CAGE_LAYERS.length}
          className="w-full py-1.5 bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-30 disabled:cursor-not-allowed border border-amber-500/30 text-amber-300 text-[10px] font-bold rounded cursor-pointer transition-all"
        >
          {layers.length >= CAGE_LAYERS.length ? '🔒 已经觉察到底了' : '🔍 觉察一下'}
        </button>
        <div className="space-y-1 min-h-[20px]">
          {layers.map((l, i) => (
            <p
              key={i}
              className={`text-[10px] italic leading-snug ${
                i === CAGE_LAYERS.length - 1
                  ? 'text-rose-400 font-bold'
                  : 'text-stone-400 font-mono'
              }`}
              style={{ paddingLeft: `${i * 8}px` }}
            >
              {l}
            </p>
          ))}
        </div>
      </div>

      <MonologueBox>
        我以为"觉察"是出口。其实它是另一种监狱——精神都耗在看清自己上了，最后没力气走出门。我不需要更多镜子，我需要一个让人没法照镜子的环境。
      </MonologueBox>
    </ReflectionCard>
  );
}

// ============================================================
// 收尾段（2 张全交互过才出现）
// ============================================================

function FinaleSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2.5 pt-4 border-t border-amber-500/20"
    >
      <div className="bg-stone-950 border border-amber-500/30 p-3.5 rounded-xl space-y-2">
        <span className="text-[9px] font-extrabold text-amber-400 font-mono uppercase tracking-widest block">
          🏁 两个新坑都看过了
        </span>
        <p className="text-[10.5px] text-stone-200 italic leading-relaxed text-justify font-mono">
          4 阶段心智不是闭环。每一阶段对完之后，下一层的"新坑"又在等。我没有"最终答案"——我只有一个能继续走下去的姿势。
        </p>
      </div>

      <div className="bg-emerald-950/25 border border-teal-500/20 p-3.5 rounded-xl space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base select-none">🦊</span>
          <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
            小九的最后一句
          </span>
        </div>
        <p className="text-[10.5px] text-stone-200 italic leading-relaxed text-justify">
          金星亮了，过河客。亮的不是答案——是你能继续问下一个问题的勇气。下一杯茶我已经倒好了。
        </p>
      </div>
    </motion.div>
  );
}
