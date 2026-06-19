import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLifeMetrics } from './LifeMetricsContext';

/**
 * KTV 歌痕 —— 情感线的三首歌。
 *
 * 不绑定红/蓝/金星系（那是 StarSysGame 的工程/心智线）。
 * 这里走一条独立连贯的情感叙事：钢铁浇铸 → 标本馆 → 第一次想融化。
 *
 * 三首歌都来自 vault 真实素材：
 *   I.   《美丽的神话》       ← 2024-12-15.md:1-2 (四年级"心如钢铁"烙印)
 *   II.  《后会无期》          ← 几段情迷-1.md:25 (她哭了我笑了我都忘了为什么)
 *   III. 《Through the Rain》  ← 20250204逐字分析.md:228-230 (偷偷把"你"改成"我们")
 *
 * 卸载/切歌时 cleanup interval：useEffect 的 cleanup 比手持 timer state 直接得多。
 */

/**
 * KTV 歌痕 —— 情感线的三首歌。
 *
 * 三段一气呵成的叙事曲线：
 *   I.   《美丽的神话》       ← 2024-12-15.md:1-2  (钢铁浇铸：四年级"心如钢铁"自己签的字)
 *   II.  《Through the Rain》  ← 20250204逐字分析.md:228-230 (标本馆：±0.5°C 把人冻成数据)
 *   III. 《路过人间》          ← 现实素材综合 (破相：发现"看破"只是钢铁穿了袈裟)
 *
 * 每首跟一段 xiaojiuNote 做体温对位 —— reflection 提供锋利，小九提供陪伴。
 *
 * 卸载/切歌时 cleanup interval：useEffect 的 cleanup 比手持 timer state 直接得多。
 */

interface Song {
  id: string;
  title: string;
  era: string;
  desc: string;
  lyrics: string[];
  reflection: string;
  xiaojiuNote?: string;
}

const SONG_LIST: Song[] = [
  {
    id: 'mistry',
    title: '《美丽的神话》',
    era: '情感线 I ㆍ 钢铁浇铸',
    desc: '四年级电视里循环到磨损的那首歌。当时听不懂，但身体先记住了。',
    lyrics: [
      '心如钢铁任世界荒芜...',
      '思念永相随...',
      '四年级。电视里孙楠在唱。我没听懂歌词在说什么——我只挑出了"心如钢铁"四个字，然后用一辈子去执行它。',
      '【记忆碎片释出】: 之后每一次心跳都被这四个字提前否决——你不能真的喜欢她，你早就签了字。',
    ],
    reflection:
      '听这首歌哭，不是因为它写得有多好——是因为四年级那个我，自己念了一句咒，然后真的活成了它。"心如钢铁"四个字之后，我十几年里所有的"算了吧"、"配不上"、"再说吧"，都是在替这一行歌词打工。我以为我在保护，其实我在浇铸。这是钢铁浇铸的那一刻——我自己浇的，没有人逼我。',
  },
  {
    id: 'rain',
    title: '《Through the Rain》',
    era: '情感线 II ㆍ 标本馆',
    desc: '一首英文歌。她说她那年的年度歌手是 TIA。我把歌词翻译给她，偷偷改了一个词。她从来不知道。',
    lyrics: [
      'When you get caught in the rain / With nowhere to run...',
      '校友会那晚的巧合，像一杯水温误差正负 0.5°C 的茉莉花茶——精准到我立刻怀疑这是某种安排。',
      '"我泡了同款，要不要尝尝？" "最近在戒糖。" "这茶不加糖。" "还是不了。"——外面烟花在响，我捧着那杯永远不会被尝的茶，愣了几秒。',
      '【记忆碎片释出】: 我把"你可以在雨中独行"翻译成"我们"——然后没敢发。我把最想说的那个词，悄悄藏进了自己的备忘录。',
    ],
    reflection:
      '我以为校友会那晚的巧合是命运。其实那只是我又一次成功地用 ±0.5°C 的精度，把一个具体的人安全地放进了我熟悉的刻度里。她说"还是不了"，烟花在外面响，我端着那杯不会被尝的茶——这才看清：标本馆不是博物馆，是冷库。每一次"水温必须精准"都是冷库的恒温器。最想说的"我们"我只敢悄悄写在备忘录里——这不是含蓄。是我用一辈子的精度，替她选好了"她可以走"。',
  },
  {
    id: 'pass',
    title: '《路过人间》',
    era: '情感线 III ㆍ 热水澡里的破相',
    desc: '一个人住的大平层。冲澡的时候这首歌跳出来——花洒不会替我说话，但热气把玻璃蒙住了。我躲不了了。',
    lyrics: [
      '嗨 意不意外 尘埃落定之后...',
      '路过人间 无非一整面山海，一具温热水滴下冲洗着的凡俗肉身。',
      '在花洒下站了很久。突然停下来——我用"凡所有相皆是虚妄"这句话，到底躲了多少年？',
      '【记忆碎片释出】: 钢铁是怎么浇铸的、标本馆是怎么运作的、"看破红尘"是怎么把这两件事盖了一个章合法化的——这一刻我全看见了。',
    ],
    reflection:
      '热水浇下来的时候我停住了——我用"凡所有相皆是虚妄"躲了多少年？这句话太方便了，方便到只要说一句"看破"，我就可以心安理得地不伸手。那个看着她哭还笑得出来的我，那个把茉莉花茶调到 ±0.5°C 的我，那个把"我们"藏在备忘录里的我——不是不会爱。是用"看破"给"不爱"颁了一张奖状。原来我十几年的"看破"，只是钢铁套了一件袈裟。袈裟很好看——它让我可以摆出"我懂"的姿态，继续把每一个具体的人冻成标本。今天热水把它泡软了。我没有立刻变好。但我至少不能再躲在它后面了。',
    xiaojiuNote:
      '袈裟泡软了。热气把整面玻璃蒙住，我从外面看不太清——但我知道你哭了。听好啊过河客：破相不是结束，破相是 day 1。明天你还是会犯老毛病，还是会把水温调到 ±0.5°C，还是会把"我们"塞进备忘录。但今天你看见了。看见之后再犯，就不一样了。我陪你。茶不烫了，喝吧。',
  },
];

