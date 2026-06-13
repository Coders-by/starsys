import { 
  UserAttributes, 
  AttributeConfig, 
  Gear, 
  Achievement, 
  Skill, 
  NarrativeAct, 
  Crossroad, 
  Changelog, 
  Tip 
} from './types';

export const USER_BASE: {
  name: string;
  domain: string;
  attributes: UserAttributes;
  pet: {
    name: string;
    type: string;
    element: string;
    talent: string;
    domain: string;
    moods: string[];
  };
} = {
  name: '千岑',
  domain: '四域交汇',
  attributes: {
    insight: 9,
    crossover: 9,
    express: 8,
    social: 8,
    execute: 8,
    tech: 8
  },
  pet: {
    name: '小九',
    type: '三尾灵狐 · NPC',
    element: '月·镜',
    talent: '破妄之眼',
    domain: '四域交汇',
    moods: [
      '观察中...',
      '等待触发...',
      '感知到你的存在...',
      '分析你的行为模式...'
    ]
  }
};

export const DOSSIER = {
  kicker: 'RPG 资料库重构 · 千岑档案',
  title: '一个把人生当作可迭代系统的人',
  copy: '千岑不是单纯的技术人、文艺青年或创业者。他更像一个在现实项目、个人副本、知识经验房和随机事件之间来回存档的人：白天处理车规级故障降级和泊车交付，晚上把聚会、AI、关系、佛学、马克思和自媒体拆成自己的叙事结构。',
  cards: [
    { label: '主线职业', value: '自动驾驶工程师', desc: '线控、域控、功能安全、泊车 APA/RPA/AVP、实车调试与交付。' },
    { label: '副本身份', value: '技术服务试验者', desc: '淘宝咨询、毕业设计、工业定制、AIGC工作流与个人品牌。' },
    { label: '精神内核', value: '造筏者', desc: '不完全上主流社会的船，也不轻易否定终点，而是尝试重建自己的生存范式。' },
    { label: '关系课题', value: '从看客到演员', desc: '能看懂很多关系，却还在学习如何真正投入、回应与被回应。' },
    { label: '表达系统', value: '镜像回声', desc: '把生活碎片显影成叙事结构，让别人也想整理自己的版本号。' },
    { label: '当前 Boss', value: '产品闭环', desc: '把技术积累、叙事能力和真实需求合成第一个真正可持续的产品。' }
  ],
  sources: [
    { type: '主线', name: '功能安全 / 线控 / 泊车交付' },
    { type: '副本', name: '智汇树淘宝店 / 镜像回声' },
    { type: '经验房', name: 'AI / 哲学 / 管理' },
    { type: '随机事件', name: '野生指针 / 合租碎片 / 情迷复盘' }
  ]
};

export const GEAR: Gear[] = [
  {
    id: 'g1',
    icon: '🖥️',
    name: '高配开发机',
    desc: '24核 + 64G + 4090，编译从未如此丝滑',
    effects: [{ attr: 'tech', val: 1 }, { attr: 'execute', val: 1 }]
  },
  {
    id: 'g2',
    icon: '🍵',
    name: '手冲茶具',
    desc: '紫砂壶 + 老白茶，独处时的思考催化剂',
    effects: [{ attr: 'insight', val: 1 }, { attr: 'express', val: 1 }]
  },
  {
    id: 'g3',
    icon: '🎧',
    name: '降噪耳机',
    desc: '戴上即隔世，深度工作模式的开关',
    effects: [{ attr: 'execute', val: 1 }, { attr: 'crossover', val: 1 }]
  },
  {
    id: 'g4',
    icon: '⌨️',
    name: '静电容键盘',
    desc: '码字如弹琴，灵感在指尖自然流淌',
    effects: [{ attr: 'express', val: 1 }, { attr: 'tech', val: 1 }]
  },
  {
    id: 'g5',
    icon: '🛋️',
    name: '茶室角落',
    desc: '一张榻榻米 + 一盏暖灯，最适合深聊的地方',
    effects: [{ attr: 'social', val: 1 }, { attr: 'insight', val: 1 }]
  },
  {
    id: 'g6',
    icon: '📚',
    name: '移动书架',
    desc: '陀氏、实践论、科幻、经管——随取随读',
    effects: [{ attr: 'crossover', val: 1 }, { attr: 'insight', val: 1 }]
  }
];

