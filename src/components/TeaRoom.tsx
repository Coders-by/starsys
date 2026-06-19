import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Coffee,
  Sparkles,
  PenTool,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface GuestComment {
  text: string;
  color: string;
  time: string;
}

export default function TeaRoom() {
  // --- TEA BREWING SIMULATOR (白茶悟道：从抽象虚空走向凡人温热) ---
  const [brewStep, setBrewStep] = useState<number>(0); // 0: 干叶, 1: 醒茶, 2: 舒叶, 3: 香融
  const [steamRising, setSteamRising] = useState<boolean>(false);
  const [isBrewing, setIsBrewing] = useState<boolean>(false);

  // Brew step details
  const brewSteps = [
    {
      title: "🍂 零点隔离 ㆍ 枯叶闭垒",
      philosophy: "──『凡所有相，皆是虚妄』",
      desc: "千岑以往习惯高悬在‘第三人称旁观者’的冰冷高台。他把生活当作算法推演，心如一片卷缩、疏离、缺乏水分的干枯古茶饼，虽完美自卫，却毫无体温。",
      interactive: "注入 85°C 热水，唤醒冬星记忆"
    },
    {
      title: "♨️ 醒茶展叶 ㆍ 拆除装甲",
      philosophy: "──『外避退坡，惊雷初击』",
      desc: "滚水注入，白毫初展。在零下40度酷寒的车辆APA路试中，在黑河荒原颠簸里，他发现人如果一味优雅降级，其实就是在主动断绝外界对流。开始惊醒：看破一切的‘空寂自满’本身也是极其深重的虚妄面具。",
      interactive: "继续浸润，温热渗透"
    },
    {
      title: "🍃 舒叶透魂 ㆍ 泥泞涉险",
      philosophy: "──『踩入泥涂，真实爱恨』",
      desc: "叶片完全舒展，释放积蓄已久的饱满油脂。不再逃避，不再躲避纠结。千岑不再为了保持清白而站在岸上，而是选择穿着泥鞋淌进具体的纠葛中：撮合好友、深夜带教、去深圳南山夜风里为最真切的关系流泪大哭。",
      interactive: "分茶入盏，细品余温"
    },
    {
      title: "🍵 分盏温喉 ㆍ 人间烟火",
      philosophy: "──『以具体温热，致敬荒原』",
      desc: "茶汤倒满，执杯入口。不需要用高深的逻辑去辩白常识，舍友微信群里一声『面烧焦了，快进来吃🍲』，比一切极简禅意更能温饱肠胃。在具体的尘世生老、汗咸、茶温里，完成了心智的终极共振。",
      interactive: "倒掉残茶，重新醒茶"
    }
  ];

  const handleNextBrew = () => {
    if (isBrewing) return;
    setIsBrewing(true);
    setSteamRising(true);
    setTimeout(() => {
      setBrewStep((prev) => (prev + 1) % 4);
      setIsBrewing(false);
      if (brewStep === 3) {
        setSteamRising(false);
      }
    }, 1200);
  };

  // --- TEA ROOM CHATBOT (灵狐小九 智能回音对流) ---
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      sender: 'bot', 
      text: '茶已经沏好了，隔年老白茶，温润温厚。🍵 欢迎来到千岑的心流茶寮。\n\n我能陪你解说他的自动驾驶智驾实车毫米级标定、深夜阅览《矛盾论》与《实践论》的泥涂大无畏，还有卸下绝对理性自负、笨拙走向真实关系长征的爱恨秘密。说吧，你想了解哪一页星系或人间的真实温存？' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Handle chatbot communications with API and elegant backends
  const handleSendChat = async (directText?: string) => {
    const textToSend = directText || chatInput;
    if (!textToSend.trim()) return;

    // Add user question
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
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const reply = data.reply || data.text || '小九耳朵有点堵，好像服务器在吹冷气... 🍵 欢迎继续点击下面锦囊，或者稍后再来问我！';
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch {
      // Intentionally crafted fallback responses matching correct character constraints
      let fallbackText = '白茶倒满，刚才量子天线稍微断了一丝。说到调试自动驾驶实车的惊险：零下40度在冰雪上毫米级的反控制，每一次抱死都是一次跟自保本能的殊死拆抢；这与面对亲密关系时，怕受伤害而启动的那道自动优雅降级，本质是一模一样的心智机制啊。';
      
      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes('卡拉马佐夫') || lowerText.includes('阅览') || lowerText.includes('读书') || lowerText.includes('矛盾论') || lowerText.includes('实践论')) {
        fallbackText = '老陀在《卡拉马佐夫兄弟》深处讲过：要爱具体的普通人，胜过爱抽象的人类。千岑以前悬空在第三人称高台，用清傲看透一切、写完美合同。等他自己踩在大雨路面的泥灰里、写着极寒带教文档送给战友的时候，他才真正感知到一截实地篝火的温度。';
      } else if (lowerText.includes('自媒体') || lowerText.includes('信鸽') || lowerText.includes('回声') || lowerText.includes('镜像回声')) {
        fallbackText = '《镜像回声》是他在深夜里给自己也给这世上所有感到冷空无依的行路客沏的一席热茶。这里不贩卖任何职场和财富焦虑，只把他在自动驾驶冗余安全里磨淬出的 fail-safe 退坡自愈智慧，倾注成保护所有脆弱敏感心灵安全落地坠滑的红树林海绵。';
      } else if (lowerText.includes('虚妄') || lowerText.includes('凡所有相')) {
        fallbackText = '其实，过去千岑挂在嘴边的“空空寂寂，皆是虚妄”，本身只是一张得体极简的高级防弹面具。有了这张看破红尘的王牌，他就可以逃避掉在真实的、不完美的世俗接触里可能遭受的伤害。但真正的白茶是烫的，爱是要流泪的，踩进南山的滚烫大排档，才是从虚妄超拔出的生路。';
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: fallbackText }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- GUESTBOOK COMMENTS PANEL ---
  const [guestName, setGuestName] = useState('');
  const [guestMsg, setGuestMsg] = useState('');
  const [guestSelectedColor, setGuestSelectedColor] = useState('#fbbf24');
  const [guestComments, setGuestComments] = useState<GuestComment[]>([
    { text: '【观棋客】: 读完了，眼角有点酸。曾自傲于无懈可击的高智商与完美防线，看这篇档案就像看到了深夜里狼狈却终于活出热血的自己。', color: '#fbbf24', time: '刚才' },
    { text: '【南山行者】: “凡所有相，皆是虚妄”的确可以让人活成空灵的佛。但没有具体的痛苦、热烈的创伤、大笑与喝茶，人不过是披着得体袈裟的空心雕像。写得真好！', color: '#34d399', time: '1小时前' },
    { text: '【红星摆渡手】: 在深圳南山夜风下的糖心荷包蛋香气，比起什么冷彻星空高合算力理论要迷人一万倍。实践论说得真对。', color: '#ff6b6b', time: '2小时前' },
    { text: '【极寒测试员】: 懂这股子笨拙！写最优解代码时脑力一骑绝尘，面对一份实情摩擦却在键盘边缘反复横跳。不逃了，我也要去岸下的湿海里捞具体的雨！', color: '#60a5fa', time: '前天' }
  ]);

  const handlePostComment = () => {
    if (!guestMsg.trim()) return;
    const author = guestName.trim() || '过河客';
    const newComment: GuestComment = {
      text: `【${author}】: ${guestMsg}`,
      color: guestSelectedColor,
      time: '刚才'
    };
    setGuestComments([newComment, ...guestComments]);
    setGuestMsg('');
    setGuestName('');
  };

  return (
    <div className="space-y-5 animate-[fadeIn_0.4s_ease_1] pb-10">
      
      {/* 1. BREATHING VISUAL ADVISOR: WHITE TEA MINDFULNESS SIMULATOR */}
      <div 
        id="tea_mindfulness_card"
        className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-850 rounded-2xl p-4.5 relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-stone-950/80 px-2.5 py-0.5 rounded border border-stone-850/60 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[7.5px] text-amber-300 uppercase font-mono font-bold tracking-wider">沏茶思辨悟道</span>
        </div>

        <div className="flex gap-4 items-center mb-4.5">
          <div className="relative shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-stone-950 border border-stone-850">
            {/* Dynamic Tea Vessel & Steam animations */}
            {steamRising && (
              <div className="absolute -top-3 flex gap-1 justify-center w-full">
                <span className="w-0.5 h-6 bg-amber-400/20 rounded-full animate-[bounce_1.5s_infinite_ease-in-out_0.2s] filter blur-[0.5px]" />
                <span className="w-0.5 h-8 bg-amber-300/30 rounded-full animate-[bounce_1.2s_infinite_ease-in-out_0.4s] filter blur-[0.5px]" />
                <span className="w-0.5 h-5 bg-amber-400/20 rounded-full animate-[bounce_1.8s_infinite_ease-in-out_0.1s] filter blur-[0.5px]" />
              </div>
            )}
            
            {/* Liquid level */}
            <div 
              className="absolute bottom-1 w-14 rounded-b-full bg-amber-500/10 transition-all duration-1000 border-t border-amber-500/30 overflow-hidden"
              style={{ 
                height: `${brewStep * 20 + 8}px`,
                opacity: brewStep === 0 ? 0.2 : 0.95,
                backgroundColor: brewStep === 1 ? 'rgba(217, 119, 6, 0.15)' : brewStep === 2 ? 'rgba(180, 83, 9, 0.25)' : 'rgba(245, 158, 11, 0.35)'
              }}
            >
              {brewStep > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent animate-[scroll_3s_linear_infinite]" />
              )}
            </div>

            <span className="text-4xl relative z-10 select-none filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.15)] transition-transform duration-500 hover:rotate-12">
              {brewStep === 0 ? '🍂' : brewStep === 1 ? '♨️' : brewStep === 2 ? '🍃' : '🍵'}
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-stone-100 flex items-center gap-1">
              <span>{brewSteps[brewStep].title}</span>
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            </h4>
            <div className="text-[7.5px] font-mono tracking-widest text-amber-500 uppercase font-extrabold pb-0.5 border-b border-stone-850/30">
              {brewSteps[brewStep].philosophy}
            </div>
            <p className="text-[9px] text-stone-400 leading-normal max-w-[210px] mt-1 text-justify">
              {brewSteps[brewStep].desc}
            </p>
          </div>
        </div>

        {/* Action Button which drives the mental evolution */}
        <div className="flex gap-2">
          <button 
            id="brew_tea_btn"
            onClick={handleNextBrew}
            disabled={isBrewing}
            className="flex-1 bg-amber-500 hover:bg-amber-400 hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] text-stone-955 font-black text-[10.5px] py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer select-none active:scale-95 disabled:opacity-40"
          >
            {isBrewing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>沸汤下壶中...</span>
              </>
            ) : (
              <>
                <Coffee className="w-3.5 h-3.5" />
                <span>{brewSteps[brewStep].interactive}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. CHAT MATRIX WITH LINGHU XIAO JIU */}
      <div 
        id="xiaojiu_chat_box"
        className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-4 shadow-2xl"
      >
        <div className="flex justify-between items-center border-b border-stone-850/60 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🦊</span>
            <div>
              <span className="text-[9.5px] uppercase font-mono font-black text-stone-300 tracking-wider block">灵狐小九 ㆍ 心意对流阁</span>
              <span className="text-[7.5px] font-mono text-stone-500 font-bold block uppercase tracking-widest mt-0.5">Character-Auth Grounding Stream</span>
            </div>
          </div>
          <span className="text-[8px] bg-stone-950 text-stone-500 border border-stone-850 px-2 py-0.5 rounded-md font-mono font-bold">
            RAG-Active
          </span>
        </div>

        {/* Dialogue scroll panel */}
        <div className="h-[210px] overflow-y-auto space-y-4 pr-1 text-xs scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-stone-950 p-1 rounded">
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex gap-2.5 items-start ${msg.sender === 'user' ? 'flex-row-reverse text-right' : 'text-left'}`}
            >
              <div className="w-7 h-7 rounded-full bg-stone-950 border border-stone-850 flex items-center justify-center text-base shrink-0 select-none shadow">
                {msg.sender === 'user' ? '👤' : '🦊'}
              </div>
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-[8px] text-stone-500 block font-bold tracking-wider">
                  {msg.sender === 'user' ? '探索客' : '小九'}
                </span>
                <div className={`p-3 rounded-2xl border leading-relaxed text-[10.5px] text-left text-justify shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-200 rounded-tr-none' 
                    : 'bg-stone-950 border-stone-850/80 text-stone-300 rounded-tl-none font-sans'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2.5 items-center animate-pulse pl-0.5">
              <div className="w-7 h-7 rounded-full bg-stone-950 border border-stone-850 flex items-center justify-center text-base">🦊</div>
              <div className="bg-stone-950 border border-stone-850/80 px-3 py-2 rounded-2xl text-[10px] text-stone-500 italic max-w-[80%]">
                小九正在翻寻千岑在极塞车底、凌晨烛照下的书册批注笔记... 🍵
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Suggestions chips and queries aligned with core theme */}
        <div className="space-y-2 pt-2 border-t border-stone-850/40">
          <span className="text-[8px] text-stone-500 font-extrabold block uppercase tracking-wider">💡 灵犀提示囊（点击直接向小九发问）：</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin shrink-0 flex-nowrap">
            <button 
              onClick={() => handleSendChat('既然『凡所有相，皆是虚妄』，那千岑为什么还要踩进具体的生活泥潭？')}
              disabled={isTyping}
              className="bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1.5 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              💡 凡所有相与虚妄本质
            </button>
            <button 
              onClick={() => handleSendChat('给我讲讲千岑在零下40度极寒标定智能起停泊车APA时，写下带教案的那个深夜故事。')}
              disabled={isTyping}
              className="bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1.5 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              🚗 零下40度APA深冬
            </button>
            <button 
              onClick={() => handleSendChat('微信公众号自媒体《镜像回声》的初心，是怎样默默用容错自愈温度来抚平普通人心灵的？')}
              disabled={isTyping}
              className="bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1.5 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              🪁 自媒体与红树林海绵
            </button>
            <button 
              onClick={() => handleSendChat('他真的能摆脱第三人称的“安全观察者”，当好第一人称的主角吗？')}
              disabled={isTyping}
              className="bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-amber-500/40 px-2.5 py-1.5 rounded-lg text-[9.5px] whitespace-nowrap text-stone-300 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              👤 拆卸观察者防护罩
            </button>
          </div>
        </div>

        {/* Message Input line */}
        <div className="flex gap-2 border-t border-stone-850/40 pt-2 shrink-0">
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
            disabled={isTyping}
            placeholder="与小九聊聊星系执念、白茶、生活温度..."
            className="flex-1 bg-stone-950 border border-stone-850 focus:border-amber-500/40 rounded-xl px-3 py-2 text-xs outline-none text-stone-200 placeholder-stone-650 transition-all font-sans"
          />
          <button 
            onClick={() => handleSendChat()}
            disabled={isTyping || !chatInput.trim()}
            className="bg-amber-500 text-stone-955 font-black px-4 rounded-xl text-xs hover:bg-amber-400 active:scale-95 transition-all outline-none flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. GUESTBOOK COMPILE ROOM: "落泥笔札" (Grounded Tablet Logs) */}
      <div 
        id="guest_notebook_box"
        className="bg-stone-900 border border-stone-850 rounded-2xl p-4.5 space-y-4 shadow-xl"
      >
        <div className="border-b border-stone-850/50 pb-2.5">
          <div className="flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[10px] font-extrabold text-stone-300 uppercase tracking-widest block leading-none">📝 落泥笔札 ㆍ 尘泥刻印</span>
          </div>
          <p className="text-[9.5px] text-stone-500 mt-1 lines leading-relaxed">
            凡所有相，不必高空逃避。写下任何能唤醒你内心共鸣的生活瞬间，亦或是给千岑的温暖笺言：
          </p>
        </div>

        {/* Comments scrolling boards */}
        <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
          {guestComments.map((comment, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-stone-850 bg-stone-950 relative select-none shadow-sm flex flex-col justify-between min-h-[50px] transition-all hover:bg-stone-900/30">
              <div className="absolute left-1.5 top-1.5 bottom-1.5 w-1 rounded-full" style={{ backgroundColor: comment.color }} />
              <p className="text-[10px] text-stone-300 pl-3.5 leading-relaxed text-justify pr-1">{comment.text}</p>
              <span className="self-end text-[7.5px] text-stone-600 font-mono tracking-wider mt-1">{comment.time}</span>
            </div>
          ))}
        </div>

        {/* Name and color configuration box */}
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-850/70 space-y-2.5">
          <div className="flex gap-2 items-center justify-between">
            <input 
              type="text"
              placeholder="落泥署名 (如：过河客)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              maxLength={12}
              className="w-2/5 bg-stone-900 border border-stone-850 rounded-lg px-2 text-[10px] py-1 focus:border-amber-500/30 outline-none text-stone-200 placeholder-stone-650"
            />

            <div className="flex gap-1.5 items-center">
              <span className="text-[8px] text-stone-650 font-mono uppercase">色彩印证:</span>
              {['#fbbf24', '#34d399', '#ff6b6b', '#60a5fa'].map((c) => (
                <button
                  key={c}
                  onClick={() => setGuestSelectedColor(c)}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    guestSelectedColor === c ? 'scale-115 border-stone-200 ring-1 ring-stone-700' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Comment text and submission button */}
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="刻下一句有温度、有血肉的印记吧 (九十字内)..."
              value={guestMsg}
              onChange={(e) => setGuestMsg(e.target.value)}
              maxLength={90}
              className="flex-1 bg-stone-900 border border-stone-850 rounded-lg px-2.5 py-1.5 text-[10px] focus:border-amber-500/30 outline-none text-stone-200"
            />
            <button
              onClick={handlePostComment}
              disabled={!guestMsg.trim()}
              className="bg-amber-500 text-stone-950 font-black px-3.5 py-1 text-[10px] rounded-lg hover:bg-amber-400 disabled:opacity-40 transition-all shrink-0 active:scale-95"
            >
              刻于木札
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
