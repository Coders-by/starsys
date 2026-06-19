import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

/**
 * 红星章节 ㆍ 情感线三段（小学流星雨 → 2020 soul 图书馆员 → 2024 茉莉花茶）。
 *
 * 从 StarSysGame.tsx 抽出。内部 state 自洽（章节进度 + 三章各自的玩法 state），
 * 对外只通过 props：
 *   - solved: 读 parent 的 redSolved（结算显示 + stepper 锁定）
 *   - onSolved: 替代 markPlanetSolved('red', true)
 *   - resetNonce: parent 重置时 +1，本组件 useEffect 监听自清内部 state
 *   - foxCommentary: parent 持有的灵狐弹幕，Ch1 失败时读它决定是否显示狐评
 */

interface RedStarChapterProps {
  solved: boolean;
  onSolved: () => void;
  resetNonce: number;
  foxCommentary: string | null;
}

export default function RedStarChapter({ solved: redSolved, onSolved, resetNonce, foxCommentary }: RedStarChapterProps) {
  const [redChapter, setRedChapter] = useState<number>(1);

  // Scattered QQ/chat bubbles from Qiancen's elementary/early summer regret (Chapter 1)
  const originalChatBubbles = [
    { id: 'b1', text: '她：“今晚天上有流星雨，好漂亮啊。你快看啊。”', correctIdx: 0, desc: '流星雨降临' },
    { id: 'b2', text: '千岑：“没看，我在家和哥们联机魔兽呢，别打岔。”', correctIdx: 1, desc: '傲慢的自尊防御' },
    { id: 'b3', text: '她：“哦……那我特地也下载了魔兽，可以带我一起联机么？”', correctIdx: 2, desc: '诚挚的走近' },
    { id: 'b4', text: '千岑：“你下的那个绝对是盗版，肯定跑不了联机，别折腾了。”', correctIdx: 3, desc: '紧锁的圣殿' },
    { id: 'b5', text: '她：“这样呀……可我一直没睡，会在流星下直到你想我。”', correctIdx: 4, desc: '情根封存' },
  ];

  const [redCurrentSequence, setRedCurrentSequence] = useState<string[]>(['b3', 'b1', 'b5', 'b2', 'b4']);
  const [redCheckMessage, setRedCheckMessage] = useState<'success' | 'failure' | null>(null);

  const moveRedBubble = (index: number, direction: 'up' | 'down') => {
    const nextArr = [...redCurrentSequence];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextArr.length) return;
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
  const [soulBass, setSoulBass] = useState<number>(40); // target: 70-90
  const [soulMid, setSoulMid] = useState<number>(800); // target: 500-650
  const [soulTreble, setSoulTreble] = useState<number>(5000); // target: 1000-1500
  const [soulMessage, setSoulMessage] = useState<string | null>(null);

  const verifySoulTuner = () => {
    const isBassOk = soulBass >= 70 && soulBass <= 90;
    const isMidOk = soulMid >= 500 && soulMid <= 650;
    const isTrebleOk = soulTreble >= 1000 && soulTreble <= 1500;

    if (isBassOk && isMidOk && isTrebleOk) {
      setSoulMessage('success');
    } else {
      const advice: string[] = [];
      if (!isBassOk) advice.push('年代不对。她研究的古董是哪一年的风物？——70 到 90 年代之间');
      if (!isMidOk) advice.push('书架号不对。那本她想守护的书在图书馆哪个架上？——500 到 650 号架之间');
      if (!isTrebleOk) advice.push('阻抗没对上。你们之间的那根线——1000 到 1500 MΩ 才能接通');
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
      setTeaEasterEgg(teaTemp === 85 && teaTime === 30);
      setTeaMessage('success');
      onSolved(); // Completing level 3 solves the Red Planet!
    } else {
      const advice: string[] = [];
      if (!isTempOk) {
        advice.push(teaTemp > 85 ? `水温太烫了 (${teaTemp}°C) —— 茉莉花茶不是普洱，80-85°C就好` : `水温太凉 (${teaTemp}°C) —— 花茶需要80-85°C才能泡开`);
      }
      if (!isTimeOk) {
        advice.push(teaTime > 40 ? `泡太久了 (${teaTime}秒) —— 好的茶不需要泡到出苦味，30-40秒就够了` : `时间太短 (${teaTime}秒) —— 30-40秒才能让花香渗出来`);
      }
      if (!teaVulnerable) {
        advice.push('你还穿着盔甲呢。——不把「理智自卫」放下来，泡出来的永远只是隔阂的水');
      }
      setTeaMessage(`${advice.join('；')}`);
    }
  };

  // resetNonce 机制：parent 重置时 +1，自清内部进度（跳过首次 mount）
  useEffect(() => {
    if (resetNonce === 0) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce]);

  return (
    <div className="space-y-4">

      {/* Progress stepper meter */}
      <div className="flex gap-1 bg-stone-950/40 p-1.5 rounded-xl border border-stone-850">
        {[1, 2, 3].map((ch) => {
          const titles = ['小学ㆍ流星雨', '2020ㆍ可遇不可求', '2024ㆍ那杯没尝的茶'];
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

      {/* --- CHAPTER 1: 小学夏夜流星雨 (Meteor Shower) --- */}
      {(!redSolved ? redChapter === 1 : redChapter === 1) && (
        <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed relative">
            <span className="text-[8px] font-bold text-red-400 block mb-1">【第一阶段 ㆍ 小学夏夜的流星雨】</span>
            <p className="text-stone-300 font-semibold italic text-justify">"在那一刻为了维持人设，他亲手叉掉了她发来的讯号。"</p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              那是小学的某个夏夜。家里的电脑刚来不久，他在和朋友打《魔兽争霸》。QQ 弹出来——一个女孩说『今晚有流星，把我认作哥哥吧』。他在朋友面前装作没看到，叉掉了对话框。
            </p>
            <p className="text-stone-500 mt-1.5 leading-snug">
              多年后他才承认：那一刻他追悔得无力——不是不喜欢她，是怕被人看穿他是个穿补丁校服的小偷。
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">🛠️ 把这些气泡排回它们本来的顺序——当年你是怎么一步步把她推开的</span>
              <button
                onClick={() => setRedCurrentSequence(['b3', 'b1', 'b5', 'b2', 'b4'])}
                className="text-[9px] text-stone-500 hover:text-stone-300 flex items-center gap-1 cursor-pointer"
              >
                <span>🔄 重乱</span>
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[10.5px]">
              {redCurrentSequence.map((id, index) => {
                const bubble = originalChatBubbles.find((b) => b.id === id)!;
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
              ❌ 顺序不对。你当时是先拒绝、再拒绝、最后还是拒绝。想想那颗流星——是她先开口的，你是先回绝的那个。
            </div>
          )}
          {redCheckMessage === 'failure' && !foxCommentary && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9px] text-zinc-500 italic font-mono text-right"
            >
              🦊 你当年拒绝她的速度，比你现在排序的速度快多了。
            </motion.p>
          )}
        </div>
      )}
      {(!redSolved ? redChapter === 2 : redChapter === 2) && (
        <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed relative">
            <span className="text-[8px] font-bold text-rose-400 block mb-1">【第二阶段 ㆍ 2020 soul 上的图书馆员】</span>
            <p className="text-stone-300 font-semibold italic text-justify">"可遇不可求的事，后海有树的院子，夏代有工的玉，此时此刻的云，二十来岁的你。"</p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              2020 年疫情困乡下的夏天，他在 soul 上遇到一个想当图书馆员的女孩。她爱研究古董，想去西藏。
            </p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              她聊她的西藏梦。他给她讲算法课的大作业——"骑士救公主"的几种解法，回溯、动态规划。他半真半假地说，他在想到底谁才是真的公主。
            </p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              理性又来了——它像一堵透明的墙。他退后一步。期末忙起来时<strong className="text-rose-300">他一星期没上线</strong>。再回去时，她问起学车的事，他认真回了许多细节。她说，"好的好的，谢谢你。"
            </p>
            <p className="text-stone-500 mt-1.5 leading-snug">
              现在请你替他对齐三件事的频率：那段古董的年代、那本她想守护的图书的位置、和他与她之间那根迟迟没接通的线。
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
                  : Math.sin(i * 0.2 + (soulBass / 20)) * 8 + (soulMid / 100) + 6;
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
                  <span className="text-stone-400 font-medium">她研究的金石——是哪一年的风物？</span>
                  <span className={`font-bold ${soulBass >= 70 && soulBass <= 90 ? 'text-rose-400' : 'text-stone-500'}`}>
                    {soulBass} <span className="text-[8px] font-normal opacity-70">(目标: 70-90年代)</span>
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
                  <span className="text-stone-400 font-medium">那本她想守护的书放在图书馆哪个架上？</span>
                  <span className={`font-bold ${soulMid >= 500 && soulMid <= 650 ? 'text-rose-400' : 'text-stone-500'}`}>
                    {soulMid} <span className="text-[8px] font-normal opacity-70">(目标: 500-650号架)</span>
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
                  <span className="text-stone-400 font-medium">你们之间的那根线——阻抗调对了才能接通</span>
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
                "频率对上了——他第一次真正听懂了那个想去西藏的女孩在说什么。多年后他读到这首诗——\n\n『可遇不可求的事，后海有树的院子，夏代有工的玉，此时此刻的云，二十来岁的你。』\n\n他突然懂了：这首诗不是写给"努力的他"，是写给"愿意停下来读这首诗的他"。可那年——他一星期没上线，回去之后只认真聊了学车的事。"
              </p>
              <button
                onClick={() => {
                  setRedChapter(3);
                  setSoulMessage(null);
                }}
                className="w-full mt-2 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-stone-950 font-extrabold rounded-xl text-[10.5px] cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:scale-[1.01] transition-all"
              >
                ⚡ 立即点击：迈入最终章 ㆍ 2024 茉莉花茶
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

      {/* --- CHAPTER 3: 2024 深冬茉莉花茶 (Jasmine Tea) --- */}
      {redChapter === 3 && (
        <div className="space-y-4 animate-[fadeIn_0.4s_ease_1]">
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 text-[11px] leading-relaxed relative">
            <span className="text-[8px] font-bold text-red-400 block mb-1">【第三阶段 ㆍ 2024 深冬茉莉花茶】</span>
            <p className="text-stone-300 font-semibold italic text-justify">"水温对了，时间对了，但有些茶——终究没有被一起喝下。"</p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              2024 深冬校友会那晚的巧合，像一杯水温误差正负 0.5°C 的茉莉花茶——精准到他立刻怀疑这是某种安排。
            </p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              签到处她抬头那一眼。后来他们聊东南亚房产、聊 TIA 的歌、聊她想做的开店游戏。备忘录里堆了越来越多"还想再聊的话题"。
            </p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              他试着泡了一杯同款——精确到 80°C，焖 30 秒——拍照发过去："要尝尝吗？"
            </p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              三小时后她回："最近在戒糖。"  "这茶不加糖。"  "还是不了。"
            </p>
            <p className="text-stone-500 mt-1.5 leading-relaxed">
              烟花在外面响。他捧着那杯不会被尝的茶，愣了几秒。
            </p>
            <p className="text-stone-500 mt-1.5 leading-snug">
              现在请你替他重沏这杯茶。水温和时间都简单——难的是最后那个按钮：<strong className="text-stone-400">他当时按下了「🛡️ 理智自卫」</strong>。这一回，请你替他选 <strong className="text-red-300">「💔 卸盔解甲」</strong>——这不是改写历史，是让他在事后看清自己当时没敢做的那个选择。
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
                    : '（注：好茶需 80-85°C 焖 30-40秒，并且不可开启理智自守）'}
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
                  <button type="button" disabled={teaTemp <= 20} onClick={() => { setTeaTemp((p) => Math.max(20, p - 5)); setTeaMessage(null); }} className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none">-5°</button>
                  <button type="button" disabled={teaTemp <= 20} onClick={() => { setTeaTemp((p) => Math.max(20, p - 1)); setTeaMessage(null); }} className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none">-1°</button>
                  <input type="range" min="20" max="100" value={teaTemp} onChange={(e) => { setTeaTemp(Number(e.target.value)); setTeaMessage(null); }} className="flex-1 accent-red-500 h-1.5 rounded-lg cursor-pointer disabled:opacity-40" />
                  <button type="button" disabled={teaTemp >= 100} onClick={() => { setTeaTemp((p) => Math.min(100, p + 1)); setTeaMessage(null); }} className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none">+1°</button>
                  <button type="button" disabled={teaTemp >= 100} onClick={() => { setTeaTemp((p) => Math.min(100, p + 5)); setTeaMessage(null); }} className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none">+5°</button>
                </div>
                <div className="flex gap-1">
                  {[60, 75, 80, 83, 85, 95].map((t) => (
                    <button key={t} type="button" onClick={() => { setTeaTemp(t); setTeaMessage(null); }} className={`flex-1 py-1 rounded text-[9px] font-mono border transition-all ${teaTemp === t ? 'bg-red-500/10 border-red-500/40 text-red-300 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'bg-stone-900/60 border-stone-850/80 text-stone-400 hover:text-stone-300'}`}>{t}°C</button>
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
                  <button type="button" disabled={teaTime <= 5} onClick={() => { setTeaTime((p) => Math.max(5, p - 5)); setTeaMessage(null); }} className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none">-5s</button>
                  <button type="button" disabled={teaTime <= 5} onClick={() => { setTeaTime((p) => Math.max(5, p - 1)); setTeaMessage(null); }} className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none">-1s</button>
                  <input type="range" min="5" max="90" value={teaTime} onChange={(e) => { setTeaTime(Number(e.target.value)); setTeaMessage(null); }} className="flex-1 accent-red-500 h-1.5 rounded-lg cursor-pointer disabled:opacity-40" />
                  <button type="button" disabled={teaTime >= 90} onClick={() => { setTeaTime((p) => Math.min(90, p + 1)); setTeaMessage(null); }} className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none">+1s</button>
                  <button type="button" disabled={teaTime >= 90} onClick={() => { setTeaTime((p) => Math.min(90, p + 5)); setTeaMessage(null); }} className="px-2 py-1 bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-bold text-stone-300 pointer-events-auto select-none">+5s</button>
                </div>
                <div className="flex gap-1">
                  {[10, 20, 30, 35, 40, 60].map((s) => (
                    <button key={s} type="button" onClick={() => { setTeaTime(s); setTeaMessage(null); }} className={`flex-1 py-1 rounded text-[9px] font-mono border transition-all ${teaTime === s ? 'bg-red-500/10 border-red-500/40 text-red-300 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'bg-stone-900/60 border-stone-850/80 text-stone-400 hover:text-stone-300'}`}>{s}s</button>
                  ))}
                </div>
              </div>

              {/* Mindset Pose selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-stone-400 block">心智姿态选择 (Mindset Pose Calibration)</span>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" disabled={redSolved} onClick={() => { if (!redSolved) { setTeaVulnerable(false); setTeaMessage(null); } }} className={`py-2 px-2.5 rounded-xl border text-[10px] font-bold font-mono transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer ${!teaVulnerable && !redSolved ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]' : 'bg-stone-900/60 border-stone-850 text-stone-500 hover:text-stone-400 disabled:opacity-40'}`}>
                    <span>🛡️ 理智自卫</span>
                    <span className="text-[7.5px] font-normal opacity-75">坚守逻辑，客套防摩擦</span>
                  </button>
                  <button type="button" disabled={redSolved} onClick={() => { if (!redSolved) { setTeaVulnerable(true); setTeaMessage(null); } }} className={`py-2 px-2.5 rounded-xl border text-[10px] font-bold font-mono transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer ${teaVulnerable || redSolved ? 'bg-red-500/20 border-red-500/40 text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.25)]' : 'bg-stone-900/60 border-stone-850 text-stone-500 hover:text-stone-400 disabled:opacity-40'}`}>
                    <span>💔 卸盔解甲</span>
                    <span className="text-[7.5px] font-normal opacity-75">放下防线，痛快去痛</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action verification */}
          {!redSolved ? (
            <button onClick={verifyTeaBrewer} className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-stone-950 hover:from-red-400 hover:to-rose-500 font-extrabold py-2.5 rounded-xl text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-bounce">
              <span>✓ 注入滚烫真心，焖泡此杯</span>
            </button>
          ) : (
            <div className="bg-emerald-955/20 border-2 border-emerald-500/35 rounded-xl p-3.5 space-y-2 text-[11px] text-justify text-emerald-300 animate-[fadeIn_0.5s_ease_1]">
              <span className="text-[10px] font-bold block uppercase font-mono text-emerald-400">🌟 红星亮了 ㆍ 三段情感终于走完一遍</span>
              <p className="italic text-stone-200 leading-relaxed whitespace-pre-line">
                {`"茉莉花茶的水温我调到了 80°C，焖了 30 秒——但那杯茶从来没被一起喝下。

我把那句歌词的"你独行"偷偷改成了"我们"。我没敢发。

这不是失去——是从未发生。

我又一次成功地用 ±0.5°C 的精度，把一个具体的人安全地放进了我熟悉的刻度里。现在我才看见：精度本身就是冷库。

能把这份怅然装进胸口、不再用'看破'打发它——已经是十几年里第一次的进步了。"`}
              </p>
              {teaEasterEgg && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl mt-2.5 mb-2.5 space-y-1.5 animate-pulse text-left">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <span>🦊 🌸【灵狐小九 ㆍ 特别清芳彩蛋】</span>
                  </div>
                  <p className="text-[10px] text-amber-200/90 leading-relaxed italic">
                    "小九不知什么时候蹲在了桌角。她看了看你的茶杯，又看了看你：『嗯，水温对了，时间对了。但你也看见了——茶始终是一个人的茶。承认这一点，已经够了。』说完，她就不见了。"
                  </p>
                </div>
              )}
              <p className="font-bold text-amber-400 border-t border-emerald-500/10 pt-1 text-[10px] uppercase font-mono">
                🔑 获得人格碎片：【共情/EMPATHY】 ── 看清自己用精度替代亲近的能力。
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
  );
}
