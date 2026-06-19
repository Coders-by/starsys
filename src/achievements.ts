/**
 * 成就元数据 —— 7 个解锁瞬间的"纸背后的墨迹私信"。
 *
 * 触发位置：
 *   red_star          ← StarSysGame.verifyTeaBrewer() (red 章节 3，茉莉茶水温/时间命中)
 *   blue_star         ← StarSysGame.resolveMentorship('B') (blue 章节 4，承担带教)
 *   gold_star         ← StarSysGame.verifyGoldStar() (金行星，18→26 心智 4 阶段全填)
 *   central_star      ← StarSysGame.triggerClimaxResonance('all') (中心引力)
 *   resonance_escape  ← EchoSystem.handleSynthesize() id='escape'
 *   resonance_waiting ← EchoSystem.handleSynthesize() id='waiting'
 *   resonance_stay    ← EchoSystem.handleSynthesize() id='stay'
 *
 * 文案口径参考 src/lib/xiaojiu.ts 的 voice spec —— 不写鸡汤，要落地、要对得起一个具体的人。
 */

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  time: string;
  story: string;
  gain: string[];
  cost: string[];
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  red_star: {
    id: 'red_star',
    icon: '🍵',
    name: '茉莉那壶刚好的温度',
    desc: '红行星 · 第三章 · 茶泡到位',
    time: '解锁瞬间',
    story:
      '千岑认识的那个泡茶的人，对水温敏感得过分。80 到 85，泡 30 秒，多一秒少一度都不是那一杯。这一小刻钟教他的事比任何技术评审会都多——精度不是冷的，精度是为了对得起一个具体的人。',
    gain: ['红行星共鸣 +15%', "解锁'对脆弱事物的精度'"],
    cost: ['三次倒错温度的尴尬', '一段被记住的难堪'],
  },
  blue_star: {
    id: 'blue_star',
    icon: '📘',
    name: '把救命的 fail-safe 写进带教文档',
    desc: '蓝行星 · 第四章 · 把经验交出去',
    time: '解锁瞬间',
    story:
      '他在自动驾驶冗余系统里写过的那些容错策略，本来只是 spec 里的几行 if-else。直到他给新人做带教，一边写一边发现：自己花了三年才悟到的避险姿势，可以用一晚上文档让别人少撞三次墙。承担带教不是给别人的，是给三年前那个独自硬撑的自己的礼物。',
    gain: ['蓝行星共鸣 +15%', '知识被传出去了'],
    cost: ['几个独自撑住的深夜', "再也回不去的'专家光环'"],
  },
  gold_star: {
    id: 'gold_star',
    icon: '✨',
    name: '从精英主义掉进虚无再爬到具体的人那里',
    desc: '金行星 · 心智路线 · 18→26 岁',
    time: '解锁瞬间',
    story:
      "18 岁信精英主义，22 岁掉进虚无，24 岁啃《实践论》，26 岁读到老陀那句'要爱具体的人胜过爱抽象的人类'——他停了一下，把那本书合上。心智路线不是直线，是螺旋下沉再螺旋上升。每一阶都是把上一阶打碎重组的代价。",
    gain: ['金行星共鸣 +15%', '和自己年轻时的样子和解了'],
    cost: ['两年不读书的虚无期', '若干被自己骂醒的傲慢'],
  },
  central_star: {
    id: 'central_star',
    icon: '🌌',
    name: '三股力终于在同一个动作里同时在场',
    desc: '中心引力 · 同频共振合一',
    time: '解锁瞬间',
    story:
      '红蓝金三股力终于不打架了。工程的精度、心智的深度、情感的温度，第一次在同一个动作里同时落下来——比如在零下 40 度的黑河，给一个冻僵的同事调好 APA，又顺手把他递过来的奶茶接住。这不是顿悟，是把三条线练到肌肉记忆。',
    gain: ['共鸣率 +20%', '从筏造者升级为渡客'],
    cost: ['十年的来回反复', '每一次都差点放弃的疲惫'],
  },
  resonance_escape: {
    id: 'resonance_escape',
    icon: '🌠',
    name: '三次想跑的瞬间',
    desc: '回响 · 逃 · 一种模式被照见',
    time: '解锁瞬间',
    story:
      'QQ 上拒绝了流星雨邀约，把灵魂相近的女孩晾成了距离，履历里那段空白的 gap year——三件事没关系，又都是同一件：当生活逼近时，他选择往后退一步。看清这个模式不是为了自责，是为了下一次让自己往前那一步。',
    gain: ['回响共鸣 +10%', "看见了自己'safe observer'的形状"],
    cost: ['几个本可以更近的人', "一个本可以更早开始的'去过'"],
  },
  resonance_waiting: {
    id: 'resonance_waiting',
    icon: '⏳',
    name: '三次原地等待的姿势',
    desc: '回响 · 等 · fail-safe 的另一面',
    time: '解锁瞬间',
    story:
      "工程上'优雅降级'是美德，情感里那叫犹豫。同样的姿势在不同语境里可以是稳重也可以是错过。流星雨那次他在等一个'更明确'的信号，手势召唤那次他在等对方先开口，《红楼梦》那次他在等心情对了再读——等到信号永远不来。fail-safe 救得了系统，救不了人和人的此刻。",
    gain: ['回响共鸣 +10%', "知道了'稳重'的代价"],
    cost: ['三次主动权流失', '一些再也来不了的此刻'],
  },
  resonance_stay: {
    id: 'resonance_stay',
    icon: '🪐',
    name: '决定不退的那个 2024',
    desc: '回响 · 留 · 跳进第一人称',
    time: '解锁瞬间',
    story:
      "2024 年那段关系不是没问题，但他第一次没有用'优雅退坡'去躲。同年他把带教文档写完，把《实践论》读到第三遍。三件事一起证明同一件事：这个人开始从观察者气泡里走出来，赤脚踩进具体的泥地——而泥地里长得出庄稼。",
    gain: ['回响共鸣 +15%', "从'看破'切换到'走进去'"],
    cost: ['三个月的睡不好', '再也不能假装自己是局外人了'],
  },
};
