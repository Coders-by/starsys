import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLifeMetrics } from './LifeMetricsContext';

/**
 * 深夜骑行 —— 单车 / 徒步两种 tempo，定时器每 2.6s 推进 33% 进度。
 * 每个 tick 触发一段路边奇遇 (烧烤摊 / 流浪猫 / 红眼程序员)，逛完触发漫游成就。
 *
 * 拆出来后用 useEffect 管 interval 的生命周期，避免原文件那种 setInterval 手动清的写法。
 */

interface RoadEncounter {
  text: string;
  log: string;
}

const ROUTE_ENCOUNTERS: RoadEncounter[] = [
  {
    text: '🍢 偶遇【深夜路边烧烤摊】',
    log: '在南山村破旧的小塑料凳坐下，铁签呲溜呲溜冒着烟。旁边的闪送小哥累得眼睛通红，狠狠灌了一口菠萝啤。你点了串烤香菇、烤面筋，那一刻你们只是在这块铁皮锅下的战友，相视一笑。这，才是活着的温热。',
  },
  {
    text: '🐱 发现【绿化带里藏着的流浪小橘猫】',
    log: '在深圳湾海风中，灌木丛传出微弱奶猫叫声。你把口袋里刚买的鱼肠撕开掰碎，伸出食指。小猫哆嗦着凑过来，用湿漉漉的鼻子碰了碰你冒着汗的指尖，一阵带微小摩擦却极解压的共鸣温存。你融化了。',
  },
  {
    text: '🚴‍♂️ 碰见【推着黄色共享单车的红眼程序员】',
    log: '他挂着双肩电脑包，因为找不着车锁而有些急了。你主动上前帮他扫开。他叹气：『智能驾驶定位又飘移了，标定真折磨人。』你一笑：『没事，今天降一点过滤阈值，明天再战。』他错愕地握握你的手：『哥们同行？谢了！』',
  },
];

export default function MidnightRide() {
  const { addHumanValue, addResonancePoints, triggerAchievement } = useLifeMetrics();
  const [rideType, setRideType] = useState<'bike' | 'walk' | null>(null);
  const [rideProgress, setRideProgress] = useState<number>(0);
  const [rideActive, setRideActive] = useState<boolean>(false);
  const [rideLog, setRideLog] = useState<string[]>([]);
  const [rideEncounters, setRideEncounters] = useState<string[]>([]);

  useEffect(() => {
    if (!rideActive || !rideType) return;
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const enc = ROUTE_ENCOUNTERS[step - 1];
      if (enc) {
        setRideEncounters((prev) => [...prev, enc.text]);
        setRideLog((prev) => [...prev, enc.log]);
        addHumanValue(15);
        addResonancePoints(5);
      }
      setRideProgress((prev) => {
        const next = Math.min(100, prev + 33.3);
        if (next >= 100) {
          clearInterval(interval);
          setRideActive(false);
          triggerAchievement(`深夜漫游: ${rideType === 'bike' ? '单车飞驰' : '海岸徒步'}`);
        }
        return next;
      });
    }, 2600);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideActive, rideType]);

  const startRide = (type: 'bike' | 'walk') => {
    setRideType(type);
    setRideProgress(0);
    setRideLog([]);
    setRideEncounters([]);
    setRideActive(true);
  };

  const resetRide = () => {
    setRideType(null);
    setRideProgress(0);
    setRideLog([]);
    setRideEncounters([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md text-left"
    >
      <div className="border-b border-stone-850/50 pb-2">
        <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">
          🚴 南山骑夜 ㆍ 深夜深圳湾的实体漫游
        </span>
        <p className="text-[10px] text-stone-500 mt-0.5">
          去偶遇南山、深圳湾的烟火气，这比一切高深思辨更具实体抗抑郁的力量：
        </p>
      </div>

      {!rideActive && rideLog.length === 0 ? (
        <div className="space-y-3.5">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-850">
            <span className="text-[10.5px] font-bold text-amber-400 block mb-1">🚴 选择夜游路线：</span>
            <p className="text-[10.5px] text-stone-400 leading-normal text-justify">
              戴上旧耳机，避开白天的嘈杂人海，踏入午夜 12 点的微咸海风之滨。在这个流淌着无数梦想和加班汗水的硅谷之滨，寻找最真切的具体烟火故事。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => startRide('bike')}
              className="bg-stone-950 p-4 rounded-xl border border-stone-850 hover:border-amber-500/40 text-center space-y-2 cursor-pointer hover:scale-[1.01] transition-all"
            >
              <span className="text-3xl block">🚴‍♂️</span>
              <span className="text-xs font-bold text-stone-200 block">深夜单车狂飙</span>
              <span className="text-[9px] text-stone-500 block leading-tight">
                绕科学园、高新南，感受深夜疾风
              </span>
            </button>

            <button
              onClick={() => startRide('walk')}
              className="bg-stone-950 p-4 rounded-xl border border-stone-850 hover:border-amber-500/40 text-center space-y-2 cursor-pointer hover:scale-[1.01] transition-all"
            >
              <span className="text-3xl block">🚶‍♀️</span>
              <span className="text-xs font-bold text-stone-200 block">深圳湾海岸徒步</span>
              <span className="text-[9px] text-stone-500 block leading-tight">
                聆听红树林和咸潮波浪的私心细诉
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-stone-900 text-xs text-amber-300 font-bold">
              <span>游历路线：{rideType === 'bike' ? '🚗 深夜科学园单车飞驰' : '🌊 深圳湾晚潮徒步'}</span>
              <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded font-mono font-black">
                {rideActive ? 'ROUTING...' : 'COMPLETED!'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-mono text-stone-600">
                <span>南山始发站</span>
                <span>深圳湾红树林总站</span>
              </div>
              <div className="h-2 bg-stone-900 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 to-rose-500 transition-all duration-[2600ms]"
                  style={{ width: `${rideProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest block">
              📡 实时路段具体奇遇 logs：
            </span>
            {rideEncounters.map((enc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-stone-850 bg-stone-950 relative space-y-1.5 animate-[fadeIn_0.3s_ease_1]"
              >
                <span className="text-[10px] font-bold text-amber-300 block">{enc}</span>
                <p className="text-[10px] text-stone-300 italic leading-relaxed text-justify font-mono">
                  {rideLog[idx]}
                </p>
              </div>
            ))}
          </div>

          {!rideActive && (
            <button
              onClick={resetRide}
              className="w-full mt-2 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 font-black rounded-xl text-xs sm:text-[10.5px] cursor-pointer"
            >
              ← 重新漫游深圳
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