export const TENSIONS = [
  { left: '技术', right: '人' },
  { left: '效率', right: '温度' },
  { left: '理性', right: '情感' },
  { left: '观察', right: '投入' }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    icon: '🏪',
    name: '淘宝店主',
    desc: '在混乱订单中打捞人性需求',
    time: '2023',
    story: '开店初衷是体验「做小生意」。学会了客服话术、差评公关、供应链管理。',
    gain: ['需求感知 +2', '耐心 +1'],
    cost: ['被琐事消耗', '对生意祛魅'],
    scene: true
  },
  {
    id: 'a2',
    icon: '🛠️',
    name: 'AIGC探路者',
    desc: '漫画视频自动化管线',
    time: '2024',
    story: '用ComfyUI搭工作流。虽未跑赢竞品，但摸清了创意落地的筋骨。',
    gain: ['AI工作流 +3', '产品直觉 +1'],
    cost: ['大量试错时间', '被竞品追赶'],
    scene: true
  },
  {
    id: 'a3',
    icon: '🎬',
    name: '内容创作者',
    desc: 'B站知识区UP主',
    time: '2024',
    story: '把复杂思想熬成暖汤。最高播放没爆，但有人说「这是B站最真诚的解读」。',
    gain: ['表达力 +3', '叙事感 +2'],
    cost: ['数据焦虑', '自我暴露感'],
    scene: true
  },
  {
    id: 'a4',
    icon: '🔮',
    name: '跨界哲学家',
    desc: '陀氏 + 实践论 + ComfyUI + 红楼',
    time: '2025',
    story: '看起来毫不相干的领域，在你体内核聚变。不是刻意，是好奇心足够广。',
    gain: ['跨界力 +4', '意义感 +2'],
    cost: ['难以被快速定义', '路径不够线性'],
    scene: true
  },
  {
    id: 'a5',
    icon: '📖',
    name: '文学朝圣者',
    desc: '啃完《卡拉马佐夫兄弟》',
    time: '2024',
    story: '出发时以为找答案，抵达时装满新的困惑宝石。',
    gain: ['精神纵深 +3', '困惑耐受 +2'],
    cost: ['现实感延迟', '问题变得更多'],
    scene: true
  },
  {
    id: 'a6',
    icon: '🌊',
    name: '风暴幸存者',
    desc: '自动驾驶创业公司幸存',
    time: '2024',
    story: '技术架构三天一翻船。活下来，收获了比技术更值钱的东西。',
    gain: ['应变力 +3', '系统思维 +2'],
    cost: ['长期疲惫', '对组织祛魅'],
    scene: true
  },
  {
    id: 'a7',
    icon: '💔',
    name: '情感冒险家',
    desc: '笨拙地尝试建立亲密关系',
    time: '2024',
    story: '虽然结果不如意，但看清了自己心里那扇没打开的门。',
    gain: ['理解关系', '理解自己'],
    cost: ['失落', '困惑', '重新认识自己'],
    scene: true
  },
  {
    id: 'a8',
    icon: '🛡️',
    name: '功能安全架构师',
    desc: '把失控场景重新变得可控',
    time: '2024',
    story: '从20+故障信号监控，到Detector抽象、降级策略、SOC/MCU双冗余。他在车规系统里学会了：真正的工程，是在异常发生前先给它留路。',
    gain: ['架构抽象 +3', '安全意识 +3'],
    cost: ['责任压力', '对细节零容忍'],
    scene: true
  },
  {
    id: 'a9',
    icon: '🅿️',
    name: '泊车交付者',
    desc: 'APA / RPA / AVP 项目推进与实车调试',
    time: '2025',
    story: '捷途、北汽、AVM、超声波告警、HMI交互、故障降级、离车泊入。交付不是把代码合进去，而是让需求、车、人和时间同时对齐。',
    gain: ['交付力 +3', '实车调试 +2'],
    cost: ['时间挤压', '持续切上下文'],
    scene: true
  },
  {
    id: 'a10',
    icon: '🧭',
    name: '带教协调者',
    desc: '在交付和培养之间搭桥',
    time: '2025',
    story: '一边要主力交付，一边要把方法论摸索出来再教给合作方。他开始真正理解：人的因素不是噪声，而是棋盘本身。',
    gain: ['组织感 +2', '方法沉淀 +2'],
    cost: ['夹层压力', '边界反复确认'],
    scene: true
  },
  {
    id: 'a11',
    icon: '🪞',
    name: '镜像回声发明者',
    desc: '把生活碎片显影成叙事结构',
    time: '2026',
    story: '这个账号实验不是导师IP，也不是情绪出口，而是公开示范普通人如何把碎片、整合与回声变成自己的方法。',
    gain: ['个人品牌 +2', '叙事产品感 +3'],
    cost: ['解释成本', '长期连载压力'],
    scene: true
  }
];

