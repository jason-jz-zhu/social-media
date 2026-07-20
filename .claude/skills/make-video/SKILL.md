---
name: make-video
description: 把一个 topic 目录变成 1920s 复古印刷风动画解说视频（16:9 + 9:16 + 封面）。用于 "做视频" "/make-video content/ai/xxx"。前提：topic 已有 research/outline（通常先跑完图文流程）。
---

# 动画解说视频生产流程

工具链：`pipeline/video/`（通用脚本）+ `pipeline/video/exemplars/`（17 个场景范例）。
Golden 参考实现：`content/ai/2026-07-14_electricity-parallel/video/`（完整跑通的一集）。
改 pipeline 脚本后必须跑 `python3 pipeline/video/test_golden.py` 回归。

## 阶段总览（含 2 个强制审稿点）

```
1 口播稿 → 2 分镜 storyboard.json → ⏸审稿点A → 3 场景动画 → 4 TTS → 5 字幕条
→ 6 帧捕捉 → 7 组装 → 8 QC → ⏸审稿点B → 9 竖版+封面 → 10 发布包
```

## 1. 口播稿（750-950 字 ≈ 4 分钟）
- 三稿并写（悬念冷开场/共鸣开场/数据冲击开场）→ 三评委打分（算法留存/语感人设/事实准确）→ 合成终稿
- 语感：chill 观察者，短句可朗读，禁书面腔；每 30 秒一个新钩子；≥2 句原创金句；结尾留互动问题
- 有"梗密度"意识（混子哥教训：幽默>精良）

## 2. 分镜 storyboard.json
- 13-17 个 scene；narration 逐字拼接=完整稿；每 scene 8-20 秒
- schema 见 golden topic；必须补 `"video"` 配置块：voice/rate、buildDir/framesDir、
  beats（音效节拍 [sceneId, 秒, sfx名, 增益]）、transitions（章节转场）、subtitleKeywords（coral 关键词）
- tts_map.json：所有英文词映射成中文说法（中文 TTS 读英文必怪，血泪教训），字幕自动同步

### ⏸ 审稿点 A：口播稿 + 分镜表给用户过目，通过才继续

## 3. 场景动画（核心工序）
- 每 scene 一个 `build/scene-NN.html`：**全画幅动画舞台**，不是排版页
  - 禁止 masthead/标题块/要点列表/页脚；文字只能是画内物（招牌/告示/画内海报大字）
  - 结构：body 1920x1080 + #camera(世界 2200-3200 宽) + grain/vignette + lib/anim-v4.js + 内联 seek(t)
  - **持续动效 ≥2 个循环**（烟/摆动/流动/闪烁）贯穿全场 + **一次性节拍**对齐旁白时刻
  - seek(t) 纯函数：禁 Date.now/random/CSS animation
  - 调色板：ink #1E2A3A / paper #FAF3E7 / coral #FF6B6B（唯一强调）+ 低饱和辅助色由氛围层提供
  - 人物用 A.walkerSVG/A.walk 火柴人；镜头 CAM keyframes 覆盖全时长，不许露出世界边缘
  - **镜头纪律（用户反馈 2026-07-19）**：默认横移+恒定焦距（z 锁 1.02-1.06 只动 x）；
    禁止"怼近开场→拉远→再推近"的呼吸式 zoom；每场镜头只走一个方向；
    zoom 只留给叙事时刻（紧张=单向缓推、揭示=单次拉出），全片 zoom 场景 ≤3 个
- **从范例库起步**：按 visualType 从 `pipeline/video/exemplars/` 复制最接近的场景改
- 每 scene 末尾注入 `<script src="lib/v5-atmo.js"></script>`（氛围层：晕染/天际线/尘埃自动加）
- lib 从 pipeline 复制进 topic 的 build/lib/
- 自检：`node <topic>/render-still 用 pipeline 版` 渲 t=1/mid/late 三帧 + t=2 vs 2.5 运动对比，
  溢出/重叠/调色板违规/静止死图都要修（最多 3 轮）

## 4-7. 自动工序（顺序执行）
```bash
python3 pipeline/video/gen_audio.py  <topic>          # TTS + durations.json
python3 pipeline/video/gen_strips.py <topic>          # 品牌字幕条
node    pipeline/video/capture.js    <topic>          # 逐帧截屏（可传场景号单捕）
python3 pipeline/video/assemble.py   <topic> v1       # 冷开卡+转场+ducking+SFX → master
```
- 冷开卡：从 pipeline/templates/opencard.html 复制到 topic build/ 改文案（最强悬念句）
- 注意：Chrome 并发会僵死——所有 Chrome 工序串行跑；批量字幕用长页切片（脚本已内置）

## 8. QC（成片必检）
- 抽帧：开头 3 秒 / 每 60 秒一帧 / 同 scene 隔 1.5s 两帧（验证持续运动）
- 听感：音量电平（旁白峰值约 -5dB）、SFX 是否对齐节拍、英文词发音
- 字幕与语音一致性（tts_map 改动后必查）

### ⏸ 审稿点 B：成片给用户看，通过才继续

## 9. 竖版 + 封面
- topic build/ 里按 pipeline/templates/ 改 vertical-bg.html、cover-video.html、thumb-169.html 的文案
- `python3 pipeline/video/make_vertical.py <topic>`（如尚未通用化则参照 golden topic 的 make_vertical.py）
- 封面纪律：深色底(#1E2A3A) > 白底；标题占 60%+；coral 强调关键词

## 10. 发布包 publish.md
标题（分平台）/ 正文 / tags / BGM 署名（Kevin MacLeod CC-BY 必带）/ 发布时间 18:30 / 数据观察点

## 已知约束与教训
- 声音定版：云希 zh-CN-YunxiNeural -5% + tts_map；不要用 multilingual 声线（外国腔已被否）
- edge-tts 每次输出时长有 ±1-2% 漂移；改音频后 durations.json 变 → 帧数要重算
- 制作精良度与流量弱相关；人格/比喻/选题强相关——别在画面上过度投入
