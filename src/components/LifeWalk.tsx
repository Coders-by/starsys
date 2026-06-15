import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Users, 
  Heart, 
  Bike, 
  Coffee, 
  Music, 
  MessageSquare, 
  Workflow, 
  Zap, 
  Gift, 
  Smile, 
  Compass, 
  Activity,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

interface NPC {
  id: string;
  name: string;
  avatar: string;
  desc: string;
  skills: string[];
  resonanceCost?: string;
}

export default function LifeWalk() {
  // --- Global Life Metrics ---
  const [humanValue, setHumanValue] = useState<number>(35); // Personhood Temperature (人格温度)
  const [resonancePoints, setResonancePoints] = useState<number>(10); // Resonance Power (缘分共振)
  const [activeSubTab, setActiveSubTab] = useState<'co_living' | 'zen_moments' | 'ktv' | 'midnight' | 'nexus'>('co_living');
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  // Add achievement helper
  const triggerAchievement = (name: string) => {
    if (!unlockedAchievements.includes(name)) {
      setUnlockedAchievements(prev => [...prev, name]);
      setHumanValue(prev => prev + 15);
    }
  };

  // --- STATE 1: CO-LIVING FRAGMENTS (合租碎片) ---
  const [coLivingObj, setCoLivingObj] = useState<string | null>(null);
  const [coLivingChoice, setCoLivingChoice] = useState<string | null>(null);

  // --- STATE 2: ZEN MOMENT (禅意朋友圈) ---
  const [zenOption, setZenOption] = useState<string | null>(null);
  const [feedLiked, setFeedLiked] = useState<boolean>(false);
  const [lifeTeaTemp, setLifeTeaTemp] = useState<number>(55);
  const [lifeTeaTime, setLifeTeaTime] = useState<number>(15);
  const [lifeTeaSuccess, setLifeTeaSuccess] = useState<boolean>(false);

  // --- STATE 3: KTV CARAOKE MODE (KTV记忆歌房) ---
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [singProgress, setSingProgress] = useState<number>(0);
  const [singTimer, setSingTimer] = useState<NodeJS.Timeout | null>(null);
  const [lyricIndex, setLyricIndex] = useState<number>(0);

  // --- STATE 4: MIDNIGHT MOTORCYCLE / RIDE (深夜骑行) ---
  const [rideType, setRideType] = useState<'bike' | 'walk' | null>(null);
  const [rideProgress, setRideProgress] = useState<number>(0);
  const [rideActive, setRideActive] = useState<boolean>(false);
  const [rideLog, setRideLog] = useState<string[]>([]);
  const [rideEncounters, setRideEncounters] = useState<string[]>([]);

  // --- STATE 5: DESTINY NEXUS MATCHMAKING (穿针引线) ---
  const [selectedNPC1, setSelectedNPC1] = useState<string | null>(null);
  const [selectedNPC2, setSelectedNPC2] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<{
    success: boolean;
    title: string;
    story: string;
    rewards: string[];
  } | null>(null);

  // --- CO-LIVING EVENTS CONFIG ---
  const coLivingEvents: Record<string, {
    title: string;
    desc: string;
    choices: {
      label: string;
      id: string;
      result: string;
      effect: () => void;
    }[];
  }> = {
    fridge: {
      title: "🧭 11:00 PM ㆍ 冰箱深处的隐秘",
      desc: "冰箱散发微小的机器嗡鸣。底层翻出一盒生产日期奇特、已过期 3 天的鲜牛奶。你感到焦躁却空虚。",
      choices: [
        {
          label: "一饮而尽 (喝)",
          id: "drink",
          result: "【胃部的野蛮复苏】：辛辣与牛奶的发酵在你胃里起舞。你在痛感中找到了在北极极寒标定智能汽车APA时的野蛮冲劲。深圳的生活，有时确实需要一点游牧民族的莽撞！",
          effect: () => { setHumanValue(p => p + 10); }
        },
        {
          label: "环保扔掉 (扔掉)",
          id: "throw",
          result: "【理智的极简断舍离】：你理智地把它扔进干湿分类垃圾桶。生活没有太多容错，删掉无用的代码，也洗干净深夜的烦闷。保持清醒是工程师的最高原则。",
          effect: () => { setHumanValue(p => p + 5); }
        },
        {
          label: "研究包装印刷与质保期 (研究生产日期)",
          id: "study",
          result: "【解锁隐藏成就 ──《工程师职业病》】：你仔细端详喷码印刷，估算灭菌封装工艺和牛奶抗原缓冲冗余，甚至开始构想其物流温控供应链失效概率模型。同合租舍友叹了口气：『千岑，你连下晚饭的饮料都要做失效模式分析（FMEA）吗？』但随后他陪你热了一壶白茶。",
          effect: () => { 
            triggerAchievement("工程师的职业病");
            setHumanValue(p => p + 20);
          }
        }
      ]
    },
    balcony: {
      title: "🌌 11:20 PM ㆍ 阳台冷风与科兴灯火",
      desc: "走出阳台，热带夜风吹在温热的脖颈上。远处科兴科学园的高楼依旧亮着冰冷的长明灯，代表着千百台服务器与无眠的程序员，你收着晒得略微脆硬的干透衣物。",
      choices: [
        {
          label: "倚在栏杆上，放空眺望这连绵不绝的城市亮光",
          id: "gaze",
          result: "【在无限算力外的静谧安详】：在无数加班灯光的背景下，你只是默默收拢自己的衣袖。不试图去用算法征服它，也不用理智解剖它，你感到一种超脱的放松。我们终究只是在冷酷的系统间寻找微小生路的凡世旅人。",
          effect: () => { setHumanValue(p => p + 10); }
        },
        {
          label: "专注折叠带有太阳余温的棉质衬衫",
          id: "fold",
          result: "【触摸真实的厚实】：一件件抚平褶皱，折叠整齐。粗糙的棉线在手心带来微麻微痒的触感。我们在数字虚无里过得太空，需要洗干净的热水、晒干脆的棉布来抚慰这滚烫温热的实体。",
          effect: () => { setHumanValue(p => p + 15); }
        },
        {
          label: "把头埋进带有淡淡茉莉花香的抱枕里安眠",
          id: "sleep",
          result: "【不求解答的具体安眠】：揉揉酸胀的额头，把脸埋进带有茉莉花余香的暖融靠垫。没有算法，没有关系警报，唯有空气中残留的一丝烤串孜然香气，陪伴你滑入彻底不求解答的睡眠里。",
          effect: () => { setHumanValue(p => p + 10); }
        }
      ]
    }
  };

  // --- ZEN朋友圈 EVENTS ---
  const handleZenSelection = (opt: string) => {
    setZenOption(opt);
    if (opt === 'roast') {
      setResonancePoints(p => p + 5);
      setHumanValue(p => p + 20);
    } else if (opt === 'think') {
      setHumanValue(p => p + 15);
    } else {
      setHumanValue(p => p + 10);
    }
  };

  // --- KTV MODE SONG LIST ---
  const songList = [
    {
      id: "houhui",
      title: "《后会无期》",
      era: "高中时代 ㆍ 红星澄澈初识",
      desc: "在老式录放音机与泛黄教案中，寻找那些因为矜持而未能投递的少年执意。",
      lyrics: [
        "当一艘船沉入海底...",
        "当一个人成了谜...",
        "那是在高三蝉鸣深处，你冷言叉掉她QQ窗口的反向真情实忆。",
        "【记忆碎片释出】: 我用冷漠做装甲，只因害怕卑微的自己，无法承受她纯粹如流星雨般投射的光芒..."
      ],
      reflection: "在这句歌词里，我吹散了少年青涩退缩的烟尘。曾因为害怕被拒绝，就固执地在面对真心时假装冷漠、转身大步跑开。然而回忆温热地回首，我终于能隔着十几载的光景，真诚地对那个勇敢送出纸条的女孩说声珍重。"
    },
    {
      id: "qishi",
      title: "《路过人间》",
      era: "青年Gap期 ㆍ 蓝星山海顿悟",
      desc: "在山海间的大平层里冲温水澡听着歌，突然顿悟『凡所有相，皆是虚妄』本身也是逃避红尘的虚妄。",
      lyrics: [
        "嗨 意不意外 尘埃落定之后...",
        "路过人间 无非一整面山海，一具温热水滴下冲洗着的凡俗肉身。",
        "在大平层巨大的科技感花洒下，热水冲刷着疲惫、世俗、注定要在宿命中老去的肉体。那一刻《路过人间》温热低鸣。我突然自嘲一笑：原来我过去长久执迷并用来防身的那句『凡所有相，皆是虚妄』，其本身也不过是一种极其高级、极其自负的思维虚妄。我借着傲慢的‘看破与空无’，逃避了真实的相看与纠缠宿因。",
        "【记忆碎片释出】: 真正的解脱绝不是高悬在云端谈论虚妄，而是这具注定‘路过’的身体热烈地爱恨、痛快地落泪，落落大方地踏入滚烫的烟火人间中去。"
      ],
      reflection: "在这句歌词里，我终于理解了《路过人间》的温热。原来曾经我高挂在心头的‘凡所有相，皆是虚妄’，不过是用来逃避深情摩擦的免责借口。如果不曾弄脏双手、真实痛快地哭笑过，自诩超脱的空空悟执，本身也就是最大的思维虚妄。"
    },
    {
      id: "sansan",
      title: "《说散就散》",
      era: "关系重叠 ㆍ 金星痛楚共情",
      desc: "打破理智、放下防御阀门，经历情感爆裂时的撕裂痛快，去触碰生命具体的痛感与温度。",
      lyrics: [
        "抱一抱就当作从没在一起...",
        "因为成长，我们忽而间拆散了对方...",
        "那一刻，你第一次红着眼睛在暴雪冬夜捧着 85°C 茉莉花茶嚎啕大哭。你没有启动'优雅降级避险算法'。",
        "【记忆碎片释出】: 虽然很痛，但我终于踩入过对流的真情泥泞里。我爱过了，我痛过了。我的人格共情，在一面镜子的回声碎裂声中，融成了温热的实体。"
      ],
      reflection: "在这句歌词里，我终于拆掉了情感的安全阀门。在暴风雪标定的深夜，紧握那一杯温热的 85°C 茉莉花茶放声痛哭。没有退缩方案，没有安全冗余。在真实地痛饮生活的苦辣后，我终结了做一个观察者冷眼旁观的漫长惩罚，获得了血肉有温的生命实体。"
    }
  ];

  const handleStartSing = (songId: string) => {
    if (singTimer) clearInterval(singTimer);
    setCurrentSong(songId);
    setSingProgress(0);
    setLyricIndex(0);
    
    let chunk = 0;
    const interval = setInterval(() => {
      chunk += 1;
      setSingProgress(prev => Math.min(100, prev + 25));
      setLyricIndex(prev => Math.min(3, prev + 1));
      setHumanValue(p => p + 3);
      if (chunk >= 4) {
        clearInterval(interval);
        triggerAchievement(`收集共鸣歌痕: ${songId}`);
      }
    }, 2800);
    setSingTimer(interval);
  };

  // --- MIDNIGHT RIDE SYSTEM ---
  const handleStartRide = (type: 'bike' | 'walk') => {
    setRideType(type);
    setRideProgress(0);
    setRideActive(true);
    setRideLog([]);
    setRideEncounters([]);

    const routeEncountersPool = [
      {
        text: "🍢 偶遇【深夜路边烧烤摊】",
        log: "在南山村破旧的小塑料凳坐下，铁签呲溜呲溜冒着烟。旁边的闪送小哥累得眼睛通红，狠狠灌了一口菠萝啤。你点了串烤香菇、烤面筋，那一刻你们只是在这块铁皮锅下的战友，相视一笑。这，才是活着的温热。",
        ach: "深夜串共鸣"
      },
      {
        text: "🐱 发现【绿化带里藏着的流浪小橘猫】",
        log: "在深圳湾海风中，灌木丛传出微弱奶猫叫声。你把口袋里刚买的鱼肠撕开掰碎，伸出食指。小猫哆嗦着凑过来，用湿漉漉的鼻子碰了碰你冒着汗的指尖，一阵带微小摩擦却极解压的共鸣温存。你融化了。",
        ach: "萌猫护航师"
      },
      {
        text: "🚴‍♂️ 碰见【推着黄色共享单车的红眼程序员】",
        log: "他挂着双肩电脑包，因为找不着车锁而有些急了。你主动上前帮他扫开。他叹气：『智能驾驶定位又飘移了，标定真折磨人。』你一笑：『没事，今天降一点过滤阈值，明天再战。』他错愕地握握你的手：『哥们同行？谢了！』",
        ach: "千岑引线"
      }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      setRideProgress(prev => {
        const next = Math.min(100, prev + 33.3);
        if (next >= 100) {
          clearInterval(interval);
          setRideActive(false);
          triggerAchievement(`深夜漫游: ${type === 'bike' ? '单车飞驰' : '海岸徒步'}`);
        }
        return next;
      });

      const nextEnc = routeEncountersPool[currentStep - 1];
      if (nextEnc) {
        setRideEncounters(prev => [...prev, nextEnc.text]);
        setRideLog(prev => [...prev, nextEnc.log]);
        setHumanValue(h => h + 15);
        setResonancePoints(r => r + 5);
      }
    }, 2600);
  };

  // --- NPC POOL (DESTINY NEXUS) ---
  const npcs: NPC[] = [
    { id: "xu", name: "老徐", avatar: "🛠️", desc: "资深结构、五金硬件工程师。在南山开发小型智能关节电机，CNC打样经验极丰。常苦于无法接到国外订单。", skills: ["硬件开发", "CNC供应链", "五金模具"] },
    { id: "ling", name: "阿玲", avatar: "👩‍💻", desc: "在名校实验室和开源社区折腾 AI 图像检测与深度边缘化部署的女极客。不谙熟世故，手握机器视觉优秀算法，无用武之地。", skills: ["边缘AI", "机器视觉", "Python"] },
    { id: "peng", name: "鹏哥", avatar: "🏭", desc: "在宝安沙井拥有三家高精度五金 CNC 加工厂。人非常实诚爽快，但今年传统代工订单急缩，想引入科技转型，正愁没技术。", skills: ["CNC制造", "工厂供应链", "智能夹具"] },
    { id: "qiang", name: "强少", avatar: "🚢", desc: "跨境电商大卖家，常年深耕海外亚马逊和独立站。极其敏锐，知道如何把一块塑料包装成智能微创新爆款。常苦于接不到定制柔性供应。", skills: ["海外电商", "营销引流", "市场洞察"] },
    { id: "jie", name: "小洁", avatar: "🌸", desc: "喜欢古旧书籍、石碑金石拓印与摄影的文润姑娘。梦想去西藏或山间拾取记忆，内向少言。有一箱从祁连山背回的美丽干花。", skills: ["古董典籍", "温婉共情", "山野摄影"] },
    { id: "jian", name: "阿健", avatar: "📷", desc: "古金石文物修复、篆刻痴迷者，背着老吉他的青年。他在冷门金石领域精研，但非常孤独，希望能遇到读懂金石斑驳故事的琴鸣之友。", skills: ["金石篆刻", "诗意民谣", "古籍修复"] },
  ];

  const handleMatchMaking = () => {
    if (!selectedNPC1 || !selectedNPC2) return;
    
    const pair = [selectedNPC1, selectedNPC2].sort().join('-');
    let result = {
      success: true,
      title: "⚙️ 普通缘分网络偶遇",
      story: "这两个人在饭局上喝着茶，聊起了南山的高房租和昨晚煮的溏心面。虽然没有惊动产业，但这种温厚的友谊也是深圳夜幕下多出了一撮温暖的篝火。千岑，你看着他们的名片，觉得人生真是由每一个细节撮合而成的。",
      rewards: ["共振力 +5", "人格温度 +8"]
    };

    // Special match cases
    if (pair === 'peng-xu') {
      result = {
        success: true,
        title: "🚀【智能柔性液压夹具 ㆍ 工业突围】",
        story: "把【老徐】的精密结构件设计，和【鹏哥】的宝安高品质 CNC 加工生产能效穿针引线！两人在顺峰路大排档喝完白茶，第二天就共同研制出了一套低能耗、全自动的柔性工业夹具模块。沙井代工厂顺利拿下大批量特种结构出口订单，工厂破产警报全面解除！鹏哥在电话里吼叫着大笑：『千岑，今晚留声机底下的老茶我包送！』",
        rewards: ["🔓 黄金成就: 工业逆袭穿针人", "缘分共振 +30", "人格温度 +25"]
      };
      triggerAchievement("沙井工业逆袭者");
    } else if (pair === 'ling-peng') {
      result = {
        success: true,
        title: "👁️【AI 电脑视觉 ── 智能质检机器人】",
        story: "这真是天才般的偶合！你将【阿玲】开源的高精视觉检测 AI 模块，和【鹏哥】的重型滑轨机加工台成功对接。鹏哥在厂房提供五百台零件标定数据集，阿玲在深夜写下了第一行部署层过滤，完美解决了高反光镀锌零件微米级瑕疵检测的世界难题！不仅拯救了工厂质检良品率，还将耗损下降 35%。这是边缘黑客技术扎在宝安黑泥里的知行合一！",
        rewards: ["🔓 隐藏成就: 智能黑客落泥地", "缘分共振 +35", "人格温度 +30"]
      };
      triggerAchievement("智能黑客扎落黑泥");
    } else if (pair === 'ling-xu') {
      result = {
        success: true,
        title: "🦾【深圳南山 ㆍ 机器视觉随动假肢关节】",
        story: "阿玲的边缘AI目标预测逻辑，配合老徐多年底盘传动防爆电机功底，两人尝试给残障患者设计一款会自学习步态的机械仿生鞋底与随动机甲。他们在车库里连续通宵，听着徐良的有些甜腻的歌词度过。一次偶然饭局促成，两个孤独极客居然开始不计较商业，赤脚踩进造福具体特殊群体的技术长征中。",
        rewards: ["缘分共振 +25", "人格温度 +20"]
      };
    } else if (pair === 'qiang-xu') {
      result = {
        success: true,
        title: "🚢【智能微创硬件 ㆍ 出海爆品】",
        story: "极具触觉嗅觉的跨境电商巨鳄【强少】，一眼相中【老徐】那款放在抽屉里蒙了三年灰的“多功能户外手势求生手电”。在强少的流量矩阵和海外定制包装下，手电在亚马逊瞬间卖空 20 万台，甚至引爆了极限探险圈！这就是深圳：极速研发 + 下沉供应链 + 狂飙的全球流量生态。缘分网络，正是改变命运最汹涌的机制！",
        rewards: ["缘分共振 +20", "人格温度 +15"]
      };
    } else if (pair === 'jian-jie') {
      result = {
        success: true,
        title: "🌸❤️【古抄卷轴 ㆍ 祁连金石之约】",
        story: "天不生这两人，世上少了一双温柔人！你把醉心印痕古籍的内向姑娘【小洁】，和孤独弹奏《路过人间》温热低鸣的篆刻拓片修复者【阿健】撮合在了后海那座放着老唱机的茶叶院子。两人面红耳赤沉默了三分钟，直到阿健拿出他珍藏的格桑花碎樱拓印。两人相敬着聊了整整 8 个小时，连夕阳把茉莉花茶晒干都浑然不觉。真正的爱意，根本不需要算法预设阀门，它们在岁月的印戳上，宿命般彼此共鸣了。",
        rewards: ["🍁 终极浪漫彩蛋: 《可遇不可求的书香》", "缘分共振 +50", "人格温度 +45"]
      };
      triggerAchievement("金石手抄本的执手");
    }

    setMatchResult(result);
    setResonancePoints(p => p + 15);
    setHumanValue(p => p + 15);
    
    // Clear selections
    setSelectedNPC1(null);
    setSelectedNPC2(null);
  };

  return (
    <div className="space-y-4">
      {/* HEADER CARD: Human Heat and Resonance Panel */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-stone-850 p-4 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <Flame className="w-40 h-40 text-amber-500" />
        </div>
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs">
            <span>🦊 🌸【人间烟火 ㆍ 尘世慢游与烟火温度】</span>
          </div>
          <p className="text-[10px] text-stone-400 max-w-[240px] leading-relaxed text-justify">
            在星系的三条叙事线（红星、蓝星、金星）里，我们反思、寻找、调试，一直向内寻找宇宙答案。而真正的千岑，是选择踏实涉入具体的生活：在深圳南山夜风之下，吃一碗溏心荷包蛋、唱一曲久违的深情老歌、撮合落地的硬核共赢项目，在万家烟火中活出生命的真实体温。
          </p>
        </div>

        {/* Global state gauges */}
        <div className="flex flex-col gap-2 relative z-10 shrink-0 text-right">
          <div className="bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-xl text-center">
            <span className="text-[8px] font-mono font-bold text-amber-400 block uppercase">🌡️ 人格温度 (Warmth)</span>
            <span className="text-sm font-black font-mono text-amber-300">{humanValue}°C</span>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-xl text-center">
            <span className="text-[8px] font-mono font-bold text-rose-400 block uppercase">🧬 缘分共振 (Resonance)</span>
            <span className="text-sm font-black font-mono text-rose-300">{resonancePoints} PTS</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL TAB MENU */}
      <div className="bg-stone-900/80 p-1 rounded-xl border border-stone-850 flex gap-1 overflow-x-auto scrollbar-none shrink-0 flex-nowrap">
        {[
          { id: 'co_living', label: '🏠 合租碎片', icon: Coffee },
          { id: 'zen_moments', label: '🍵 禅意朋友圈', icon: MessageSquare },
          { id: 'ktv', label: '🎤 KTV歌痕', icon: Music },
          { id: 'midnight', label: '🚴 深夜漫游', icon: Bike },
          { id: 'nexus', label: '🕸️ 缘分网络', icon: Workflow },
        ].map((sub) => {
          const Icon = sub.icon;
          const isSelected = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubTab(sub.id as any);
                setCoLivingChoice(null);
                setCoLivingObj(null);
                setMatchResult(null);
              }}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-amber-500 text-stone-950 shadow-[0_0_8px_rgba(245,158,11,0.25)]' 
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- CONTENT 1: CO-LIVING FRAGMENTS --- */}
      {activeSubTab === 'co_living' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md"
        >
          <div className="border-b border-stone-850/50 pb-2">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">🏢 深夜 11点的出租屋：让坚硬剥落</span>
            <p className="text-[10px] text-stone-500 mt-0.5">合租房里点着昏黄的荧光，一切都是那么平常。点击你想探索的物理细节：</p>
          </div>

          {!coLivingObj ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'fridge', title: '🥛 厨房冰箱', emoji: '🧊', desc: '发现一盒过期牛奶...' },
                { id: 'balcony', title: '🍃 客厅阳台', emoji: '🏢', desc: '收晾衣，看科兴灯火...' },
                { id: 'kitchen', title: '🍜 深夜灶台', emoji: '🍳', desc: '煮一包面或刷洗盘子...' },
                { id: 'sofa', title: '🛋️ 起居沙发', emoji: '🛋️', desc: '揉揉眼，跟舍友废话...' },
              ].map((obj) => (
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
                <p className="text-stone-300 text-[10.5px] leading-relaxed text-justify">{coLivingEvents[coLivingObj].desc}</p>
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
                    {coLivingEvents[coLivingObj].choices.find(c => c.id === coLivingChoice)?.result}
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
      )}

      {/* --- CONTENT 2: ZEN MOMENT朋友圈 --- */}
      {activeSubTab === 'zen_moments' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md text-left"
        >
          <div className="border-b border-stone-850/50 pb-2">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">💭 禅意朋友圈 ㆍ 不是神格而是硬顶</span>
            <p className="text-[10px] text-stone-500 mt-0.5">有时看似空旷如禅的语句，背后不过是凡胎俗身正咬牙硬顶。刷新一条朋友圈：</p>
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
                
                {/* Content */}
                <p className="text-[11px] text-justify text-stone-200 leading-relaxed font-semibold">
                  「风从不解释自己。 🍵」
                </p>

                {/* 茉莉花茶精准温控实验 */}
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 shadow-inner space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-900 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🍵</span>
                      <span className="text-[10.5px] font-extrabold text-amber-400 font-mono">后海午夜 ㆍ 茉莉花茶精密温控车间</span>
                    </div>
                    <span className="text-[8px] bg-stone-900 px-2 py-0.5 rounded border border-stone-850 text-stone-500 font-mono">FMEA V1.0</span>
                  </div>

                  {/* Thermostat & Timer Indicators */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-stone-900/40 p-2.5 rounded-xl border border-stone-900 text-center relative overflow-hidden">
                      <span className="text-[8px] text-stone-500 block uppercase font-mono tracking-wider">🌡️ 注入温度 (Target: 85°C)</span>
                      <span className={`text-[15px] font-black font-mono transition-colors ${lifeTeaTemp === 85 ? 'text-emerald-400 animate-pulse' : 'text-amber-300'}`}>
                        {lifeTeaTemp} °C
                      </span>
                      {lifeTeaTemp === 85 && (
                        <span className="absolute top-1 right-1.5 text-[7px] text-emerald-400 font-bold font-mono">✓ MATCH</span>
                      )}
                    </div>
                    <div className="bg-stone-900/40 p-2.5 rounded-xl border border-stone-900 text-center relative overflow-hidden">
                      <span className="text-[8px] text-stone-500 block uppercase font-mono tracking-wider">⏱️ 冲泡耗时 (Target: 30s)</span>
                      <span className={`text-[15px] font-black font-mono transition-colors ${lifeTeaTime === 30 ? 'text-emerald-400 animate-pulse' : 'text-stone-300'}`}>
                        {lifeTeaTime} 秒
                      </span>
                      {lifeTeaTime === 30 && (
                        <span className="absolute top-1 right-1.5 text-[7px] text-emerald-400 font-bold font-mono">✓ MATCH</span>
                      )}
                    </div>
                  </div>

                  {/* Custom Water Temperature Control Sliders */}
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
                          if (val === 85 && lifeTeaTime === 30) {
                            setLifeTeaSuccess(true);
                            triggerAchievement("后海星光 ㆍ 精准温柔");
                          } else {
                            setLifeTeaSuccess(false);
                          }
                        }}
                        className="w-full h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      {/* Scale mark at 85°C */}
                      <div className="absolute left-[81.25%] top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none">
                        <span className="text-[7.5px] font-mono text-amber-500 font-bold bg-stone-950 px-1 rounded border border-stone-850">85°C</span>
                        <div className="w-[1.5px] h-2.5 bg-amber-500/80 mt-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Custom Steeping Time Control Sliders */}
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
                          if (lifeTeaTemp === 85 && val === 30) {
                            setLifeTeaSuccess(true);
                            triggerAchievement("后海星光 ㆍ 精准温柔");
                          } else {
                            setLifeTeaSuccess(false);
                          }
                        }}
                        className="w-full h-1.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      {/* Scale mark at 30s */}
                      <div className="absolute left-[49.15%] top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none">
                        <span className="text-[7.5px] font-mono text-emerald-500 font-bold bg-stone-950 px-1 rounded border border-stone-850">30s</span>
                        <div className="w-[1.5px] h-2.5 bg-emerald-500/80 mt-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Status messages based on values */}
                  <div className="text-[9.5px] font-mono leading-relaxed bg-stone-900/60 p-2.5 rounded-xl border border-stone-900 text-stone-400 text-justify">
                    {lifeTeaSuccess ? (
                      <div className="text-emerald-400 font-bold flex items-center gap-1">
                        <span>🌟 极上契合！85°C 茉莉花茶成功激发无退避人格共情共振！</span>
                      </div>
                    ) : (
                      <span className="block leading-relaxed">
                        💡 <span className="text-stone-300 font-semibold">焖温提示</span>：好茶需水温 <strong className="text-amber-400">85°C</strong> 与焖茶 <strong className="text-emerald-400">30秒</strong> 的极致交汇。在极上平衡的瞬间，人生的宿命余热才会完美漫溢。
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
                        {/* Animated background glow */}
                        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none animate-[pulse_3s_infinite]" />

                        <div className="flex items-start gap-3 relative z-10">
                          {/* Little Fox Xiao Jiu avatar presentation */}
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

                             {/* Dialogue */}
                             <p className="text-[10.5px] text-justify leading-relaxed text-stone-200 italic font-mono bg-stone-900/60 p-2.5 rounded-xl border border-emerald-950/40">
                               “瞧！灵巧的小九捧着一壶热气腾腾的 <strong>85°C 极品茉莉花茶</strong> 欢快地跳了出来！她将茶杯稳稳递到你的指尖，眨巴着金黄剔透的眼眸盈盈憨笑：『千岑！你终于肯卸下多余的借口、自守，和那些冰凉如霜的冷酷代码啦。不冷不热，刚好 85°C 焖 30秒 的温存，是这暴风冬夜里最干净无瑕的偏心善意。来，捧着茶，喝一口，好香！』”
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
                <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest block">💬 针对这句鸡汤，你的第一反应是：</span>
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
                <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest block">📢 情感波纹折射回复：</span>
                <p className="text-[10.5px] text-stone-200 italic leading-relaxed text-justify font-mono">
                  {zenOption === 'like' && (
                    "【理智的客套赞美】：你随手点了个赞，留下了一句‘风姿清绝’的客套称许。然而你知道，高悬世外的虚幻赞美并不能让人在寒流中真正感到一丝实存的热意。"
                  )}
                  {zenOption === 'think' && (
                    "【虚妄的理智解构】：你深吸一口气，开始用极高傲的理智去定义风和自然的常识。但你突然自嘲一笑：原来对空空、看破的过度思维推演，本身也是我们抗拒在烟火宿因中痛快爱恨的防卫面具。"
                  )}
                  {zenOption === 'roast' && (
                    "【具体的温暖治愈】：舍友在微信群大吼『别装了，锅里你煮的寿桃面烧焦了，快进来！🍲』你在热汤前哑然失笑。对，那锅滚烫的寿桃面，比任何脱俗空寂的禅语都更能照亮你的肚腹。这，才是他在具体凡间最可贵的回声。"
                  )}
                </p>

                {/* Simulated Comment Box */}
                <div className="space-y-1.5 pt-2 border-t border-stone-900 text-[10px] font-mono">
                  <span className="text-stone-500 font-bold">💬 精选互动评论 (Secret Archive):</span>
                  <div className="bg-stone-950/60 p-2.5 rounded border border-stone-900 space-y-1">
                    <p><span className="text-amber-400 font-bold">阿玲:</span> <span className="text-stone-300">我用示波器模拟了：风的噪声其实呈 1/f 幂律粉红分布，这不需要解释，这是傅里叶常识。</span></p>
                    <p><span className="text-emerald-400 font-bold">合租室友:</span> <span className="text-stone-300">别装了，锅里你煮的寿桃面烧焦了，快进来！🍲</span></p>
                    <p><span className="text-stone-500 font-bold">千岑 (Cen) 回复:</span> <span className="text-amber-300">哈哈，来了来了！</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* --- CONTENT 3: KTV KARAOKE --- */}
      {activeSubTab === 'ktv' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md text-left"
        >
          <div className="border-b border-stone-850/50 pb-2">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">🎤 留声星歌房 ㆍ 纯真年代的情感呼啸</span>
            <p className="text-[10px] text-stone-500 mt-0.5">唱歌是千岑人格里极灵动鲜活的血液。每隔几载的经典歌曲，都契合着岁月的痕印：</p>
          </div>

          {!currentSong ? (
            <div className="space-y-2.5">
              {songList.map((song) => (
                <div 
                  key={song.id} 
                  className="bg-stone-950 p-3.5 rounded-xl border border-stone-850 flex justify-between items-center gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base text-rose-400 font-extrabold">{song.title}</span>
                      <span className="text-[8.5px] bg-stone-900 px-1.5 py-0.5 rounded border border-stone-850 text-stone-400 font-mono">{song.era}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-snug">{song.desc}</p>
                  </div>
                  <button
                    onClick={() => handleStartSing(song.id)}
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
                    正在演歌: {songList.find(s => s.id === currentSong)?.title}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    if (singTimer) clearInterval(singTimer);
                    setCurrentSong(null);
                  }}
                  className="text-stone-500 hover:text-stone-300 text-[10px] font-mono"
                >
                  切歌 ✖
                </button>
              </div>

              {/* Dynamic Lyric Box */}
              <div className="h-28 bg-stone-900/60 rounded-xl border border-stone-850/60 p-3 flex flex-col justify-center items-center text-center relative overflow-hidden select-none">
                <div className="absolute top-2 left-3 text-[7.5px] uppercase font-mono text-stone-600 bg-stone-950 px-1 py-0.5 rounded">
                  Lyric Stream Realtime v1.0
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-amber-300 font-extrabold animate-pulse">
                    🎤 {songList.find(s => s.id === currentSong)?.lyrics[lyricIndex]}
                  </p>
                  <p className="text-[10px] text-stone-600 italic">
                    {lyricIndex < 3 ? "..." : "🎉 心智记忆碎块完全解锁，人格温度上升！"}
                  </p>
                </div>

                {/* Progress bar */}
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
                <div className="p-3.5 bg-rose-500/5 border border-rose-500/20 text-stone-300 text-[10.5px] leading-relaxed text-justify font-mono rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-rose-400 block">🗝️ 捕获隐藏情感痕印：</span>
                  <p className="italic text-stone-200">
                    “{songList.find(s => s.id === currentSong)?.reflection || '在这句歌词里，我找到了丢掉的半块虚影，用热泪打破空零的禁锢。'}”
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* --- CONTENT 4: MIDNIGHT RIDE/WALK --- */}
      {activeSubTab === 'midnight' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md text-left"
        >
          <div className="border-b border-stone-850/50 pb-2">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">🚴 南山骑夜 ㆍ 深夜深圳湾的实体漫游</span>
            <p className="text-[10px] text-stone-500 mt-0.5">去偶遇南山、深圳湾的烟火气，这比一切高深思辨更具实体抗抑郁的力量：</p>
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
                  onClick={() => handleStartRide('bike')}
                  className="bg-stone-950 p-4 rounded-xl border border-stone-850 hover:border-amber-500/40 text-center space-y-2 cursor-pointer hover:scale-[1.01] transition-all"
                >
                  <span className="text-3xl block">🚴‍♂️</span>
                  <span className="text-xs font-bold text-stone-200 block">深夜单车狂飙</span>
                  <span className="text-[9px] text-stone-500 block leading-tight">绕科学园、高新南，感受深夜疾风</span>
                </button>

                <button 
                  onClick={() => handleStartRide('walk')}
                  className="bg-stone-950 p-4 rounded-xl border border-stone-850 hover:border-amber-500/40 text-center space-y-2 cursor-pointer hover:scale-[1.01] transition-all"
                >
                  <span className="text-3xl block">🚶‍♀️</span>
                  <span className="text-xs font-bold text-stone-200 block">深圳湾海岸徒步</span>
                  <span className="text-[9px] text-stone-500 block leading-tight">聆听红树林和咸潮波浪的私心细诉</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-stone-900 text-xs text-amber-300 font-bold">
                  <span>游历路线：{rideType === 'bike' ? "🚗 深夜科学园单车飞驰" : "🌊 深圳湾晚潮徒步"}</span>
                  <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded font-mono font-black">
                    {rideActive ? "ROUTING..." : "COMPLETED!"}
                  </span>
                </div>

                {/* Simulated GPS Track bar */}
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

              {/* Dynamic Encounter Card list */}
              <div className="space-y-2">
                <span className="text-[9.5px] font-bold text-stone-500 uppercase tracking-widest block">📡 实时路段具体奇遇 logs：</span>
                {rideEncounters.map((enc, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-stone-850 bg-stone-950 relative space-y-1.5 animate-[fadeIn_0.3s_ease_1]">
                    <span className="text-[10px] font-bold text-amber-300 block">{enc}</span>
                    <p className="text-[10px] text-stone-300 italic leading-relaxed text-justify font-mono">{rideLog[idx]}</p>
                  </div>
                ))}
              </div>

              {!rideActive && (
                <button 
                  onClick={() => {
                    setRideLog([]);
                    setRideEncounters([]);
                    setRideType(null);
                  }}
                  className="w-full mt-2 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-stone-950 font-black rounded-xl text-xs sm:text-[10.5px] cursor-pointer"
                >
                  ← 重新漫游深圳
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* --- CONTENT 5: DESTINY NEXUS (穿针引线) --- */}
      {activeSubTab === 'nexus' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md text-left"
        >
          <div className="border-b border-stone-850/50 pb-2">
            <span className="text-[10px] font-extrabold text-stone-400 block uppercase tracking-wider">🕸️ 贪狼化权 ㆍ 缘分红尘强连网</span>
            <p className="text-[10px] text-stone-500 mt-0.5">
              千岑最非凡的外在特质：哪里有人，哪里就有连接；不要死等计划，去撮合那些不相干的灵魂，碰撞出奇效。
            </p>
          </div>

          {/* NPC select stage */}
          <div className="space-y-3">
            <span className="text-[9.5px] font-bold text-stone-400 uppercase font-mono block">
              第一步：在凡间人海中，挑选两位你觉得能够产生奇妙化学反应的 NPC：
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {npcs.map((npc) => {
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
                        {isSelected && <span className="text-[7.5px] bg-amber-500 text-stone-950 font-bold px-1 rounded">已选</span>}
                      </div>
                      <p className="text-[8.5px] leading-tight text-stone-500 h-9 line-clamp-3 text-justify">{npc.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected stats info bar */}
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-850 flex items-center justify-between gap-2.5">
              <div className="flex gap-2.5 items-center text-[10.5px]">
                <span className="font-bold text-stone-400">撮合队列:</span>
                <span className="font-extrabold text-stone-200 bg-stone-905 px-2 py-0.5 rounded">
                  {selectedNPC1 ? npcs.find(n => n.id === selectedNPC1)?.name : '❓ 空席一'}
                </span>
                <span className="text-amber-500 font-extrabold">+</span>
                <span className="font-extrabold text-stone-200 bg-stone-905 px-2 py-0.5 rounded">
                  {selectedNPC2 ? npcs.find(n => n.id === selectedNPC2)?.name : '❓ 空席二'}
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

            {/* Matching result reveal */}
            {matchResult && (
              <div className="p-3.5 bg-amber-500/5 border-2 border-amber-500/25 rounded-xl space-y-2.5 text-[10.5px] leading-relaxed text-left animate-[fadeIn_0.3s_ease_1]">
                <div className="flex items-center gap-1.5 text-amber-300 font-extrabold">
                  <Workflow className="w-4 h-4" />
                  <span>{matchResult.title}</span>
                </div>
                
                <p className="text-[10.5px] text-justify text-stone-300 font-mono italic leading-relaxed bg-stone-950/70 p-3 rounded-lg border border-stone-900">
                  “{matchResult.story}”
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-stone-900">
                  <span className="text-[9px] text-stone-500 font-bold font-mono">获得凡间气象滋养：</span>
                  {matchResult.rewards.map((r, ri) => (
                    <span key={ri} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[8.5px] font-mono leading-none flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* FOOTER ACHIEVEMENTS REVEAL CATERING */}
      {unlockedAchievements.length > 0 && (
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 text-left space-y-2 animate-pulse">
          <span className="text-[8.5px] font-extrabold text-amber-400 font-mono block uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            已收割凡尘人间成就已印章 ({unlockedAchievements.length}/5)：
          </span>
          <div className="flex flex-wrap gap-1.5">
            {unlockedAchievements.map((ach, ai) => (
              <span key={ai} className="bg-amber-500/15 border border-amber-500/30 text-amber-200 px-2.5 py-1 rounded-lg text-[9.5px] font-bold font-mono">
                📌 {ach}
              </span>
            ))}
            {typeof window !== 'undefined' && localStorage.getItem('dlc_woolen_wear_badge') === 'true' && (
              <span className="bg-amber-500/25 border-2 border-amber-500/40 text-amber-200 px-2.5 py-1 rounded-lg text-[9.5px] font-bold font-mono shadow-[0_0_8px_rgba(245,158,11,0.25)] flex items-center gap-1 animate-pulse">
                🧶 未被穿透的毛线衣 (DLC 核心勋章)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