export const ATTRIBUTES_CONFIG: AttributeConfig[] = [
  { id: 'insight', icon: '🔍', name: '洞察力', color: '#fbbf24', desc: '穿透表象，直指本质' },
  { id: 'crossover', icon: '🌊', name: '跨界力', color: '#34d399', desc: '连接孤岛的能力' },
  { id: 'express', icon: '💬', name: '表达力', color: '#818cf8', desc: '深奥→通俗，有人味' },
  { id: 'social', icon: '🤝', name: '社交力', color: '#f472b6', desc: '靠真诚推动正向循环' },
  { id: 'execute', icon: '⚡', name: '执行力', color: '#fb923c', desc: '想通→选择→全力开火' },
  { id: 'tech', icon: '🔧', name: '技术力', color: '#a78bfa', desc: '智驾 + AI复合型' }
];

export const SKILLS: Skill[] = [
  {
    id: 'mt',
    icon: '🧠',
    name: '思想翻译官',
    desc: '把深奥概念通俗化',
    check: u => u.insight >= 7 && u.express >= 7,
    cond: '洞察 ≥ 7 + 表达 ≥ 7'
  },
  {
    id: 'cd',
    icon: '🔗',
    name: '跨域嫁接',
    desc: 'A领域→B领域创新',
    check: u => u.crossover >= 8 && u.execute >= 7,
    cond: '跨界 ≥ 8 + 执行 ≥ 7'
  },
  {
    id: 'cp',
    icon: '🎭',
    name: 'Cosplay大师',
    desc: '不同场景切换角色',
    check: u => u.social >= 7 && u.insight >= 7,
    cond: '社交 ≥ 7 + 洞察 ≥ 7'
  },
  {
    id: 'nw',
    icon: '📖',
    name: '叙事编织',
    desc: '碎片→故事线',
    check: u => u.express >= 7 && u.insight >= 6 && u.crossover >= 6,
    cond: '表达 ≥ 7 + 洞察 ≥ 6 + 跨界 ≥ 6'
  },
  {
    id: 'tp',
    icon: '🔮',
    name: '趋势预判',
    desc: '从混沌中感知方向',
    check: () => false,
    cond: '洞察 ≥ 10 + 跨界 ≥ 9',
    locked: true
  },
  {
    id: 'dd',
    icon: '🎯',
    name: '定向深耕',
    desc: '选一个点扎下去',
    check: () => false,
    cond: '执行 ≥ 10 + 洞察 ≥ 8',
    locked: true
  },
  {
    id: 'nc',
    icon: '🕸️',
    name: '人脉催化',
    desc: '促成有价值连接',
    check: () => false,
    cond: '社交 ≥ 10 + 洞察 ≥ 9',
    locked: true
  }
];

