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
    name: '那壶始终没被一起喝下的茶',
    desc: '红星 · 第三章 · 看清精度的代价',
    time: '解锁瞬间',
    story:
      '2024 深冬校友会之后，他试着泡了一杯精确到 ±0.5°C 的茉莉花茶发给她。她说"还是不了"——烟花在外面响，他捧着那杯不会被尝的茶，愣了几秒。他想说"我们独行"，但只敢偷偷写在备忘录里。这不是失去——是从未发生。他终于看见：精度本身就是冷库。能把这份怅然装进胸口、不再用"看破"打发它，已经是十几年里第一次进步。',
    gain: ['红星共鸣 +15%', '看清自己用精度替代亲近的能力'],
    cost: ['一段几乎可以发生的关系', '一句没敢发的"我们"'],
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
    desc: '中心引力 · 三股力第一次同时在场',
    time: '解锁瞬间',
    story:
      '红蓝金三股力终于不打架了。工程的精度、心智的深度、情感的温度，第一次在同一个动作里同时落下来——比如在零下 40 度的黑河，给一个冻僵的同事调好 APA，又顺手把他递过来的奶茶接住。这不是顿悟，是把三条线练到肌肉记忆。',
    gain: ['共鸣率 +20%', '第一次让工程/心智/情感同时在场'],
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
    icon: '🌱',
    name: '第一次想留下的 day 1',
    desc: '回响 · day 1 · 承认"真下场"是什么样子',
    time: '解锁瞬间',
    story:
      '2024 深冬那杯没尝的茶让他第一次承认：他用 ±0.5°C 的精度替代了亲近。同年他给合作团队的新人写带教文档、重读《实践论》到第三遍——这不是他已经决定留下来了，是他第一次愿意承认"真下场"是什么样的。这不是终点。这是 day 1。',
    gain: ['回响共鸣 +15%', "第一次承认'真下场'是什么样"],
    cost: ['一段几乎可以发生的关系', '再也不能假装自己只是个观察者'],
  },
};
