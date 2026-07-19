# 动画解说视频 Pipeline（POC · The Electric Parallel）

从口播稿到成片全自动，除画面素材外零付费依赖。1920s 复古印刷风全画幅动画，
HTML/CSS/SVG 确定性渲染（文字永不糊），Chrome 逐帧截屏 + ffmpeg 合成。

## 流程总览

```
storyboard.json ──┬─ edge-tts (云希) ──────────── audio/scene-NN.mp3 + durations.json
                  │      └ tts_map.json 把英文词换成中文说法（配音+字幕同步）
                  ├─ build/v5/scene-NN.html ───── 全画幅动画场景（seek(t) 纯函数）
                  │      ├ lib/anim-v4.js         动画库（walker/draw/flow/kf/camera）
                  │      └ lib/v5-atmo.js         氛围层（晕染/天际线/尘埃，自动注入）
                  ├─ capture-v5.js ────────────── Chrome 逐帧截屏 30fps → out/v5frames/
                  ├─ gen_strips.py ────────────── 品牌化字幕条（关键词染 coral）→ out/subs/
                  └─ assemble_v51.py ──────────── 冷开卡 + 转场 + BGM ducking + SFX
                                                  → out/master-v51.mp4
```

## 重跑命令

```bash
# 1. 配音（改稿/换音色后）
python3 -c "…edge-tts per scene…"        # 见 assemble 历史，或手动逐段

# 2. 帧捕捉（改场景后；只捕缺的，传场景号可单捕）
node capture-v5.js        # 全部
node capture-v5.js 5 12   # 指定场景

# 3. 字幕条（改稿/改关键词后）
python3 gen_strips.py

# 4. 成片
python3 assemble_v51.py   # → out/master-v51.mp4
```

## 关键设计决定
- **seek(t) 纯函数**：所有动画状态由 t 计算（禁 Date.now/random/CSS animation），
  逐帧截屏天然确定、可断点续拍
- **字幕即图层**：字幕条是 Chrome 渲染的透明 PNG，ffmpeg overlay 按时间窗叠加——
  不依赖 libass/drawtext，任何 ffmpeg build 都能跑
- **tts_map.json**：中文 TTS 读英文词发音怪 → 配音文本映射成中文说法，字幕同步，
  画面里的英文标牌保留（视觉装饰）
- **音效全合成**：assets/sfx/*.wav 由 ffmpeg 数学合成（whoosh/thud/pop/ding/riser/tear），
  零版权风险
- **BGM**：Covert Affair — Kevin MacLeod (incompetech.com) CC BY 4.0，发布须署名

## 版本史（out/，本地保留不入 git）
v1 静态卡片 → v2 +转场BGM → v3 +入场动画 → v4 全画幅动画舞台 →
v45 +音效 → v46 云希+中文化 → v5 +画面密度层 → **v51 终版**
（冷开卡/章节转场/BGM ducking/coral 关键词字幕）

## 已知改进方向（下一集再做）
- 系列角色 The Observer（报童帽小人贯穿全片）
- 配乐分段（爆发段换曲、金句留白）
- 真人配音（调研数据：AI 配音前 45 秒流失 +35%）
- 动画节拍与旁白的秒级对齐工具
