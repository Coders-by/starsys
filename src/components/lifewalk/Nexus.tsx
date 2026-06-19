import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Workflow, Sparkles } from 'lucide-react';
import { useLifeMetrics } from './LifeMetricsContext';

/**
 * 穿针引线 —— 6 个 NPC 两两撮合。5 个特殊 pair 各自有定制剧情和成就，
 * 其余组合走通用"普通缘分"模板。pair key 用排序后的两个 id 拼，对换顺序结果一致。
 */

interface NPC {
  id: string;
  name: string;
  avatar: string;
  desc: string;
  skills: string[];
}

interface MatchResult {
  success: boolean;
  title: string;
  story: string;
  rewards: string[];
}

const NPCS: NPC[] = [
  {
    id: 'xu',
    name: '老徐',
    avatar: '🛠️',
    desc: '资深结构、五金硬件工程师。在南山开发小型智能关节电机，CNC打样经验极丰。常苦于无法接到国外订单。',
    skills: ['硬件开发', 'CNC供应链', '五金模具'],
  },
  {
    id: 'ling',
    name: '阿玲',
    avatar: '👩‍💻',
    desc: '在名校实验室和开源社区折腾 AI 图像检测与深度边缘化部署的女极客。不谙熟世故，手握机器视觉优秀算法，无用武之地。',
    skills: ['边缘AI', '机器视觉', 'Python'],
  },
  {
    id: 'peng',
    name: '鹏哥',
    avatar: '🏭',
    desc: '在宝安沙井拥有三家高精度五金 CNC 加工厂。人非常实诚爽快，但今年传统代工订单急缩，想引入科技转型，正愁没技术。',
    skills: ['CNC制造', '工厂供应链', '智能夹具'],
  },
  {
    id: 'qiang',
    name: '强少',
    avatar: '🚢',
    desc: '跨境电商大卖家，常年深耕海外亚马逊和独立站。极其敏锐，知道如何把一块塑料包装成智能微创新爆款。常苦于接不到定制柔性供应。',
    skills: ['海外电商', '营销引流', '市场洞察'],
  },
  {
    id: 'jie',
    name: '小洁',
    avatar: '🌸',
    desc: '喜欢古旧书籍、石碑金石拓印与摄影的文润姑娘。梦想去西藏或山间拾取记忆，内向少言。有一箱从祁连山背回的美丽干花。',
    skills: ['古董典籍', '温婉共情', '山野摄影'],
  },
  {
    id: 'jian',
    name: '阿健',
    avatar: '📷',
    desc: '古金石文物修复、篆刻痴迷者，背着老吉他的青年。他在冷门金石领域精研，但非常孤独，希望能遇到读懂金石斑驳故事的琴鸣之友。',
    skills: ['金石篆刻', '诗意民谣', '古籍修复'],
  },
];

interface SpecialPair {
  result: MatchResult;
  achievement?: string;
}

