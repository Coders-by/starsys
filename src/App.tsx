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

export default function App() {
  // --- Standard States ---
  const [inQuiz, setInQuiz] = useState(true);
  const [quizStep, setQuizStep] = useState(0);
  const [quizTraits, setQuizTraits] = useState<Record<string, number>>({
    tech: 0, startup: 0, philosophy: 0, relationship: 0, nope: 0, none: 0
  });
  const [currentTab, setCurrentTab] = useState(0);

  const switchTab = (idx: number) => {
    setCurrentTab(idx);
  };
  
  // --- Interactive RPG States ---
  const [equippedGear, setEquippedGear] = useState<Record<string, boolean>>({
    g1: false, g2: false, g3: false, g4: false, g5: false, g6: false
  });
  const [unlockedHidden, setUnlockedHidden] = useState<Set<string>>(new Set());
  const [storyViews, setStoryViews] = useState<Set<string>>(new Set());
  const [bookshelfClicks, setBookshelfClicks] = useState(0);
  const [crossroadChoices, setCrossroadChoices] = useState<Record<string, string[]>>({});
  
  // --- UI Modals & Panels ---
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{ name: string; domId: string; story: string; x: number; y: number } | null>(null);
  const [selectedGlossary, setSelectedGlossary] = useState<{ term: string; desc: string } | null>(null);
  
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
                  className="space-y-4"
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
                          className="bg-stone-950/65 border border-stone-850 rounded-xl p-2.5 hover:border-amber-500/30 transition-all cursor-pointer"
                        >
                          <div className="text-[9px] text-amber-400/70 font-semibold">{card.label}</div>
                          <div className="text-xs font-bold text-stone-200 mt-0.5">{card.value}</div>
                          <div className="text-[9px] text-stone-500 mt-1 leading-normal">{card.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Horizontal Evidence Strip Indicators */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
                    {DOSSIER.sources.map((src, idx) => (
                      <span 
                        key={idx}
                        className="bg-stone-900 border border-stone-850 px-3 py-1 rounded-full text-[10px] whitespace-nowrap text-stone-400"
                      >
                        <b className="text-amber-500 mr-1">{src.type}</b> {src.name}
                      </span>
                    ))}
                  </div>

                  {/* Four Domain tags */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                      ⚙️ 技术
                    </span>
                    <span className="text-[10px] items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full inline-block animate-pulse" />
                      🚀 创业
                    </span>
                    <span className="text-[10px] items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block animate-pulse" />
                      🌙 精神世界
                    </span>
                    <span className="text-[10px] items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex">
                      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full inline-block animate-pulse" />
                      💗 关系
                    </span>
                  </div>

                  {/* Tension lines */}
                  <div className="bg-stone-900 border border-stone-850 rounded-xl p-3">
                    <div className="text-[10px] text-stone-500 font-bold mb-2 flex items-center gap-1">
                      <span>⚡</span> 精神内在极性冲突对立
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {TENSIONS.map((ten, idx) => (
                        <div key={idx} className="bg-stone-950 border border-stone-850 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[10px]">
                          <span className="text-stone-300 font-medium">{ten.left}</span>
                          <span className="text-stone-500">←→</span>
                          <span className="text-stone-300 font-medium">{ten.right}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual SVG topology map simulation (Beautiful CSS atoms) */}
                  <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[280px]">
                    <div className="absolute top-2 left-3 text-[9px] text-stone-500 uppercase font-mono">Aesthetic Connected Topology</div>
                    
                    {/* Floating Center Node */}
                    <div className="relative group z-20">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] flex items-center justify-center font-bold text-stone-950 text-sm cursor-pointer select-none ring-2 ring-amber-350">
                        千岑
                      </div>

                      {/* Orbits & Sub-Nodes */}
                      <div className="absolute -inset-12 border border-stone-800 rounded-full pointer-events-none animate-[spin_40s_linear_infinite]" />
                      <div className="absolute -inset-24 border border-stone-850/60 rounded-full pointer-events-none animate-[spin_60s_linear_infinite]" />
                    </div>

                    {/* Orbit placement items */}
                    <div className="absolute top-6 left-12 group">
                      <div 
                        onMouseEnter={() => setHoveredNode({
                          name: '功能安全监控 (Detector)',
                          domId: '技术',
                          story: '设计FaultDetector和SOC/MCU双安全降级冗余，将代码上升为工程系统级别的灾备防护。',
                          x: 20, y: 30
                        })}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] cursor-pointer hover:scale-125 transition-all text-[9.5px] font-bold text-emerald-950 flex items-center justify-center"
                      >
                        ⚙️
                      </div>
                    </div>

                    <div className="absolute top-10 right-14">
                      <div 
                        onMouseEnter={() => setHoveredNode({
                          name: '智汇树淘宝咨询',
                          domId: '创业',
                          story: '从工业定制、学生毕业设计咨询、技术指导中拆分用户画像、报价、交付与防御机制。',
                          x: 180, y: 20
                        })}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="w-5 h-5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)] cursor-pointer hover:scale-125 transition-all text-[9.5px] font-bold text-orange-950 flex items-center justify-center"
                      >
                        🚀
                      </div>
                    </div>

                    <div className="absolute bottom-12 left-10">
                      <div 
                        onMouseEnter={() => setHoveredNode({
                          name: '《实践论》方法派',
                          domId: '精神内核',
                          story: '不陷入空洞的哲学争辩，教导自己在错杂的利益方中寻找行动落子，将认识化为实践。',
                          x: 10, y: 190
                        })}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="w-5 h-5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] cursor-pointer hover:scale-125 transition-all text-[9.5px] font-bold text-indigo-950 flex items-center justify-center"
                      >
                        🌙
                      </div>
                    </div>

                    <div className="absolute bottom-16 right-12">
                      <div 
                        onMouseEnter={() => setHoveredNode({
                          name: '野生指针小聚',
                          domId: '关系课题',
                          story: '虽有着超凡的全局关注力，但容易把自如相处当作用公式计算的后台线程，在寻找第一视角回归。',
                          x: 190, y: 180
                        })}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="w-5 h-5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)] cursor-pointer hover:scale-125 transition-all text-[9.5px] font-bold text-pink-950 flex items-center justify-center"
                      >
                        💗
                      </div>
                    </div>

                    {/* Node Hover Tip panel */}
                    {hoveredNode && (
                      <div className="absolute z-30 bottom-1.5 left-2 right-2 bg-stone-950 border border-stone-850 p-2.5 rounded-xl text-left scale-[0.98] transition-all">
                        <div className="text-[9px] text-amber-500 font-bold uppercase shrink-0">{hoveredNode.domId} • 节点聚焦</div>
                        <div className="text-xs font-bold text-stone-200 mt-0.5">{hoveredNode.name}</div>
                        <div className="text-[10px] text-stone-400 mt-1 leading-normal">{hoveredNode.story}</div>
                      </div>
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
                                  triggerNpcSpeech(`你装备了 ${item.name}！去看你的属性条和技能区，是不是涨了？这就叫实物能力锚点。`, '小九 · 装备官');
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

                  {/* CTA Leave feedback */}
                  <button
                    onClick={() => setGuestOpen(true)}
                    className="w-full border border-stone-800 hover:border-amber-500/30 bg-stone-900 p-3.5 rounded-xl text-stone-300 hover:text-amber-300 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95"
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
