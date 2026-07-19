---
name: new-topic
description: 一个选题从 0 到多端发布的总流程（research → 小红书图文 → Medium → 视频 → 发布包）。用于 "做个新 topic" "/new-topic <选题>"。
---

# 选题全链路生产流程

一个 topic = 一份研究资产 + 三种输出形态。目录约定：
```
content/<系列>/<日期>_<slug>/
├── shared/outline.md        # 大纲 + 金句 + 已验证事实清单
├── xiaohongshu/             # 图文（content.md + cover/slides HTML+PNG）
├── medium/                  # 英文长文 + hero/chart 图
└── video/                   # 视频（storyboard.json + build/ + out/）
```

## 流程

### 0｜选题确认
- 来源：topics/*.md 待写池，或用户新想法
- 先用 1-2 句话跟用户对齐"这篇真正想说什么"（历次经验：用户会把泛题收窄成尖锐观点）

### 1｜Deep Research（一次研究，三处复用）
- 用 deep-research workflow（不可用时主线程 WebSearch 兜底）
- 产出进 shared/outline.md：核心论点 / 5-7 个戏剧性支撑点 / **已验证事实清单（带数字）** / 金句池 / 开放式 CTA
- 事实必须对抗式核验过才能进清单（refuted 的明确标注不可用）

### ⏸ 审稿点：outline 给用户过目

### 2｜小红书图文（既有 8 步流程）
outline → content.md（标题≤20字，正文600-800字）→ 自检 → 封面+slides HTML → Chrome 截图
→ 逐张检查溢出 → 归档 → 更新 topics/*.md
- 设计语言：深蓝 #1E2A3A / 米色 #FAF3E7 / coral #FF6B6B，AI 系列编号递增
- 记忆里的封面/文案纪律照用（深色底、故事优先、slide-2 用"今日拆解"）

### 3｜Medium 英文长文（可选，用户点头才做）
- ~2000 词，结构：TL;DR → hook → 论证小节 → "What to do on Monday" → uncomfortable coda
- hero.png + chart.png（1600x900，HTML 渲染）

### 4｜视频（可选，用户点头才做）
- 走 `/make-video` skill（pipeline/video/ 工具链 + 2 个审稿点）

### 5｜发布包
- 各形态的标题/正文/tags/封面归拢进 topic 的 publish.md
- BGM/素材署名检查；发布时间 18:30；48h 后数据回填 project 记忆

## 原则
- 一次研究喂三种形态，事实清单是共享资产
- 每个形态有独立审稿点，文字阶段改动最便宜
- 产出后 git 提交（大文件走 .gitignore，成片本地保留）
- 数据 > 推演：发布后回看"数据观察点"，写进 memory 迭代下一条