const SPECIAL_PAIRS: Record<string, SpecialPair> = {
  'peng-xu': {
    result: {
      success: true,
      title: '🚀【智能柔性液压夹具 ㆍ 工业突围】',
      story:
        '把【老徐】的精密结构件设计，和【鹏哥】的宝安高品质 CNC 加工生产能效穿针引线！两人在顺峰路大排档喝完白茶，第二天就共同研制出了一套低能耗、全自动的柔性工业夹具模块。沙井代工厂顺利拿下大批量特种结构出口订单，工厂破产警报全面解除！鹏哥在电话里吼叫着大笑：『千岑，今晚留声机底下的老茶我包送！』',
      rewards: ['🔓 黄金成就: 工业逆袭穿针人', '缘分共振 +30', '人格温度 +25'],
    },
    achievement: '沙井工业逆袭者',
  },
  'ling-peng': {
    result: {
      success: true,
      title: '👁️【AI 电脑视觉 ── 智能质检机器人】',
      story:
        '这真是天才般的偶合！你将【阿玲】开源的高精视觉检测 AI 模块，和【鹏哥】的重型滑轨机加工台成功对接。鹏哥在厂房提供五百台零件标定数据集，阿玲在深夜写下了第一行部署层过滤，完美解决了高反光镀锌零件微米级瑕疵检测的世界难题！不仅拯救了工厂质检良品率，还将耗损下降 35%。这是边缘黑客技术扎在宝安黑泥里的知行合一！',
      rewards: ['🔓 隐藏成就: 智能黑客落泥地', '缘分共振 +35', '人格温度 +30'],
    },
    achievement: '智能黑客扎落黑泥',
  },
  'ling-xu': {
    result: {
      success: true,
      title: '🦾【深圳南山 ㆍ 机器视觉随动假肢关节】',
      story:
        '阿玲的边缘AI目标预测逻辑，配合老徐多年底盘传动防爆电机功底，两人尝试给残障患者设计一款会自学习步态的机械仿生鞋底与随动机甲。他们在车库里连续通宵，听着徐良的有些甜腻的歌词度过。一次偶然饭局促成，两个孤独极客居然开始不计较商业，赤脚踩进造福具体特殊群体的技术长征中。',
      rewards: ['缘分共振 +25', '人格温度 +20'],
    },
  },
  'qiang-xu': {
    result: {
      success: true,
      title: '🚢【智能微创硬件 ㆍ 出海爆品】',
      story:
        '极具触觉嗅觉的跨境电商巨鳄【强少】，一眼相中【老徐】那款放在抽屉里蒙了三年灰的"多功能户外手势求生手电"。在强少的流量矩阵和海外定制包装下，手电在亚马逊瞬间卖空 20 万台，甚至引爆了极限探险圈！这就是深圳：极速研发 + 下沉供应链 + 狂飙的全球流量生态。缘分网络，正是改变命运最汹涌的机制！',
      rewards: ['缘分共振 +20', '人格温度 +15'],
    },
  },
  'jian-jie': {
    result: {
      success: true,
      title: '🌸❤️【古抄卷轴 ㆍ 祁连金石之约】',
      story:
        '天不生这两人，世上少了一双温柔人！你把醉心印痕古籍的内向姑娘【小洁】，和孤独弹奏《路过人间》温热低鸣的篆刻拓片修复者【阿健】撮合在了后海那座放着老唱机的茶叶院子。两人面红耳赤沉默了三分钟，直到阿健拿出他珍藏的格桑花碎樱拓印。两人相敬着聊了整整 8 个小时，连夕阳把茉莉花茶晒干都浑然不觉。真正的爱意，根本不需要算法预设阀门，它们在岁月的印戳上，宿命般彼此共鸣了。',
      rewards: ['🍁 终极浪漫彩蛋: 《可遇不可求的书香》', '缘分共振 +50', '人格温度 +45'],
    },
    achievement: '金石手抄本的执手',
  },
};

const DEFAULT_RESULT: MatchResult = {
  success: true,
  title: '⚙️ 普通缘分网络偶遇',
  story:
    '这两个人在饭局上喝着茶，聊起了南山的高房租和昨晚煮的溏心面。虽然没有惊动产业，但这种温厚的友谊也是深圳夜幕下多出了一撮温暖的篝火。千岑，你看着他们的名片，觉得人生真是由每一个细节撮合而成的。',
  rewards: ['共振力 +5', '人格温度 +8'],
};