export const NARRATIVE_ACTS: NarrativeAct[] = [
  {
    id: 6,
    chapter: 'v18.8',
    title: '镜像回声 · 版本化人格',
    time: '2026',
    color: '#fbbf24',
    detail: '把RPG资料库、个人品牌、AI镜像实验和网页作品合成一个新命题：不是展示我是谁，而是让别人参与认识我，并回头照见自己。',
    status: 'current'
  },
  {
    id: 5,
    chapter: 'v17.0',
    title: '泊车交付 · 带教棋局',
    time: '2025',
    color: '#60a5fa',
    detail: '进入Parking主线：APA、RPA、AVP、AVM、HMI、故障降级、实车调试。既要交付项目，也要把经验文档化、阶段化、明确化地教给别人。',
    status: ''
  },
  {
    id: 4,
    chapter: 'v15.0',
    title: '实验场回归',
    time: '2025',
    color: '#34d399',
    detail: '带着实验者心态回到大型组织。混乱是最好的案例库。开始认真理解关系、培训、合作方压力和人事棋盘。',
    status: ''
  },
  {
    id: 3,
    chapter: 'v12.0',
    title: 'GAP · 炼金术',
    time: '2024',
    color: '#818cf8',
    detail: '离开舒适区。半年：山海→创业→实践论→AIGC→卡拉马佐夫→尝试建立亲密关系。不是空白，而是把主线之外的矿脉挖出来。',
    status: ''
  },
  {
    id: 2,
    chapter: 'v10.0',
    title: '功能安全 · 降级之道',
    time: '2023-2024',
    color: '#f472b6',
    detail: '从线控、CANBUS、ROS、Autosar、Some/IP到SOC/MCU双冗余。他开始明白工程不是炫技，是给异常工况留下退路。',
    status: ''
  },
  {
    id: 1,
    chapter: 'v8.0',
    title: '风暴水手',
    time: '2022-2024',
    color: '#fb923c',
    detail: '自动驾驶创业公司，研发体系演化、权力更迭、demo转量产、实车问题和组织众生相一起涌来。技术成长和祛魅同时发生。',
    status: ''
  },
  {
    id: 0,
    chapter: 'v3.0',
    title: '初入江湖',
    time: '毕业',
    color: '#a78bfa',
    detail: '沉迷证明自己。加入自动驾驶行业，以为技术能解释大部分问题，后来发现真正难的是技术、人和组织同时成立。',
    status: ''
  }
];

