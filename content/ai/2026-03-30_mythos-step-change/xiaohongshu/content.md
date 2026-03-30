# 小红书文案

## 标题
Mythos泄露 我在想什么

## 正文

Anthropic意外泄露了"Claude Mythos"的存在——内部定义为"step change"级别的能力跳跃。Fortune率先报道，Anthropic确认正在与早期客户测试。

作为每月花$450用AI工具的人（Claude $200 + ChatGPT $200 + Genspark $50），我看到这个消息的第一反应不是兴奋。

我在想：模型能力跳一个台阶，我围绕它建的workflow还成立吗？

这不是第一次面对这个问题。GPT-3到GPT-4，推理能力飞跃，但幻觉没消失。Claude 2到3，长上下文来了，但结构化prompt仍然必要。Opus 4.5到4.6，agentic能力解锁，但自评偏差依旧存在。

我刚做了一个harness design实验：同一个需求，4种架构，Solo Agent信心为零，Full Harness + Playwright测试信心才高。核心发现是——每个harness组件都编码了一个关于模型局限的假设。

所以当"step change"来了，正确的反应是：重新审计你的harness。哪些组件在补偿旧模型的局限？删掉。哪些在提供真正的架构价值？保留。然后把省出来的复杂度预算，投入到更ambitious的新任务上。

新模型不淘汰你的workflow，它淘汰你workflow里的补偿性假设，然后释放出更大的野心空间。

你的AI workflow里有哪些是在补偿模型局限？评论区聊聊

## 标签
#ClaudeMythos #AI模型 #StepChange #Anthropic #AI工作流 #HarnessDesign #AI生产力 #Prompt架构