export default function Nexus() {
  const { addHumanValue, addResonancePoints, triggerAchievement } = useLifeMetrics();
  const [selectedNPC1, setSelectedNPC1] = useState<string | null>(null);
  const [selectedNPC2, setSelectedNPC2] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const handleMatchMaking = () => {
    if (!selectedNPC1 || !selectedNPC2) return;
    const pairKey = [selectedNPC1, selectedNPC2].sort().join('-');
    const special = SPECIAL_PAIRS[pairKey];
    const result = special ? special.result : DEFAULT_RESULT;

    if (special?.achievement) triggerAchievement(special.achievement);

    setMatchResult(result);
    addResonancePoints(15);
    addHumanValue(15);
    setSelectedNPC1(null);
    setSelectedNPC2(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md text-left"
    >
      <div className="border-b border-stone-850/50 pb-2">
        <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">
          🕸️ 贪狼化权 ㆍ 缘分红尘强连网
        </span>
        <p className="text-[10px] text-stone-500 mt-0.5">
          千岑最非凡的外在特质：哪里有人，哪里就有连接；不要死等计划，去撮合那些不相干的灵魂，碰撞出奇效。
        </p>
      </div>

      <div className="space-y-3">
        <span className="text-[9.5px] font-bold text-stone-400 uppercase font-mono block">
          第一步：在凡间人海中，挑选两位你觉得能够产生奇妙化学反应的 NPC：
        </span>
        <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
          {NPCS.map((npc) => {
            const isSelected1 = selectedNPC1 === npc.id;
            const isSelected2 = selectedNPC2 === npc.id;
            const isSelected = isSelected1 || isSelected2;
            return (
              <button
                key={npc.id}
                onClick={() => {
                  setMatchResult(null);
                  if (isSelected1) {
                    setSelectedNPC1(null);
                  } else if (isSelected2) {
                    setSelectedNPC2(null);
                  } else if (!selectedNPC1) {
                    setSelectedNPC1(npc.id);
                  } else if (!selectedNPC2) {
                    setSelectedNPC2(npc.id);
                  }
                }}
                className={`p-2 rounded-xl border text-left flex gap-1.5 items-start cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-stone-200'
                    : 'bg-stone-950 border-stone-850 text-stone-400 hover:border-stone-750'
                }`}
              >
                <span className="text-xl shrink-0 select-none">{npc.avatar}</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[10.5px] font-extrabold text-stone-200">{npc.name}</span>
                    {isSelected && (
                      <span className="text-[7.5px] bg-amber-500 text-stone-950 font-bold px-1 rounded">已选</span>
                    )}
                  </div>
                  <p className="text-[8.5px] leading-tight text-stone-500 h-9 line-clamp-3 text-justify">
                    {npc.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-850 flex items-center justify-between gap-2.5">
          <div className="flex gap-2.5 items-center text-[10.5px]">
            <span className="font-bold text-stone-400">撮合队列:</span>
            <span className="font-extrabold text-stone-200 bg-stone-905 px-2 py-0.5 rounded">
              {selectedNPC1 ? NPCS.find((n) => n.id === selectedNPC1)?.name : '❓ 空席一'}
            </span>
            <span className="text-amber-500 font-extrabold">+</span>
            <span className="font-extrabold text-stone-200 bg-stone-905 px-2 py-0.5 rounded">
              {selectedNPC2 ? NPCS.find((n) => n.id === selectedNPC2)?.name : '❓ 空席二'}
            </span>
          </div>

          <button
            disabled={!selectedNPC1 || !selectedNPC2}
            onClick={handleMatchMaking}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-stone-950 font-black py-1.5 px-3.5 rounded-lg text-[10px] cursor-pointer shrink-0 transition-opacity"
          >
            ⚡ 穿针引线
          </button>
        </div>

        {matchResult && (
          <div className="p-3.5 bg-amber-500/5 border-2 border-amber-500/25 rounded-xl space-y-2.5 text-[10.5px] leading-relaxed text-left animate-[fadeIn_0.3s_ease_1]">
            <div className="flex items-center gap-1.5 text-amber-300 font-extrabold">
              <Workflow className="w-4 h-4" />
              <span>{matchResult.title}</span>
            </div>

            <p className="text-[10.5px] text-justify text-stone-300 font-mono italic leading-relaxed bg-stone-950/70 p-3 rounded-lg border border-stone-900">
              "{matchResult.story}"
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-stone-900">
              <span className="text-[9px] text-stone-500 font-bold font-mono">获得凡间气象滋养：</span>
              {matchResult.rewards.map((r, ri) => (
                <span
                  key={ri}
                  className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[8.5px] font-mono leading-none flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
