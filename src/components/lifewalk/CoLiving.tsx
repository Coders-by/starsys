import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLifeMetrics } from './LifeMetricsContext';

/**
 * 合租碎片 —— 出租屋 11 PM 的物理细节探索。
 * 4 个入口：冰箱 / 阳台 / 灶台 / 沙发。每个入口 3 个选择，落点不同。
 */

interface CoLivingChoice {
  label: string;
  id: string;
  result: string;
  effect: () => void;
}

interface CoLivingEvent {
  title: string;
  desc: string;
  choices: CoLivingChoice[];
}

export default function CoLiving() {
  const { addHumanValue, triggerAchievement } = useLifeMetrics();
  const [coLivingObj, setCoLivingObj] = useState<string | null>(null);
  const [coLivingChoice, setCoLivingChoice] = useState<string | null>(null);

  const coLivingEvents: Record<string, CoLivingEvent> = {
    fridge: {
      title: '🧭 11:00 PM ㆍ 冰箱深处的隐秘',
      desc: '冰箱散发微小的机器嗡鸣。底层翻出一盒生产日期奇特、已过期 3 天的鲜牛奶。你感到焦躁却空虚。',
      choices: [
        {
          label: '一饮而尽 (喝)',
          id: 'drink',
          result:
            '【胃部的野蛮复苏】：辛辣与牛奶的发酵在你胃里起舞。你在痛感中找到了在北极极寒标定智能汽车APA时的野蛮冲劲。深圳的生活，有时确实需要一点游牧民族的莽撞！',
          effect: () => addHumanValue(10),
        },
        {
          label: '环保扔掉 (扔掉)',
          id: 'throw',
          result:
            '【理智的极简断舍离】：你理智地把它扔进干湿分类垃圾桶。生活没有太多容错，删掉无用的代码，也洗干净深夜的烦闷。保持清醒是工程师的最高原则。',
          effect: () => addHumanValue(5),
        },
        {
          label: '研究包装印刷与质保期 (研究生产日期)',
          id: 'study',
          result:
            "【解锁隐藏成就 ──《工程师职业病》】：你仔细端详喷码印刷，估算灭菌封装工艺和牛奶抗原缓冲冗余，甚至开始构想其物流温控供应链失效概率模型。同合租舍友叹了口气：『千岑，你连下晚饭的饮料都要做失效模式分析（FMEA）吗？』但随后他陪你热了一壶白茶。",
          effect: () => {
            triggerAchievement('工程师的职业病');
            addHumanValue(20);
          },
        },
      ],
    },
    balcony: {
      title: '🌌 11:20 PM ㆍ 阳台冷风与科兴灯火',
      desc: '走出阳台，热带夜风吹在温热的脖颈上。远处科兴科学园的高楼依旧亮着冰冷的长明灯，代表着千百台服务器与无眠的程序员，你收着晒得略微脆硬的干透衣物。',
      choices: [
        {
          label: '倚在栏杆上，放空眺望这连绵不绝的城市亮光',
          id: 'gaze',
          result:
            '【就是发了个呆】：在无数加班灯光的背景下，你只是默默收拢自己的衣袖。不试图去用算法征服它，也不用理智解剖它，你感到一种超脱的放松。我们终究只是在冷酷的系统间寻找微小生路的凡世旅人。',
          effect: () => addHumanValue(10),
        },
        {
          label: '专注折叠带有太阳余温的棉质衬衫',
          id: 'fold',
          result:
            '【叠了叠衬衫而已】：一件件抚平褶皱，折叠整齐。粗糙的棉线在手心带来微麻微痒的触感。我们在数字虚无里过得太空，需要洗干净的热水、晒干脆的棉布来抚慰这滚烫温热的实体。',
          effect: () => addHumanValue(15),
        },
        {
          label: '把头埋进带有淡淡茉莉花香的抱枕里安眠',
          id: 'sleep',
          result:
            '【把头埋进枕头睡一觉】：揉揉酸胀的额头，把脸埋进带有茉莉花余香的暖融靠垫。没有算法，没有关系警报，唯有空气中残留的一丝烤串孜然香气，陪伴你滑入彻底不求解答的睡眠里。',
          effect: () => addHumanValue(10),
        },
      ],
    },
    kitchen: {
      title: '🍜 11:40 PM ㆍ 灶台水开了，煮还是不煮',
      desc: '灶上一锅水正在冒泡。冰箱里翻出半把挂面、两颗皱巴巴的小番茄、一袋去年剩下的紫菜。手机冷光打在不锈钢台面上，胃部传来一种说不清是饿还是空的感觉。',
      choices: [
        {
          label: '老老实实煮一碗清汤挂面',
          id: 'simple',
          result:
            '【最朴素的那一碗】：把锅刷净，把面下锅，把蛋打散冲进汤里。一碗清汤不加油不加肉，只有挂面、紫菜、葱花。喝下去那一口胃暖了，整夜的代码 bug 都成了别的世界的事。这就是深夜灶台最朴素的礼物：让一个加班到 11 点半的人，记起自己还是个人。',
          effect: () => addHumanValue(10),
        },
        {
          label: '翻冰箱底，凑一锅"千岑式深夜浓汤"',
          id: 'jumble',
          result:
            "【冰箱底料炼丹】：半把挂面、两颗皱小番茄、一袋紫菜、底层那盒昨天没喝完的酸奶……你开始一边煮一边怀疑自己在做菜还是做实验。最后端出来一碗带着番茄酸甜、紫菜咸鲜、说不清主调的浓汤。舍友闻味出来吐槽：『哥你这是搞 AB 测试呢？』你笑笑递过去一勺：『先尝再喷。』他喝完没说话，默默又盛了一碗。",
          effect: () => {
            triggerAchievement('冰箱底料炼丹师');
            addHumanValue(20);
          },
        },
        {
          label: '不煮了，把堆了三天的盘子刷了',
          id: 'clean',
          result:
            '【投资基础设施】：把灶上的水关了，把堆了三天的碗刷干净，把厨余倒进可降解袋。手腕酸了，但厨房恢复成可以重新开始做饭的样子。有时候不饿，也不馋，只是想给明天那个会饿的自己留一个干净台面。这种姿势工程上叫『投资基础设施』，生活里叫『不糟蹋自己』。',
          effect: () => addHumanValue(15),
        },
      ],
    },
    sofa: {
      title: '🛋️ 11:50 PM ㆍ 沙发上的合租日常',
      desc: '客厅那张三人座沙发，左边凹陷的那块是舍友固定坐的位置。他刚下班瘫在那里刷短视频，电视开着但没人看，机顶盒 logo 在墙上反光。茶几上散着两个外卖盒和一袋没拆的瓜子。',
      choices: [
        {
          label: '一屁股坐过去，跟他扯几句废话',
          id: 'chat',
          result:
            '【废话是文明的奢侈品】：你坐下，没什么主题，就是聊。聊小区今天换的快递柜，聊楼下那家肠粉店是不是要倒闭了，聊他姐相亲的对象到底是不是奇葩。话题碎得像炒花生米。但聊着聊着你突然意识到：这一段日子里你最放松的时刻，居然是这种没有 KPI、没有共识、没有结论的废话时间。',
          effect: () => addHumanValue(15),
        },
        {
          label: '默默拆瓜子，跟他一起发呆',
          id: 'seeds',
          result:
            "【一起待着但不互相打扰】：你拆开那袋瓜子，找了沙发右边的位置坐下。两个人都不说话，但谁也不觉得尴尬。他刷他的视频，你嗑你的瓜子，电视背景音里飘着不知谁家儿子结婚的祝词。这种安静，是合租生活给两个互不为家的成年人，最体面的礼物。",
          effect: () => addHumanValue(10),
        },
        {
          label: '不动声色把茶几上的外卖盒收了，递他一张湿巾',
          id: 'tidy',
          result:
            '【合租到第三年的默契】：你没说什么，只是顺手把两个外卖盒子扔了，把瓜子壳推到一处，把湿巾递过去。他愣了一下，没接，过了三秒说了句：『谢了哥。』就这五个字。这就是合租到第三年的默契：你知道他这周项目压力很大，他知道你今晚刚加完班，谁也不需要谁的安慰，但谁都顺手让对方的桌面再干净一点。',
          effect: () => {
            triggerAchievement('不动声色的体面');
            addHumanValue(20);
          },
        },
      ],
    },
  };

  const entries = [
    { id: 'fridge', title: '🥛 厨房冰箱', emoji: '🧊', desc: '发现一盒过期牛奶...' },
    { id: 'balcony', title: '🍃 客厅阳台', emoji: '🏢', desc: '收晾衣，看科兴灯火...' },
    { id: 'kitchen', title: '🍜 深夜灶台', emoji: '🍳', desc: '煮一包面或刷洗盘子...' },
    { id: 'sofa', title: '🛋️ 起居沙发', emoji: '🛋️', desc: '揉揉眼，跟舍友废话...' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md"
    >
      <div className="border-b border-stone-850/50 pb-2">
        <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">
          🏢 深夜 11点的出租屋：让坚硬剥落
        </span>
        <p className="text-[10px] text-stone-500 mt-0.5">
          合租房里点着昏黄的荧光，一切都是那么平常。点击你想探索的物理细节：
        </p>
      </div>

      {!coLivingObj ? (
        <div className="grid grid-cols-2 gap-3">
          {entries.map((obj) => (
            <button
              key={obj.id}
              onClick={() => setCoLivingObj(obj.id)}
              className="bg-stone-950 p-3.5 rounded-xl border border-stone-850 hover:border-amber-500/30 text-left space-y-1 cursor-pointer hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xl">{obj.emoji}</span>
                <span className="text-[10.5px] font-extrabold text-stone-200">{obj.title}</span>
              </div>
              <p className="text-[9.5px] text-stone-500 truncate leading-snug">{obj.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease_1]">
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-850 space-y-1.5">
            <span className="text-[10.5px] font-bold text-amber-400">{coLivingEvents[coLivingObj].title}</span>
            <p className="text-stone-300 text-[10.5px] leading-relaxed text-justify">
              {coLivingEvents[coLivingObj].desc}
            </p>
          </div>

          {!coLivingChoice ? (
            <div className="grid grid-cols-1 gap-2">
              {coLivingEvents[coLivingObj].choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCoLivingChoice(c.id);
                    c.effect();
                  }}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/30 p-2.5 rounded-xl text-left text-[10.5px] font-mono text-stone-300 flex items-center justify-between group cursor-pointer"
                >
                  <span>👉 {c.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-400 transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-left">
              <span className="text-[10.5px] font-bold text-amber-300 block">📢 触发生活共鸣折射：</span>
              <p className="text-[10.5px] text-stone-200 italic leading-relaxed text-justify font-mono">
                {coLivingEvents[coLivingObj].choices.find((c) => c.id === coLivingChoice)?.result}
              </p>
              <button
                onClick={() => {
                  setCoLivingObj(null);
                  setCoLivingChoice(null);
                }}
                className="w-full mt-2 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-[10px] font-bold text-stone-400 text-center hover:text-stone-200 cursor-pointer"
              >
                ← 重新返回深夜客厅
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