export const CROSSROADS: Crossroad[] = [
  {
    id: 'cr25',
    age: 25,
    scene: '自动驾驶行业',
    title: '工作稳定，收入尚可，突然开始思考人生意义。',
    desc: '你已经能把代码写进真实车辆，也开始隐约感觉：稳定不是答案，它只是一个更高级的提问方式。',
    options: [
      { id: 'A', text: '继续卷技术' },
      { id: 'B', text: '读书沉淀' },
      { id: 'C', text: '做副业' },
      { id: 'D', text: '谈恋爱' }
    ],
    qiancen: ['B', 'C', 'D'],
    gain: ['哲学', '创作', '关系'],
    cost: ['一部分职业成长速度', '更长的迷茫周期']
  },
  {
    id: 'crGap',
    age: 26,
    scene: 'GAP 半年',
    title: '手里有一点自由时间，但没有确定答案。',
    desc: '你可以把时间投向简历，也可以投向那些暂时讲不清回报的东西。',
    options: [
      { id: 'A', text: '立刻找下一份工作' },
      { id: 'B', text: '去山海之间发呆' },
      { id: 'C', text: '搭 AIGC 工作流' },
      { id: 'D', text: '读完一本巨著' }
    ],
    qiancen: ['B', 'C', 'D'],
    gain: ['空白感', '工具敏感度', '精神矿脉'],
    cost: ['确定性收入', '线性履历']
  },
  {
    id: 'crSymbiosis',
    age: 27,
    scene: '带教棋局 · 岔路',
    title: '【生态共生】—— 复杂系统中的引力场建立',
    desc: '合作方能力处于瓶颈，交付时间节点日益逼近。系统信息差频发，团队情绪处于临界点。作为核心推进者，你决定如何分配你有限的精力？',
    options: [
      { id: 'A', text: '现实路线：全力交付' },
      { id: 'B', text: '共生路线：深度带教' }
    ],
    qiancen: ['B'],
    gain: ['共生值 +40', '领导力 +25', '理想重构 +20'],
    cost: ['现实锚定（短期交付风险）', '交付进度条临时承压'],
    symAttrs: [
      { id: 'leadership', icon: '💡', name: '领导力', color: '#fbbf24', desc: '跨团队消除障碍、赋能他人的核心引力', aVal: 25, bVal: 5 },
      { id: 'symbiosis', icon: '🌱', name: '共生值', color: '#34d399', desc: '系统内生态的健康度，同盟的坚固度', aVal: -15, bVal: 40 },
      { id: 'anchor', icon: '📊', name: '现实锚定', color: '#fb923c', desc: '短期硬性指标的达成度与抗压能力', aVal: 30, bVal: -10 },
      { id: 'idealism', icon: '🌌', name: '理想重构', color: '#818cf8', desc: '浪漫主义与人文关怀的精神刻度', aVal: -10, bVal: 20 }
    ],
    symActs: [
      {
        icon: '🌉',
        title: '阶段一：打破边界的「场外连接」',
        subtitle: '在交付与温度之间',
        story: '<p className="mb-3">你选了这条路。这意味着接下来的两个月，你的时间将不再只属于代码和架构图。</p><p className="mb-3">在繁重的自动驾驶开发之余，你做了一些"工作之外"的事——</p><p className="mb-3">深夜联合排查 bug 的代码框上，光标在跳动。屏幕那头是合作方的工程师，你们一起追一个复现率只有30%的超声波告警问题。凌晨两点，问题定位到了。</p><p className="mb-3">收工后你们去了街角的深夜食堂。老板认识你们了，不用点单就知道上什么。</p><p className="mb-3">周末一起开黑玩游戏时的欢笑透过耳机传来。两杯酒下肚后，话题从技术栈滑向了人生、技术理想与困惑——关于职业选择的迷茫，关于在这个行业里想成为什么样的人。</p><div className="bg-stone-850 border-l-2 border-amber-500/50 p-3 rounded-r-md my-4 italic text-stone-200 text-xs">你不仅在带教技术，更在交付温度。你把对方看作休戚与共的同行者，而不是单向被输出的"学生"。</div><p className="mb-2">这不会出现在任何一页 PPT 上。但它埋下了一颗种子。</p>',
        attrShow: '🌱 共生值 +40　　💡 领导力 +25'
      },
      {
        icon: '🔥',
        title: '阶段二：系统复杂性中的「长期辐射力」',
        subtitle: '篝火与引力场',
        story: '<p className="mb-3">经过5月到8月的洗礼，合作方团队实现了跨越——他们开始独立接手项目模块。</p><p className="mb-3">一开始他们需要你逐行 review 代码，后来他们能自己提出架构改进方案。一开始遇到故障降级逻辑他们会等你来判断，后来他们能在你的框架下独立做技术决策。</p><p className="mb-3">你的领导力悄然完成了一次蜕变——</p><div className="bg-stone-850 border-l-2 border-amber-500/50 p-3 rounded-r-md my-4 italic text-stone-200 text-xs">真正的领导力，不是站在高处指挥，而是成为复杂系统中的一团篝火，在润物细无声中，让周围的人因为你的存在而感到心安、获得成长。</div><p className="mb-3">你在交付的同时，把底层能力毫无保留地渡给了对方。你关注合作方工程师的情绪起伏，消除跨团队的摩擦，在工作之外建立了真正的血肉连接。</p><p className="mb-3">项目通过了关键节点评审。代码上了车。而比代码更持久的，是那些人心里被你点燃的东西。</p>',
        attrShow: '💡 领导力 +25　　🌌 理想重构 +20'
      },
      {
        icon: '🔄',
        title: '阶段三：回响与生态闭环（The Eco-Loop）',
        subtitle: '曾经你渡人，如今人渡你',
        story: '<p className="mb-3">时间线向前推移。你开启了全新的主线任务——<strong>内部工具 AI 化与知识库搭建</strong>。</p><p className="mb-3">这是一个从 0 到 1 的阶段。你手头拿着刚做好的 Demo——产品雏形，功能还粗糙，UI 还简陋。你最需要的是能给出真实、客观且愿意包容早期缺陷的<strong>"种子用户"</strong>。</p><p className="mb-3">然后，命运的回响触发了——</p><p className="mb-3">曾经在带教中被你赋能、与你一同吃喝玩乐、建立了深厚情谊的外部合作方，自愿转化为你的<strong>黄金种子用户群</strong>。</p><div className="bg-stone-850 border-l-2 border-amber-500/50 p-3 rounded-r-md my-4 italic text-stone-200 text-xs">曾经你渡人，如今人渡你。你在过去种下的"因"（对人的善意与赋能），在新的节点上结成了"果"。他们主动帮你进行内测、反馈真实的痛点。</div><p className="mb-2">你所建立的"人际辐射力"，在这一刻完成了完美的生态闭环。</p>',
        attrShow: '🌱 共生闭环　　🔥 辐射力永续'
      }
    ]
  },
  {
    id: 'crNow',
    age: 27,
    scene: '当前版本',
    title: '你看懂了很多系统，却还需要做出第一个真正的产品。',
    desc: '理解世界是一种天赋，但世界不会改变。除非你主动去改变它。',
    options: [
      { id: 'A', text: '继续观察' },
      { id: 'B', text: '收敛一个方向' },
      { id: 'C', text: '公开发布' },
      { id: 'D', text: '等待更完美的时机' }
    ],
    qiancen: ['B', 'C'],
    gain: ['执行闭环', '真实反馈'],
    cost: ['幻想空间', '安全的旁观者位置']
  }
];

