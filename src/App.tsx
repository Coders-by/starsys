import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Zap, 
  MessageSquare, 
  Compass, 
  History, 
  Sparkles, 
  Heart, 
  Send, 
  X, 
  Award,
  BookOpen,
  ChevronRight,
  Flame
} from 'lucide-react';
import {
  USER_BASE,
  DOSSIER,
  GEAR,
  ACHIEVEMENTS,
} from './data';
import { 
  Gear as GearType, 
  Achievement, 
  ChatMessage, 
  GuestComment 
} from './types';
import StarSysGame from './components/StarSysGame';
import EchoSystem from './components/EchoSystem';
import AmbientMusic from './components/AmbientMusic';
import LifeWalk from './components/LifeWalk';

export default function App() {
  // --- Core Tabs ---
  const [currentTab, setCurrentTab] = useState(0); // 0: StarSys Game, 1: Timeline, 2: Chat & Tea Room, 3: LifeWalk (凡间漫游)

  // --- Star System Progress State ---
  const [starProgress, setStarProgress] = useState({
    red: false,
    blue: false,
    gold: false,
    central: false
  });

  // --- Discovered Resonances (Echo Alchemy) ---
  const [discoveredResonances, setDiscoveredResonances] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('qiancen_discovered_resonances_v3') || '[]');
    } catch {
      return [];
    }
  });

  const handleResonanceComplete = (id: string) => {
    if (!discoveredResonances.includes(id)) {
      setDiscoveredResonances(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    localStorage.setItem('qiancen_discovered_resonances_v3', JSON.stringify(discoveredResonances));
  }, [discoveredResonances]);

  // Legacy fallback completed state (to support retroactive badges if any)
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('qiancen_completed_actions_v3') || '{}');
    } catch {
      return {};
    }
  });

  // Computed resonance percentage from Star system and Echo board combinations (Ultimate 5-Layers)
  const resonanceRate = (() => {
    let rate = 0;
    if (starProgress.red) rate += 15;
    if (starProgress.blue) rate += 15;
    if (starProgress.gold) rate += 15;
    
    if (discoveredResonances.includes('escape')) rate += 10;
    if (discoveredResonances.includes('waiting')) rate += 10;
    if (discoveredResonances.includes('stay')) rate += 15;
    
    if (starProgress.central) rate += 20;
    return Math.min(rate, 100);
  })();

  // --- Popups ---
  const [equippedGearPopup, setEquippedGearPopup] = useState<GearType | null>(null);
  const [openedAchievement, setOpenedAchievement] = useState<Achievement | null>(null);

  // --- Tea Room Chatbot States ---
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: '茶已经沏好了，隔年老白茶，温润温厚。🍵 欢迎来到千岑的茗茶心流室。\n\n我能陪你解说他的自动驾驶智驾毫米级调试、深夜阅览《矛盾论》的泥涂实践、红楼梦与老陀的具体血肉爱恨，还有拆除避险装甲、笨手走向本真关系的长征。让我们聊聊看？' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // --- Guest comments panel state ---
  const [guestName, setGuestName] = useState('');
  const [guestMsg, setGuestMsg] = useState('');
  const [guestSelectedColor, setGuestSelectedColor] = useState('#fbbf24');
  const [guestComments, setGuestComments] = useState<GuestComment[]>([
    { text: '读完了，眼角有点酸。白白净净的高薪装甲，拆掉真有种血肉撕扯的痛楚，可也是这样，风吹进来才热。', color: '#fbbf24', time: '刚刚' },
    { text: '高阻尼自卫系统的说法太形象了。其实我们何尝不是在系统里把自己磨成了冰冷的、无法靠近的刺猬？', color: '#a78bfa', time: '1小时前' },
    { text: '那句“不在高台上辩论，赤脚在水泥泥水里活过”太打动我了。知行合一，用实践克服空心。致敬同路人！', color: '#34d399', time: '前天' }
  ]);

  const handlePostComment = () => {
    if (!guestMsg.trim()) return;
    const author = guestName.trim() || '过河客';
    const newComment: GuestComment = {
      text: `【${author}】: ${guestMsg}`,
      color: guestSelectedColor,
      time: '刚刚'
    };
    setGuestComments([newComment, ...guestComments]);
    setGuestMsg('');
    setGuestName('');
    
    // Treat guestbook comment as legacy completion fallback check
    const updated = { ...completedActions, leave_comment: true };
    setCompletedActions(updated);
    localStorage.setItem('qiancen_completed_actions_v3', JSON.stringify(updated));
  };

  // --- Live API Chatbot request logic ---
  const handleSendChat = async (directText?: string) => {
    const textToSend = directText || chatInput;
    if (!textToSend.trim()) return;

    // Add user message immediately
    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    if (!directText) setChatInput('');

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();
      const reply = data.text || '小九耳朵有点堵，好像服务器在吹冷气... 🍵 欢迎继续点击下面锦囊，或者稍后再来问我！';
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch {
      // Fallback response with beautiful, rich character content
      let replyTxt = '白茶倒满，刚才隔空思索稍微断线了。说到调试自动驾驶实车的惊险：零下40度在冰雪上毫米级的反控制，每一次抱死都是一次跟自保本能的殊死拆抢；这与面对亲密关系时，怕受伤害而启动的那道自动优雅降级，本质是一模一样的心智机制啊。';
      if (textToSend.includes('卡拉马佐夫') || textToSend.includes('阅览') || textToSend.includes('读书')) {
        replyTxt = '老陀在《卡拉马佐夫兄弟》深处讲过：爱具体的普通人，胜过爱抽象的人类。千岑以前悬空在第三人称高台，用清傲看透一切、写完美合同。等他自己踩在大雨路面的泥灰里、写着带教极寒文档送给战友的时候，他才懂了一截篝火的温度。';
      } else if (textToSend.includes('自媒体') || textToSend.includes('信鸽') || textToSend.includes('回声')) {
        replyTxt = '《镜像回声》是他在深夜里给自己也给这世上所有感到冷空无依的青年沏的一席热茶。不贩卖焦虑，只把他在车规安全上淬砺出的 fail-safe 自愈退坡智慧，默默铺设成保护所有敏感普通人心灵坠地的防沉降软垫。';
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: replyTxt }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center p-0 md:p-4 font-sans antialiased">
      
      {/* CENTRAL MOBILE CONTAINER SHELL (Pristine Visual Canvas) */}
      <div className="w-full max-w-md bg-stone-900 md:rounded-3xl border border-stone-850/70 h-screen md:h-[840px] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* TOP STATUS BAR: Global Resonance Ratio */}
        <div className="bg-stone-950 p-4 shrink-0 border-b border-stone-850/60 z-20 space-y-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌌</span>
              <div>
                <h1 className="text-sm font-bold text-stone-100 tracking-tight leading-none">千岑 ㆍ 心智共振档案</h1>
                <span className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-widest mt-1 inline-block">Active Resonance System</span>
              </div>
            </div>
            
            {/* Resonance count badge */}
            <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-center flex items-center gap-1.5 shadow-sm">
              <span className="text-amber-400 text-[10px] uppercase font-mono font-bold tracking-wider">共鸣率:</span>
              <span className="text-amber-300 text-xs font-black font-mono">{resonanceRate}%</span>
            </div>
          </div>

          {/* Dynamic Sync Progress Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-mono text-stone-500 uppercase font-bold leading-none">
              <span>零点隔离</span>
              <span>100% 同频共振合一</span>
            </div>
            <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${resonanceRate}%` }}
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              />
            </div>
          </div>
        </div>

        {/* --- MAIN SCROLLABLE WRAPPER --- */}
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
          
          <AmbientMusic />
          
          {/* TAB 0: THE PLANETARY ADVENTURE 《共振》 */}
          {currentTab === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <StarSysGame 
                onSyncProgress={setStarProgress} 
                isMaxedCheat={starProgress.central} 
                isStaySynthesized={discoveredResonances.includes('stay')}
              />
            </motion.div>
          )}

          {/* TAB 1: RESONANCE ECHOS SYSTEM */}
          {currentTab === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <EchoSystem 
                starProgress={starProgress} 
                discoveredResonances={discoveredResonances} 
                onResonanceComplete={handleResonanceComplete} 
              />
            </motion.div>
          )}

          {/* TAB 2: COZY TEA ROOM, CHAT & GUESTBOOK */}
          {currentTab === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              
              {/* Cozy advisor Card */}
              <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-850 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative py-5 gap-3 shadow-md">
                <div className="absolute top-2 right-3 flex items-center gap-1 bg-stone-950 px-2 py-0.5 rounded border border-stone-850">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7.5px] text-stone-400 uppercase font-mono font-bold">灵狐小九 在席</span>
                </div>

                <div className="relative">
                  <span className="text-5xl block select-none drop-shadow-[0_0_12px_rgba(251,191,36,0.2)]">🦊</span>
                  <div className="absolute -bottom-1 -right-1 bg-stone-950 border border-stone-800 p-1 rounded-full text-xs animate-bounce">
                    🍵
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-amber-400">{USER_BASE.pet.name}的心智回音隔</h4>
                  <p className="text-[9.5px] text-stone-500">{USER_BASE.pet.type} • 隔年老白茶正热</p>
                </div>

                <div className="bg-stone-950/90 border border-stone-850 p-3 rounded-xl italic text-[11px] text-stone-300 leading-relaxed text-justify relative">
                  “物理状态机的阻避逻辑确实妥帖稳固，但别用它来冰封自己的真心嘛。倒一茶老白茶，说点极地极寒爬车、卡氏兄弟虚落、或者你在情路上曾有的狼狈，又有何妨？”
                </div>
              </div>

              {/* Chat Terminal Block */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-stone-850/60 pb-2">
                  <span className="text-[9px] uppercase font-mono font-bold text-stone-400 tracking-wider flex items-center gap-1">
                    <span>💬</span> replica AI 的内心对流通道
                  </span>
                  <span className="text-[8px] bg-stone-950 text-stone-500 border border-stone-850 px-1.5 py-0.5 rounded font-mono">
                    RAG-Active
                  </span>
                </div>

                {/* Message logs */}
                <div className="h-[180px] overflow-y-auto space-y-3.5 pr-1 text-xs scrollbar-thin scrollbar-thumb-stone-800">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex gap-2 items-start ${msg.sender === 'user' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <span className="text-xl shrink-0 select-none">{msg.sender === 'user' ? '👤' : '🦊'}</span>
                      <div className="space-y-0.5 max-w-[80%]">
                        <span className="text-[8px] text-stone-500 block font-bold">
                          {msg.sender === 'user' ? '探索客' : '小九'}
                        </span>
                        <div className={`p-2.5 rounded-xl border leading-relaxed text-[11px] text-justify ${
                          msg.sender === 'user' 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-200 rounded-tr-none' 
                            : 'bg-stone-950 border-stone-850 text-stone-300 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2 items-center animate-pulse">
                      <span className="text-xl">🦊</span>
                      <div className="bg-stone-950 border border-stone-850 px-3 py-1.5 rounded-xl text-[10px] text-stone-500 italic">
                        小九正在翻寻千岑在极塞车底、凌晨烛照下的书册批注笔记... 🍵
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggest chips */}
                <div className="space-y-1.5 pt-1.5 border-t border-stone-850/40">
                  <span className="text-[8.5px] text-stone-500 font-bold block uppercase tracking-wider">💡 灵犀提示囊（点击直接提问）：</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none shrink-0 flex-nowrap">
                    <button 
                      onClick={() => handleSendChat('你负责的高温极寒APA智能泊车极限实车控制是怎么优雅降级的？')}
                      disabled={isTyping}
                      className="bg-stone-950 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer"
                    >
                      🚗 APA车规避险安全
                    </button>
                    <button 
                      onClick={() => handleSendChat('你觉得实践论和老陀书中的具体生活怎么帮我们打破高冷虚无？')}
                      disabled={isTyping}
                      className="bg-stone-950 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer"
                    >
                      📖 阅历、实践与具体生命
                    </button>
                    <button 
                      onClick={() => handleSendChat('聊聊自媒体《镜像回声》背后传递体温的初心吧')}
                      disabled={isTyping}
                      className="bg-stone-950 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer"
                    >
                      🪁 镜像回声教案真相
                    </button>
                  </div>
                </div>

                {/* Sender bar */}
                <div className="flex gap-2 border-t border-stone-850/40 pt-2 shrink-0">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                    disabled={isTyping}
                    placeholder="问点儿毫米级泊车、老陀具体之爱感悟..."
                    className="flex-1 bg-stone-950 border border-stone-850 rounded-xl px-3 py-2 text-xs focus:border-amber-500/40 outline-none text-stone-200 placeholder-stone-650"
                  />
                  <button 
                    onClick={() => handleSendChat()}
                    disabled={isTyping || !chatInput.trim()}
                    className="bg-amber-500 text-stone-955 font-bold px-3.5 rounded-xl text-xs hover:bg-amber-400 active:scale-95 transition-all outline-none flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* GUESTBOOK COMMENTS */}
              <div className="bg-stone-900 border border-stone-850 rounded-2xl p-4 space-y-4 shadow-md">
                <div className="border-b border-stone-850/50 pb-2">
                  <span className="text-[9.5px] font-bold text-stone-400 uppercase tracking-widest block leading-none">📝 落泥笔札：留印刻木</span>
                  <p className="text-[10px] text-stone-500 mt-1">
                    写下任何触动过你心房的心智共鸣或给千岑这架避风客栈的暖墨：
                  </p>
                </div>

                {/* list scroll */}
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {guestComments.map((comment, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-stone-850 bg-stone-950 relative">
                      <div className="absolute left-1.5 top-1.5 bottom-1.5 w-1 rounded-full" style={{ backgroundColor: comment.color }} />
                      <p className="text-[10.5px] text-stone-300 pl-3 leading-relaxed text-justify pr-6">{comment.text}</p>
                      <span className="absolute right-2 bottom-1 text-[7.5px] text-stone-600 font-mono">{comment.time}</span>
                    </div>
                  ))}
                </div>

                {/* input block */}
                <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-850/70 space-y-2">
                  <div className="flex gap-2 items-center justify-between">
                    <input 
                      type="text"
                      placeholder="客官印记/署名"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      maxLength={10}
                      className="w-1/3 bg-stone-900 border border-stone-850 rounded-lg px-2 py-1 text-[10.5px] focus:border-amber-500/30 outline-none text-stone-200 placeholder-stone-600"
                    />

                    <div className="flex gap-1">
                      {['#fbbf24', '#34d399', '#60a5fa', '#a78bfa'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setGuestSelectedColor(c)}
                          className={`w-3 h-3 rounded-full border transition-all ${guestSelectedColor === c ? 'scale-110 border-stone-200' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="写句落款（八十字以内）..."
                      value={guestMsg}
                      onChange={(e) => setGuestMsg(e.target.value)}
                      maxLength={80}
                      className="flex-1 bg-stone-900 border border-stone-850 rounded-lg px-2.5 py-1.5 text-[10.5px] focus:border-amber-500/30 outline-none text-stone-200"
                    />
                    <button
                      onClick={handlePostComment}
                      disabled={!guestMsg.trim()}
                      className="bg-amber-500 text-stone-950 font-extrabold px-3 py-1 text-[10.5px] rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-all shrink-0"
                    >
                      刻款
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 3: MORTAL WANDERING 《凡间漫游》 */}
          {currentTab === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <LifeWalk />
            </motion.div>
          )}

        </div>

        {/* BOTTOM NAV BAR */}
        <div className="bg-stone-950 border-t border-stone-850/65 grid grid-cols-4 shrink-0 pb-[env(safe-area-inset-bottom,0)] z-20 shadow-lg">
          <button 
            onClick={() => setCurrentTab(0)}
            className={`py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold transition-all ${
              currentTab === 0 ? 'text-amber-400 bg-stone-900/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="tracking-wider text-[9px]">星系共振</span>
          </button>

          <button 
            onClick={() => setCurrentTab(1)}
            className={`py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold transition-all ${
              currentTab === 1 ? 'text-amber-400 bg-stone-900/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="tracking-wider text-[9px]">回响星图</span>
          </button>

          <button 
            onClick={() => setCurrentTab(2)}
            className={`py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold transition-all ${
              currentTab === 2 ? 'text-amber-400 bg-stone-900/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="tracking-wider text-[9px]">茗茶闲叙</span>
          </button>

          <button 
            onClick={() => setCurrentTab(3)}
            className={`py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold transition-all ${
              currentTab === 3 ? 'text-amber-400 bg-stone-900/30' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span className="tracking-wider text-[9px]">凡间漫游</span>
          </button>
        </div>

      </div>

      {/* --- POPUPS MODALS --- */}

      {/* Achievement modal info */}
      <AnimatePresence>
        {openedAchievement && (
          <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setOpenedAchievement(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-stone-850 pb-3">
                <span className="text-3xl bg-amber-500/10 p-2 rounded-xl text-amber-400">{openedAchievement.icon}</span>
                <div>
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-amber-500 font-mono">精神勋章已收割 • {openedAchievement.time}</span>
                  <h3 className="text-sm font-bold text-stone-100 mt-1">{openedAchievement.name}</h3>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{openedAchievement.desc}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 block font-mono">纸背后的墨迹私信</span>
                <p className="text-[11.5px] text-stone-300 leading-relaxed text-justify bg-stone-950 p-3.5 rounded-xl border border-stone-850/50">
                  {openedAchievement.story}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-emerald-950/20 border border-emerald-500/10 p-2.5 rounded-xl">
                  <span className="text-emerald-400 font-bold block mb-1">🌱 获得：</span>
                  <ul className="space-y-0.5 text-[9.5px] text-stone-400 list-disc list-inside leading-relaxed">
                    {openedAchievement.gain?.map((g, gi) => <li key={gi}>{g}</li>)}
                  </ul>
                </div>

                <div className="bg-rose-950/10 border border-rose-500/10 p-2.5 rounded-xl">
                  <span className="text-rose-400 font-bold block mb-1">🍂 损耗代价：</span>
                  <ul className="space-y-0.5 text-[9.5px] text-stone-400 list-disc list-inside leading-relaxed">
                    {openedAchievement.cost?.map((c, ci) => <li key={ci}>{ci === 0 ? '一无所有' : c}</li>)}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