export default function KTV() {
  const { addHumanValue, triggerAchievement } = useLifeMetrics();
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [singProgress, setSingProgress] = useState<number>(0);
  const [lyricIndex, setLyricIndex] = useState<number>(0);

  // 定时器跟随 currentSong 生命周期，切歌或卸载自动 cleanup。
  useEffect(() => {
    if (!currentSong) return;
    setSingProgress(0);
    setLyricIndex(0);
    let chunk = 0;
    const interval = setInterval(() => {
      chunk += 1;
      setSingProgress((prev) => Math.min(100, prev + 25));
      setLyricIndex((prev) => Math.min(3, prev + 1));
      addHumanValue(3);
      if (chunk >= 4) {
        clearInterval(interval);
        triggerAchievement(`收集共鸣歌痕: ${currentSong}`);
      }
    }, 2800);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md text-left"
    >
      <div className="border-b border-stone-850/50 pb-2">
        <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">
          🎤 留声星歌房 ㆍ 情感线的三首歌
        </span>
        <p className="text-[10px] text-stone-500 mt-0.5">
          这是同一条情感线被三首歌切开的三个瞬间——钢铁怎么浇铸、怎么收集遗憾、第一次想融化。
        </p>
      </div>

      {!currentSong ? (
        <div className="space-y-2.5">
          {SONG_LIST.map((song) => (
            <div
              key={song.id}
              className="bg-stone-950 p-3.5 rounded-xl border border-stone-850 flex justify-between items-center gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base text-rose-400 font-extrabold">{song.title}</span>
                  <span className="text-[8.5px] bg-stone-900 px-1.5 py-0.5 rounded border border-stone-850 text-stone-400 font-mono">
                    {song.era}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 leading-snug">{song.desc}</p>
              </div>
              <button
                onClick={() => setCurrentSong(song.id)}
                className="bg-amber-500 text-stone-950 font-black py-1.5 px-3.5 rounded-lg text-[10px] hover:bg-amber-400 transition-all select-none cursor-pointer shrink-0"
              >
                🎙️ 点唱
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-4 animate-[fadeIn_0.3s_ease_1]">
          <div className="flex justify-between items-center border-b border-stone-900 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg text-rose-400 font-bold">
                正在演歌: {SONG_LIST.find((s) => s.id === currentSong)?.title}
              </span>
            </div>
            <button
              onClick={() => setCurrentSong(null)}
              className="text-stone-500 hover:text-stone-300 text-[10px] font-mono"
            >
              切歌 ✖
            </button>
          </div>

          <div className="h-28 bg-stone-900/60 rounded-xl border border-stone-850/60 p-3 flex flex-col justify-center items-center text-center relative overflow-hidden select-none">
            <div className="absolute top-2 left-3 text-[7.5px] uppercase font-mono text-stone-600 bg-stone-950 px-1 py-0.5 rounded">
              Lyric Stream Realtime v1.0
            </div>

            <div className="space-y-2">
              <p className="text-xs text-amber-300 font-extrabold animate-pulse">
                🎤 {SONG_LIST.find((s) => s.id === currentSong)?.lyrics[lyricIndex]}
              </p>
              <p className="text-[10px] text-stone-600 italic">
                {lyricIndex < 3 ? '...' : '🎉 心智记忆碎块完全解锁，人格温度上升！'}
              </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 transition-all duration-[2600ms]"
                style={{ width: `${singProgress}%` }}
              />
            </div>
          </div>

          {singProgress < 100 ? (
            <div className="p-3 text-center bg-stone-900/40 rounded-xl border border-stone-905 italic text-[10px] text-stone-500 animate-pulse">
              🔊 闭眼吟唱中... 声波与往昔冬星达成频率契合...
            </div>
          ) : (
            <>
              <div className="p-3.5 bg-rose-500/5 border border-rose-500/20 text-stone-300 text-[10.5px] leading-relaxed text-justify font-mono rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-rose-400 block">🗝️ 捕获隐藏情感痕印：</span>
                <p className="italic text-stone-200">
                  "{SONG_LIST.find((s) => s.id === currentSong)?.reflection}"
                </p>
              </div>

              {/* 小九的茶旁注 —— 只在某些歌后才出现（避免密度过高把小九稀释成伴奏） */}
              {SONG_LIST.find((s) => s.id === currentSong)?.xiaojiuNote && (
                <div className="p-3.5 bg-emerald-950/25 border border-teal-500/20 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🦊</span>
                    <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
                      小九的茶旁注
                    </span>
                  </div>
                  <p className="text-[10.5px] text-stone-200 leading-relaxed text-justify italic">
                    {SONG_LIST.find((s) => s.id === currentSong)?.xiaojiuNote}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
