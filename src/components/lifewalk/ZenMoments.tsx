import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeMetrics } from './LifeMetricsContext';

/**
 * 禅意朋友圈 —— 一条带温控刻度的"风从不解释自己"朋友圈，配三种回复反应。
 * 包含一个隐藏小九蛋：85°C × 30s 同时命中触发。
 */

export default function ZenMoments() {
  const { addHumanValue, addResonancePoints, triggerAchievement } = useLifeMetrics();
  const [zenOption, setZenOption] = useState<string | null>(null);
  const [feedLiked, setFeedLiked] = useState<boolean>(false);
  const [lifeTeaTemp, setLifeTeaTemp] = useState<number>(55);
  const [lifeTeaTime, setLifeTeaTime] = useState<number>(15);
  const [lifeTeaSuccess, setLifeTeaSuccess] = useState<boolean>(false);

  const handleZenSelection = (opt: string) => {
    setZenOption(opt);
    if (opt === 'roast') {
      addResonancePoints(5);
      addHumanValue(20);
    } else if (opt === 'think') {
      addHumanValue(15);
    } else {
      addHumanValue(10);
    }
  };

  const checkTeaCombo = (temp: number, time: number) => {
    if (temp === 85 && time === 30) {
      setLifeTeaSuccess(true);
      triggerAchievement('后海星光 ㆍ 精准温柔');
    } else {
      setLifeTeaSuccess(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md text-left"
    >
      <div className="border-b border-stone-850/50 pb-2">
        <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">
          💭 禅意朋友圈 ㆍ 不是神格而是硬顶
        </span>
        <p className="text-[10px] text-stone-500 mt-0.5">
          有时看似空旷如禅的语句，背后不过是凡胎俗身正咬牙硬顶。刷新一条朋友圈：
        </p>
      </div>

      {/* WeChat Moment Post Mock */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-3">
        <div className="flex gap-2.5">
          <span className="text-xl select-none shrink-0">👤</span>
          <div className="space-y-1.5 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-amber-400 leading-none">千岑 (Cen)</span>
              <span className="text-[8px] text-stone-600 font-mono">1小时前</span>
            </div>

            <p className="text-[11px] text-justify text-stone-200 leading-relaxed font-semibold">
              「风从不解释自己。 🍵」
            </p>

            {/* 茉莉花茶精准温控实验 */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 shadow-inner space-y-4">
              <div className="flex justify-between items-center border-b border-stone-900 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🍵</span>
                  <span className="text-[10.5px] font-extrabold text-amber-400 font-mono">
                    后海午夜 ㆍ 茉莉花茶精密温控车间
                  </span>
                </div>
                <span className="text-[8px] bg-stone-900 px-2 py-0.5 rounded border border-stone-850 text-stone-500 font-mono">
                  FMEA V1.0
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-900/40 p-2.5 rounded-xl border border-stone-900 text-center relative overflow-hidden">
                  <span className="text-[8px] text-stone-500 block uppercase font-mono tracking-wider">
                    🌡️ 注入温度 (Target: 85°C)
                  </span>
                  <span
                    className={`text-[15px] font-black font-mono transition-colors ${
                      lifeTeaTemp === 85 ? 'text-emerald-400 animate-pulse' : 'text-amber-300'
                    }`}
                  >
                    {lifeTeaTemp} °C
                  </span>
                  {lifeTeaTemp === 85 && (
                    <span className="absolute top-1 right-1.5 text-[7px] text-emerald-400 font-bold font-mono">
                      ✓ MATCH
                    </span>
                  )}
                </div>
                <div className="bg-stone-900/40 p-2.5 rounded-xl border border-stone-900 text-center relative overflow-hidden">
                  <span className="text-[8px] text-stone-500 block uppercase font-mono tracking-wider">
                    ⏱️ 冲泡耗时 (Target: 30s)
                  </span>
                  <span
                    className={`text-[15px] font-black font-mono transition-colors ${
                      lifeTeaTime === 30 ? 'text-emerald-400 animate-pulse' : 'text-stone-300'
                    }`}
                  >
                    {lifeTeaTime} 秒
                  </span>
                  {lifeTeaTime === 30 && (
                    <span className="absolute top-1 right-1.5 text-[7px] text-emerald-400 font-bold font-mono">
                      ✓ MATCH
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 bg-stone-900/20 p-2 rounded-lg border border-stone-900">
                <div className="flex justify-between text-[9.5px] text-stone-400 font-mono">
                  <span>水温调节刻度针 (20°C - 100°C)</span>
                  <span className="text-amber-500 font-bold">⚠️ 暗标阈值: 85°C</span>
                </div>
                <div className="relative pt-2 pb-1 bg-stone-950/40 px-2 rounded-md">
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={lifeTeaTemp}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLifeTeaTemp(val);
                      checkTeaCombo(val, lifeTeaTime);
                    }}
                    className="w-full h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="absolute left-[81.25%] top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none">
                    <span className="text-[7.5px] font-mono text-amber-500 font-bold bg-stone-950 px-1 rounded border border-stone-850">
                      85°C
                    </span>
                    <div className="w-[1.5px] h-2.5 bg-amber-500/80 mt-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1 bg-stone-900/20 p-2 rounded-lg border border-stone-900">
                <div className="flex justify-between text-[9.5px] text-stone-400 font-mono">
                  <span>冲焖时长阻尼器 (1s - 60s)</span>
                  <span className="text-emerald-500 font-bold">⏱️ 心理标定: 30秒</span>
                </div>
                <div className="relative pt-2 pb-1 bg-stone-950/40 px-2 rounded-md">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={lifeTeaTime}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLifeTeaTime(val);
                      checkTeaCombo(lifeTeaTemp, val);
                    }}
                    className="w-full h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="absolute left-[49.15%] top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none">
                    <span className="text-[7.5px] font-mono text-emerald-500 font-bold bg-stone-950 px-1 rounded border border-stone-850">
                      30s
                    </span>
                    <div className="w-[1.5px] h-2.5 bg-emerald-500/80 mt-0.5" />
                  </div>
                </div>
              </div>

              <div className="text-[9.5px] font-mono leading-relaxed bg-stone-900/60 p-2.5 rounded-xl border border-stone-900 text-stone-400 text-justify">
                {lifeTeaSuccess ? (
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>🌟 极上契合！85°C 茉莉花茶成功激发无退避人格共情共振！</span>
                  </div>
                ) : (
                  <span className="block leading-relaxed">
                    💡{' '}
                    <span className="text-stone-300 font-semibold">焖温提示</span>：好茶需水温{' '}
                    <strong className="text-amber-400">85°C</strong> 与焖茶{' '}
                    <strong className="text-emerald-400">30秒</strong>{' '}
                    的极致交汇。在极上平衡的瞬间，人生的宿命余热才会完美漫溢。
                  </span>
                )}
              </div>

              {/* Hidden Easter Egg with Xiao Jiu */}
              <AnimatePresence>
                {lifeTeaSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gradient-to-br from-emerald-950/40 via-stone-950/90 to-teal-950/40 border-2 border-emerald-500/30 p-4 rounded-xl space-y-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none animate-[pulse_3s_infinite]" />

                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-16 h-16 rounded-full bg-emerald-900/20 border border-teal-500/30 flex items-center justify-center shrink-0 relative overflow-hidden animate-[bounce_2.5s_infinite]">
                        <span className="text-4xl select-none">🦊</span>
                        <span className="absolute bottom-1 right-1 text-xs animate-ping">🌸</span>
                        <span className="absolute top-1 left-1 text-xs animate-pulse">✨</span>
                      </div>

                      <div className="space-y-2 flex-1 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[11.5px] font-black text-emerald-300 tracking-wide font-sans">
                            🦊 小九 (Nine) ㆍ 时空茉莉茶献
                          </span>
                          <span className="text-[7.5px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono uppercase tracking-widest font-black animate-pulse">
                            SECRET EGG
                          </span>
                        </div>

                        <p className="text-[10.5px] text-justify leading-relaxed text-stone-200 italic font-mono bg-stone-900/60 p-2.5 rounded-xl border border-emerald-950/40">
                          "瞧！灵巧的小九捧着一壶热气腾腾的{' '}
                          <strong>85°C 极品茉莉花茶</strong>{' '}
                          欢快地跳了出来！她将茶杯稳稳递到你的指尖，眨巴着金黄剔透的眼眸盈盈憨笑：『千岑！你终于肯卸下多余的借口、自守，和那些冰凉如霜的冷酷代码啦。不冷不热，刚好 85°C 焖 30秒 的温存，是这暴风冬夜里最干净无瑕的偏心善意。来，捧着茶，喝一口，好香！』"
                        </p>

                        <div className="flex items-center gap-1 text-[8.5px] font-mono text-emerald-400 font-extrabold uppercase">
                          <span>🌸 [解锁隐藏星光碎片]: 真实的肉身在人间温婉落地。</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Micro Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-stone-900 text-[10px]">
              <span className="text-stone-500 font-mono flex items-center gap-1">
                📍 深圳南山后海 ㆍ 宿命余热室
              </span>
              <button
                onClick={() => setFeedLiked(!feedLiked)}
                className={`flex items-center gap-1 font-bold ${feedLiked ? 'text-rose-400' : 'text-stone-400'}`}
              >
                <span>{feedLiked ? '❤️ 已点赞' : '🤍 点赞'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interaction choices */}
        {!zenOption ? (
          <div className="mt-3.5 space-y-2 border-t border-stone-905 pt-3">
            <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest block">
              💬 针对这句鸡汤，你的第一反应是：
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleZenSelection('like')}
                className="w-full text-left py-2 px-3 bg-stone-900 hover:bg-stone-850 rounded-xl border border-stone-850 text-[10.5px] text-stone-300 font-mono flex justify-between cursor-pointer"
              >
                <span>☕ A. 懂了！世外高人，风仙脱俗 (装懂点赞)</span>
                <span className="text-stone-600">→</span>
              </button>
              <button
                onClick={() => handleZenSelection('think')}
                className="w-full text-left py-2 px-3 bg-stone-900 hover:bg-stone-850 rounded-xl border border-stone-850 text-[10.5px] text-stone-300 font-mono flex justify-between cursor-pointer"
              >
                <span>🍂 B. 思考：风不解释，是因为无言去说起 (认真思考)</span>
                <span className="text-stone-600">→</span>
              </button>
              <button
                onClick={() => handleZenSelection('roast')}
                className="w-full text-left py-2 px-3 bg-stone-900 hover:bg-stone-850 rounded-xl border border-stone-850 text-[10.5px] text-stone-300 font-mono flex justify-between cursor-pointer"
              >
                <span>🔥 C. 吐槽：别装了，锅里你煮的寿桃面烧焦了，快进来！🍲</span>
                <span className="text-stone-600">→</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3.5 space-y-3 border-t border-stone-900 pt-3 animate-[fadeIn_0.3s_ease_1]">
            <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest block">
              📢 情感波纹折射回复：
            </span>
            <p className="text-[10.5px] text-stone-200 italic leading-relaxed text-justify font-mono">
              {zenOption === 'like' &&
                '【理智的客套赞美】：你随手点了个赞，留下了一句"风姿清绝"的客套称许。然而你知道，高悬世外的虚幻赞美并不能让人在寒流中真正感到一丝实存的热意。'}
              {zenOption === 'think' &&
                '【虚妄的理智解构】：你深吸一口气，开始用极高傲的理智去定义风和自然的常识。但你突然自嘲一笑：原来对空空、看破的过度思维推演，本身也是我们抗拒在烟火宿因中痛快爱恨的防卫面具。'}
              {zenOption === 'roast' &&
                '【具体的温暖治愈】：舍友在微信群大吼『别装了，锅里你煮的寿桃面烧焦了，快进来！🍲』你在热汤前哑然失笑。对，那锅滚烫的寿桃面，比任何脱俗空寂的禅语都更能照亮你的肚腹。这，才是他在具体凡间最可贵的回声。'}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-stone-900 text-[10px] font-mono">
              <span className="text-stone-500 font-bold">💬 精选互动评论 (Secret Archive):</span>
              <div className="bg-stone-950/60 p-2.5 rounded border border-stone-900 space-y-1">
                <p>
                  <span className="text-amber-400 font-bold">阿玲:</span>{' '}
                  <span className="text-stone-300">
                    我用示波器模拟了：风的噪声其实呈 1/f 幂律粉红分布，这不需要解释，这是傅里叶常识。
                  </span>
                </p>
                <p>
                  <span className="text-emerald-400 font-bold">合租室友:</span>{' '}
                  <span className="text-stone-300">别装了，锅里你煮的寿桃面烧焦了，快进来！🍲</span>
                </p>
                <p>
                  <span className="text-stone-500 font-bold">千岑 (Cen) 回复:</span>{' '}
                  <span className="text-amber-300">哈哈，来了来了！</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