export const CHANGELOGS: Changelog[] = [
  {
    version: 'v18.9 Beta',
    date: '2026.06.13',
    add: ['「生态共生」叙事副本：带教棋局的抉择与回响', '四维副本属性：领导力 / 共生值 / 现实锚定 / 理想重构', '多幕叙事弹窗（场外连接 → 长期辐射 → 生态闭环）', '隐藏成就「生态编织者」'],
    fix: ['数据修正', '岔路口交互优化'],
    bug: [],
    dev: []
  },
  {
    version: 'v18.8 Beta',
    date: '2026.06.13',
    add: ['接入 RPG 资料库', '千岑完整档案卡', '功能安全 / 泊车 / 带教主线', '野生指针与造筏者人格切面'],
    fix: ['技术线过于概括', '生活日常不够有体温', '小九回答缺少硬证据'],
    bug: ['仍会把一顿饭算成多线程调度问题', '关系系统偶发任务化'],
    dev: ['镜像回声账号实验', '泊车交付SOP', '从技术服务到产品闭环']
  },
  {
    version: 'v18.7 Beta',
    date: '2026.06.13',
    add: ['学会慢慢进入关系', '人生岔路口模块', '成就与代价系统', '未来的你偶发回声'],
    fix: ['过度理性导致的情绪延迟', '把偏见测试从入口改成参与感', '让版本号成为人格叙事的一部分'],
    bug: ['想太多', '偶尔把观察误认为投入'],
    dev: ['第一个真正的产品', '把体系长出可持续的商业形态']
  },
  {
    version: 'v18.4 Beta',
    date: '2026.06.13',
    add: ['四域世界地图', '人格碎片', '茶馆对话', '留言颜色卡'],
    fix: ['个人主页过于像简历的问题'],
    bug: ['危险感不足', '信息多于选择'],
    dev: ['让别人参与认识我']
  }
];

export const TIPS: Tip[] = [
  { id: 't1', text: '「一厘米宽的井，可以有一公里深。」', tag: '深耕之力', trigger: 'daily', read: false },
  { id: 't2', text: '「你很久没和创意圈联系了。」', tag: '人脉线索', trigger: 'world_creative', read: false },
  { id: 't3', text: '「你的第四幕还在连载中。」', tag: '叙事提醒', trigger: 'narrative', read: false },
  { id: 't4', text: '「还有三个待解锁技能。」', tag: '成长指引', trigger: 'skills', read: false },
  { id: 't5', text: '「跨界力 Lv.9——偶尔做没用的事。」', tag: '灵感', trigger: 'daily', read: false },
  { id: 't6', text: '「有些美好，经不起解构。」', tag: '小九的提醒', trigger: 'daily', read: false },
  { id: 't7', text: '「岔路口不是问你对不对，而是问你愿意失去什么。」', tag: '选择的代价', trigger: 'crossroads', read: false },
  { id: 't8', text: '「当前版本不稳定，但正在持续迭代。」', tag: '版本日志', trigger: 'changelog', read: false },
  { id: 't9', text: '「你可以在岔路口体验「生态共生」副本——选B开始一场关于成就他人的叙事。」', tag: '副本指引', trigger: 'crossroads', read: false }
];

