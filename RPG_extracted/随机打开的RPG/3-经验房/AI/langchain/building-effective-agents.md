[https://www.anthropic.com/research/building-effective-agents]
要点：
1. 由多个 LLM 构建的 agent 系统，必然导致运行时延的提高。因此当考虑构建这样的 agent 系统时，需要评估增加的时延在当前场景下是否可接受
2. LangChain 等现成框架可以方便地让初学者入门，当由于这些框架都做了更抽象的封装，因此对于深入考察 agent 系统的人员来说反而会徒增复杂度，并且不易调试。一个可行的建议是，框架使用者在深入理解框架的构造原理之后再使用，例如 LangChain 中的 Persistence 层是如何实现的？如果不使用 LangChain 框架，你又该如何从零搭建类似的功能以实现记忆存储？
3. workflow 与 agent 的区别：
	1. workflow 更强调 LLM(s) 的**固定**流程，agent 则可以关注没有明确固定流程的任务。换言之，人类告诉 workflow 何时停止，而 agent 则是自己告诉自己何时停止
	2. agent 的高自由度通常意味着更高的程序权限，因此必须小心使用
4. 牢记：只有当复杂的 workflow 或 agent 明确提高了 LLM 能力时才使用，否则尽量维持简洁的 LLM 调用关系。LLM 的应用是否成功往往不取决于复杂度，而是在于能否精准切中客户需求。