# 罗曼森林创意播放器 Demo

移动端 H5 单页 Demo：播放音乐让 IP 树成长，生成分享卡并收集罗曼城玩偶。

页面默认采用“上半屏歌曲封面 + 下半屏原生播放器复刻”结构。点击“进入罗曼森林”后，上半屏切换为森林成长场景；成长详情、居民收藏和分享功能从森林状态继续进入，不改变原生播放器排版。

## 启动

```bash
pnpm install
pnpm assets
pnpm dev
```

打开 `http://localhost:5173/?demo=1` 可默认显示演示控制台。

## 音频

页面依次尝试：

1. `public/assets/audio/demo.m4a`
2. `public/assets/audio/demo.ogg`

音频不可用时会自动切换为计时演示模式。

当前歌曲文件仅用于本地创意 Demo 展示。对外部署或商业使用前，请替换为已取得完整授权的音频素材。

## 验证

```bash
pnpm lint
pnpm test
pnpm build
```
