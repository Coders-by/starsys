import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Globe, 
  Zap, 
  Briefcase, 
  Trophy, 
  MessageSquare, 
  FileText, 
  Compass, 
  History, 
  Sparkles, 
  ShieldAlert, 
  Heart, 
  Eye, 
  Info, 
  Check, 
  Send, 
  X, 
  BookOpen, 
  Share2 
} from 'lucide-react';
import {
  USER_BASE,
  DOSSIER,
  GEAR,
  TENSIONS,
  ACHIEVEMENTS,
  ATTRIBUTES_CONFIG,
  SKILLS,
  NARRATIVE_ACTS,
  CROSSROADS,
  CHANGELOGS,
  TIPS,
  PET_WORDS,
  GLOSSARY,
  CHAT_KB,
  CHAT_FALLBACK
} from './data';
import { 
  UserAttributes, 
  Gear as GearType, 
  Achievement, 
  Skill, 
  NarrativeAct, 
  Crossroad, 
  Changelog, 
  Tip, 
  ChatMessage, 
  GuestComment 
} from './types';
import {
  QIAN_CE_REGRETS,
  QIAN_CE_BONSAI_DIALOGS,
  QIAN_CE_DAILY_SCENES
} from './narrativeData';

export default function App() {
  // --- Standard States ---
  const [inQuiz, setInQuiz] = useState(true);
  const [quizStep, setQuizStep] = useState(0);
  const [quizTraits, setQuizTraits] = useState<Record<string, number>>({
    tech: 0, startup: 0, philosophy: 0, relationship: 0, nope: 0, none: 0
  });
  const [currentTab, setCurrentTab] = useState(0);

  // --- New Narrative Substates ---
  const [narrativeSubTab, setNarrativeSubTab] = useState<'timeline' | 'regrets' | 'bonsai' | 'daily' | 'bazi'>('timeline');
  const [jasmineBrewTemp, setJasmineBrewTemp] = useState(70);
  const [activeSpecimenId, setActiveSpecimenId] = useState<string | null>(null);
  const [sandboxUltramanCrushed, setSandboxUltramanCrushed] = useState(false);
  const [bonsaiPrunedCount, setBonsaiPrunedCount] = useState(0);
  const [activeCocoonId, setActiveCocoonId] = useState<string | null>(null);
  const [activeDailySceneId, setActiveDailySceneId] = useState<string | null>(null);
  const [appliedCookingDungeon, setAppliedCookingDungeon] = useState(false);

  // --- Dynamic Obsidian Vault States ---
  const [vaultFiles, setVaultFiles] = useState<{ relativePath: string, title: string, categories: string[], size: number }[]>([]);
  const [selectedVaultFile, setSelectedVaultFile] = useState<string | null>(null);
  const [selectedVaultContent, setSelectedVaultContent] = useState<string>('');
  const [loadingVault, setLoadingVault] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [vaultSearch, setVaultSearch] = useState('');
  const [activeVaultCategory, setActiveVaultCategory] = useState<string>('all');

  // --- Cyber Bazi States ---
  const [baziDaymaster, setBaziDaymaster] = useState<'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water'>('Earth');
  const [baziSeason, setBaziSeason] = useState<'Spring' | 'Summer' | 'Autumn' | 'Winter'>('Summer');
  const [baziGodA, setBaziGodA] = useState<'Wealth' | 'Seal' | 'Officer' | 'Output' | 'Friend'>('Seal');
  const [baziGodBOnDuty, setBaziGodBOnDuty] = useState<boolean>(true);

  const getShichenInfo = () => {
    const hour = new Date().getHours();
    let name = '';
    let color = '';
    let element = '';
    let description = '';
    
    if (hour >= 23 || hour < 1) {
      name = '子时';
      color = 'text-blue-400';
      element = '坎水至盛 (Deep Water)';
      description = '此刻是子时，天地交泰，世界已沉睡，你的意识却往往最清醒。比起过度消耗精力去思考没有答案的虚空，现在更适合收缩感知，在静谧中让白天超负荷的脑神经静息、让整个系统的后台进行自动碎片归档。';
    } else if (hour >= 1 && hour < 3) {
      name = '丑时';
      color = 'text-amber-600';
      element = '湿土酝酿 (Wet Earth)';
      description = '此刻是丑时，黎明前的最深静穆。这是大地湿土力量在暗自蓄存之时，最适合深度睡眠。亦或在这个不带功利目的的沉静时刻，写下不公开的日记，把心智的刀具重新敷油研磨，静候天光拂晓。';
    } else if (hour >= 3 && hour < 5) {
      name = '寅时';
      color = 'text-emerald-500';
      element = '少阳初萌 (Young Wood)';
      description = '此刻是寅时，天地微明，勃然朝夕。少阳木气正在悄悄破壳，万物处于后台重装系统（Reboot）的临界点。若此时尚醒，放空自己莫生杂念，吸气凝神，别急着把冰冷理性的日间计算器挂载上来。';
    } else if (hour >= 5 && hour < 7) {
      name = '卯时';
      color = 'text-emerald-400';
      element = '晨光破晓 (Blossom Wood)';
      description = '此刻是卯时，旭日出海，光曜大野。清晨五六点，是一天执行力与洞察意志的黄金峰值。宜在此阶段做完一整天最核心的逻辑“编译”与攻坚，让最具难度的主线工作在这个充盈阶段尘埃落定。';
    } else if (hour >= 7 && hour < 9) {
      name = '辰时';
      color = 'text-yellow-600';
      element = '温土生化 (Warm Earth)';
      description = '此刻是辰时，艳阳攀登，万家热气。此时脾胃运化达到峰值，最宜享用一顿温热丰盛的早餐。像为底盘充入恒电压力，用真切饱满的物理物质，去拉满今天高强度的现实锚定与抗磨损系数。';
    } else if (hour >= 9 && hour < 11) {
      name = '巳时';
      color = 'text-rose-500';
      element = '巽风催火 (Bright Fire)';
      description = '此刻是巳时，光芒璀璨，思绪奔流。这是一天里思维运算速度与泊车调试般穿透力最旺盛的顶点。把那些无聊的冗余群聊和分神杂音置之度外，全身心投入最坚硬的项目关卡，开火，破局！';
    } else if (hour >= 11 && hour < 13) {
      name = '午时';
      color = 'text-red-500';
      element = '极阳生阴 (Limit Fire)';
      description = '此刻是午时，日轮中天。阳气抵御极峰而微妙的阴气自地表初萌。强行逆势推进高脑力工作容易遭遇主频过载或偶发崩盘。温茶半响，闭目打盹片刻，这就是肉体架构中最精妙的 fail-safe 安全降级阀。';
    } else if (hour >= 13 && hour < 15) {
      name = '未时';
      color = 'text-amber-500';
      element = '燥土承载 (Heavy Earth)';
      description = '此刻是未时，斜阳西转，厚德载物。下午的深水攻坚战已然吹号，诸多琐细的 Code Review 或是跨团队对齐需要你的冷静。稳扎稳打，像刚毅的数控机床刀具般沉稳低噪地向前推进。';
    } else if (hour >= 15 && hour < 17) {
      name = '申时';
      color = 'text-amber-300';
      element = '申金肃敛 (Aura Gold)';
      description = '此刻是申时，天地气场收敛。比起向外探索，现在更适合在脑海里给你的庞大体系做一次编排。';
    } else if (hour >= 17 && hour < 19) {
      name = '酉时';
      color = 'text-orange-400';
      element = '晚霞归航 (Sinking Gold)';
      description = '此刻是酉时，残阳铺金，万灵思归。这是天地磁场给你的断电哨。卸下日间的业务逻辑，将感官切回到第一人称：凝视飞燕斜斜地画过暮色，听微风荡涤耳廓。重新为“观察者”擦拭铜镜。';
    } else if (hour >= 19 && hour < 21) {
      name = '戌时';
      color = 'text-yellow-700';
      element = '暮夜燥土 (Dark Earth)';
      description = '此刻是戌时，夜幕四合，温火在内。在街角人声鼎沸的烟火里，与挚友、合租伙伴大碗吃辣、点赞德扑桌旁的怪诞行为，或深度讨论马克思、陀氏，都是在给赛博世界注入坚实、带有呼吸感的生命回响。';
    } else if (hour >= 21 && hour < 23) {
      name = '亥时';
      color = 'text-sky-500';
      element = '双鱼入海 (Floating Water)';
      description = '此刻是亥时，人定百虑休。最适宜温茶一壶，点亮一盏昏黄的阅读灯。跟随《卡拉马佐夫兄弟》摸索精神旷脉，或者随心所欲敲下不为功利的诗篇。在不设限的随想中，轻轻与自己的偏见和解。';
    }
    return { name, color, element, description, hour };
  };

  const switchTab = (idx: number) => {
    setCurrentTab(idx);
  };
  
  // --- Interactive RPG States ---
  const [equippedGear, setEquippedGear] = useState<Record<string, boolean>>({
    g1: false, g2: false, g3: false, g4: false, g5: false, g6: false, g7: false
  });
  const [unlockedHidden, setUnlockedHidden] = useState<Set<string>>(new Set());
  const [storyViews, setStoryViews] = useState<Set<string>>(new Set());
  const [bookshelfClicks, setBookshelfClicks] = useState(0);
  const [crossroadChoices, setCrossroadChoices] = useState<Record<string, string[]>>({});
  
  // --- Interactive Spiritual Mind Game (Tab 0) ---
  const [mindGameStep, setMindGameStep] = useState<number>(1);
  const [mindGameSelections, setMindGameSelections] = useState<Record<number, string>>({});
  const [mindGameFinished, setMindGameFinished] = useState<boolean>(false);
  const [observerSliderValue, setObserverSliderValue] = useState<number>(30); // 0-100 for Chapter II
  const [resonanceSlider, setResonanceSlider] = useState<number>(50); // 0-100 for Chapter III logic/heart harmony
  const [weaveCompleted, setWeaveCompleted] = useState<boolean>(false);
  const [selectedDomainNode, setSelectedDomainNode] = useState<string | null>(null);
  
  // --- UI Modals & Panels ---
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{ name: string; domId: string; story: string; x: number; y: number } | null>(null);
  const [selectedGlossary, setSelectedGlossary] = useState<{ term: string; desc: string } | null>(null);
  
  // --- AI Capability Orchestrator Mini-Game States ---
  const [orchPerception, setOrchPerception] = useState<string | null>(null); // "神经网络"
  const [orchDecision, setOrchDecision] = useState<string | null>(null);     // "博弈规划"
  const [orchExecution, setOrchExecution] = useState<string | null>(null);    // "降级制动"
  const [orchSolved, setOrchSolved] = useState(false);
  const [orchActiveLeft, setOrchActiveLeft] = useState<string | null>(null); // selected left node: "perception", "decision", "execution"
  
  // --- Symbiosis Saga Storyboard states ---
  const [sagaOpen, setSagaOpen] = useState(false);
  const [sagaIdx, setSagaIdx] = useState(0);
  const [sagaCompleted, setSagaCompleted] = useState(false);
  const [sagaTriggeredOptionB, setSagaTriggeredOptionB] = useState(false);
  
  // --- Guest Card system ---
  const [guestOpen, setGuestOpen] = useState(false);
  const [guestSelectedColor, setGuestSelectedColor] = useState<string | null>(null);
  const [guestMsg, setGuestMsg] = useState('');
  const [guestVotes, setGuestVotes] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('guestVotes') || '{"#ef4444":12,"#fb923c":24,"#fbbf24":45,"#34d399":31,"#60a5fa":28,"#a78bfa":19}');
    } catch {
      return { "#ef4444": 12, "#fb923c": 24, "#fbbf24": 45, "#34d399": 31, "#60a5fa": 28, "#a78bfa": 19 };
    }
  });
  const [guestComments, setGuestComments] = useState<GuestComment[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('guestMessages') || '[]');
    } catch {
      return [];
    }
  });

  // --- Dynamic Chatbot States ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: '茶已经泡好了。🍵 欢迎来到千岑的茶室。你可以问我关于他的职业经历、开发细节（诸如线控底盘、泊车调试）、深夜里读陀氏或《实践论》的困惑，以及对AI和亲密关系的底层思考。我会结合他的真实思考深度回答你。' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // --- NPC Observational Speeches ---
  const [npcSpeech, setNpcSpeech] = useState<{ text: string; persona: string } | null>(null);
  const [npcCooldown, setNpcCooldown] = useState(false);
  const [petWordIdx, setPetWordIdx] = useState(0);
  const tabStayTimers = useRef<Record<number, number>>({});
  
  // --- Dynamic Tip system ---
  const [tipsList, setTipsList] = useState<Tip[]>(() => TIPS);
  const [activeToastTip, setActiveToastTip] = useState<Tip | null>(null);
  const [tipPanelOpen, setTipPanelOpen] = useState(false);

  // --- Quiz Config ---
  const QUIZ = [
    {
      icon: '🎭',
      q: '请选择你对这个人的第一印象：',
      opts: [
        { t: '技术硬核玩家', v: 'tech' },
        { t: '敏锐的创业探测者', v: 'startup' },
        { t: '感性文艺青年', v: 'philosophy' },
        { t: '温存的情感探索者', v: 'relationship' },
        { t: '吃瓜冲浪群众', v: 'nope' },
        { t: '低调修行的行者', v: 'none' }
      ]
    },
    {
      icon: '🌙',
      q: '深夜独空无一人时，他大概率在做什么？',
      opts: [
        { t: '死磕自动驾驶降级链代码', v: 'tech' },
        { t: '迭代他内容产品的商业闭环', v: 'startup' },
        { t: '深度阅读陀斯妥耶夫斯基', v: 'philosophy' },
        { t: '反思自己在人际上的野生指针', v: 'relationship' },
        { t: '倒腾一些炫酷的AIGC好玩工具', v: 'nope' },
        { t: '泡一壶老白茶，静静复盘今日矛盾', v: 'none' }
      ]
    },
    {
      icon: '💬',
      q: '身边最好的朋友，往往会这样吐槽他：',
      opts: [
        { t: '凡事爱解构，有些过于理性', v: 'philosophy' },
        { t: '理想主义太重，总在自己造筏', v: 'startup' },
        { t: '心思太缜密，常在多线程宕机', v: 'relationship' },
        { t: '一聊起CANBUS和ROS就两眼冒光', v: 'tech' },
        { t: '爱好跨界极宽，神出鬼没', v: 'nope' },
        { t: '看起来很好相处，内心却隔着一堵墙', v: 'none' }
      ]
    },
    {
      icon: '🔥',
      q: '如果给他贴一个最大的隐形标签，你觉得是：',
      opts: [
        { t: '对一切复杂系统着迷的工程师', v: 'tech' },
        { t: '极度克制，渴望交付闭环的试验者', v: 'startup' },
        { t: '在生存矛盾中寻找信仰的造筏者', v: 'philosophy' },
        { t: '一个渴望跳进生活热浪、拥抱真实的人', v: 'relationship' },
        { t: '高强度涉猎的赛博蜂鸟', v: 'nope' },
        { t: '在四域交界处安营扎寨的独行侠', v: 'none' }
      ]
    }
  ];

  // --- Persistent Storage synchronizing ---
  useEffect(() => {
    localStorage.setItem('guestVotes', JSON.stringify(guestVotes));
  }, [guestVotes]);

  useEffect(() => {
    localStorage.setItem('guestMessages', JSON.stringify(guestComments));
  }, [guestComments]);

  // Fetch Obsidian Files List on selection of Obsidian sub-tab
  useEffect(() => {
    if (narrativeSubTab === 'obsidian' && vaultFiles.length === 0) {
      setLoadingVault(true);
      fetch('/api/vault/files')
        .then(res => res.json())
        .then(data => {
          if (data.files) {
            setVaultFiles(data.files);
          }
          setLoadingVault(false);
        })
        .catch(e => {
          console.error('Failed to load vault files:', e);
          setLoadingVault(false);
        });
    }
  }, [narrativeSubTab, vaultFiles.length]);

  const readVaultFile = (relPath: string) => {
    setSelectedVaultFile(relPath);
    setLoadingContent(true);
    setSelectedVaultContent('');
    fetch(`/api/vault/read?path=${encodeURIComponent(relPath)}`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setSelectedVaultContent(data.content);
        } else {
          setSelectedVaultContent('※ 无法读取文件，或者该文档内容为空。');
        }
        setLoadingContent(false);
      })
      .catch(e => {
        console.error('Failed to read vault file content:', e);
        setSelectedVaultContent('※ 读取文件出错，请重试。');
        setLoadingContent(false);
      });
  };

  const getCleanFileName = (fullPath: string) => {
    const parts = fullPath.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(/\.md$/, '');
  };

  // --- Dynamic Tab Stay Timers (observing how deep the visitor explores) ---
  useEffect(() => {
    if (inQuiz) return;
    const start = Date.now();
    tabStayTimers.current[currentTab] = start;

    const interval = setInterval(() => {
      if (npcSpeech || npcCooldown) return;
      const stayDuration = Date.now() - (tabStayTimers.current[currentTab] || start);
      
      // If stays on active tab > 12s, prompt NPC observation
      if (stayDuration > 12000) {
        let text = '';
        let persona = '小九 · 旁白';
        
        if (currentTab === 1) { // Skills
          text = '他看了很久这套数据。能力属性只是他给系统编辑出的参数，他真正的魅力隐藏在数字规则之外。';
          persona = '小九 · 观察者';
        } else if (currentTab === 5) { // Log
          text = '看着这道主线？为了突破第四幕「产品闭环」这个大BOSS，他已经在副本地带炼金了很久。';
          persona = '小九 · 档案员';
        } else if (currentTab === 3) { // Achievements
          text = '看到「情感冒险家」了吗？那是他最坎坷的一段副本地窟。他常说，在关系中受伤是承认自己有血肉的必经之路。';
          persona = '小九 · 文艺狐';
        } else if (currentTab === 2) { // Gear
          text = '装备栏都是真的。高配开发机、手冲茶具、降噪耳机——他把精神专注力绑定在具体物质上。很理性的习惯，对吧？';
          persona = '小九 · 档案员';
        } else if (currentTab === 6) { // Crossroads
          text = '「生态共生」可不是单纯的选项——那是他在2025年外部交付极度撕裂下，真实趟过的心路成长。建议点击进去完整体验。';
          persona = '小九 · 过来狐';
        } else if (currentTab === 0) { // World topology
          text = '他的精神世界是拓扑织网状的。四座孤岛——技术、创业、精神、关系。技术帮他把控底层，精神帮他在深夜造筏。';
          persona = '小九 · 旁白';
        }

        if (text) {
          triggerNpcSpeech(text, persona);
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentTab, inQuiz, npcSpeech, npcCooldown]);

  // Check and auto-trigger relative Tips when visiting respective tabs
  useEffect(() => {
    if (inQuiz) return;
    let tipTrigger = '';
    if (currentTab === 0) tipTrigger = 'world_creative';
    if (currentTab === 1) tipTrigger = 'skills';
    if (currentTab === 5) tipTrigger = 'narrative';
    if (currentTab === 6) tipTrigger = 'crossroads';
    if (currentTab === 7) tipTrigger = 'changelog';

    if (tipTrigger) {
      const matchTip = tipsList.find(t => t.trigger === tipTrigger && !t.read);
      if (matchTip) {
        // Read it
        setTipsList(prev => prev.map(t => t.id === matchTip.id ? { ...t, read: true } : t));
        setActiveToastTip(matchTip);
        setTimeout(() => {
          setActiveToastTip(null);
        }, 6000);
      }
    }
  }, [currentTab, inQuiz]);

  // --- Dynamic Attribute Multiplier Calculations ---
  const getAttributes = (): UserAttributes => {
    const base = { ...USER_BASE.attributes };
    GEAR.forEach(g => {
      if (equippedGear[g.id]) {
        g.effects.forEach(e => {
          base[e.attr] = (base[e.attr] || 0) + e.val;
        });
      }
    });
    return base;
  };

  const attributes = getAttributes();

  // --- Hidden Achievements Collector (Eastern Eggs) ---
  useEffect(() => {
    if (inQuiz) return;

    // Fragment 1: Third perspective (Bookshelf clicks >= 3)
    if (bookshelfClicks >= 3 && !unlockedHidden.has('f1')) {
      unlockFragment('f1', '📖 第三视角', '我总能精准解读别人，却需要很久才记起跳回第一人称。');
    }

    // Fragment 2: Connector (Viewed at least 5 nodes or achievements)
    if (storyViews.size >= 5 && !unlockedHidden.has('f2')) {
      unlockFragment('f2', '🕸️ 深度连接者', '真正的连接不在于你想通透了，而在于你真实投入、行动过。');
    }

    // Fragment 3: System explorer (Quiz done)
    if (!unlockedHidden.has('f3')) {
      unlockFragment('f3', '🎯 偏见剥离', '带着偏见进入，带着多维立体的系统视角离开。');
    }

    // Fragment 4: Saga completions (Saga read completely)
    if (sagaCompleted && !unlockedHidden.has('f5')) {
      unlockFragment('f5', '🌱 生态编织者', '在复杂利益摩擦中，你执意做了高成本的渡人带教，种子终会回响。');
    }
  }, [bookshelfClicks, storyViews, sagaCompleted, inQuiz]);

  const unlockFragment = (id: string, name: string, desc: string) => {
    setUnlockedHidden(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    const toast = document.getElementById('hach-toast-container');
    if (toast) {
      toast.innerHTML = `
        <div class="bg-gradient-to-r from-stone-900 to-amber-950 borders border-amber-500/80 p-4 rounded-xl shadow-2xl text-center max-w-xs mx-auto animate-bounce">
          <div class="text-3xl mb-1">🧩</div>
          <div class="font-bold text-amber-400 text-sm">解锁隐藏人格碎片</div>
          <div class="font-semibold text-stone-200 mt-1 text-xs">${name}</div>
          <div class="text-stone-400 text-[10px] mt-1 leading-snug">${desc}</div>
        </div>
      `;
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5500);
    }
  };

  const triggerNpcSpeech = (text: string, persona: string) => {
    setNpcSpeech({ text, persona });
    setNpcCooldown(true);
    // Auto clear cooldown
    setTimeout(() => {
      setNpcCooldown(false);
    }, 20000);
  };

  // Glossary parser parser to insert interactive tooltip dots in text
  const parseGlossary = (text: string) => {
    if (!text) return '';
    const terms = Object.keys(GLOSSARY);
    let result = text;
    
    // Sort terms by length descending to avoid nested replacement errors
    const sortedTerms = [...terms].sort((a,b) => b.length - a.length);
    
    // We can split the string by terms and map them as interactive react elements instead of innerHTML
    // For simplicity and robust react rendering inside paragraphs, let's create a helper mapper
    return result;
  };

  // Render glossary text helper
  const GlossaryText = ({ text }: { text: string }) => {
    if (!text) return null;
    const terms = Object.keys(GLOSSARY);
    
    // Simple regex to match exact terms
    const regex = new RegExp(`(${terms.join('|')})`, 'g');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => {
          if (terms.includes(part)) {
            return (
              <span 
                key={i} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGlossary({ term: part, desc: GLOSSARY[part] });
                }}
                className="underline decoration-dashed decoration-amber-500/80 cursor-help text-amber-300 font-medium hover:text-amber-200 transition-colors px-0.5"
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </>
    );
  };

  // Send message to the Chatbot
  const handleSendChat = async () => {
    const query = chatInput.trim();
    if (!query) return;

    // Append User Message
    const updatedMessages = [...chatMessages, { sender: 'user' as const, text: query }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsTyping(true);

    // Keep active speech views for Easter eggs
    setStoryViews(prev => {
      const next = new Set(prev);
      next.add('chat-' + query.slice(0, 5));
      return next;
    });

    try {
      // We will first check our backend API proxy!
      // This is dynamic, secure, and utilizes high intelligence
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { sender: 'bot', text: '🦊 ' + data.reply }]);
      } else {
        // Fallback to our offline local knowledge base match
        throw new Error('Using local matcher fallback');
      }
    } catch {
      // Local regex rule matches
      setTimeout(() => {
        const match = CHAT_KB.find(({ match: re }) => re.test(query));
        const reply = match ? match.answer : CHAT_FALLBACK[Math.floor(Math.random() * CHAT_FALLBACK.length)];
        setChatMessages(prev => [...prev, { sender: 'bot', text: '🦊 ' + reply }]);
      }, 700 + Math.random() * 500);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 flex flex-col font-sans relative antialiased selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Absolute Hidden Achievement Floating Toast */}
      <div 
        id="hach-toast-container" 
        className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-72 pointer-events-none" 
        style={{ display: 'none' }}
      />

      {/* --- INTRO MINI-QUIZ --- */}
      <AnimatePresence>
        {inQuiz && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-between"
          >
            {/* Quiz Header */}
            <div className="text-center mt-6">
              <span className="text-5xl mb-2 inline-block filter drop-shadow-[0_0_15px_rgba(251,191,36,0.25)]">
                {QUIZ[quizStep]?.icon || '🪐'}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-stone-100 mt-2">千岑档案</h1>
              <p className="text-xs text-stone-400 mt-1.5 max-w-xs mx-auto">
                致力于将技术架构、商业实践与人文思考融合的人。进入前，来看看你对他有什么初始印象。
              </p>
            </div>

            {/* Quiz Progress dots */}
            <div className="flex gap-2 justify-center my-6">
              {QUIZ.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx < quizStep ? 'bg-amber-500' : idx === quizStep ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>

            {/* Quiz Options display / spectrum result banner */}
            <div className="flex-1 flex flex-col justify-center">
              {quizStep < QUIZ.length ? (
                <motion.div
                  key={quizStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-semibold text-stone-200 text-center mb-4 leading-relaxed">
                    {QUIZ[quizStep].q}
                  </h3>
                  
                  <div className="space-y-2">
                    {QUIZ[quizStep].opts.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => {
                          setQuizTraits(prev => ({ ...prev, [opt.v]: prev[opt.v] + 1 }));
                          setQuizStep(prev => prev + 1);
                        }}
                        className="w-full text-left bg-stone-900 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900/80 active:scale-[0.99] p-3.5 rounded-xl text-xs transition-all flex items-center gap-3 text-stone-300 active:bg-stone-850"
                      >
                        <span className="w-6 h-6 rounded-full bg-stone-800 text-[10px] text-stone-400 font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt.t}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-stone-900 rounded-2xl border border-stone-800/85 p-6 text-center space-y-4 shadow-xl"
                >
                  <div className="text-4xl">🎭</div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-400">第一印象揭晓</h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                      你觉得他更多是：
                    </p>
                  </div>

                  {/* Calculated spectrum result */}
                  <div className="flex flex-wrap justify-center gap-2 py-2">
                    {(Object.entries(quizTraits) as [string, number][])
                      .filter(([_, v]) => v > 0)
                      .map(([k, v]) => {
                        const label = k === 'tech' ? '技术探索者' : k === 'startup' ? '创业践行者' : k === 'philosophy' ? '精神造筏人' : k === 'relationship' ? '生活探温针' : k === 'nope' ? '跨界飞羽' : '极简修行客';
                        const colorClass = k === 'tech' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : k === 'startup' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : k === 'philosophy' ? 'text-indigo-400 bg-indigo-505/10 border-indigo-500/20' : k === 'relationship' ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' : 'text-stone-400 bg-stone-500/10 border-stone-800';
                        return (
                          <span key={k} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}>
                            {label} ({v})
                          </span>
                        );
                      })}
                  </div>

                  <p className="text-stone-300 text-xs leading-relaxed text-left bg-stone-950 p-3 rounded-xl border border-stone-800/50">
                    🦊 实际探索完他的四维世界后你会发现：他无法用任何单一标签定义。他在不同场域中切换，用理性重构系统，用真心触碰世界。
                  </p>

                  <button
                    onClick={() => setInQuiz(false)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3 px-5 rounded-xl text-xs active:scale-95 transition-all outline-none"
                  >
                    开启千岑的冒险之旅 →
                  </button>
                  <p className="text-[10px] text-stone-500">77% 访客带着偏见观察他，仅 12% 坚持初始判断</p>
                </motion.div>
              )}
            </div>
            
            {/* Quiz Footer copyright */}
            <div className="text-center text-[10px] text-stone-600 mt-4">
              © 2026 千岑档案 • RPG 资料卡
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN SYSTEM VIEW --- */}
      <AnimatePresence>
        {!inQuiz && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow w-full max-w-md mx-auto flex flex-col bg-stone-950 shadow-2xl border-x border-stone-900/60 relative overflow-hidden"
          >
            {/* Dynamic Status Bar */}
            <div className="bg-stone-900/80 backdrop-blur border-b border-stone-800/50 px-4 py-2.5 flex items-center justify-between shrink-0 gap-2 select-none">
              
              {/* Profile indicator */}
              <div 
                onClick={() => setCurrentTab(7)}
                className="flex items-center gap-1.5 cursor-pointer bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg hover:bg-amber-500/15 transition-all active:scale-95 text-[10px] font-bold"
              >
                <span>⚠️</span>
                <div>
                  <div className="text-[8px] text-amber-500/60 uppercase tracking-wider font-mono">Current Ver</div>
                  <div>v18.9 Beta</div>
                </div>
              </div>

              {/* World State */}
              <div className="flex-1 bg-stone-950 border border-stone-850 px-2 py-1 rounded-lg text-center">
                <div className="text-[8px] text-stone-500 uppercase tracking-wider">Topology Map</div>
                <div className="text-[10px] font-semibold text-stone-300 flex items-center justify-center gap-1">
                  <span>🌍</span> 精神拓扑空间
                </div>
              </div>

              {/* Tip Jin Nang Trigger */}
              <div 
                onClick={() => setTipPanelOpen(true)}
                className="cursor-pointer bg-pink-500/10 border border-pink-500/20 text-pink-400 px-2.5 py-1 rounded-lg hover:bg-pink-500/15 transition-all text-xs flex items-center gap-1 font-bold"
              >
                <span>🧧</span>
                <div className="text-left">
                  <div className="text-[8px] text-pink-500/60 uppercase tracking-wider">Tips</div>
                  <div className="text-[10px] text-pink-300">{tipsList.filter(t => !t.read).length} 条</div>
                </div>
              </div>
            </div>

            {/* Active Toast Alert for new tips */}
            <AnimatePresence>
              {activeToastTip && (
                <motion.div
                  initial={{ transform: 'translateY(-100%) scale(0.95)', opacity: 0 }}
                  animate={{ transform: 'translateY(0) scale(1)', opacity: 1 }}
                  exit={{ transform: 'translateY(-30px) scale(0.95)', opacity: 0 }}
                  onClick={() => {
                    setActiveToastTip(null);
                    setTipPanelOpen(true);
                  }}
                  className="absolute top-16 left-4 right-4 z-40 bg-gradient-to-r from-amber-950/90 to-stone-900/90 border border-amber-500/40 rounded-xl p-3.5 shadow-xl backdrop-blur cursor-pointer hover:border-amber-400/60 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">📌 {activeToastTip.tag}</span>
                    <span className="text-[9px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">解锁锦囊</span>
                  </div>
                  <div className="text-xs text-stone-200 mt-1 leading-snug">{activeToastTip.text}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MAIN PORTABLE CANVAS VIEWPORT */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              
              {/* TAB 0 = WORLD TOPOLOGY */}
              {currentTab === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  {/* Rich Dossier Panel */}
                  <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-850 rounded-2xl p-4 shadow-lg space-y-2">
                    <div className="text-[9px] font-bold text-amber-400 tracking-widest uppercase">{DOSSIER.kicker}</div>
                    <h2 className="text-lg font-bold text-stone-100">{DOSSIER.title}</h2>
                    <p className="text-xs text-stone-400 leading-relaxed text-justify">
                      <GlossaryText text={DOSSIER.copy} />
                    </p>

                    {/* Dossier Bento Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {DOSSIER.cards.map((card, cidx) => (
                        <div 
                          key={cidx} 
                          onClick={() => {
                            setStoryViews(prev => {
                              const next = new Set(prev);
                              next.add('card-' + cidx);
                              return next;
                            });
                          }}
                          className="bg-stone-950/65 border border-stone-850 rounded-xl p-2.5 hover:border-amber-500/30 transition-all cursor-pointer group"
                        >
                          <div className="text-[9px] text-amber-400/70 font-semibold group-hover:text-amber-400 transition-colors uppercase tracking-wider">{card.label}</div>
                          <div className="text-xs font-bold text-stone-200 mt-0.5">{card.value}</div>
                          <div className="text-[9px] text-stone-400 mt-1 leading-normal">{card.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Horizontal Evidence Strip Indicators */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
                    {DOSSIER.sources.map((src, idx) => (
                      <span 
                        key={idx}
                        className="bg-stone-900/80 border border-stone-850 px-3 py-1 rounded-full text-[10px] whitespace-nowrap text-stone-400"
                      >
                        <b className="text-amber-500 mr-1">{src.type}</b> {src.name}
                      </span>
                    ))}
                  </div>

                  {/* Unified Section Header */}
                  <div className="border-t border-stone-850/60 pt-4">
                    <h3 className="text-xs font-bold text-amber-400/90 uppercase tracking-widest mb-1">
                      ☯️ WORLD TOPOLOGY · 四域智能交汇
                    </h3>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      千岑生命的完整版图并不是单一的技术参数，而是由以下四个彼此张持、咬合的维度拼搭而成。点击任意领域，开启能量对流：
                    </p>
                  </div>

                  {/* Interconnected Domain Web Visualization (Instead of redundant radar) */}
                  <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[340px] overflow-hidden">
                    {/* SVG Connector Lines with Animated Pulse particles */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 320 300" preserveAspectRatio="xMidYMid meet">
                        {/* Radial Glow lines radiating from center object */}
                        <line x1="160" y1="150" x2="60" y2="70" stroke="rgba(251,191,36,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />
                        <line x1="160" y1="150" x2="260" y2="70" stroke="rgba(52,211,153,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />
                        <line x1="160" y1="150" x2="60" y2="230" stroke="rgba(129,140,248,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />
                        <line x1="160" y1="150" x2="260" y2="230" stroke="rgba(244,114,182,0.25)" strokeWidth="1.5" strokeDasharray="4 2" />

                        {/* Ring borders around center core */}
                        <circle cx="160" cy="150" r="45" fill="none" stroke="rgba(251,191,36,0.12)" strokeWidth="1" />
                        <circle cx="160" cy="150" r="75" fill="none" stroke="rgba(251,191,36,0.06)" strokeWidth="1" strokeDasharray="5 5" />
                        
                        {/* Animated flowing pulse dots */}
                        <circle cx="110" cy="110" r="2.5" fill="#fbbf24" className="animate-ping" style={{ animationDuration: '3s' }} />
                        <circle cx="210" cy="110" r="2.5" fill="#34d399" className="animate-ping" style={{ animationDuration: '4s' }} />
                        <circle cx="110" cy="190" r="2.5" fill="#818cf8" className="animate-ping" style={{ animationDuration: '3.5s' }} />
                        <circle cx="210" cy="190" r="2.5" fill="#f472b6" className="animate-ping" style={{ animationDuration: '4.5s' }} />
                      </svg>
                    </div>

                    {/* Central Glowing Core Core Node (Qiancen) */}
                    <div className="absolute top-[150px] left-[160px] -translate-x-1/2 -translate-y-1/2 z-20 group">
                      <div 
                        onClick={() => setSelectedDomainNode('center')}
                        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-xs cursor-pointer select-none ring-4 transition-all duration-300 ${
                          selectedDomainNode === 'center' || !selectedDomainNode
                            ? 'bg-gradient-to-tr from-amber-500/10 to-amber-400/20 border-2 border-amber-400 col shadow-[0_0_25px_rgba(251,191,36,0.45)] ring-amber-500/20 text-amber-200'
                            : 'bg-stone-900 border border-stone-800 text-stone-400 ring-transparent hover:border-amber-500/30'
                        }`}
                      >
                        <span className="text-[11px] tracking-wider font-extrabold">千岑</span>
                        <span className="text-[7.5px] text-amber-400/80 font-mono scale-90">MAIN CORE</span>
                      </div>
                      {/* Active orbital animations around center */}
                      <div className="absolute -inset-4 border border-amber-500/15 rounded-full pointer-events-none animate-[spin_12s_linear_infinite]" />
                      <div className="absolute -inset-8 border border-stone-800/40 rounded-full pointer-events-none animate-[spin_24s_linear_infinite]" />
                    </div>

                    {/* Node 1: Technology (Top-Left) */}
                    <button
                      onClick={() => setSelectedDomainNode('tech')}
                      className={`absolute top-[40px] left-[20px] max-w-[125px] p-2 rounded-xl text-left border transition-all z-10 hover:scale-103 ${
                        selectedDomainNode === 'tech'
                          ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.25)] text-stone-100'
                          : 'bg-stone-950/85 border-stone-850 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <span>⚙️</span> 技术域
                      </div>
                      <div className="text-[10px] font-bold text-stone-200 mt-0.5">智能驾驶功能安全</div>
                      <div className="text-[8.5px] text-stone-500 mt-1 leading-snug">
                        车辆失控异常冗余与优雅降级控制程序。
                      </div>
                    </button>

                    {/* Node 2: Entrepreneurship (Top-Right) */}
                    <button
                      onClick={() => setSelectedDomainNode('startup')}
                      className={`absolute top-[40px] right-[20px] max-w-[125px] p-2 rounded-xl text-left border transition-all z-10 hover:scale-103 ${
                        selectedDomainNode === 'startup'
                          ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.25)] text-stone-100'
                          : 'bg-stone-950/85 border-stone-850 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <span>🚀</span> 商业域
                      </div>
                      <div className="text-[10px] font-bold text-stone-200 mt-0.5">市井淘宝与真实求索</div>
                      <div className="text-[8.5px] text-stone-500 mt-1 leading-snug">
                        运营兼职淘宝，在微小的零配件供需里倾听市井重力。
                      </div>
                    </button>

                    {/* Node 3: Spiritual (Bottom-Left) */}
                    <button
                      onClick={() => setSelectedDomainNode('philosophy')}
                      className={`absolute bottom-[40px] left-[20px] max-w-[125px] p-2 rounded-xl text-left border transition-all z-10 hover:scale-103 ${
                        selectedDomainNode === 'philosophy'
                          ? 'bg-indigo-950/40 border-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.25)] text-stone-100'
                          : 'bg-stone-950/85 border-stone-850 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                        <span>🌙</span> 精神书房
                      </div>
                      <div className="text-[10px] font-bold text-stone-200 mt-0.5">重读经典与矛盾思辨</div>
                      <div className="text-[8.5px] text-stone-500 mt-1 leading-snug">
                        啃透《卡氏兄弟》冰川，深学《实践论》对抗空心危机。
                      </div>
                    </button>

                    {/* Node 4: Relationship (Bottom-Right) */}
                    <button
                      onClick={() => setSelectedDomainNode('relationship')}
                      className={`absolute bottom-[40px] right-[20px] max-w-[125px] p-2 rounded-xl text-left border transition-all z-10 hover:scale-103 ${
                        selectedDomainNode === 'relationship'
                          ? 'bg-pink-950/40 border-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.25)] text-stone-100'
                          : 'bg-stone-950/85 border-stone-850 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-pink-400 flex items-center gap-1">
                        <span>🩹</span> 关系客栈
                      </div>
                      <div className="text-[10px] font-bold text-stone-200 mt-0.5">解下盔甲真心涉险</div>
                      <div className="text-[8.5px] text-stone-500 mt-1 leading-snug">
                        收缩冷静冷观的第三人称自保盾，笨拙投入爱的体验。
                      </div>
                    </button>

                    {/* Node Interactive Disclosure Panel */}
                    <div className="absolute inset-x-2 bottom-2 bg-stone-950/95 border border-stone-800 rounded-xl p-3 text-left">
                      {(!selectedDomainNode || selectedDomainNode === 'center') && (
                        <div>
                          <div className="text-[9px] text-amber-400 font-extrabold uppercase tracking-wider">💡 域核心 · 四域交聚</div>
                          <div className="text-[11.5px] font-bold text-stone-100 mt-0.5">跨界跃越：将生活的裂纹缝合成网</div>
                          <p className="text-[10px] text-stone-400 mt-1 leading-relaxed text-justify">
                            千岑说：“我无法只做一个冷冰冰的代码流水线机械。只做技术会让我空心化，只谈文艺会让我变成悬空的清高虚无客。我宁可同时背着扳手和书卷，在市井生活和高维算法中不停跃界，用这重摩擦感知生命的真纯温度。”
                          </p>
                        </div>
                      )}
                      {selectedDomainNode === 'tech' && (
                        <div>
                          <div className="text-[9px] text-amber-400 font-extrabold uppercase tracking-wider">🔧 自动驾驶安全 · 物理基准线</div>
                          <div className="text-[11.5px] font-bold text-stone-100 mt-0.5">车规级冗余防御：不怕失控，因为早已预留退路</div>
                          <p className="text-[10px] text-stone-400 mt-1 leading-relaxed text-justify">
                            自动泊车（APA/RPA）涉及数吨钢铁在现实复杂泊位里的移动。为了绝对机动与人身保障，千岑在功能规范中构建起“优雅降级”状态机：传感器信号中断时自动降级制动而不是剧烈抱死。他将这种工程思想化为一生的行路指南：在命运发动机异常突击时，已经为自己悄布下心理降级软着陆的气垫。
                          </p>
                        </div>
                      )}
                      {selectedDomainNode === 'startup' && (
                        <div>
                          <div className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-wider">🚀 市井淘宝 · 卸下书生气</div>
                          <div className="text-[11.5px] font-bold text-stone-100 mt-0.5">淘宝小本买卖：让双手触摸泥泞的供需重力</div>
                          <p className="text-[10px] text-stone-400 mt-1 leading-relaxed text-justify">
                            他深知键盘侠清高评论世界的廉价。他在淘宝兼职做工业配件和技能策划网店。面对客户为了几块钱优惠的软磨硬泡、被差评防护侵蚀的焦心、低客单价微薄利润的拉扯，这一道现实生计的褶皱，将他曾经的书呆气磨灭，极大地夯实了他对社会普罗大众民生生计的深刻悲悯。
                          </p>
                        </div>
                      )}
                      {selectedDomainNode === 'philosophy' && (
                        <div>
                          <div className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-wider">📚 矛盾思辨 · 精神自愈之骨</div>
                          <div className="text-[11.5px] font-bold text-stone-100 mt-0.5">卡拉马佐夫长歌：在残损的人间里拼死前去爱</div>
                          <p className="text-[10px] text-stone-400 mt-1 leading-relaxed text-justify">
                            用一整年死咬完陀氏绝笔，又反复翻看《实践论》，他不再傲慢急躁。他领悟到心智成长没有任何可以取巧的PPT剧本。正如矛盾论所释，摩擦、冲突不是程序错误，它们就是生命本身的存在频率，唯有肉身涉水才能在林梢点亮火。
                          </p>
                        </div>
                      )}
                      {selectedDomainNode === 'relationship' && (
                        <div>
                          <div className="text-[9px] text-pink-400 font-extrabold uppercase tracking-wider">🩹 凡尘情根 · 回应的重量</div>
                          <div className="text-[11.5px] font-bold text-stone-100 mt-0.5">打破看客自傲：收起天眼保护，笨拙走入真心</div>
                          <p className="text-[10px] text-stone-400 mt-1 leading-relaxed text-justify">
                            他习惯开启高空“第三视角观察者”防御壳。这样能将痛苦和尴尬解构为单纯的因果数据。但在2024的那段感情冒险中，他硬生生把防御甲拔除，全盘赤诚应对。纵使流星滑落未能圆满，但那真情爱恨磨砺出的重温痛感，让他真正地退出了隔空看客席，加入了热血涌流的人类一员。
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Aesthetic Tension Transition Block */}
                  <div className="bg-stone-900 border border-stone-850 rounded-xl p-3.5 space-y-3">
                    <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-850/50 pb-2">
                      <span>⚡</span> 精神内在极性冲突对立
                    </div>
                    <p className="text-[10px] text-stone-400 leading-normal text-justify">
                      这些极性长歌并不是互不往来的绝缘箱。千岑曾长久撕扯在这“冷酷的计算”与“火热的热度”对决中。这四股激越的能量正是推动他探索和蜕变的狂暴引力：
                    </p>
                    <div className="grid grid-cols-2 gap-2 pb-1 text-[10px]">
                      {TENSIONS.map((ten, idx) => (
                        <div key={idx} className="bg-stone-950 border border-stone-850 px-2.5 py-2 rounded-lg flex items-center justify-between">
                          <span className="text-amber-400/80 font-medium">{ten.left}</span>
                          <span className="text-stone-600 font-mono">←→</span>
                          <span className="text-indigo-400/80 font-medium">{ten.right}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Magnificent Interactive Game: 「心智试炼：三重灵魂辩证」 */}
                  <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-850 pb-2.5">
                      <div>
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">MINDS TRIAL CHRONICLE</span>
                        <h4 className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5 mt-0.5">
                          <span>🧩</span> 心智试炼：三重灵魂辩证小游戏
                        </h4>
                      </div>
                      <span className="text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                        {mindGameFinished ? '完成终合' : `第 ${mindGameStep} 关 / 共 3 步`}
                      </span>
                    </div>

                    {!mindGameFinished ? (
                      <div className="space-y-4">
                        {/* Tab-like indicator representing Chapters */}
                        <div className="grid grid-cols-3 gap-1 bg-stone-950 p-1 rounded-lg border border-stone-850">
                          <button 
                            onClick={() => { if(mindGameStep > 1) setMindGameStep(1); }}
                            className={`text-[9.5px] py-1 rounded transition-all font-semibold ${
                              mindGameStep === 1 
                                ? 'bg-amber-500 text-stone-950 shadow' 
                                : 'text-stone-500 hover:text-stone-300'
                            }`}
                          >
                            Chapter I: 实践矛盾
                          </button>
                          <button 
                            onClick={() => { if(mindGameSelections[1] === 'B') setMindGameStep(2); }}
                            disabled={mindGameSelections[1] !== 'B'}
                            className={`text-[9.5px] py-1 rounded transition-all font-semibold ${
                              mindGameStep === 2 
                                ? 'bg-amber-500 text-stone-950 shadow' 
                                : mindGameSelections[1] === 'B' 
                                  ? 'text-stone-400 hover:text-stone-200' 
                                  : 'text-stone-700 cursor-not-allowed'
                            }`}
                          >
                            Chapter II: 见相非相
                          </button>
                          <button 
                            onClick={() => { if(mindGameSelections[1] === 'B' && observerSliderValue >= 50) setMindGameStep(3); }}
                            disabled={mindGameSelections[1] !== 'B' || observerSliderValue < 50}
                            className={`text-[9.5px] py-1 rounded transition-all font-semibold ${
                              mindGameStep === 3 
                                ? 'bg-amber-500 text-stone-950 shadow' 
                                : (mindGameSelections[1] === 'B' && observerSliderValue >= 50) 
                                  ? 'text-stone-400 hover:text-stone-200' 
                                  : 'text-stone-700 cursor-not-allowed'
                            }`}
                          >
                            Chapter III: 情根不灭
                          </button>
                        </div>

                        {/* CHAMBER I: On Practice and Contradiction */}
                        {mindGameStep === 1 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <div className="bg-amber-500/5 text-amber-400 border border-amber-500/10 p-2.5 rounded-lg text-[10px] leading-relaxed">
                              <strong>📌 场景还原：</strong> 一辆卡车在暴废的智能泊车调试基地发生了严重的异常抱死，车身失控滑离标定坡度。外面下着冻雨，雷达传感器被脏泥覆盖。合作外包团队慌作一团不讲规范，只在一旁摔板子说代码有bug。
                            </div>
                            <h5 className="text-[11.5px] font-bold text-stone-200">你脑中完美的数学算法，在肮脏的冻雨泥泞里瞬间报废，你需要做出抉择：</h5>
                            
                            <div className="space-y-2 pt-1">
                              <button
                                onClick={() => setMindGameSelections(prev => ({ ...prev, 1: 'A' }))}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                                  mindGameSelections[1] === 'A'
                                    ? 'bg-red-950/20 border-red-500/80 text-red-200'
                                    : 'bg-stone-950 border-stone-850 text-stone-300 hover:border-stone-800'
                                }`}
                              >
                                <span className="text-xs shrink-0 mt-0.5">🏛️</span>
                                <div>
                                  <div className="font-bold">选择 A:「退避神庙」</div>
                                  <div className="text-[9.5px] text-stone-400 mt-0.5">高举完美数学逻辑和车规协议硬性框条，指责合作团队愚钝、硬件不达标，冷冷退场以保护完美的思想实验不受污染。</div>
                                </div>
                              </button>

                              <button
                                onClick={() => setMindGameSelections(prev => ({ ...prev, 1: 'B' }))}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                                  mindGameSelections[1] === 'B'
                                    ? 'bg-amber-950/20 border-amber-500/80 text-amber-200'
                                    : 'bg-stone-950 border-stone-850 text-stone-300 hover:border-stone-800'
                                }`}
                              >
                                <span className="text-xs shrink-0 mt-0.5">🛶</span>
                                <div>
                                  <div className="font-bold">选择 B:「入水横渡」</div>
                                  <div className="text-[9.5px] text-stone-400 mt-0.5">穿上胶鞋趴到底盘下擦雷达、抓异常帧，熬到凌晨四点。把经验写成毫无死角的带教文档讲给合作方听，用真实摩擦降服这泥泞世界。</div>
                                </div>
                              </button>
                            </div>

                            {/* Option Results display */}
                            {mindGameSelections[1] === 'A' && (
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-950/25 border border-red-900/50 rounded-xl p-3 text-[10px] text-red-300 leading-relaxed">
                                <b className="text-xs">⚠️ 思想警告：</b> 代码完美无缺。但在这座漂亮的象牙塔里，它一辈子也没爬行在实车的微波震颤中。高谈阔论无法将指针向前拨动。你虽然安全，但也因隔绝而枯水。点击选择 B，试试深水横渡。
                              </motion.div>
                            )}

                            {mindGameSelections[1] === 'B' && (
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
                                <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3 text-[10px] text-emerald-300 leading-relaxed">
                                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400 mb-1">
                                    <span>🏅</span> 实践意志 · 学徒得道
                                  </div>
                                  你通过《实践论》降服了理论纯净的洁癖！现场车身制动安全归航。更不可思议的是，那伙你呕心沥血带教出的合作方伙伴，竟然在多年后你开发第一代心灵显影AI产品时，红着眼睛免费为你拼命肉身测试。这即是矛盾在世俗中奇妙的良性转易——不舍心力涉险，就永远没有一生交付的盟友。
                                </div>
                                <button
                                  onClick={() => setMindGameStep(2)}
                                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 active:scale-98 transition-all rounded-xl text-stone-950 font-extrabold text-[11px] uppercase tracking-wider shadow"
                                >
                                  解锁关隘 2: 前往见相非相 🔮
                                </button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* CHAMBER II: Seeing Through Forms */}
                        {mindGameStep === 2 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <div className="bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 p-2.5 rounded-lg text-[10px] leading-relaxed">
                              <strong>📌 心魔调和：</strong> 千岑生就极强的“第三人称天眼自卫机制”。命运遭遇变故、情关难耐伤痛时，他便把自己的知觉向天顶一扯，像看电影一样抽离地打量自己的失落。这让他永不受死伤，可长久以还，他成了生命活剧的隐形旁观者，不再感觉任何纯白的温度。
                            </div>

                            <label className="text-[11px] text-stone-300 font-bold block">
                              请左右拖动调谐器，为千岑设置今日的【入局涉险比例】(Participant Ratio)：
                            </label>

                            {/* Customized Range Slider */}
                            <div className="bg-stone-950 border border-stone-850 p-4 rounded-xl space-y-2.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-stone-500 font-mono">0% (极端冰冷高塔看客)</span>
                                <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded font-mono">
                                  当前: {observerSliderValue}%
                                </span>
                                <span className="text-pink-400 font-mono">100% (血肉裸露涉险)</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={observerSliderValue}
                                onChange={(e) => setObserverSliderValue(Number(e.target.value))}
                                className="w-full accent-amber-500 bg-stone-850 rounded-lg cursor-pointer h-1.5"
                              />

                              {/* Dynamic Text Output based on values */}
                              <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg min-h-[64px] flex flex-col justify-center">
                                {observerSliderValue <= 25 && (
                                  <div className="text-[9.5px] text-stone-400 leading-relaxed text-justify">
                                    <span className="text-red-400 font-bold block mb-1">🛡️ [0-25%] 极致高空镜子 shield：</span>
                                    “凡所有相，皆是虚妄。” 你的第三人称面罩拉满了。你看着自己在凡俗里跌脚，甚至没有任何难堪与酸软。可当你侧头打量一盏茶或是一个老友的背影，心里只有一片冷冰冰的数字采样波。你保卫了安全，但也成了生命的行尸。
                                  </div>
                                )}
                                {observerSliderValue > 25 && observerSliderValue < 75 && (
                                  <div className="text-[9.5px] text-emerald-300 leading-relaxed text-justify">
                                    <span className="text-emerald-400 font-bold block mb-1">🪞 [26-74%] 见相非相·静心折射：</span>
                                    “若见诸相非相，即见如来。” 这正是千岑最深沉的哲学对焦。第三人称是你的心灵修道手术刀，而不是你的棺木。你降临凡尘打滚、在商业人情中真诚犯傻、受伤，但夜晚捧起杯老白茶，你依然有一镜澄净收录生活的风尘。
                                  </div>
                                )}
                                {observerSliderValue >= 75 && (
                                  <div className="text-[9.5px] text-pink-300 leading-relaxed text-justify">
                                    <span className="text-pink-400 font-bold block mb-1">🩹 [75-100%] 第一人称·热血涉险：</span>
                                    抛却一切安全防线，笨手笨脚把全部真心亮出来！你不再解构。迎面撞上不可预测的恋爱与世事，你大声哭、畅快笑、感受皮肉撕裂的真痛和胸膛激烈撞击的心跳。纵使血痕累累，你的眼睛是闪光的：Qiancen, this is real life!
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Forward block depending on tuning */}
                            {observerSliderValue < 50 ? (
                              <div className="bg-yellow-950/20 border border-yellow-900/50 rounded-xl p-3 text-[10px] text-yellow-300 leading-relaxed">
                                <b>💡 调谐提示：</b> 太抽离了，灵魂容易死寂。请将滑块拖拽到 <strong>50% 以上</strong>，放任自己带着体温去凡尘纠缠，即能解锁第三重终极对齐！
                              </div>
                            ) : (
                              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                                <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3 text-[10px] text-emerald-300 leading-relaxed">
                                  <strong>🏅 见相非相达成！</strong> 你明白退避在上帝视域是可怜的，敢在红尘被绊倒才是真雄杰。你已成功将今日的千岑调和为温存有胆、自保有序的心智黄金对焦。
                                </div>
                                <button
                                  onClick={() => setMindGameStep(3)}
                                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 active:scale-98 transition-all rounded-xl text-stone-950 font-extrabold text-[11px] uppercase tracking-wider shadow"
                                >
                                  解锁关隘 3: 不灭情根共鸣 🩹
                                </button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* CHAMBER III: The Crimson Root */}
                        {mindGameStep === 3 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <div className="bg-pink-500/5 text-pink-400 border border-pink-500/10 p-2.5 rounded-lg text-[10px] leading-relaxed">
                              <strong>📌 终点融合：</strong> 在这算法疯狂倾倒效率、大厂将每个人压瘪在PPT表格的冷硬纪元，我们那些微不足道的笨拙眼泪和真心，是否只是一堆多余的信息垃圾？不。那是大雪漫野里不灭的「情根」！请对齐千岑灵魂底盘的逻辑主频与人间回想。
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-stone-950 p-3 rounded-xl border border-stone-850">
                              <div className="space-y-1.5">
                                <label className="text-[9.5px] text-stone-500 font-mono block">🔧 计算理性主频 (0-100)</label>
                                <input 
                                  type="range" 
                                  min="0" max="100" 
                                  value={resonanceSlider} 
                                  onChange={(e) => setResonanceSlider(Number(e.target.value))}
                                  className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer h-1"
                                />
                                <div className="text-[10px] font-bold text-stone-300 font-mono">
                                  车规安全级冗余: {resonanceSlider} Hz
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[9.5px] text-stone-500 font-mono block">💗 人情生命温存 (0-100)</label>
                                <div className="flex items-center gap-1.5 mt-2">
                                  <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all rounded-full" 
                                      style={{ width: `${resonanceSlider}%` }} 
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-pink-400 font-mono">{resonanceSlider}%</span>
                                </div>
                                <div className="text-[8px] text-stone-500 font-mono mt-1">情根能量与理性共振对齐中</div>
                              </div>
                            </div>

                            {/* Complete trigger button */}
                            {resonanceSlider < 60 ? (
                              <div className="bg-yellow-950/20 border border-yellow-900/50 rounded-xl p-3 text-[10px] text-yellow-300 leading-relaxed">
                                <b>💡 织网调控：</b> 为了使“冷钢控制代码”和“温热人本情根”实现完美谐振，请将【计算理性】提升调至 <strong>60% 以上</strong>！
                              </div>
                            ) : (
                              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-1">
                                <button
                                  onClick={() => {
                                    setWeaveCompleted(true);
                                    setMindGameFinished(true);
                                    setUnlockedHidden(prev => {
                                      const next = new Set(prev);
                                      next.add('dorot_covenant');
                                      return next;
                                    });
                                  }}
                                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-pink-500 text-stone-950 font-extrabold text-[11.5px] uppercase tracking-widest rounded-xl hover:shadow-[0_0_18px_rgba(244,114,182,0.4)] active:scale-97 transition-all flex items-center justify-center gap-1.5"
                                >
                                  <span>🔥</span> 编组情根 · 燃亮营野之火 <span>🔥</span>
                                </button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      /* MASSIVE REWARD / SAGA ENDPONT PANEL (The campfire certificate) */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.96 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="bg-stone-950 border-2 border-pink-500/30 rounded-2xl p-5 relative overflow-hidden space-y-4"
                      >
                        {/* Campfire Visual Sparks Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-rose-500/10 rounded-full blur-2xl" />
                          <div className="absolute bottom-8 left-1/3 w-2 h-2 bg-amber-500 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
                          <div className="absolute bottom-12 right-1/3 w-1.5 h-1.5 bg-rose-400 rounded-full animate-ping" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }} />
                          <div className="absolute bottom-6 left-[45%] w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                        </div>

                        {/* Certificate Header */}
                        <div className="text-center space-y-1 relative z-10">
                          <div className="text-[10px] font-extrabold text-pink-400 tracking-widest uppercase">THE DOROT COVENANT</div>
                          <h5 className="text-base font-extrabold text-stone-100 flex items-center justify-center gap-2">
                            <span>🔥</span> 多洛特灵魂誓章 <span>🔥</span>
                          </h5>
                          <div className="text-[8px] text-stone-500 font-mono mt-0.5">COMPLATED MULTI-CORE TOPOLOGY HARMONY</div>
                        </div>

                        {/* Majestic Poetic Prose directly understandable by anyone */}
                        <div className="relative z-10 bg-stone-900/90 border border-stone-800/80 rounded-xl p-3 text-xs text-stone-300 leading-relaxed text-justify space-y-2.5">
                          <p>
                            恭喜行路人，你已陪同千岑完成了这场艰难的心智磨砺：
                          </p>
                          <blockquote className="border-l-2 border-pink-500/60 pl-3 italic text-[11px] text-stone-200 py-0.5">
                            “纵然这个时代钢铁冷漠，算法在拼死压缩人性的褶皱；纵然白日里的车规安全代码充斥着条框契约。但当你踩进淘宝市井的泥土、深夜一字一划给陌生同行者递去解忧的铜镜、毫无保留地把越坑方案讲给落后的战友听，你已经在这世界悄悄钉下了不可磨灭的情根。”
                          </blockquote>
                          <p className="text-[10.5px]">
                            真正成熟的灵魂，绝对不是长居高空、无伤无痛的看客旁观者。而是他看透了规则的残破，却毅然收起第三视角的遮罩，带着软肋和傲骨，跳入这一汪吵闹污脏的俗流。在实践的重力摩擦中，燃亮一堆属于自我的暖流营野篝火。
                          </p>
                        </div>

                        {/* Interactive Reset */}
                        <div className="relative z-10 flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setMindGameStep(1);
                              setMindGameSelections({});
                              setMindGameFinished(false);
                              setWeaveCompleted(false);
                            }}
                            className="flex-1 py-2 bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-stone-200 border border-stone-800 active:scale-98 transition-all rounded-xl text-[10px] font-semibold"
                          >
                            🔄 重历试炼
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDomainNode(null);
                              // Add a chat message to show game reflection
                              setChatMessages(prev => [
                                ...prev,
                                { sender: 'user', text: '小九，我通关了千岑的三重灵魂辩证，对真实的千岑有了全然一新的感触！' },
                                { sender: 'bot', text: '🍵（温柔行礼）你终于看懂了呢。他从来不是个完美的极客，也不是个只会谈玄论道的书生。他用笨拙但无比滚烫的手脚走着真真切切的泥路，甚至这一路扑了满身沙子。多洛特的篝火，此时也温暖着客人的手。' }
                              ]);
                              setChatOpen(true);
                            }}
                            className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-stone-100 active:scale-98 transition-all rounded-xl text-[10px] font-bold shadow-md"
                          >
                            💬 和小九叙谈感悟
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 1 = SKILLS & ATTRIBUTES */}
              {currentTab === 1 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center bg-stone-900 border border-stone-850 px-4 py-3 rounded-2xl">
                    <div>
                      <h3 className="text-sm font-bold text-stone-200">🌳 多维能力属性面板</h3>
                      <p className="text-[10px] text-stone-400 mt-0.5">基础熟练度 + 装备奖励</p>
                    </div>
                    <span className="text-xs bg-stone-950 px-2 py-1 rounded border border-stone-850 text-amber-400 font-mono">
                      Level Total: {Object.values(attributes).reduce((a,b)=>a+b, 0)}
                    </span>
                  </div>

                  {/* Attributes Progress Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    {ATTRIBUTES_CONFIG.map((cfg) => {
                      const effVal = attributes[cfg.id] || 0;
                      const baseVal = USER_BASE.attributes[cfg.id] || 0;
                      const bonus = effVal - baseVal;
                      return (
                        <div key={cfg.id} className="bg-stone-900 border border-stone-850 rounded-xl p-3.5 space-y-1 relative overflow-hidden">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-stone-300">
                              <span>{cfg.icon}</span>{cfg.name}
                            </span>
                            <span style={{ color: cfg.color }} className="font-mono text-sm inline-block font-bold">
                              {effVal} 
                              {bonus > 0 && <span className="text-[9px] text-stone-400 ml-0.5">(+{bonus})</span>}
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="h-1.5 bg-stone-950 rounded-full w-full overflow-hidden">
                            <div 
                              style={{ width: `${effVal * 10}%`, backgroundColor: cfg.color }}
                              className="h-full rounded-full transition-all duration-700"
                            />
                          </div>
                          
                          <p className="text-[9.5px] text-stone-500">{cfg.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Unlocking skills */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-stone-400 flex items-center gap-1">
                      <span>⚡</span> RPG 技能激活系统 (依据当前属性重算)
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5">
                      {SKILLS.map((skill) => {
                        const isUnlocked = skill.check(attributes) && !skill.locked;
                        return (
                          <div 
                            key={skill.id}
                            className={`border rounded-xl p-3 flex gap-3 transition-all ${
                              isUnlocked 
                                ? 'bg-stone-900 border-emerald-500/30' 
                                : 'bg-stone-900/40 border-stone-850 opacity-45'
                            }`}
                          >
                            <span className="text-2xl mt-0.5">{skill.icon}</span>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-stone-200">{skill.name}</span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                  isUnlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-stone-800 text-stone-500'
                                }`}>
                                  {isUnlocked ? '已激活' : '未解锁'}
                                </span>
                              </div>
                              <p className="text-[10px] text-stone-400">{skill.desc}</p>
                              <div className="text-[9px] text-stone-500 font-mono">🔑 解锁阈值: {skill.cond}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2 = COMPONENT BACKPACK / GEAR */}
              {currentTab === 2 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-stone-900 border border-stone-850 p-4 rounded-2xl">
                    <h3 className="text-sm font-bold text-stone-200">🎒 个人装备工具背包</h3>
                    <p className="text-xs text-stone-400 mt-1">装备具体实物物件可以给对应属性属性增加增益 Buff，激活前置高阶技能。</p>
                  </div>

                  {/* Gear Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {GEAR.map((item) => {
                      const isEquipped = equippedGear[item.id];
                      return (
                        <div 
                          key={item.id}
                          className={`border rounded-2xl p-4.5 flex flex-col justify-between gap-3 text-left transition-all ${
                            isEquipped 
                              ? 'bg-gradient-to-b from-stone-900 to-amber-950/20 border-amber-500/40' 
                              : 'bg-stone-900 border-stone-800'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">{item.icon}</span>
                            <button
                              onClick={() => {
                                setEquippedGear(prev => {
                                  const next = { ...prev, [item.id]: !prev[item.id] };
                                  return next;
                                });
                                // Keep node stats Easter eggs
                                setStoryViews(prev => {
                                  const next = new Set(prev);
                                  next.add('equip-' + item.id);
                                  return next;
                                });
                                // trigger small NPC popup
                                if (!isEquipped) {
                                  if (item.id === 'g7') {
                                    triggerNpcSpeech("别翻了，这本书真的是讲刀具的，里面绝对没有夹着 iPhone。", "小九 · 吐槽");
                                  } else {
                                    triggerNpcSpeech(`你装备了 ${item.name}！去看你的属性条和技能区，是不是涨了？这就叫实物能力锚点。`, '小九 · 装备官');
                                  }
                                }
                              }}
                              className={`text-[9.5px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                                isEquipped 
                                  ? 'bg-amber-500 border-amber-600 text-stone-950 active:scale-95' 
                                  : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-amber-500/30'
                              }`}
                            >
                              {isEquipped ? '打包装备' : '佩戴挂载'}
                            </button>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-stone-200">{item.name}</h4>
                            <p className="text-[10px] text-stone-500 leading-normal">{item.desc}</p>
                          </div>

                          {/* Buff metrics */}
                          <div className="flex flex-wrap gap-1">
                            {item.effects.map((eff, eidx) => {
                              const attrName = ATTRIBUTES_CONFIG.find(c => c.id === eff.attr)?.name || '';
                              return (
                                <span key={eidx} className="bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded">
                                  {attrName} +{eff.val}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-850 text-left text-[11px] text-stone-400 leading-relaxed">
                    💡 提示：高配开发机、手冲茶具等并非形式噱头，而是千岑将高能物件赋予属性，在实操中以此稳定特定心流的自我调试行为模式。
                  </div>
                </motion.div>
              )}

              {/* TAB 3 = MILESTONE ACHIEVEMENTS */}
              {currentTab === 3 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-stone-900 border border-stone-850 p-4 rounded-2xl">
                    <h3 className="text-sm font-bold text-stone-200">🏆 个人历程里程碑成就册</h3>
                    <p className="text-xs text-stone-400 mt-1">记录他在每个关键决策点的成就以及他所付出的高维成长代价。</p>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {ACHIEVEMENTS.map((ach) => (
                      <div 
                        key={ach.id}
                        onClick={() => {
                          setSelectedAchievement(ach);
                          setStoryViews(prev => {
                            const next = new Set(prev);
                            next.add('ach-' + ach.id);
                            return next;
                          });
                        }}
                        className="bg-stone-900 border border-stone-850 hover:border-amber-500/40 p-3.5 rounded-2xl flex gap-3 text-left transition-all cursor-pointer hover:bg-stone-900/80 active:scale-[0.99]"
                      >
                        <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.15)] select-none">{ach.icon}</span>
                        <div className="flex-grow space-y-1.5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold text-stone-200">{ach.name}</h4>
                              <p className="text-[10px] text-stone-500 leading-snug">{ach.desc}</p>
                            </div>
                            {ach.time && <span className="bg-stone-950 font-mono text-[8px] text-stone-400 px-1.5 py-0.5 rounded">{ach.time}</span>}
                          </div>

                          {/* Increments & cost grids */}
                          {(ach.gain || ach.cost) && (
                            <div className="grid grid-cols-2 gap-2 text-[9px] pt-1">
                              {ach.gain && (
                                <div className="bg-emerald-500/5 min-h-[30px] p-2 rounded border border-emerald-500/10">
                                  <div className="text-emerald-400 font-bold">✓ 获得</div>
                                  <div className="text-stone-400 mt-0.5 leading-normal">{ach.gain.join('、')}</div>
                                </div>
                              )}
                              {ach.cost && (
                                <div className="bg-rose-500/5 min-h-[30px] p-2 rounded border border-rose-500/10">
                                  <div className="text-rose-400 font-bold">✗ 代价 / 负重</div>
                                  <div className="text-stone-400 mt-0.5 leading-normal">{ach.cost.join('、')}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4 = PET COMPANION */}
              {currentTab === 4 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4 max-w-sm mx-auto text-center py-6"
                >
                  <span className="text-7xl mb-1 inline-block filter drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse">
                    🦊
                  </span>
                  
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-amber-400">{USER_BASE.pet.name}</h2>
                    <p className="text-xs text-stone-500 mt-0.5">{USER_BASE.pet.type}</p>
                  </div>

                  <div className="flex justify-center gap-1.5 flex-wrap">
                    <span className="text-[10px] bg-stone-900 border border-stone-850 px-2.5 py-1 rounded-full text-amber-300">
                      🌙 月灵: {USER_BASE.pet.element}
                    </span>
                    <span className="text-[10px] bg-stone-900 border border-stone-850 px-2.5 py-1 rounded-full text-emerald-300">
                      🔮 天赋: {USER_BASE.pet.talent}
                    </span>
                    <span className="text-[10px] bg-stone-900 border border-stone-850 px-2.5 py-1 rounded-full text-pink-300">
                      🧬 三尾・跨界对焦
                    </span>
                  </div>

                  {/* Words dialogue bubble */}
                  <div className="bg-stone-900 border border-stone-850 p-4 rounded-2xl italic text-xs leading-relaxed max-w-xs mx-auto text-stone-300 relative">
                    <div className="absolute top-1.5 right-2 text-[8px] text-stone-500 uppercase tracking-widest font-mono">Quotes</div>
                    {PET_WORDS[petWordIdx]}
                  </div>

                  <button
                    onClick={() => {
                      setPetWordIdx((prev) => (prev + 1) % PET_WORDS.length);
                      // easter egg count clicks
                      setBookshelfClicks(prev => prev + 1);
                    }}
                    className="bg-stone-900 border border-stone-800 hover:border-amber-500/30 text-stone-200 text-[10.5px] px-4 py-2 rounded-xl transition-all font-semibold select-none active:scale-95 hover:bg-stone-900/80"
                  >
                    💡 轻戳互动，倾听悄悄话
                  </button>

                  <div className="grid grid-cols-2 gap-2 text-left pt-2">
                    <div className="bg-stone-900 border border-stone-850 p-3 rounded-xl">
                      <span className="text-[8px] text-amber-400/80 font-bold uppercase block tracking-wider">守护领域</span>
                      <span className="text-xs font-bold text-stone-200 mt-0.5 inline-block">{USER_BASE.pet.domain}</span>
                      <p className="text-[9px] text-stone-500 leading-normal mt-0.5">连结四界，折射客观本心形态。</p>
                    </div>

                    <div className="bg-stone-900 border border-stone-850 p-3 rounded-xl">
                      <span className="text-[8px] text-pink-400/80 font-bold uppercase block tracking-wider">当前心情</span>
                      <span className="text-xs font-bold text-stone-200 mt-0.5 inline-block">
                        {USER_BASE.pet.moods[Math.floor(Math.random() * USER_BASE.pet.moods.length)]}
                      </span>
                      <p className="text-[9px] text-stone-500 leading-normal mt-0.5">时刻观测你留在本空间中的足迹特征。</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5 = NARRATIVE & LOG TIMELINE */}
              {currentTab === 5 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4 text-left"
                >
                  {/* Subtle Sub-tab Navigation */}
                  <div className="flex bg-stone-900 border border-stone-850 p-1 rounded-xl text-[10px] font-bold tracking-tight select-none overflow-x-auto gap-1 scrollbar-none scroll-smooth flex-nowrap shrink-0">
                    <button 
                      onClick={() => setNarrativeSubTab('timeline')}
                      className={`px-3 py-2 text-center rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        narrativeSubTab === 'timeline' ? 'bg-stone-950 text-amber-400 font-semibold shadow-sm' : 'text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      🚀 主线大纲
                    </button>
                    <button 
                      onClick={() => setNarrativeSubTab('regrets')}
                      className={`px-3 py-2 text-center rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        narrativeSubTab === 'regrets' ? 'bg-stone-950 text-amber-400 font-semibold shadow-sm' : 'text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      💗 情迷复盘
                    </button>
                    <button 
                      onClick={() => setNarrativeSubTab('bonsai')}
                      className={`px-3 py-2 text-center rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        narrativeSubTab === 'bonsai' ? 'bg-stone-950 text-amber-400 font-semibold shadow-sm' : 'text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      ✂️ 心灵修剪
                    </button>
                    <button 
                      onClick={() => setNarrativeSubTab('daily')}
                      className={`px-3 py-2 text-center rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        narrativeSubTab === 'daily' ? 'bg-stone-950 text-amber-400 font-semibold shadow-sm' : 'text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      🍵 人间烟火
                    </button>
                    <button 
                      onClick={() => setNarrativeSubTab('bazi')}
                      className={`px-3 py-2 text-center rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        narrativeSubTab === 'bazi' ? 'bg-stone-950 text-amber-400 font-semibold shadow-sm' : 'text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      ☯️ 命理与时辰
                    </button>
                  </div>

                  {/* SUBTAB 1: TIMELINE */}
                  {narrativeSubTab === 'timeline' && (
                    <div className="space-y-4">
                      <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl border-l-[3px] border-amber-500">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-stone-200">🎯 当前主线任务：第四幕 · 闯关</h4>
                          <span className="text-xs font-bold text-amber-500 font-mono">22%</span>
                        </div>
                        {/* progress line */}
                        <div className="h-1 bg-stone-950 mt-2 rounded-full overflow-hidden w-full">
                          <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: '22%' }} />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2.5 mt-3.5 text-xs text-stone-400 leading-relaxed">
                          <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> <span>把RPG资料库显影成千岑档案</span></div>
                          <div className="flex items-center gap-2 text-stone-500"><span>⬜</span> <span>找到最值得深耕十年的核心场景方向</span></div>
                          <div className="flex items-center gap-2 text-stone-500"><span>⬜</span> <span>完成一次包含技术与商业的完整产品闭环</span></div>
                          <div className="flex items-center gap-2 text-stone-500"><span>⬜</span> <span>梳理和沉淀自动驾驶泊车交付与团队带教SOP</span></div>
                        </div>
                      </div>

                      {/* Vertical Timeline */}
                      <div className="relative border-l border-stone-850 pl-5 space-y-5 py-2">
                        <span className="absolute -left-1.5 top-0 w-3 h-3 bg-stone-950 border border-stone-700 rounded-full" />
                        
                        {NARRATIVE_ACTS.map((act) => {
                          const isCurrent = act.status === 'current';
                          return (
                            <div key={act.id} className="relative group">
                              {/* Anchor Node */}
                              <div 
                                style={{ backgroundColor: act.color }}
                                className={`absolute -left-[26px] top-1.5 w-3.5 h-3.5 rounded-full border border-stone-950 ${
                                  isCurrent ? 'ring-4 ring-amber-500/20 scale-125' : ''
                                }`}
                              />

                              <details className="bg-stone-900 border border-stone-850 hover:border-stone-800 rounded-2xl group transition-all duration-300">
                                <summary className="cursor-pointer list-none p-4 flex justify-between items-start">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span style={{ color: act.color }} className="text-[10px] font-bold font-mono tracking-wide">{act.chapter}</span>
                                      <span className="text-[10px] text-stone-500 font-mono">{act.time}</span>
                                    </div>
                                    <h4 className={`text-xs font-bold leading-relaxed ${isCurrent ? 'text-amber-400' : 'text-stone-200'}`}>
                                      {act.title}
                                    </h4>
                                  </div>
                                  <span className="text-stone-600 group-open:rotate-180 transition-transform text-xs inline-block ml-2 select-none">▼</span>
                                </summary>

                                <div className="px-4 pb-4 border-t border-stone-950 pt-2 text-xs text-stone-400 leading-relaxed text-justify space-y-2">
                                  <GlossaryText text={act.detail} />
                                  
                                  {isCurrent && (
                                    <div className="p-2.5 mt-2 bg-amber-500/5 rounded-lg border border-amber-500/15 text-[11px] text-amber-200 leading-normal">
                                      💡 观察随想：把每次经历提炼为「版本号」，有利于自身客观摆脱情绪杂音，用迭代系统的科学视角看待自己的坎坷。
                                    </div>
                                  )}
                                </div>
                              </details>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: REGRETS (情迷复盘) */}
                  {narrativeSubTab === 'regrets' && (
                    <div className="space-y-4">
                      {/* intro card */}
                      <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl">
                        <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                          <span>💔</span> 外在情感波动与回避型策略复盘
                        </h3>
                        <p className="text-[11px] text-stone-400 leading-relaxed text-justify mt-1">
                          对千岑而言，什么是喜欢？那意味着对方的一切风吹草动都会让自己变为城堡门前执勤的哨兵，极度警觉而敏感。遗憾的是，敏感和喜欢在以前往往导致了最被动的自保和抗拒回避，最后将回忆精加工制成标本。
                        </p>
                      </div>

                      {/* Interactive Tea Brewing slider */}
                      <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between items-center shrink-0">
                          <label className="text-[11px] text-stone-300 font-bold flex items-center gap-1.5">
                            <span>🍵</span> 冲一壶茉莉花茶
                          </label>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            jasmineBrewTemp === 85 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse' 
                              : 'bg-stone-950 text-stone-400'
                          }`}>
                            水温偏好: {jasmineBrewTemp} °C {jasmineBrewTemp === 85 ? '(完美契合)' : ''}
                          </span>
                        </div>
                        
                        <p className="text-[10.5px] text-stone-500 leading-relaxed">
                          温度决定香气开阖。拖动滑块来调节冲泡水温，寻找千岑心里茉莉盛开的最精确阈值：
                        </p>

                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          value={jasmineBrewTemp}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setJasmineBrewTemp(val);
                            if (val === 85) {
                              setStoryViews(prev => {
                                const next = new Set(prev);
                                next.add('jasmine-85');
                                return next;
                              });
                            }
                          }}
                          className="w-full h-1.5 bg-stone-950 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                        />

                        {/* Interactive Speech bubble */}
                        <div className="bg-stone-950 border border-stone-850 p-3 rounded-xl min-h-[55px] flex items-center justify-center text-center transition-all">
                          {jasmineBrewTemp <= 40 && (
                            <p className="text-[11px] text-stone-400 italic">
                              “冷水死水。茶叶一动不动，任你心里波涛汹涌，水温冲不开那道回避型保护的冰层舱壁。”
                            </p>
                          )}
                          {jasmineBrewTemp > 40 && jasmineBrewTemp < 80 && (
                            <p className="text-[11px] text-amber-500/80 italic">
                              “水温不够烫。思念蜷缩在杯底像一声叹息，茶叶虽在舒展，却没有勇气溢出来，一如以前的无声默认。”
                            </p>
                          )}
                          {jasmineBrewTemp >= 80 && jasmineBrewTemp <= 88 && (
                            <div className="space-y-1">
                              <p className="text-[11.5px] text-amber-300 font-medium italic animate-pulse">
                                “不冷不热，八十五度恰得一绝。你不去喝它，茉莉香茗就永远是熟透、最顶好闻的。”
                              </p>
                              <p className="text-[10px] text-stone-500 font-mono">
                                🌲 二十岁的夏天，后海有树的院子，夏代有工的玉，二十来岁的你。这本也是可遇不可求的事。
                              </p>
                            </div>
                          )}
                          {jasmineBrewTemp > 88 && (
                            <p className="text-[11px] text-rose-400 italic">
                              “水太烫了！近乎沸腾的自卑与无措直接把茶叶烫伤了。任何接近都会一瞬间激起极度的应急，掉头逃难！”
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Specimen grid list */}
                      <div className="space-y-3">
                        <div className="text-[10px] text-stone-500 uppercase tracking-wider font-mono flex justify-between items-center px-1">
                          <span>📦 心动与回避标本陈列馆</span>
                          <span className="text-rose-400 text-[9px] animate-pulse">点击抽取出土标本</span>
                        </div>

                        <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 mt-2">
                          {QIAN_CE_REGRETS.map((reg) => (
                            <button
                              key={reg.id}
                              onClick={() => {
                                setActiveSpecimenId(reg.id === activeSpecimenId ? null : reg.id);
                                setStoryViews(prev => {
                                  const next = new Set(prev);
                                  next.add('regret-' + reg.id);
                                  return next;
                                });
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                reg.id === activeSpecimenId 
                                  ? 'bg-rose-950/20 border-rose-500/50 text-stone-200' 
                                  : 'bg-stone-900 border-stone-850/60 text-stone-400 hover:border-stone-800'
                              }`}
                            >
                              <div className="text-[9px] text-stone-500 font-mono flex justify-between items-center">
                                <span>{reg.period}</span>
                                {reg.id === activeSpecimenId ? <span className="text-rose-500 text-[12px]">●</span> : null}
                              </div>
                              <div className="text-[10.5px] font-bold truncate mt-1 text-stone-300">
                                {reg.标本Name}
                              </div>
                            </button>
                          ))}
                        </div>

                        {activeSpecimenId && (() => {
                          const reg = QIAN_CE_REGRETS.find(r => r.id === activeSpecimenId);
                          if (!reg) return null;
                          return (
                            <div className="bg-stone-950 border border-rose-500/20 rounded-2xl p-4.5 mt-3 space-y-3 relative overflow-hidden">
                              <div className="absolute top-1 right-2 text-[8px] text-rose-500/50 uppercase tracking-widest font-mono">SPECIMEN CARD</div>
                              <div className="flex justify-between items-start">
                                <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1">
                                  <span>📦</span> {reg.title}
                                </h5>
                                <span className="text-[9px] bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded font-bold font-mono">标本化存档</span>
                              </div>
                              
                              <div className="space-y-3 text-[11px] leading-relaxed">
                                <div>
                                  <span className="text-rose-400/80 block text-[9.5px] font-bold mb-1">【重演现场】</span>
                                  <p className="text-stone-300 text-justify bg-stone-900/60 p-2.5 rounded-lg border border-stone-850">{reg.event}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                  <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-850">
                                    <span className="text-rose-400/80 block text-[9px] font-bold mb-0.5">【惯性应对】</span>
                                    <span className="text-amber-400/90">{reg.coping}</span>
                                  </div>
                                  <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-850">
                                    <span className="text-rose-400/80 block text-[9px] font-bold mb-0.5">【回看教训】</span>
                                    <span className="text-stone-300">{reg.reflection}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-2 text-center text-[9.5px] text-stone-500 border-t border-stone-900 font-mono italic">
                                "我不是在抗拒建立连接，我只是在一遍遍收集这些凄美的遗憾标本。"
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 3: BONSAI (心灵修剪) */}
                  {narrativeSubTab === 'bonsai' && (
                    <div className="space-y-4">
                      {/* quote note */}
                      <div className="bg-stone-900/90 border border-stone-850 p-4 rounded-xl text-justify relative">
                        <span className="absolute -top-2 right-4 text-xs font-serif text-stone-600 font-bold">我命由我不由改</span>
                        <h3 className="text-xs font-bold text-indigo-400">“开头改了不抓人？但我执意不改它！”</h3>
                        <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
                          千岑写道：开头没爆款潜质、说教感太浓，但我不想改！理直气壮不予修饰，这就是最纯粹的反叛。
                        </p>
                      </div>

                      {/* Bento grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Interactive Pruner */}
                        <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                          <div className="absolute top-1.5 right-25 text-[8px] text-indigo-500 font-mono">Bonsai Dojo</div>
                          <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                            <span>🪵</span> 宫城先生的心灵盆栽工坊
                          </h4>
                          
                          {/* CSS Bonsai rendering based on clicks */}
                          <div className="h-32 bg-stone-950 rounded-xl relative border border-stone-850/60 flex items-end justify-center py-2.5 overflow-hidden">
                            <span className="absolute top-1.5 left-2 text-[8px] text-stone-500 font-mono">内心树型.prun</span>
                            
                            <svg className="w-24 h-24 transition-all duration-500" viewBox="0 0 100 100">
                              {/* Trunk */}
                              <path d="M50,90 Q47,60 52,30" stroke="#78350f" strokeWidth="4.5" fill="none" />
                              {/* Branches */}
                              <path d="M51,60 Q20,53 28,32" stroke="#78350f" strokeWidth="2.5" fill="none" opacity={bonsaiPrunedCount >= 1 ? 0.2 : 1} className="transition-all duration-500" />
                              <path d="M50,45 Q78,35 70,18" stroke="#78350f" strokeWidth="2" fill="none" opacity={bonsaiPrunedCount >= 2 ? 0.2 : 1} className="transition-all duration-500" />
                              <path d="M52,30 Q44,12 48,3" stroke="#78350f" strokeWidth="1.5" fill="none" opacity={bonsaiPrunedCount >= 3 ? 0.2 : 1} className="transition-all duration-500" />
                              
                              {/* Foliage leaves */}
                              <circle cx="28" cy="32" r="8" fill="#15803d" opacity={bonsaiPrunedCount >= 1 ? 0.15 : 0.85} className="transition-all duration-300" />
                              <circle cx="70" cy="18" r="9" fill="#166534" opacity={bonsaiPrunedCount >= 2 ? 0.15 : 0.9} className="transition-all duration-300" />
                              <circle cx="48" cy="3" r="10" fill="#22c55e" opacity={bonsaiPrunedCount >= 3 ? 0.15 : 0.95} className="transition-all duration-300" />
                            </svg>
                            
                            <div className="absolute right-2 bottom-1.5 text-[8px] text-stone-500 font-mono">
                              修整冗杂度: <span className="text-amber-500 font-bold">{bonsaiPrunedCount}</span> / 4 
                            </div>
                          </div>

                          {/* Dialogue display container */}
                          {(() => {
                            const curIdx = Math.min(bonsaiPrunedCount, QIAN_CE_BONSAI_DIALOGS.length - 1);
                            const node = QIAN_CE_BONSAI_DIALOGS[curIdx];
                            return (
                              <div className="bg-stone-950 border border-stone-850 p-3 rounded-xl min-h-[85px] flex flex-col justify-between">
                                <div className="text-[10px] text-stone-500 font-bold flex justify-between">
                                  <span>💬 心灵修剪对话 Step {curIdx + 1}</span>
                                  <span className={node.speaker === '小九' ? 'text-amber-400' : 'text-indigo-400'}>{node.speaker}</span>
                                </div>
                                <p className="text-[11px] text-stone-300 mt-1 pb-1.5 leading-relaxed text-justify">
                                  {node.text}
                                </p>
                              </div>
                            );
                          })()}

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setBonsaiPrunedCount(prev => (prev + 1) % 5);
                              }}
                              className="flex-grow bg-indigo-500/15 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 p-2 rounded-xl text-[10.5px] font-bold active:scale-95 transition-all text-center"
                            >
                              ✂️ 挥剪修修枝 (Prune Branch)
                            </button>
                            <button
                              onClick={() => setBonsaiPrunedCount(0)}
                              className="bg-stone-950 hover:bg-stone-900 border border-stone-850 px-3.5 py-2 rounded-xl text-[10.5px] text-stone-400 active:scale-95"
                            >
                              重置
                            </button>
                          </div>
                        </div>

                        {/* Sand ultraman breaking sandbox */}
                        <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between">
                          <div className="absolute top-1.5 right-3 text-[8px] text-stone-500 font-mono uppercase">SandBox</div>
                          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <span>🏜️</span> 堆满沙滩的奥特曼
                          </h4>
                          <p className="text-[10.5px] text-stone-400 leading-normal text-justify">
                            三年级雕刻沙子的故事：假装闭眼堆沙，然后用手锤咔嚓一下猛烈击碎，看看虚妄背后的空虚心魂：
                          </p>

                          {/* Sandcastle Display */}
                          <div className="h-32 bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-center justify-center relative overflow-hidden">
                            {!sandboxUltramanCrushed ? (
                              <div className="text-center space-y-1 animate-pulse">
                                <span className="text-4xl block filter drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">🏰</span>
                                <span className="text-[10px] text-amber-500 font-bold block">闭眼堆好的奥特曼沙雕</span>
                                <p className="text-[8px] text-stone-500 font-mono">Durable Sandcastle Structure</p>
                              </div>
                            ) : (
                              <div className="text-center space-y-1.5 p-3">
                                <span className="text-3xl block filter grayscale">💥</span>
                                <p className="text-[10px] text-rose-400 font-bold">沙子瞬息爆裂崩散！</p>
                                <p className="text-[9px] text-stone-400 leading-normal text-justify">
                                  世界上其实根本没有奥特曼！做错的细节在成人的世界里没法擦去，鲁棒二维码带着偏执和抗体。
                                </p>
                                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono block w-fit mx-auto">
                                  🔓 破妄成果: 精神抗性/意志极限 +2
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setSandboxUltramanCrushed(!sandboxUltramanCrushed);
                              if (!sandboxUltramanCrushed) {
                                setStoryViews(prev => {
                                  const next = new Set(prev);
                                  next.add('sandbox-crushed');
                                  return next;
                                });
                              }
                            }}
                            className={`w-full p-2 rounded-xl text-[10.5px] font-bold active:scale-95 transition-all text-center border ${
                              !sandboxUltramanCrushed 
                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
                                : 'bg-stone-950 text-stone-400 border-stone-850'
                            }`}
                          >
                            {!sandboxUltramanCrushed ? '🔨 一锤猛碎 (Break Sandbox)' : '🧱 重新闭眼堆沙 (Rebuild)'}
                          </button>
                        </div>
                      </div>

                      {/* Cocoons labels breaking */}
                      <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <span>🕸️</span> 思想钢印：剥离我们的假人属性茧层
                          </h4>
                          <span className="text-[9.5px] text-stone-500 font-mono">Labels spec</span>
                        </div>
                        <p className="text-[10.5px] text-stone-400 leading-relaxed text-justify">
                          我们的成分中混杂了重度社会规约：做题家、乐子人、纯观察外宾客。轻按这些硬标签，听听小九刺破它们的白皮书：
                        </p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setActiveCocoonId('maker')}
                            className={`p-2 rounded-lg border text-[10.5px] font-bold text-center transition-all ${
                              activeCocoonId === 'maker' 
                                ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold' 
                                : 'bg-stone-950 border-stone-850 text-stone-400 hover:border-stone-800'
                            }`}
                          >
                            📐 做题家
                          </button>
                          <button
                            onClick={() => setActiveCocoonId('joker')}
                            className={`p-2 rounded-lg border text-[10.5px] font-bold text-center transition-all ${
                              activeCocoonId === 'joker' 
                                ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold' 
                                : 'bg-stone-950 border-stone-850 text-stone-400 hover:border-stone-800'
                            }`}
                          >
                            🃏 乐子人
                          </button>
                          <button
                            onClick={() => setActiveCocoonId('watcher')}
                            className={`p-2 rounded-lg border text-[10.5px] font-bold text-center transition-all ${
                              activeCocoonId === 'watcher' 
                                ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold' 
                                : 'bg-stone-950 border-stone-850 text-stone-400 hover:border-stone-800'
                            }`}
                          >
                            👀 旁观客
                          </button>
                        </div>

                        {activeCocoonId && (
                          <div className="bg-stone-950 border border-stone-850 p-3.5 rounded-xl text-stone-300 text-justify space-y-2 animate-fade-in text-[11px] leading-relaxed">
                            {activeCocoonId === 'maker' && (
                              <>
                                <div className="font-bold text-amber-400">📐 做题家茧层：一生用2B笔答满卷子</div>
                                <p className="text-stone-400 text-justify">
                                  我们一生都在纸上，被风吹乱。小时候习惯用软糯的橡皮擦抹错除字，长大之后，每一笔歪掉的数据就终成定音。那些2B铅笔留下的铅痕，构筑了高鲁棒性抗错二维码的思想壁垒。
                                </p>
                              </>
                            )}
                            {activeCocoonId === 'joker' && (
                              <>
                                <div className="font-bold text-amber-400">🃏 乐子人茧层：“2B/沙雕/菊花残”伪装铠甲</div>
                                <p className="text-stone-400 text-justify">
                                  用尽一切宿命冷漠和白痴搞笑，拼着劲在人前吼叫“润/V我50”。可越是想在人面前嘻嘻哈哈、插科打诨掩耳盗铃，就越生动代表那颗太怕在关系中被孤立、所以亲手先把烛光吹熄的笨拙脆弱。
                                </p>
                              </>
                            )}
                            {activeCocoonId === 'watcher' && (
                              <>
                                <div className="font-bold text-amber-400">👀 旁观客茧层：逃避入场的看热闹外宾</div>
                                <p className="text-stone-400 text-justify">
                                  习惯了客体化周遭。坐在离垃圾桶扫帚不远的防卫角落，以完美的分析和理智解构一切感情风暴，却永远抗拒真正跳下海第一人称入海游泳。
                                </p>
                              </>
                            )}
                            <button
                              onClick={() => {
                                setActiveCocoonId(null);
                                triggerNpcSpeech('“戳破这些茧。当你甘心收起审判者的视角，踏实回应生活时，血肉才开始呼吸。”', '小九 · 渡人狐');
                              }}
                              className="w-full bg-stone-900 border border-stone-800 hover:border-amber-500 hover:text-amber-300 text-stone-400 text-[10.5px] font-bold py-1.5 rounded-lg mt-2 transition-all"
                            >
                              ⚡ 祭起破妄锤：敲碎这壳
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 4: DAILY (人间烟火) */}
                  {narrativeSubTab === 'daily' && (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
                      {/* intro */}
                      <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl">
                        <h3 className="text-xs font-bold text-amber-400">“白天智驾交付，夜晚市井煮茶”</h3>
                        <p className="text-[11px] text-stone-400 leading-relaxed text-justify mt-1">
                          高维系统解构久了，灵魂会渴。回到合租房有温度、略带市井小折腾的场景里。每一个歪扭的面包、每两只猫的打架，才是生活和对焦温度最真的原木底色。
                        </p>
                      </div>

                      {/* Interactive cats reconcilation card */}
                      <div className="bg-stone-900 border border-stone-850 rounded-xl p-3.5 flex justify-between items-center gap-3">
                        <div className="space-y-1">
                          <div className="text-[8px] text-stone-500 uppercase tracking-widest font-mono">Daily State</div>
                          <h4 className="text-xs font-bold text-stone-200">七千八的租金与二猫打架</h4>
                          <p className="text-[10px] text-stone-400">哥们姐们都在Gap挣扎，走廊两只猫见日死咬。</p>
                        </div>
                        <button
                          onClick={() => {
                            triggerNpcSpeech('😸 【小九・拉偏架】：「房租每月7800元已经够重了，生活不易，猫猫叹气！去看看葱烤排骨和德扑桌旁的心理学吧！」', '小九 · 旁白');
                            setStoryViews(prev => {
                              const next = new Set(prev);
                              next.add('daily-cats-quarrel');
                              return next;
                            });
                          }}
                          className="bg-stone-950 border border-stone-800 hover:border-amber-500/50 px-3.5 py-2.5 rounded-xl text-[10.5px] text-stone-300 font-bold active:scale-95 transition-all text-center whitespace-nowrap"
                        >
                          🐈 劝劝猫架
                        </button>
                      </div>

                      {/* Stories grid list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {QIAN_CE_DAILY_SCENES.map((snip) => {
                          const isExpanded = snip.id === activeDailySceneId;
                          return (
                            <div 
                              key={snip.id}
                              onClick={() => {
                                setActiveDailySceneId(isExpanded ? null : snip.id);
                                setStoryViews(prev => {
                                  const next = new Set(prev);
                                  next.add('daily-' + snip.id);
                                  return next;
                                });
                              }}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 select-none ${
                                isExpanded 
                                  ? 'bg-amber-950/15 border-amber-500/60 shadow-[0_0_15px_rgba(251,191,36,0.03)]' 
                                  : 'bg-stone-900 border-stone-850 hover:border-stone-800/80 hover:bg-stone-900/60'
                              }`}
                            >
                              <div className="flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{snip.icon}</span>
                                  <h4 className="text-[11px] font-bold text-stone-200">{snip.title}</h4>
                                </div>
                                <span className="text-[8px] bg-stone-950 text-amber-500 px-1.5 py-0.5 rounded font-mono">
                                  {isExpanded ? '关闭 ▲' : '拆阅 ▼'}
                                </span>
                              </div>
                              
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-[10.5px] text-stone-300 leading-relaxed text-justify mt-2.5 border-t border-stone-850/60 pt-2.5">
                                      {snip.story}
                                    </p>
                                    <div className="mt-2.5 bg-stone-950 px-2 py-1 rounded border border-stone-850/60 text-[9px] text-emerald-400 font-mono flex items-center gap-1.5">
                                      <span>🧬 生活共鸣影响:</span>
                                      <span>{snip.statEffect}</span>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      {/* 🌌 MULTIPLAYER CO-OP LOBBY / 周末组队大厅 */}
                      <div className="bg-stone-900 border border-stone-850 rounded-xl p-4 space-y-3.5 mt-4 text-left animate-[fadeIn_0.3s_ease]">
                        <div>
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-stone-200">⚔️ 千岑的周末常设副本 · 自组织组队大厅 (MMO Lobby)</h3>
                            <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded font-mono uppercase">Offline Co-op v1.0</span>
                          </div>
                          <p className="text-[10px] text-stone-400 mt-1 leading-normal">
                            自我介绍的终极目的是建立连接、打破物理屏幕的重墙障碍。以下是千岑周期性在现实生活中刷新的悬赏任务。同频的朋友欢迎当场连线。
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          {/* Dungeon 1: Daily Cooking & Cards */}
                          <div className="bg-stone-950 p-3 rounded-lg border border-stone-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">日常副本</span>
                                <h4 className="text-xs font-bold text-stone-200">周末做饭打牌局</h4>
                              </div>
                              <p className="text-[9.5px] text-stone-400"><strong>难度：</strong>低　<strong>要求：</strong>会洗任意牌、能吃中低度辣</p>
                              <p className="text-[9px] text-stone-500 leading-none"><strong>当前状态：</strong>室友已被强制就位 👥（缺 1 人）</p>
                            </div>
                            
                            <button
                              disabled={appliedCookingDungeon}
                              onClick={() => {
                                setAppliedCookingDungeon(true);
                                triggerNpcSpeech('👨‍🍳 【小九・拉郎配】：「组队请求已飞鸽传书！快在右下角的『和小九喝茶』中向我留个微信号，千岑看到后会直接向微波段发送联机码！」', '小九 · 联机大使');
                              }}
                              className={`w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all text-center whitespace-nowrap active:scale-95 border ${
                                appliedCookingDungeon 
                                  ? 'bg-stone-900 border-emerald-500/25 text-emerald-400 cursor-not-allowed opacity-90' 
                                  : 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-stone-950 hover:scale-[1.02]'
                              }`}
                            >
                              {appliedCookingDungeon ? '✓ 组队申请中' : '🤝 接受悬赏组队'}
                            </button>
                          </div>

                          {/* Dungeon 2: Cross-city Climbing */}
                          <div className="bg-stone-950/50 p-3 rounded-lg border border-stone-850/65 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 opacity-60">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">探索副本</span>
                                <h4 className="text-xs font-bold text-stone-300">五一跨城爬山行</h4>
                              </div>
                              <p className="text-[9.5px] text-stone-500"><strong>难度：</strong>中等　<strong>要求：</strong>耐磨膝盖、不恐高</p>
                              <p className="text-[9px] text-amber-500/70 font-semibold leading-normal">🧬 特殊锁：已有特定双重校友合意锁定。本队已达成最优冗余占位。已处于非接单状态。</p>
                            </div>
                            
                            <button
                              disabled={true}
                              onClick={() => {}}
                              className="w-full sm:w-auto bg-stone-900 border border-stone-850 text-stone-600 cursor-not-allowed px-3.5 py-1.5 rounded-lg text-[10px] font-bold text-center whitespace-nowrap"
                            >
                              🔒 队伍已满员
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-stone-850/40 pt-2 text-[9px] text-stone-500 leading-normal italic text-center text-rose-500">
                          💡 提示：本着荒诞感而设立的生活组队日常。也是千岑一种不带做作之色、不动声色地表露当下特定情感状态的幽默设计。
                        </div>
                      </div>
                    </div>
                  )}



                  {/* SUBTAB 6: CYBER BAZI CALCULATOR (☯️ 赛博八字) */}
                  {narrativeSubTab === 'bazi' && (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
                      <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl border-l-[3px] border-amber-500/50">
                        <h3 className="text-xs font-bold text-amber-400">☯️ 千岑・极简八字系统演算终端 (Cyber Metaphysics Terminal)</h3>
                        <p className="text-[11px] text-stone-400 leading-relaxed text-justify mt-1">
                          基于千岑本地笔记原稿（<i>2-副本/命理/未命名.md</i>），用精密系统化思维拆解传统命理学。断身强身弱，辨喜用神是否“有情”与“有力”，把传统玄学翻译为鲁棒的系统冗余设计。
                        </p>
                      </div>

                      <div className="bg-stone-900 border border-stone-850 rounded-xl p-4 space-y-4 text-xs text-stone-350">
                        <div className="grid grid-cols-2 gap-3.5">
                          {/* Daymaster (日元) Selection */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">1. 选择日主 (日元五行)</label>
                            <select 
                              value={baziDaymaster} 
                              onChange={(e) => setBaziDaymaster(e.target.value as any)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[11px] text-stone-300 focus:border-amber-500/40 outline-none"
                            >
                              <option value="Wood">甲乙木 (Wood)</option>
                              <option value="Fire">丙丁火 (Fire)</option>
                              <option value="Earth">戊己土 (Earth · 千岑日元)</option>
                              <option value="Metal">庚辛金 (Metal)</option>
                              <option value="Water">壬癸水 (Water)</option>
                            </select>
                          </div>

                          {/* Season of Birth */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">2. 出生季节 (月令力量)</label>
                            <select 
                              value={baziSeason} 
                              onChange={(e) => setBaziSeason(e.target.value as any)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[11px] text-stone-300 focus:border-amber-500/40 outline-none"
                            >
                              <option value="Spring">春季 (寅卯辰月 - 木旺)</option>
                              <option value="Summer">夏季 (巳午未月 - 火旺 · 千岑出生月)</option>
                              <option value="Autumn">秋季 (申酉戌月 - 金旺)</option>
                              <option value="Winter">冬季 (亥子丑月 - 水旺)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3.5 pt-1.5 border-t border-stone-850/50">
                          {/* UseGod Selection (用神) */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">3. 选定原局最强用神</label>
                            <select 
                              value={baziGodA} 
                              onChange={(e) => setBaziGodA(e.target.value as any)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-[11px] text-stone-300 focus:border-amber-500/40 outline-none"
                            >
                              <option value="Seal">印星 (Seal - 帮扶/自省库)</option>
                              <option value="Friend">比劫 (Friend - 相同五行帮扶)</option>
                              <option value="Wealth">财星 (Wealth - 理性掌控度)</option>
                              <option value="Officer">官杀 (Officer - 车规故障律/官限约束)</option>
                              <option value="Output">食伤 (Output - 自媒体表达/泄耗)</option>
                            </select>
                          </div>

                          {/* On duty or off duty (有力与无力) */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">4. 用神状态 (是否当令/得势)</label>
                            <div className="flex items-center gap-2 h-9">
                              <button
                                onClick={() => setBaziGodBOnDuty(true)}
                                className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                  baziGodBOnDuty 
                                    ? 'bg-amber-500/15 border-amber-500 text-amber-400' 
                                    : 'bg-stone-950 border-stone-850 text-stone-500 hover:text-stone-300'
                                }`}
                              >
                                当令有力
                              </button>
                              <button
                                onClick={() => setBaziGodBOnDuty(false)}
                                className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                  !baziGodBOnDuty 
                                    ? 'bg-amber-500/15 border-amber-500 text-amber-400' 
                                    : 'bg-stone-950 border-stone-850 text-stone-500 hover:text-stone-300'
                                }`}
                              >
                                退气候无力
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Mathematical analysis engine of Bazi */}
                        {(() => {
                          let isStrong = false;
                          let strengthLevel = 50;
                          let explanation = '';
                          let favoredTypes: string[] = [];

                          if (baziDaymaster === 'Wood') {
                            if (baziSeason === 'Spring') { isStrong = true; strengthLevel = 75; }
                            else if (baziSeason === 'Winter') { isStrong = true; strengthLevel = 65; }
                            else { isStrong = false; strengthLevel = 40; }
                          } else if (baziDaymaster === 'Fire') {
                            if (baziSeason === 'Summer') { isStrong = true; strengthLevel = 80; }
                            else if (baziSeason === 'Spring') { isStrong = true; strengthLevel = 70; }
                            else { isStrong = false; strengthLevel = 35; }
                          } else if (baziDaymaster === 'Earth') {
                            if (baziSeason === 'Summer') { isStrong = true; strengthLevel = 75; }
                            else if (baziSeason === 'Spring') { isStrong = false; strengthLevel = 30; }
                            else if (baziSeason === 'Autumn') { isStrong = false; strengthLevel = 45; }
                            else { isStrong = false; strengthLevel = 48; }
                          } else if (baziDaymaster === 'Metal') {
                            if (baziSeason === 'Autumn') { isStrong = true; strengthLevel = 75; }
                            else if (baziSeason === 'Winter') { isStrong = false; strengthLevel = 35; }
                            else if (baziSeason === 'Spring') { isStrong = false; strengthLevel = 40; }
                            else { isStrong = true; strengthLevel = 55; }
                          } else if (baziDaymaster === 'Water') {
                            if (baziSeason === 'Winter') { isStrong = true; strengthLevel = 80; }
                            else if (baziSeason === 'Autumn') { isStrong = true; strengthLevel = 70; }
                            else { isStrong = false; strengthLevel = 30; }
                          }

                          if (isStrong) {
                            explanation = '【身硬强劲】：主体机征强横，系统冗余充沛。此时印比代表信息堆叠重负，最适宜使用财官（对冲/理性把关）与食伤（倾听/自媒体表达）来降级泄耗，让生命力重归鲁棒对焦。';
                            favoredTypes = ['Wealth', 'Officer', 'Output'];
                          } else {
                            explanation = '【身单微弱】：系统在复杂任务中极限承载，容易被外在负能量穿透屏障。此时极大喜好印星（读书思考、哲学、获取高维信息）或比劫（温存社交、老友叙旧、合租人烟相互支撑）作为正反馈保护极。';
                            favoredTypes = ['Seal', 'Friend'];
                          }

                          const isUsefulAffectionate = favoredTypes.includes(baziGodA);
                          
                          return (
                            <div className="mt-4 bg-stone-950 p-4 rounded-xl border border-stone-850/80 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-200">🤖 八字体系状态编译完成:</span>
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  isStrong ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                  {isStrong ? `身强 (Strength: ${strengthLevel}%)` : `身弱 (Strength: ${strengthLevel}%)`}
                                </span>
                              </div>

                              <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${isStrong ? 'bg-orange-400' : 'bg-blue-400'}`} 
                                  style={{ width: `${strengthLevel}%` }} 
                                />
                              </div>

                              <p className="text-[10.5px] text-stone-400 leading-relaxed text-justify">
                                {explanation}
                              </p>

                              <div className="border-t border-stone-850/50 pt-2.5 grid grid-cols-2 gap-2 text-left">
                                <div className="space-y-0.5">
                                  <div className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wider">用神情致 (Affection)</div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm">{isUsefulAffectionate ? '❤️' : '💔'}</span>
                                    <span className={`text-[11px] font-bold ${isUsefulAffectionate ? 'text-emerald-400' : 'text-stone-500'}`}>
                                      {isUsefulAffectionate ? '用神有情 (最真对焦)' : '用神无情 (错漏偏转)'}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-0.5">
                                  <div className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wider">用神力度 (Potency)</div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm">{baziGodBOnDuty ? '⚡' : '🌬️'}</span>
                                    <span className={`text-[11px] font-bold ${baziGodBOnDuty ? 'text-amber-400' : 'text-stone-500'}`}>
                                      {baziGodBOnDuty ? '用神有力 (当令得势)' : '用神无力 (退气候虚)'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-stone-900 rounded-lg p-2.5 border border-stone-850 text-[10px] text-stone-400 italic text-justify">
                                📌 <strong>千岑命理学寄语：</strong> 
                                {baziDaymaster === 'Earth' && baziSeason === 'Summer'
                                  ? '“生于仲夏的焦黑戊土，印星得势极高。他拼尽全力用火性灵光照亮工作黑盒，却最渴求溪流温存以润身。少当完美的计算木头，去做不设限的产品和创意（食伤），生命方得舒卷自在。”'
                                  : '“用神有情且有力，生命系统稳固。若身陷退运、用神无力，莫急着对抗大局。不妨把防线缩小，泡一盏茉莉银针（印），在孤读守门中静静等候你的下一次流星标本。”'
                                }
                              </div>
                            </div>
                          );
                        })()}

                        {/* SUB-BLOCK: REAL-TIME SHICHEN ENGINE (时辰算力引擎) */}
                        {(() => {
                          const shichen = getShichenInfo();
                          return (
                            <div className="bg-stone-900 border border-stone-850 rounded-xl p-4 space-y-3 mt-4">
                              <div className="flex justify-between items-center bg-stone-950 px-3.5 py-2.5 rounded-lg border border-stone-850/60 shadow-inner">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider block">紫微斗数算力合参 · 动态时辰</span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-stone-400 font-mono text-[10.5px] font-semibold">
                                      当前物理时区
                                    </span>
                                    <span className="text-stone-600 font-mono text-[10px]">→</span>
                                    <span className={`text-[12px] font-bold ${shichen.color} flex items-center gap-1 font-sans`}>
                                      <span>☯️</span> {shichen.name} [{shichen.element}]
                                    </span>
                                  </div>
                                </div>
                                <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.25)] select-none">🔮</span>
                              </div>

                              <div className="bg-stone-950/60 p-3.5 rounded-lg border border-stone-850/45 italic text-[11px] leading-relaxed text-stone-300 text-justify relative overflow-hidden">
                                <span className="absolute top-1.5 right-2 text-[7px] text-stone-500 uppercase tracking-widest font-mono font-sans">小九专属批言</span>
                                {shichen.description}
                              </div>
                              
                              <p className="text-[9px] text-stone-500 text-center leading-normal">
                                * 提示：时辰系统依据您的物理访问时间进行动态换算，将中国传统玄学意象与现代哲学命置进行融合，生成实时心流指引。
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* CTA Leave feedback */}
                  <button
                    onClick={() => setGuestOpen(true)}
                    className="w-full border border-stone-800 hover:border-amber-500/30 bg-stone-900 p-3.5 rounded-xl text-stone-300 hover:text-amber-300 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 mt-2"
                  >
                    💌 在他的冒险书里，留下一张彩虹卡片
                  </button>
                </motion.div>
              )}

              {/* TAB 6 = LIFE CROSSROADS & CHOOSE SYSTEM */}
              {currentTab === 6 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4 text-left"
                >
                  <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl">
                    <h3 className="text-sm font-bold text-stone-200">🧭 人生岔路口模拟选择</h3>
                    <p className="text-xs text-stone-400 mt-1">
                      如果是你坐他在这个年纪的棋局，你会分配精力选择什么？点击看看你与千岑的心智重合度。
                    </p>
                  </div>

                  <div className="space-y-3">
                    {CROSSROADS.map((cr) => {
                      const selected = crossroadChoices[cr.id] || [];
                      const isRevealed = selected.length > 0;
                      const isSymbiosisCustom = cr.id === 'crSymbiosis';
                      return (
                        <div 
                          key={cr.id}
                          className={`bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-3 relative ${
                            isSymbiosisCustom ? 'border-l-[3px] border-l-pink-500' : ''
                          }`}
                        >
                          {isSymbiosisCustom && (
                            <span className="text-[8px] bg-pink-500/10 border border-pink-500/30 text-pink-400 font-bold px-2 py-0.5 rounded uppercase block tracking-wider w-fit">
                              🎮 叙事副本 • 限时模拟体验
                            </span>
                          )}

                          <div className="flex justify-between items-center text-[10px] text-amber-500 font-bold">
                            <span>{cr.age} 岁 • {cr.scene}</span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-stone-200">{cr.title}</h4>
                            <p className="text-[10px] text-stone-400 leading-relaxed">{cr.desc}</p>
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-2 gap-2">
                            {cr.options.map((opt) => {
                              const isChecked = selected.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    setCrossroadChoices(prev => {
                                      const active = prev[cr.id] || [];
                                      const next = active.includes(opt.id) 
                                        ? active.filter(x => x !== opt.id)
                                        : [...active, opt.id];
                                      return { ...prev, [cr.id]: next };
                                    });

                                    // if 선택 option B inside Ecosystem trigger multi-act saga storyboard
                                    if (isSymbiosisCustom && opt.id === 'B') {
                                      setSagaTriggeredOptionB(true);
                                      setTimeout(() => {
                                        setSagaOpen(true);
                                        setSagaIdx(0);
                                      }, 400);
                                    }
                                  }}
                                  className={`text-left p-3 rounded-xl border text-[10.5px] transition-all relative ${
                                    isChecked 
                                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold' 
                                      : 'bg-stone-950 border-stone-850 text-stone-400 hover:border-stone-800'
                                  }`}
                                >
                                  <span className="font-bold mr-1.5">{opt.id}.</span> {opt.text}
                                  {isChecked && <Check className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 top-1/2 -translate-y-1/2" />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Matching result banner */}
                          {isRevealed && (
                            <div className="p-3 bg-stone-950 rounded-xl border border-stone-850/60 text-[10.5px] leading-relaxed space-y-2 pt-2.5 animate-[fadeIn_0.4s_ease-out]">
                              <div>
                                以千岑当时的真实选择是：
                                <strong className="text-amber-400 ml-1 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                  {cr.qiancen.join(' + ')}
                                </strong>
                              </div>

                              {/* Symbiosis-specific stats graphs */}
                              {isSymbiosisCustom ? (
                                <div className="space-y-2 py-1.5">
                                  <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider block">模拟副本属性重算</span>
                                  <div className="grid grid-cols-2 gap-2 text-[9px] text-stone-400">
                                    {cr.symAttrs?.map((attr) => {
                                      const val = selected.includes('B') ? attr.bVal : attr.aVal;
                                      return (
                                        <div key={attr.id} className="bg-stone-900 border border-stone-850 p-2 rounded">
                                          <div className="flex justify-between font-bold">
                                            <span>{attr.icon} {attr.name}</span>
                                            <span className={val >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                              {val >= 0 ? '+' : ''}{val}
                                            </span>
                                          </div>
                                          <div className="h-1 bg-stone-950 mt-1 rounded-full overflow-hidden w-full">
                                            <div 
                                              style={{ width: `${Math.min(100, (Math.abs(val) + 15) * 2.25)}%` }}
                                              className={`h-full rounded-full ${val >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                            />
                                          </div>
                                          <p className="text-[8px] text-stone-500 mt-0.5 leading-normal">{attr.desc}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  
                                  <div className="text-center pt-2">
                                    <button
                                      onClick={() => {
                                        setSagaOpen(true);
                                        setSagaIdx(0);
                                      }}
                                      className="bg-pink-500 text-stone-950 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-[0_0_12px_rgba(236,72,153,0.25)] select-none hover:bg-pink-400 active:scale-95"
                                    >
                                      展开完整《生态共生》幕后故事 →
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-2 text-[9px]">
                                  <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                                    <div className="text-emerald-400 font-bold">✓ 获得</div>
                                    <div className="text-stone-400 mt-0.5 leading-normal">{cr.gain.join('、')}</div>
                                  </div>
                                  <div className="bg-rose-500/5 p-2 rounded border border-rose-500/10">
                                    <div className="text-rose-400 font-bold">✗ 失去 / 机会成本</div>
                                    <div className="text-stone-400 mt-0.5 leading-normal">{cr.cost.join('、')}</div>
                                  </div>
                                </div>
                              )}

                              {/* Comparative logic analysis statements */}
                              <p className="text-stone-400 pt-1.5 border-t border-stone-900">
                                {(() => {
                                  const hit = selected.filter(x => cr.qiancen.includes(x)).length;
                                  if (hit === cr.qiancen.length && selected.length === cr.qiancen.length) {
                                    return '💡 镜像印证：你和他不仅在这个路口做了完全一致的选择，还承载了相同的代价和惊喜礼物。';
                                  } else if (hit > 0) {
                                    return '💡 局部对焦：你理解他为什么这么选，但你给自己预修了一条更为舒适的安全逃生通道。';
                                  } else {
                                    return '💡 差异透光：你们指向了完全不一致的方向。这也印证了思维生态的多样与多维。';
                                  }
                                })()}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 7 = CHANGELOGS HISTORY */}
              {currentTab === 7 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="space-y-4 text-left font-mono"
                >
                  <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl">
                    <span className="text-[10px] text-amber-500 font-bold block">CURRENT PIPELINE</span>
                    <h3 className="text-lg font-bold text-stone-200 mt-0.5">千岑个人开发迭代日志</h3>
                    <p className="text-[10px] text-stone-500 mt-1">他把自己的心智成长、能力板块梳理、重大节点变化，都视为一门不断被重构的软件工程。</p>
                  </div>

                  <div className="space-y-3">
                    {CHANGELOGS.map((log, idx) => (
                      <div key={idx} className="bg-stone-900 border border-stone-850 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center pb-2 border-b border-stone-950">
                          <span className="text-xs font-bold text-amber-400 font-sans">{log.version}</span>
                          <span className="text-[9px] text-stone-500">{log.date}</span>
                        </div>

                        {/* Logs section list */}
                        {log.add.length > 0 && (
                          <div className="space-y-0.5">
                            <div className="text-[9px] text-emerald-400 font-bold font-sans">✓ ADDED:</div>
                            {log.add.map((x, xi) => (
                              <div key={xi} className="text-[10px] text-stone-400 pl-2 leading-relaxed">• {x}</div>
                            ))}
                          </div>
                        )}

                        {log.fix.length > 0 && (
                          <div className="space-y-0.5 pt-1">
                            <div className="text-[9px] text-blue-400 font-bold font-sans">✓ FIXED:</div>
                            {log.fix.map((x, xi) => (
                              <div key={xi} className="text-[10px] text-stone-400 pl-2 leading-relaxed">• {x}</div>
                            ))}
                          </div>
                        )}

                        {log.bug.length > 0 && (
                          <div className="space-y-0.5 pt-1">
                            <div className="text-[9px] text-rose-400 font-bold font-sans">✗ TRAPPED BUGS:</div>
                            {log.bug.map((x, xi) => (
                              <div key={xi} className="text-[10px] text-stone-400 pl-2 leading-relaxed">• {x}</div>
                            ))}
                          </div>
                        )}

                        {log.dev.length > 0 && (
                          <div className="space-y-0.5 pt-1">
                            <div className="text-[9px] text-amber-500 font-bold font-sans">✗ ROADMAPING:</div>
                            {log.dev.map((x, xi) => (
                              <div key={xi} className="text-[10px] text-stone-400 pl-2 leading-relaxed">• {x}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Speeches NPCs overlays bubble list */}
            {npcSpeech && (
              <div 
                onClick={() => setNpcSpeech(null)}
                className="absolute bottom-16 left-3 right-3 z-40 bg-stone-950 border border-amber-500/30 rounded-xl p-3 flex gap-2.5 items-start cursor-pointer hover:border-amber-400/50 transition-all shadow-xl animate-[slideUp_0.3s_ease]"
              >
                <span className="text-2xl mt-0.5 select-none">🦊</span>
                <div className="flex-1 space-y-0.5 text-left">
                  <div className="text-[9px] text-amber-400 font-bold">{npcSpeech.persona} (点我合上)</div>
                  <p className="text-xs text-stone-300 leading-snug">{npcSpeech.text}</p>
                </div>
              </div>
            )}

            {/* Bottom Sticky Navigation System */}
            <div className="bg-stone-900 border-t border-stone-850/50 grid grid-cols-5 shrink-0 select-none pb-[env(safe-area-inset-bottom,0)] z-40">
              <button 
                onClick={() => switchTab(0)}
                className={`py-3 flex flex-col items-center gap-1 text-[9px] outline-none ${currentTab === 0 ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'}`}
              >
                <Globe className="w-5 h-5 shrink-0" />
                <span>世界拓扑</span>
              </button>

              <button 
                onClick={() => switchTab(1)}
                className={`py-3 flex flex-col items-center gap-1 text-[9px] outline-none ${currentTab === 1 ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'}`}
              >
                <Zap className="w-5 h-5 shrink-0" />
                <span>属性技能</span>
              </button>

              <button 
                onClick={() => switchTab(2)}
                className={`py-3 flex flex-col items-center gap-1 text-[9px] outline-none ${currentTab === 2 ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'}`}
              >
                <Briefcase className="w-5 h-5 shrink-0" />
                <span>装备背包</span>
              </button>

              <button 
                onClick={() => switchTab(3)}
                className={`py-3 flex flex-col items-center gap-1 text-[9px] outline-none ${currentTab === 3 ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'}`}
              >
                <Trophy className="w-5 h-5 shrink-0" />
                <span>通关成就</span>
              </button>

              <button 
                onClick={() => switchTab(5)}
                className={`py-3 flex flex-col items-center gap-1 text-[9px] outline-none ${[5, 4, 6, 7].includes(currentTab) ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'}`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                <span>叙事历程</span>
              </button>
            </div>

            {/* Absolute FLOATING FAB for Side Menu Drawer Actions */}
            <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-40 select-none">
              
              {/* Pet Quick Anchor */}
              <button
                onClick={() => setCurrentTab(4)}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-stone-900 to-stone-800 border border-stone-800/80 text-lg flex items-center justify-center shadow-lg active:scale-90 transition-all hover:border-amber-500/20"
                title="召出小九"
              >
                🦊
              </button>

              {/* Crossroads Quick View */}
              <button
                onClick={() => setCurrentTab(6)}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-stone-900 to-stone-800 border border-stone-800/80 flex items-center justify-center shadow-lg active:scale-90 transition-all hover:border-amber-500/20 text-stone-300"
                title="抉择岔路"
              >
                <Compass className="w-5 h-5 text-amber-500" />
              </button>

              {/* Chat room Tea Chat Bot activator */}
              <button
                onClick={() => setChatOpen(true)}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 border border-amber-600 text-stone-950 flex items-center justify-center shadow-lg active:scale-90 transition-all"
                title="和小九喝茶"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- OVERLAY MODALS & DIALOG PANELS --- */}

      {/* Obsidian File content Viewer overlay Modal */}
      <AnimatePresence>
        {selectedVaultFile && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-md z-[130] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setSelectedVaultFile(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-5 max-h-[85vh] flex flex-col relative text-left z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-850 shrink-0">
                <div className="space-y-0.5">
                  <span className="text-[8px] bg-amber-500/15 text-amber-400 font-mono font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                    Obsidian Vault Document
                  </span>
                  <h4 className="text-xs font-bold text-stone-200 truncate pr-4">
                    {getCleanFileName(selectedVaultFile)}
                  </h4>
                </div>
                <button 
                  onClick={() => setSelectedVaultFile(null)} 
                  className="text-stone-500 hover:text-stone-300 p-1 rounded-lg hover:bg-stone-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingContent ? (
                <div className="flex-1 py-16 text-center text-[10.5px] text-stone-500 font-mono space-y-2">
                  <div className="animate-spin w-5 h-5 border-2 border-amber-500/20 border-t-amber-500 rounded-full mx-auto" />
                  <div>正在加载文档内容...</div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-1 text-[11px] text-stone-350 leading-relaxed font-sans space-y-3.5 pt-4 text-justify select-text">
                  {selectedVaultContent ? (
                    selectedVaultContent.split('\n\n').map((para, pIdx) => {
                      const cleanPara = para.trim();
                      if (!cleanPara) return null;
                      
                      // Render Headers
                      if (cleanPara.startsWith('### ')) {
                        return <h4 key={pIdx} className="text-stone-100 font-bold text-[12px] border-l-2 border-amber-500/50 pl-2 mt-4">{cleanPara.replace('### ', '')}</h4>;
                      }
                      if (cleanPara.startsWith('## ')) {
                        return <h3 key={pIdx} className="text-stone-100 font-bold text-xs border-l-2 border-amber-500 pl-2 mt-5">{cleanPara.replace('## ', '')}</h3>;
                      }
                      if (cleanPara.startsWith('# ')) {
                        return <h2 key={pIdx} className="text-stone-150 font-bold text-xs tracking-tight bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-850 text-amber-400 mt-6">{cleanPara.replace('# ', '')}</h2>;
                      }

                      // Render Bullet Lists
                      if (cleanPara.startsWith('- ') || cleanPara.startsWith('* ')) {
                        const items = cleanPara.split('\n');
                        return (
                          <ul key={pIdx} className="list-disc list-inside space-y-1.5 text-stone-300 pl-1">
                            {items.map((it, itIdx) => (
                              <li key={itIdx} className="list-item">
                                {it.replace(/^[\-\*]\s+/, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      // Render blockquotes
                      if (cleanPara.startsWith('[*') || cleanPara.startsWith('> ')) {
                        return (
                          <div key={pIdx} className="bg-amber-950/15 border-l-2 border-amber-500/40 p-3 rounded-r-xl italic text-stone-400 text-[10.5px] leading-relaxed">
                            {cleanPara.replace(/^>\s+/, '').replace(/^\[\*/, '').replace(/\*\]$/, '')}
                          </div>
                        );
                      }

                      // Render Code Blocks
                      if (cleanPara.startsWith('```')) {
                        const lines = cleanPara.split('\n').filter(l => !l.startsWith('```'));
                        return (
                          <pre key={pIdx} className="bg-stone-950 border border-stone-850 p-3 rounded-xl overflow-x-auto text-[10px] text-amber-400 font-mono tracking-normal leading-tight">
                            <code>{lines.join('\n')}</code>
                          </pre>
                        );
                      }

                      // Standard paragraph
                      return (
                        <p key={pIdx}>
                          {cleanPara}
                        </p>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-xs text-stone-500">
                      文档内容为空。
                    </div>
                  )}
                </div>
              )}
              
              <div className="pt-3 border-t border-stone-850 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => {
                    const title = getCleanFileName(selectedVaultFile);
                    triggerNpcSpeech(`🦊【小九・共鸣】：「你正在阅读来自他的 Obsidian 知识库中的《${title}》。这正是他用心智文字打扫战场的真实痕迹。你可以点击右下方 '和小九喝茶'，输入文档中的关键词向我提问，我能结合日记给你讲述更多背后的血肉故事噢！」`, '小九 · 旁白');
                    setSelectedVaultFile(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10.5px] font-bold px-4 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> 问问小九这个
                </button>
                <button 
                  onClick={() => setSelectedVaultFile(null)}
                  className="bg-stone-950 border border-stone-800 hover:bg-stone-900/60 px-4 py-2 rounded-xl text-[10.5px] text-stone-300 font-bold active:scale-95 transition-all"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Glossary Dictionary Info display panel Drawer */}
      <AnimatePresence>
        {selectedGlossary && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs z-[130] flex items-end justify-center px-4">
            <div className="absolute inset-0" onClick={() => setSelectedGlossary(null)} />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-stone-900 border-t border-stone-850 rounded-t-2xl w-full max-w-md p-5 pb-8 relative text-left space-y-3 z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full text-amber-400 font-bold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> 百科词条解析 (Glossary)
                </span>
                <button onClick={() => setSelectedGlossary(null)} className="text-stone-500 hover:text-stone-300 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-stone-100 italic">「 {selectedGlossary.term} 」</h3>
                <p className="text-xs text-stone-400 leading-relaxed text-stone-300 bg-stone-950 p-4 rounded-xl border border-stone-850/50">
                  {selectedGlossary.desc}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Achievement story behind details Overlay Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setSelectedAchievement(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-850 rounded-2xl w-full max-w-md p-5 relative text-left shadow-2xl space-y-4 z-10"
            >
              <div className="flex justify-between items-start">
                <div className="text-4xl filter drop-shadow-[0_0_12px_rgba(251,191,36,0.2)] select-none">
                  {selectedAchievement.icon}
                </div>
                <button onClick={() => setSelectedAchievement(null)} className="text-stone-500 hover:text-stone-300 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-stone-200">{selectedAchievement.name}</h3>
                  {selectedAchievement.time && <span className="bg-stone-950 font-mono text-[9px] text-amber-500 px-2 py-0.5 rounded border border-amber-500/10">Year {selectedAchievement.time}</span>}
                </div>
                <p className="text-xs text-stone-400 leading-relaxed italic">{selectedAchievement.desc}</p>
              </div>

              {/* Expanded Story paragraph */}
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-850 text-xs text-stone-300 leading-relaxed text-justify space-y-2">
                <span className="text-[8px] text-stone-500 font-bold block uppercase tracking-wider">千岑幕后实况复盘</span>
                <p><GlossaryText text={selectedAchievement.story || selectedAchievement.desc} /></p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedAchievement.gain && (
                  <div className="bg-emerald-500/5 p-2.5 rounded border border-emerald-500/10">
                    <span className="text-emerald-400 font-bold block">✓ 获取加成</span>
                    <div className="text-[10px] text-stone-400 mt-1 leading-normal">{selectedAchievement.gain.join('、')}</div>
                  </div>
                )}
                {selectedAchievement.cost && (
                  <div className="bg-rose-500/5 p-2.5 rounded border border-rose-500/10">
                    <span className="text-rose-400 font-bold block">✗ 承担代价</span>
                    <div className="text-[10px] text-stone-400 mt-1 leading-normal">{selectedAchievement.cost.join('、')}</div>
                  </div>
                )}
              </div>

              {/* If it is AIGC探路者, render the matching puzzle */}
              {selectedAchievement.id === 'a2' && (
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-900">
                    <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <span>🤖</span> 赛博能力编排器
                    </span>
                    <span className="text-[9px] text-stone-500 font-mono">
                      {orchSolved ? "🔴 [100% 架构齐整]" : "⚪ [等待连线中...]"}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-stone-400 leading-normal">
                    请先点击左侧的<strong>能力层级</strong>，再点击右侧对应的<strong>物理承载介质</strong>以完成数字架构连线：
                  </p>

                  {/* Left-Right Grid matching */}
                  <div className="grid grid-cols-2 gap-3 relative py-1 text-xs">
                    {/* Left Column (Capabilities) */}
                    <div className="space-y-2">
                      <span className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wider block">能力层级 (抽象)</span>
                      {[
                        { id: 'perception', label: '👁️ 感知系统', desc: '实时状态抽取与环景物理过滤' },
                        { id: 'decision', label: '🧠 决策模块', desc: '大模型心智路由与多规划树' },
                        { id: 'execution', label: '🦾 执行触角', desc: '生成式图元构建与底盘制动' },
                      ].map(left => {
                        const isPaired = left.id === 'perception' ? !!orchPerception : left.id === 'decision' ? !!orchDecision : !!orchExecution;
                        const isSelected = orchActiveLeft === left.id;
                        return (
                          <button
                            key={left.id}
                            onClick={() => {
                              if (orchSolved) return;
                              setOrchActiveLeft(left.id);
                            }}
                            className={`w-full text-left p-2 rounded-lg border transition-all text-[11px] ${
                              isPaired
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                : isSelected
                                ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500/20'
                                : 'bg-stone-900 border-stone-850 text-stone-300 hover:border-stone-700'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>{left.label}</span>
                              {isPaired && <span className="text-[9px] text-emerald-400 font-mono">✓ 贯通</span>}
                            </div>
                            <div className="text-[9px] text-stone-500 mt-0.5 leading-normal">{left.desc}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column (Substrates) */}
                    <div className="space-y-2">
                      <span className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wider block">承载介质 (具象)</span>
                      {[
                        { id: 'right-sensor', label: '实车环景传感器与SOC注意力网络', target: 'perception' },
                        { id: 'right-decision', label: '大模型心智路由与多角色规划树', target: 'decision' },
                        { id: 'right-execution', label: 'ComfyUI视频自动生成与故障级制动器', target: 'execution' },
                      ].map(right => {
                        // Check if this right option is already matched
                        const isMatched = (right.target === 'perception' && orchPerception) ||
                                          (right.target === 'decision' && orchDecision) ||
                                          (right.target === 'execution' && orchExecution);

                        return (
                          <button
                            key={right.id}
                            onClick={() => {
                              if (orchSolved) return;
                              if (!orchActiveLeft) {
                                triggerNpcSpeech(`🦊【小九】：「连接电波迷失了！请在左侧选点击一项『抽象能力』，然后再来和我右边的『物理介质』点击连线配接哦！」`, "小九 · 指导官");
                                return;
                              }
                              if (orchActiveLeft === right.target) {
                                // Match!
                                if (right.target === 'perception') setOrchPerception('paired');
                                if (right.target === 'decision') setOrchDecision('paired');
                                if (right.target === 'execution') setOrchExecution('paired');
                                setOrchActiveLeft(null);

                                // Check if all three paired
                                const checkP = right.target === 'perception' ? true : !!orchPerception;
                                const checkD = right.target === 'decision' ? true : !!orchDecision;
                                const checkE = right.target === 'execution' ? true : !!orchExecution;
                                if (checkP && checkD && checkE) {
                                  setOrchSolved(true);
                                  triggerNpcSpeech("🦊【小九・共振度100%】：「太棒了！感知、决策和底盘降级执行成功合一！千岑藏在 ComfyUI 与车规安全背后的『编排手记』已经解锁呈现啦！」", "小九 · 庆贺");
                                }
                              } else {
                                // Wrong match
                                triggerNpcSpeech("⚠️【编排警报】：这个抽象层级无法与该承载配对。请回想：感知连注意力网络，决策连心智路由，执行对应视频生成与制动。", "系统提示");
                              }
                            }}
                            className={`w-full text-left p-2 rounded-lg border transition-all text-[11px] ${
                              isMatched
                                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-350 pointer-events-none'
                                : 'bg-stone-900 border-stone-850 text-stone-400 hover:border-stone-750'
                            }`}
                          >
                            <span className="font-bold block text-[10px]/tight text-stone-200">{right.label}</span>
                            <span className="text-[8px] text-stone-500 mt-1 block tracking-tight font-mono">
                              {isMatched ? "⚡ 成功接通" : "⚓ 点击对接口"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset capability link button */}
                  {!orchSolved && (orchPerception || orchDecision || orchExecution) && (
                    <div className="flex justify-between items-center pt-1 border-t border-stone-900">
                      <span className="text-[9px] text-amber-500/60">信号配成中...</span>
                      <button
                        onClick={() => {
                          setOrchPerception(null);
                          setOrchDecision(null);
                          setOrchExecution(null);
                          setOrchActiveLeft(null);
                        }}
                        className="text-[9px] text-stone-400 hover:text-stone-200 underline font-mono cursor-pointer"
                      >
                        重置架构线
                      </button>
                    </div>
                  )}

                  {/* Solved Note reveal! */}
                  {orchSolved && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-950/15 border border-amber-500/25 p-3 rounded-xl mt-2.5 space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                        <span>📖</span>
                        <span>千岑：编排重构下的 AIGC 与物理失控防御录</span>
                      </div>
                      <p className="text-[10px] text-stone-300 leading-relaxed text-justify">
                        “在智能泊车和功能冗余研发里，我们要求‘冗余、限幅和隔离’——因为偶现失控的物理现场永远会偏离设想。
                        投射到 AIGC 自动化管线上也完全一致：感知层我们必须建立客观极强的词法限制与类型卡位，
                        决策层配置博弈规划树将内容路径束缚在可控象限，
                        而执行端则对意外结果、排版倾斜、生成断裂预置自适应的底噪重置、降级平稳排版。
                        不指望完美无瑕的算力输入，而在偶发波动的世界里做最坏的防御准备，这便是工程跨界的底层共通性。”
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Symbiosis Multi-Act Storyboards Saga Overlay Modal */}
      <AnimatePresence>
        {sagaOpen && (
          <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-sm z-[140] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setSagaOpen(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-amber-500/30 rounded-2xl w-full max-w-sm overflow-hidden h-[85vh] flex flex-col justify-between shadow-2xl relative z-10"
            >
              {/* Header */}
              <div className="bg-stone-950 border-b border-stone-850 px-4 py-3 flex justify-between items-center shrink-0 select-none">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                  幕 {sagaIdx + 1} / 3 • 生态共生叙事副本
                </span>
                <button onClick={() => setSagaOpen(false)} className="text-stone-500 hover:text-stone-300 p-1">
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Story content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {(() => {
                  const act = CROSSROADS.find(x => x.id === 'crSymbiosis')?.symActs?.[sagaIdx];
                  if (!act) return null;
                  return (
                    <div className="space-y-3.5 text-left text-xs text-stone-300 leading-relaxed text-justify">
                      <div className="text-center py-2 text-4xl filter drop-shadow-[0_0_10px_rgba(251,191,36,0.15)] select-none">
                        {act.icon}
                      </div>
                      
                      <div className="text-center">
                        <h4 className="font-bold text-stone-200 text-sm">{act.title}</h4>
                        <span className="text-[10.5px] text-amber-500 font-medium tracking-wide block mt-0.5">{act.subtitle}</span>
                      </div>

                      {/* We use danger HTML because the data originally contained <p className="mb-3"> etc. */}
                      <div 
                        className="prose prose-stone-invert max-w-none text-xs text-stone-300 leading-relaxed space-y-2.5 pt-1.5"
                        dangerouslySetInnerHTML={{ __html: act.story }}
                      />

                      <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/60 mt-3.5">
                        <span className="text-[8px] text-stone-500 uppercase tracking-wider font-bold block">此状态属性权重</span>
                        <div className="text-[10.5px] text-emerald-400 font-bold text-center tracking-normal mt-1">{act.attrShow}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer controllers */}
              <div className="bg-stone-950 border-t border-stone-850 px-5 py-3.5 flex items-center justify-between gap-3 shrink-0 select-none">
                <button
                  disabled={sagaIdx === 0}
                  onClick={() => setSagaIdx(p => Math.max(0, p - 1))}
                  className="bg-stone-900 border border-stone-800 text-stone-400 font-bold px-3 py-2 rounded-xl text-xs active:scale-95 transition-all hover:bg-stone-850 disabled:opacity-20 disabled:pointer-events-none"
                >
                  ← 上一幕
                </button>

                {/* Dots */}
                <div className="flex gap-2.5">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === sagaIdx ? 'bg-amber-400 scale-125' : i < sagaIdx ? 'bg-amber-500/60' : 'bg-stone-800'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (sagaIdx < 2) {
                      setSagaIdx(p => p + 1);
                    } else {
                      setSagaOpen(false);
                      setSagaCompleted(true);
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all"
                >
                  {sagaIdx === 2 ? '完成并感悟' : '下一幕 →'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guest card / comments board Overlay Drawer */}
      <AnimatePresence>
        {guestOpen && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs z-[130] flex items-end justify-center px-4">
            <div className="absolute inset-0" onClick={() => setGuestOpen(false)} />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-stone-900 border-t border-stone-850 rounded-t-2xl w-full max-w-md p-5 pb-[calc(20px+env(safe-area-inset-bottom,0))] relative text-left shadow-2xl flex flex-col justify-between max-h-[80vh] z-10"
            >
              <div className="flex justify-between items-center shrink-0">
                <h3 className="text-sm font-bold text-stone-100 flex items-center gap-1">
                  <span>💌</span> 留下一张彩虹卡片
                </h3>
                <button onClick={() => setGuestOpen(false)} className="text-stone-500 hover:text-stone-300 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-4 space-y-4">
                <p className="text-[11.5px] text-stone-400 leading-relaxed text-stone-300 text-justify">
                  拜读完他的职业主线与副本历程，你认为他是个什么「颜色」的人？请选择：
                </p>

                {/* Colors Pick */}
                <div className="flex gap-2.5 justify-center py-2 shrink-0">
                  {[
                    { name: '红', color: '#ef4444', desc: '红: 热烈•坚守行力者' },
                    { name: '橙', color: '#fb923c', desc: '橙: 温暖•跨域连结者' },
                    { name: '黄', color: '#fbbf24', desc: '黄: 明亮•极客探索者' },
                    { name: '绿', color: '#34d399', desc: '绿: 蓬勃•生态编织人' },
                    { name: '蓝', color: '#60a5fa', desc: '蓝: 澄明•深度思辨眼' },
                    { name: '紫', color: '#a78bfa', desc: '紫: 神秘•无界思想家' }
                  ].map((item) => (
                    <button
                      key={item.color}
                      onClick={() => setGuestSelectedColor(item.color)}
                      style={{ backgroundColor: item.color }}
                      title={item.desc}
                      className={`w-9 h-9 rounded-full relative transition-all active:scale-90 ${
                        guestSelectedColor === item.color 
                          ? 'ring-4 ring-offset-2 ring-offset-stone-900 ring-amber-400 scale-110 shadow-lg' 
                          : 'opacity-85'
                      }`}
                    />
                  ))}
                </div>

                {/* msg area */}
                <textarea
                  value={guestMsg}
                  onChange={(e) => setGuestMsg(e.target.value)}
                  placeholder="留下一句你对千岑想说的话，或者你感受到的共鸣点...（选填）"
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-850 rounded-xl p-3 text-xs text-stone-200 leading-relaxed outline-none focus:border-amber-500/50 resize-none font-sans"
                />

                <button
                  onClick={() => {
                    if (!guestSelectedColor) {
                      alert('请先选择一个彩虹色调～');
                      return;
                    }
                    // increment vote
                    setGuestVotes(prev => ({ ...prev, [guestSelectedColor]: (prev[guestSelectedColor] || 0) + 1 }));
                    
                    if (guestMsg.trim()) {
                      const newComment = { 
                        color: guestSelectedColor, 
                        text: guestMsg, 
                        time: new Date().toLocaleDateString() 
                      };
                      setGuestComments(prev => [newComment, ...prev]);
                    }

                    setGuestMsg('');
                    setGuestSelectedColor(null);
                    alert('💌 谢谢！你的彩虹彩卡已投入信箱中。');

                    // keep easter eggs views
                    setStoryViews(prev => {
                      const next = new Set(prev);
                      next.add('comment');
                      return next;
                    });
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs active:scale-95 transition-all text-center"
                >
                  ✉️ 投下我的彩虹信件
                </button>

                {/* Simple aggregate spectrum results graph */}
                <div className="pt-4 border-t border-stone-850/60 space-y-2.5">
                  <span className="text-[9px] text-stone-500 font-bold block uppercase tracking-wider">
                    当前已有位访客投下的心智色彩印象比例
                  </span>
                  
                  <div className="space-y-1.5">
                    {(Object.entries(guestVotes) as [string, number][]).map(([color, votes]) => {
                      const label = color === '#ef4444' ? '热烈行动' : color === '#fb923c' ? '跨域桥梁' : color === '#fbbf24' ? '极客探索' : color === '#34d399' ? '生态树根' : color === '#60a5fa' ? '深邃思想' : '跨界神秘';
                      const totalVotes = (Object.values(guestVotes) as number[]).reduce((a,b)=>a+b, 0);
                      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                      return (
                        <div key={color} className="flex items-center gap-2 text-[10px] text-stone-400">
                          <span style={{ backgroundColor: color }} className="w-2 h-2 rounded-full inline-block shrink-0" />
                          <span className="w-16 shrink-0">{label}</span>
                          <div className="flex-grow h-1.5 bg-stone-950 rounded-full overflow-hidden">
                            <div style={{ width: `${percentage}%`, backgroundColor: color }} className="h-full rounded-full" />
                          </div>
                          <span className="w-10 text-right font-mono text-[9px] shrink-0 text-stone-500">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* List guest books messages details */}
                  {guestComments.length > 0 && (
                    <div className="space-y-2 pt-4">
                      <span className="text-[9px] text-stone-500 font-bold uppercase block tracking-wider">最新访客留言笺</span>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {guestComments.map((comment, ci) => (
                          <div key={ci} className="bg-stone-950 p-2.5 border border-stone-850/50 rounded-xl space-y-1">
                            <div className="flex justify-between items-center text-[8px] text-stone-500 font-mono">
                              <span style={{ color: comment.color }} className="font-sans font-bold">● 彩虹回响</span>
                              <span>{comment.time}</span>
                            </div>
                            <p className="text-[10.5px] text-stone-300 leading-relaxed">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PREMIUM DYNAMIC TEA CHAT BOT PANEL --- */}
      <AnimatePresence>
        {chatOpen && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs z-[150] flex items-end justify-center px-4">
            <div className="absolute inset-0" onClick={() => setChatOpen(false)} />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-stone-900 border-t border-stone-850 rounded-t-2xl w-full max-w-md h-[78vh] relative flex flex-col justify-between shadow-2xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="bg-stone-950 border-b border-stone-850 px-4 py-3.5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 select-none">
                  <span className="text-2xl animate-spin" style={{ animationDuration: '6s' }}>🦊</span>
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-stone-200">和小九喝杯茶 (AI 茶室)</h3>
                    <p className="text-[9.5px] text-stone-500">双核动力：内置知识图谱 + 深度 Gemini</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-stone-500 hover:text-stone-300 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat lines view */}
              <div className="flex-grow overflow-y-auto px-4 py-5 space-y-3.5 text-left text-xs text-stone-200">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex gap-2.5 items-start max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    {msg.sender === 'bot' && <span className="text-2xl shrink-0 select-none">🦊</span>}
                    <div 
                      className={`p-3 rounded-2xl leading-relaxed text-justify shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs' 
                          : 'bg-stone-950 border border-stone-850 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2.5 items-center mr-auto">
                    <span className="text-2xl animate-bounce">🦊</span>
                    <div className="bg-stone-950 border border-stone-850 p-3 rounded-2xl rounded-tl-xs flex gap-1.5 items-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0s' }} />
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Controller sticky area */}
              <div className="bg-stone-950 border-t border-stone-850 px-4 py-3 flex gap-2.5 shrink-0 items-center justify-between z-10 pb-[calc(12px+env(safe-area-inset-bottom,0))]">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="向小九倾听关于千岑的事... (按回车发送)"
                  className="flex-grow bg-stone-900 border border-stone-850 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 outline-none focus:border-amber-550/50 font-sans"
                />
                <button
                  onClick={handleSendChat}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold p-2.5 rounded-xl transition-all active:scale-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ALL JIN NANG TIPS DRAWER --- */}
      <AnimatePresence>
        {tipPanelOpen && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs z-[130] flex items-end justify-center px-4">
            <div className="absolute inset-0" onClick={() => setTipPanelOpen(false)} />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-stone-900 border-t border-stone-850 rounded-t-2xl w-full max-w-md p-5 pb-[calc(20px+env(safe-area-inset-bottom,0))] relative text-left shadow-2xl flex flex-col justify-between max-h-[75vh] z-10"
            >
              <div className="flex justify-between items-center shrink-0 pb-3 border-b border-stone-950">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1">
                  <span>🧧</span> 探索锦囊汇总 (Tips list)
                </h3>
                <button onClick={() => setTipPanelOpen(false)} className="text-stone-500 hover:text-stone-300 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-3.5 space-y-2.5">
                {tipsList.map((tip) => (
                  <div 
                    key={tip.id} 
                    className={`p-3.5 rounded-xl border transition-all ${
                      tip.read 
                        ? 'bg-stone-950 border-stone-850/60 opacity-60' 
                        : 'bg-stone-950 border-pink-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[8.5px] font-bold text-amber-500 uppercase font-mono">📌 {tip.tag}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        tip.read ? 'bg-stone-900 text-stone-500' : 'bg-pink-500/10 text-pink-400'
                      }`}>
                        {tip.read ? '已读' : '未读'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-snug mt-1.5">{tip.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
