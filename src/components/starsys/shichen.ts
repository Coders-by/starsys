// 十二时辰五行配置 —— 蓝星第三章"今日时辰"用。
// 抽离自 StarSysGame.tsx，纯数据 + 纯函数，零 React 依赖。

export interface ShichenInfo {
  name: string;
  range: string;
  element: string;
  elementColor: string;
  elementBg: string;
  glowColor: string;
  desc: string;
  modifiers: {
    pm: number;
    algo: number;
    test: number;
    customer: number;
  };
}

export const SHICHEN_DATA: Record<string, ShichenInfo> = {
  "子时": {
    name: "子时",
    range: "23:00 - 01:00",
    element: "水",
    elementColor: "text-blue-400",
    elementBg: "bg-blue-500/10 border-blue-500/20",
    glowColor: "rgba(59,130,246,0.15)",
    desc: "水气重，深夜适合静静整理用户反馈。PM节奏慢下来，测试也能歇口气。",
    modifiers: { pm: -5, algo: 5, test: -5, customer: 15 }
  },
  "丑时": {
    name: "丑时",
    range: "01:00 - 03:00",
    element: "土",
    elementColor: "text-amber-600",
    elementBg: "bg-amber-600/10 border-amber-600/20",
    glowColor: "rgba(217,119,6,0.15)",
    desc: "湿土气稳，算法和硬件容灾这时候最扎实。测试随便跑，出不了大事。",
    modifiers: { pm: 5, algo: -5, test: 15, customer: -5 }
  },
  "寅时": {
    name: "寅时",
    range: "03:00 - 05:00",
    element: "木",
    elementColor: "text-emerald-400",
    elementBg: "bg-emerald-500/10 border-emerald-500/20",
    glowColor: "rgba(16,185,129,0.15)",
    desc: "凌晨阳气初生，草木精神。适合写算法和带教文档，但别在这时候排PM会议。",
    modifiers: { pm: -10, algo: 15, test: -5, customer: 10 }
  },
  "卯时": {
    name: "卯时",
    range: "05:00 - 07:00",
    element: "木",
    elementColor: "text-emerald-400",
    elementBg: "bg-emerald-500/10 border-emerald-500/20",
    glowColor: "rgba(16,185,129,0.15)",
    desc: "日出时分，协作和带人最顺。用户反馈也会比较正面，适合安排客户沟通。",
    modifiers: { pm: -5, algo: 10, test: -5, customer: 15 }
  },
  "辰时": {
    name: "辰时",
    range: "07:00 - 09:00",
    element: "土",
    elementColor: "text-amber-500",
    elementBg: "bg-amber-500/10 border-amber-500/20",
    glowColor: "rgba(245,158,11,0.15)",
    desc: "辰时土气中正，各方利益基本持平。适合开项目计划会，不偏不倚。",
    modifiers: { pm: 10, algo: -5, test: 10, customer: -5 }
  },
  "巳时": {
    name: "巳时",
    range: "09:00 - 11:00",
    element: "火",
    elementColor: "text-rose-500",
    elementBg: "bg-rose-500/10 border-rose-500/20",
    glowColor: "rgba(244,63,94,0.15)",
    desc: "火气旺，PM冲劲最猛。适合突击推进度，但开发和测试压力山大，容易 burnout。",
    modifiers: { pm: 15, algo: -10, test: -10, customer: 15 }
  },
  "午时": {
    name: "午时",
    range: "11:00 - 13:00",
    element: "火",
    elementColor: "text-orange-500",
    elementBg: "bg-orange-500/10 border-orange-500/20",
    glowColor: "rgba(249,115,22,0.15)",
    desc: "午时火最旺，客户响应速度和发布效率拉到最高。开发和测试咬着牙顶住。",
    modifiers: { pm: 20, algo: -15, test: -10, customer: 15 }
  },
  "未时": {
    name: "未时",
    range: "13:00 - 15:00",
    element: "土",
    elementColor: "text-amber-600",
    elementBg: "bg-amber-600/10 border-amber-600/20",
    glowColor: "rgba(217,119,6,0.15)",
    desc: "午后土气回归，适合稳打稳扎做路测覆盖和架构设计。不急不躁。",
    modifiers: { pm: 5, algo: -5, test: 15, customer: -5 }
  },
  "申时": {
    name: "申时",
    range: "15:00 - 17:00",
    element: "金",
    elementColor: "text-zinc-400",
    elementBg: "bg-zinc-500/10 border-zinc-500/20",
    glowColor: "rgba(113,113,122,0.15)",
    desc: "金气清冷，写代码和做架构最锋利的时候。但用户沟通会偏冷，不适合安排客户会议。",
    modifiers: { pm: -5, algo: 15, test: 10, customer: -5 }
  },
  "酉时": {
    name: "酉时",
    range: "17:00 - 19:00",
    element: "金",
    elementColor: "text-zinc-300",
    elementBg: "bg-zinc-500/10 border-zinc-500/20",
    glowColor: "rgba(161,161,170,0.15)",
    desc: "金气收敛，适合做算法复盘和防灾策略精简。分析效率高，但别在这时候推新需求。",
    modifiers: { pm: -5, algo: 15, test: 15, customer: -5 }
  },
  "戌时": {
    name: "戌时",
    range: "19:00 - 21:00",
    element: "土",
    elementColor: "text-yellow-650",
    elementBg: "bg-yellow-600/10 border-yellow-600/20",
    glowColor: "rgba(202,138,4,0.15)",
    desc: "黄昏土气沉静。适合做硬件容灾测试和极限泊车验证，稳扎稳打。",
    modifiers: { pm: 10, algo: -10, test: 15, customer: -5 }
  },
  "亥时": {
    name: "亥时",
    range: "21:00 - 23:00",
    element: "水",
    elementColor: "text-sky-400",
    elementBg: "bg-sky-500/10 border-sky-500/20",
    glowColor: "rgba(56,189,248,0.15)",
    desc: "夜深水气重，具体的人情温度能抚平冷铁车机。适合反思用户需求，好评率会偏高。",
    modifiers: { pm: -10, algo: 5, test: -5, customer: 20 }
  }
};

export const getRealShichen = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour >= 23 || hour < 1) return "子时";
  if (hour >= 1 && hour < 3) return "丑时";
  if (hour >= 3 && hour < 5) return "寅时";
  if (hour >= 5 && hour < 7) return "卯时";
  if (hour >= 7 && hour < 9) return "辰时";
  if (hour >= 9 && hour < 11) return "巳时";
  if (hour >= 11 && hour < 13) return "午时";
  if (hour >= 13 && hour < 15) return "未时";
  if (hour >= 15 && hour < 17) return "申时";
  if (hour >= 17 && hour < 19) return "酉时";
  if (hour >= 19 && hour < 21) return "戌时";
  return "亥时";
};