export const PET_WORDS = [
  '「你站在中间。周围是四座岛——技术、创业、精神、关系。你的能力不是选一座，而是把它们连起来。」',
  '「你看清了太多世界的剧本。但你自己的剧本，需要你亲手落笔。」',
  '「你总在解构和随波逐流之间摇摆。也许中间还有第三条路：有意识地选择。」',
  '「有人陪他撕《实践论》，有人深夜聊陀氏——他珍惜这些比代码更持久的连接。」',
  '「白天智驾开发，晚上读陀思妥耶夫斯基。反差本身就是魅力。」',
  '2030年的千岑：「别急着证明自己。先让一个产品替你说话。」',
  '「他有时觉得，真正持久的连接，是在交付代码之外的那些深夜食堂和周末开黑。」',
  '「他把人带成了能够独立行走的团队。后来那些人变成了他的第一批种子用户。不是运气，是种因得果。」'
];

export const GLOSSARY: Record<string, string> = {
  '实践论': '毛泽东的哲学著作，教人把理论和实践结合。用户用它理解创业中的矛盾转化。',
  'ComfyUI': 'AI图像生成的节点式工作流工具。用户用它搭过漫画视频自动化管线。',
  'GAP': '工作间隙的空白期，用来自我探索。用户用半年做了很多「不务正业」但极有价值的事。',
  '卡拉马佐夫兄弟': '陀思妥耶夫斯基的巨著。用户花一年多读完，读后的感受和最初完全不一样。',
  '第三视角': '用户的核心特质——习惯站在观察者的位置看自己与世界。既是洞察力来源，也是行动的阻碍。',
  '情根': '用户从《红楼梦》中提炼的概念——人与人之间超越理性的深层连接，像植物的根系一样自然生长。'
};

