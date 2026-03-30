# 小红书文案

## 标题
AI说做完了 Harness说没有

## 正文

Harness Design是什么？简单说：prompt engineering优化你对AI说的话，harness design设计AI周围的系统——几个agent、怎么评估、怎么反馈修复。模型是引擎，harness是整辆车。

Anthropic最近发了一篇关于harness design的深度文章，核心发现：同一个任务，单agent花$9做出来是坏的，三agent harness花$200做出来能用。

看完之后我自己做了一个实验：同一个两句话需求，4种架构，结果差距巨大。

Run A：单Agent直出，7分钟，$1。没有任何测试，bug数量未知。

Run B：让同一个Agent自我评估。结果？它给自己打了93%通过率——典型的自评偏差。Generator永远觉得自己"完美"。

Run C：3个独立Agent（规划+生成+评审），25分钟，$5。代码review发现88/90通过，找到3个bug。

Run D：完整Harness + Playwright浏览器测试，29分钟，$5。浏览器测试只通过18/20——并且发现了一个致命bug。

那个致命bug是什么？通知面板打开后，一个overlay元素拦截了整个页面的所有点击事件。代码逻辑完全正确，code review判定PASS，但实际点击时整个app不能用。

只有真正在浏览器里点击，才能发现这种交互级bug。

关键洞察：
- 自评偏差是真实存在的，Generator永远说100%完美
- 代码review不等于使用产品
- Harness就是prompt架构——同模型、同工具、不同prompt
- C和D成本一样（$5），但信心差距巨大
- 反馈循环有效：3轮修复了3/4个bug

你在用AI做项目时，有没有验证环节？评论区聊聊

## 标签
#AI架构 #HarnessDesign #AI工程 #Prompt架构 #AI生产力 #CodeReview #自动化测试 #AI实验
