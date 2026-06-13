export interface UserAttributes {
  insight: number;
  crossover: number;
  express: number;
  social: number;
  execute: number;
  tech: number;
}

export interface AttributeConfig {
  id: keyof UserAttributes;
  icon: string;
  name: string;
  color: string;
  desc: string;
}

export interface Gear {
  id: string;
  icon: string;
  name: string;
  desc: string;
  effects: { attr: keyof UserAttributes; val: number }[];
}

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  time?: string;
  story?: string;
  gain?: string[];
  cost?: string[];
  scene?: boolean;
}

export interface Skill {
  id: string;
  icon: string;
  name: string;
  desc: string;
  check: (attrs: UserAttributes) => boolean;
  cond: string;
  locked?: boolean;
}

export interface NarrativeAct {
  id: number;
  chapter: string;
  title: string;
  time: string;
  color: string;
  detail: string;
  status: string;
}

export interface SymbiosisAttribute {
  id: string;
  icon: string;
  name: string;
  color: string;
  desc: string;
  aVal: number;
  bVal: number;
}

export interface SymbiosisAct {
  icon: string;
  title: string;
  subtitle: string;
  story: string;
  attrShow: string;
}

export interface Crossroad {
  id: string;
  age: number;
  scene: string;
  title: string;
  desc: string;
  options: { id: string; text: string }[];
  qiancen: string[];
  gain: string[];
  cost: string[];
  symAttrs?: SymbiosisAttribute[];
  symActs?: SymbiosisAct[];
}

export interface Changelog {
  version: string;
  date: string;
  add: string[];
  fix: string[];
  bug: string[];
  dev: string[];
}

export interface Tip {
  id: string;
  text: string;
  tag: string;
  trigger: string;
  read: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  icon?: string;
}

export interface GuestComment {
  color: string;
  text: string;
  time: string;
}