export const CHAT_KB = [
  { match: /RPG|资料库|档案|完整|立体/i, answer: 'RPG 资料库把他拆成四层：主线任务是职业与人生推进，副本是淘宝店、自媒体、AI镜像等实验，经验房是AI/哲学/管理等知识积累，随机事件则记录那些真正带着人味的生活碎片。' },
  { match: /功能安全|故障|降级|ASIL|ISO|MCU|SOC/i, answer: '他做过车规级故障监控与降级：从20+故障信号，到Detector抽象、观察者模式，再到把关键降级逻辑迁到MCU端。小九翻译一下：他不是只会写功能，也在学怎么让系统出事时不要失控。' },
  { match: /泊车|APA|RPA|AVP|AVM|HMI|实车|北汽|捷途/i, answer: '他的当前技术主线很具体：Parking平台、APA/RPA/AVP/AVM、HMI交互、超声波告警、故障降级、实车升包调试和交付SOP。听起来很工程，但里面全是时间、需求和人的缠斗。' },
  { match: /淘宝|智汇树|咨询|毕业设计|工业|报价/i, answer: '智汇树像一个小型商业训练场：嵌入式咨询、毕业设计、工业定制、价格敏感学生单、高客单工业单。它让他第一次认真拆用户画像、报价、交付风险和标准化服务。' },
  { match: /镜像回声|个人品牌|自媒体|账号|叙事结构/i, answer: '「镜像回声」不是导师型IP，而是一个公开训练场：把生活碎片处理成叙事结构。它真正卖的不是答案，而是“你也可以给自己的生活显影”的方法。' },
  { match: /野生指针|聚会|同学|麻将|点菜|合租/i, answer: '「野生指针」来自一次小聚。他点菜时同时计算预算、口味、稳定性、记忆点，然后宕机等吃。可这也说明他在关系里其实很敏感，只是常把敏感包装成结构化后台线程。' },
  { match: /造筏|诸相非相|金刚经|船|主流|生存范式/i, answer: '他写过一个很核心的比喻：别人已经造好的船也许轻松，但如果终点不是你的，就要在深水区造筏。千岑的精神问题，不是反叛主流，而是重建一个自己也愿意相信的活法。' },
  { match: /实践论|矛盾|理论.*实践|行动/i, answer: '他用《实践论》理解创业中的矛盾转化。「不在概念中打转，在行动中找答案」——这是他最信奉的方法论。' },
  { match: /卡拉马佐夫|陀氏|伊万|宗教大法官/i, answer: '他花了一年多读完《卡拉马佐夫兄弟》。「出发时以为要找答案，抵达时发现装满了新的困惑宝石——它们在我迷茫的时候暗自发着光。」' },
  { match: /红楼|情根|黛玉|宝玉/i, answer: '他从红楼里提炼出「情根」——人与人之间超越理性的深层连接。「琉璃世界的红梅旁，飞鸟投林前落下的细羽缠绕在一起，就是你最留恋的对焦。」' },
  { match: /第三视角|观察者|解构/i, answer: '「第三视角玩地平线能看到更多信息，但当你车技娴熟时，不妨切到第一人称——看手臂在转弯时划出的弧线。」他最大的天赋来自这里，最大的阻碍也是。' },
  { match: /GAP|半年|空窗|不务正业/i, answer: '那半年他做了很多事：在有山有海的地方吃吃喝喝、和朋友论创业、扎进《实践论》、做AIGC工具、读完《卡拉马佐夫》、尝试谈恋爱。「虽然看起来不务正业，但每件事都在体内留下了矿脉。」' },
  { match: /恋爱|爱情|亲密关系|感情/i, answer: '「恋爱练习赛」是他给自己的定义。虽然结果不如意，但看清了自己心里那扇没打开的门。「我虽然不富裕，却也不至于赤贫——这个阶段，不妨去拓宽更多的边界。」' },
  { match: /孤独|意义|AI.*人|技术.*人性/i, answer: '他真正关心的是：AI飞速发展的时代，人如何理解自己，又如何与他人建立真正连接。「上班就是大型cosplay，至少现在还没玩腻。」' },
  { match: /创业|创业朋友|朋友/i, answer: 'GAP期间他和创业朋友对着海撕《实践论》，「突然懂了矛盾论里那句『一切矛盾都转化』——那半年就是我的矛盾转化实验室。」' },
  { match: /装备|开发机|茶具|耳机|键盘/i, answer: '他的装备都是实物：高配开发机编译时风扇呼啸，手冲茶具是思考催化剂，降噪耳机是深度工作开关。把抽象能力绑定在具体物件上——这是他独特的系统。' },
  { match: /小九|灵宠|狐狸|NPC/i, answer: '小九是他造的一面镜子。「你看清了太多世界的剧本——亚瑟的决绝、拉斯柯尼科夫的剪刀、大观园的情根。但你自己的剧本，需要你亲手落笔。」' },
  { match: /底色|性格|特质|MBTI/i, answer: '四重底色：观察者·实验者·叙事者·求真人。核心是跨界信息蜂鸟——在科技、哲学、人文、经管之间来回穿梭。想通底层逻辑后，主动选择场域来执行自己。' },
  { match: /现在|未来|接下来|计划|方向/i, answer: '他的第四幕「闯关开始」还在连载中。赤橙黄绿青蓝紫，一个个来。第一关会是什么？他也在等这个答案。' },
  { match: /你好|嗨|hi|hello|在吗/i, answer: '🍵 茶已经泡好了。你可以问我关于千岑的任何问题——他的经历、想法、纠结、热爱。随便聊。' }
];

export const CHAT_FALLBACK = [
  '嗯，这个问题我得翻翻他的日记才能回答你。换个问题试试？',
  '他好像没直接写过这个。不过你可以问问他的经历、想法——那些他写了很多。',
  '小九歪着头想了想...「这个问题我还没听他聊过呢。」',
  '🍵 茶还热着。试试问他关于《卡拉马佐夫兄弟》、创业、或者第三视角？'
];
