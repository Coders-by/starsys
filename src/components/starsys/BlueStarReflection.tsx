import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 蓝星亮了之后 ㆍ 又一个新坑
 *
 * 原本这张"三条河"放在金星夹层。但它讲的是"工作的本质是在卖预期/利润/希望"——
 * 这是实践的次生悖论，不是认知线的悖论。挪到蓝星亮了之后的位置更对位。
 *
 * Vault 来源：随想/2026-06-06.md（资本/产品/信息差三层认知 + 三条河 + 沙漠捕鱼）
 *
 * 这一夹层只有 1 张卡（蓝星 outro 已经很饱满，不堆叠更多）。
 *
 * 不触发新成就，不写 localStorage——探索状态只在 session 内。
 */

const RIVERS: Record<string, { label: string; rebuttal: string }> = {
  future: {
    label: '🌅 我在卖"未来"',
    rebuttal:
      '这一行你卖的是预期。今天没赚钱不重要——靠的是大家相信明天能赚。投资人买的不是财报，是十年后的故事。',
  },
  reality: {
    label: '⚙️ 我在卖"利润"',
    rebuttal:
      '这一行你卖的是当下的成交。竞争最挤——你必须比对岸所有人都快、都准、都狠。没有"下个十年"给你撑。',
  },
  cognition: {
    label: '🪞 我在卖"希望"',
    rebuttal:
      '这一行你卖的是希望。信息可能只值 9 块 9，但希望可以卖 999——人很少为知识买单，但经常为幻想买单。',
  },
};

export default function BlueStarReflection() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [interacted, setInteracted] = useState<boolean>(false);

  return (
    <div className="space-y-3 mt-4">
      <div className="border-t-2 border-sky-500/30 pt-4 space-y-2">
        <span className="text-[9px] font-extrabold text-sky-400 font-mono uppercase tracking-widest block">
          🎣 蓝星亮了之后 ㆍ 又一个新坑
        </span>
        <p className="text-[10.5px] text-stone-300 leading-relaxed text-justify">
          "你能下场把事干成"是蓝星证明的事。但下一个问题是——<strong className="text-sky-300">这件事本身，到底在卖什么？</strong>
        </p>
        <p className="text-[10px] text-stone-500 leading-relaxed text-justify">
          vault 里千岑写过一句话：「研究了一辈子捕鱼技术，最后发现自己站在沙漠里。」下面这一题，让你看清楚自己站在哪条河边。
        </p>
      </div>

      <RiverCard
        expanded={expanded}
        onToggle={() => setExpanded((e) => !e)}
        onInteract={() => setInteracted(true)}
      />

      <AnimatePresence>{interacted && <FinaleSection />}</AnimatePresence>
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
            <span className="text-[11px] font-bold text-sky-300 block leading-tight">{title}</span>
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
    <p className="text-[10.5px] text-stone-300 leading-relaxed text-justify bg-stone-900/30 p-2.5 rounded-lg border-l-2 border-sky-500/30">
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
// 三条河卡片
// ============================================================

interface CardSubProps {
  expanded: boolean;
  onToggle: () => void;
  onInteract: () => void;
}

function RiverCard({ expanded, onToggle, onInteract }: CardSubProps) {
  const [choice, setChoice] = useState<string | null>(null);

  const pick = (key: string) => {
    setChoice(key);
    onInteract();
  };

  return (
    <ReflectionCard
      icon="🎣"
      title="我做的「实践」到底是哪种生意"
      subtitle="三种工作其实在卖三种东西——但你以为的，往往不是你真在卖的"
      expanded={expanded}
      onToggle={onToggle}
    >
      <PlainOpening>
        蓝星亮了——你证明了你能下场把事干成。但下一个问题是：这件事本身，到底在卖什么？三种工作看起来差不多，其实卖的是三种完全不同的东西——预期 / 利润 / 希望。
      </PlainOpening>

      <div className="bg-stone-900/40 p-3 rounded-lg border border-stone-900 space-y-2">
        <span className="text-[9px] font-mono text-stone-500 font-bold uppercase tracking-wider block">
          🪧 选一个你自己的工作最像哪种：
        </span>
        <div className="space-y-1.5">
          {Object.entries(RIVERS).map(([key, river]) => (
            <button
              key={key}
              onClick={() => pick(key)}
              disabled={choice !== null && choice !== key}
              className={`w-full text-left py-1.5 px-2.5 rounded border text-[10px] font-mono transition-all cursor-pointer disabled:cursor-default ${
                choice === key
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-200'
                  : choice
                  ? 'bg-stone-950 border-stone-900 text-stone-600'
                  : 'bg-stone-950 border-stone-850 text-stone-300 hover:border-sky-500/30'
              }`}
            >
              {river.label}
            </button>
          ))}
        </div>

        {choice && (
          <div className="space-y-1.5 pt-2 border-t border-stone-900">
            <p className="text-[10px] text-sky-300 italic leading-relaxed">
              ⚠️ {RIVERS[choice].rebuttal}
            </p>
            <p className="text-[10px] text-rose-400 italic leading-relaxed">
              ⚠️ ……不过再问一句：这一行的"什么算成功"，是不是也是别人替你定义好的？
            </p>
          </div>
        )}
      </div>

      <MonologueBox>
        我毕业之后一直在自动驾驶行业。严格来说，这个行业最大的产品并不是自动驾驶——是未来。今天不一定赚钱，但只要大家相信它未来能赚钱，它就能一直活着。所以这个圈子里最值钱的东西不是利润，是预期。看清这一点之后，我才开始想：我蓝星上"下场把事干成"的"事"，到底是什么事？
      </MonologueBox>
    </ReflectionCard>
  );
}

// ============================================================
// 收尾段（卡交互过才出现）
// ============================================================

function FinaleSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2.5 pt-4 border-t border-sky-500/20"
    >
      <div className="bg-stone-950 border border-sky-500/30 p-3.5 rounded-xl space-y-2">
        <span className="text-[9px] font-extrabold text-sky-400 font-mono uppercase tracking-widest block">
          🏁 蓝星这一程
        </span>
        <p className="text-[10.5px] text-stone-200 italic leading-relaxed text-justify font-mono">
          能下场把事干成不够。下一步要看清的是——你站在哪条河边。否则研究了一辈子捕鱼技术，最后发现自己其实站在沙漠里。
        </p>
      </div>

      <div className="bg-emerald-950/25 border border-teal-500/20 p-3.5 rounded-xl space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base select-none">🦊</span>
          <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
            小九补一句
          </span>
        </div>
        <p className="text-[10.5px] text-stone-200 italic leading-relaxed text-justify">
          蓝星亮了，金星亮了——但这俩亮了，红星那条线（情感）的水还在炉子上没开呢。先去把茶炉子看一眼？
        </p>
      </div>
    </motion.div>
  );
}
