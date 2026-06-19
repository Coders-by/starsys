import React, { useState, useEffect } from 'react';
import GoldStarReflection from './GoldStarReflection';

/**
 * 金星章节 ㆍ 4 阶段心智对位填空。
 *
 * 从 StarSysGame.tsx 抽出。内部 state 自洽（goldStageSolutions / goldMessage），
 * 对外只通过 props 上抛：
 *   - solved: 读 parent 的 goldSolved（结算显示用）
 *   - onSolved: 替代 markPlanetSolved('gold', true)
 *   - resetNonce: parent 重置时 +1，本组件 useEffect 监听自清内部 state
 */

interface GoldStarChapterProps {
  solved: boolean;
  onSolved: () => void;
  resetNonce: number;
}

export default function GoldStarChapter({ solved: goldSolved, onSolved, resetNonce }: GoldStarChapterProps) {
  const [goldStageSolutions, setGoldStageSolutions] = useState<Record<string, string>>({});
  const [goldMessage, setGoldMessage] = useState<string | null>(null);

  // resetNonce 机制：parent 重置时 +1，自清内部进度（跳过首次 mount）
  useEffect(() => {
    if (resetNonce === 0) return;
    setGoldStageSolutions({});
    setGoldMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce]);

  const setGoldSolution = (stageId: string, tileId: string) => {
    setGoldStageSolutions((prev) => ({ ...prev, [stageId]: tileId }));
    setGoldMessage(null);
  };

  const verifyGoldStar = () => {
    const isCorrect =
      goldStageSolutions['age18'] === 'meritocracy' &&
      goldStageSolutions['age22'] === 'nihilism' &&
      goldStageSolutions['age24'] === 'practice' &&
      goldStageSolutions['age26'] === 'concretelove';
    if (isCorrect) {
      setGoldMessage('success');
      onSolved();
    } else {
      setGoldMessage('对齐失败：思想演化树的观点年份存在断层错位。请审视千岑 24 岁的实践论拼杀、以及 26 岁卡氏与红楼具体的血肉爱恨位置。');
    }
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
      <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed space-y-2">
        <span className="text-[8px] font-bold text-amber-400 block">🪐 这一关在演示什么</span>
        <p className="text-stone-300 text-justify leading-relaxed">
          <strong className="text-amber-300">18 → 26 岁。8 年里我换了 4 次"世界长什么样"的答案。每次都以为这次是最后一次。</strong>
        </p>
        <p className="text-stone-500 text-justify leading-snug">
          把每个年龄对到当时坚信的那句话——这个题没有难度，目的不是考你，是让你跟着这条曲线走一遍。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {[
          { id: 'age18', label: '18 岁 ㆍ 刚走出高考', correct: 'meritocracy', hint: '那时我相信——只要考第一就赢了' },
          { id: 'age22', label: '22 岁 ㆍ 大学末年', correct: 'nihilism', hint: '那时我觉得——这一切都没意义' },
          { id: 'age24', label: '24 岁 ㆍ 工作摔打两年之后', correct: 'practice', hint: '那时我明白——不亲自下场就没资格说话' },
          { id: 'age26', label: '26 岁 ㆍ 谈了一段差点把自己玩死的感情之后', correct: 'concretelove', hint: '那时我敢说——我更爱身边那一个具体的人' },
        ].map((stage) => {
          const currentTileId = goldStageSolutions[stage.id];
          return (
            <div key={stage.id} className="bg-stone-950/90 border border-stone-850/60 p-3 rounded-xl flex gap-3.5 items-center justify-between">
              <div className="flex-1">
                <span className="text-[8.5px] uppercase font-mono tracking-widest text-amber-500 font-bold leading-none block mb-1">{stage.label}</span>
                <span className="text-[10px] text-stone-500 italic block">{stage.hint}</span>
                {currentTileId && (
                  <span className="text-[11px] text-amber-300 mt-1 font-bold inline-block border-l-2 border-amber-500 pl-2 leading-none">
                    对齐为 ➔{' '}
                    {(currentTileId === 'meritocracy' && '🔑 考第一就赢了') ||
                      (currentTileId === 'nihilism' && '🔑 这一切都没意义') ||
                      (currentTileId === 'practice' && '🔑 不亲自下场就没资格说话') ||
                      (currentTileId === 'concretelove' && '🔑 我更爱身边那一个具体的人')}
                  </span>
                )}
              </div>

              <select
                className="bg-stone-900 border border-stone-800 text-[10px] p-1.5 rounded text-stone-300 font-mono outline-none max-w-[120px] focus:border-amber-500 cursor-pointer"
                value={currentTileId || ''}
                onChange={(e) => setGoldSolution(stage.id, e.target.value)}
              >
                <option value="">-- 选择拼贴 --</option>
                <option value="meritocracy">考第一就赢了</option>
                <option value="nihilism">这一切都没意义</option>
                <option value="practice">不亲自下场就没资格说话</option>
                <option value="concretelove">我更爱身边那一个</option>
              </select>
            </div>
          );
        })}
      </div>

      {!goldSolved ? (
        <button
          onClick={verifyGoldStar}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 font-extrabold py-2.5 rounded-xl text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
        >
          <span>✓ 编译并校验观念演化树</span>
        </button>
      ) : (
        <div className="bg-emerald-950/20 border-2 border-emerald-500/30 rounded-xl p-3.5 space-y-2 text-[11px] text-justify text-emerald-300 animate-[fadeIn_0.5s_ease_1]">
          <span className="text-[10px] font-bold block uppercase font-mono">🌟 4 阶段对位完成：</span>
          <p className="italic">
            "十八岁，我执着对答标准卷子的自傲；廿二岁，我冷眼审判诸般功利却一无所获的虚寂；廿四岁，我在泥潭里明白，不踩泥就过不了江，我用实践磨砺我的心灵容灾；廿六岁，我终于敢走上前去，去爱具体的、微小的生命，爱到满腔愧悔但也满盘无悔。"
          </p>
          <p className="text-stone-300 not-italic text-[10px] leading-relaxed border-t border-emerald-500/10 pt-1.5">
            —— 这是 4 阶段心智演化的全景。但金星亮了，不代表"我找到了答案"。下面是亮了之后才看见的几个新坑。
          </p>
          <p className="font-bold text-amber-400 border-t border-emerald-500/10 pt-1 text-[10px] uppercase font-mono">
            🔑 获得人格碎片：【洞察/INSIGHT】 ㆍ 穿透迷雾，看清人性与规律的那双眼睛。
          </p>
        </div>
      )}

      {goldMessage && goldMessage !== 'success' && (
        <div className="p-3 bg-red-950/20 border border-red-500/20 text-rose-300 rounded-xl text-[10px] leading-snug text-justify">
          {goldMessage}
        </div>
      )}

      {/* 心智夹层 —— 金星亮了之后的新坑 */}
      {goldSolved && <GoldStarReflection />}
    </div>
  );
}
