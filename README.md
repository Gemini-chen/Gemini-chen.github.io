# 陈靖明 · 个人作品集网站

纯静态站点，零构建步骤、零第三方依赖。线上地址：<https://gemini-chen.github.io/>

## 目录结构

| 路径 | 说明 |
| --- | --- |
| `index.html` | 单页结构：Hero / 关于我 / 精选项目 / 实机演示 / 个人优势 / 联系页尾 |
| `assets/css/style.css` | 全部样式，设计变量集中在 `:root` |
| `assets/js/main.js` | 导航、滚动动效、项目详情弹层、视频播放器；`PROJECTS` 数组集中管理项目文案 |
| `assets/img/` | 头像、三张项目技术示意图、视频封面 |
| `assets/video/ros2-obstacle-avoidance.mp4` | ROS2 避障小车实机演示（1280×720，H.264 + AAC） |
| `.nojekyll` | 让 GitHub Pages 跳过 Jekyll，直接分发静态文件 |
| `tools/serve.py` | 本地预览服务器，支持 HTTP Range |

## 本地预览

**不要**直接用 `python -m http.server`：它不支持 Range 请求，视频拖动进度条会失效。
请使用随仓库提供的预览服务器：

```bash
python3 tools/serve.py          # http://127.0.0.1:4173/
python3 tools/serve.py 8080     # 自定义端口
```

## 更新与发布

本仓库是 GitHub Pages 的**用户站点**仓库（`<用户名>.github.io`），静态文件放在 `main` 分支根目录即会发布。

1. 修改 `portfolio/` 下的文件，同步到本仓库根目录；
2. `git add -A && git commit -m "描述本次改动"`；
3. `git push origin main`；
4. 等待 1–3 分钟，强刷（Ctrl+F5）查看最新效果。

Pages 设置：**Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**。

## 注意事项

- 站内资源全部使用 `assets/...` 相对路径，不要改成 `/assets/...`。
- 视频体积约 14MB，低于 GitHub 单文件 100MB 限制；**不要用 Git LFS 存储**，Pages 不解析 LFS 指针。
- 视频保持 H.264 + AAC，换成 HEVC/H.265 会导致部分浏览器无法播放。
- 播放器使用 `preload="none"` + 自定义封面，点击后才加载视频，不影响首屏性能。
