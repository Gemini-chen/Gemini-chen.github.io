# 陈靖明 · 个人作品集网站

纯静态站点，零构建步骤、零第三方依赖。线上地址：<https://gemini-chen.github.io/>

## 目录结构

| 路径 | 说明 |
| --- | --- |
| `index.html` | 单页结构：Hero / 关于我 / 6 个精选项目 / 两段并列实机演示 / 项目图集（分组轮播） / 个人优势 / 联系页尾 |
| `assets/css/style.css` | 全部样式，设计变量集中在 `:root` |
| `assets/js/main.js` | 导航、滚动动效、项目详情弹层、双视频播放器、分组轮播与灯箱；`PROJECTS` 数组集中管理项目文案 |
| `assets/img/` | 头像、6 张项目技术示意图、两段视频封面、ROS2 实验曲线与 rqt 节点图、麦轮小车四层板 / 电源板 PCB、远程 IO 板卡与 Modbus 实测、机械臂节点图 / CAD / 协议帧 |
| `assets/video/ros2-obstacle-avoidance.mp4` | ROS2 避障小车实机演示（01:46，1280×720，H.264 + AAC，14.0MB） |
| `assets/video/arm-motion-demo.mp4` | 机械臂 MoveIt2 逆解与轨迹规划运行实录（00:50，1280×720，H.264 + AAC，36.9MB） |
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

## 项目图集（分组轮播）

`#gallery` 下每个 `<section class="gset" data-gset="N">` 对应一个项目，顺序与项目卡片一致（0–5）：无人机 / 麦轮小车 / ROS2 无人车 / 远程 IO / STM32 机械臂遥控 / MoveIt2 运动学逆解。全站共 6 组 21 张图。组内每个 `<figure class="gslide">` 是一张图，标题、说明、规格写在 `data-no`、`data-title`、`data-desc`、`data-note` 上，`img` 必须带真实 `width` / `height`。

新增图片：复制到 `assets/img/`（用英文文件名）→ 在对应组的 `.gset__stage` 内追加一个 `gslide` → 更新 `data-gset-total` 和项目卡片「▦ 项目图集 NN 图」的文案。分页点与计数器由 JS 自动生成。

交互：点击图片两端 `‹ ›` 箭头翻页（循环）、点分页点跳图、键盘左右键、移动端左右滑动；点击图片打开灯箱，灯箱内同样支持左右翻页，Esc / 点遮罩关闭。单图组的箭头自动禁用。

## 注意事项

- 站内资源全部使用 `assets/...` 相对路径，不要改成 `/assets/...`。
- **不要给图片加 `loading="lazy"`**：本项目的预览环境里懒加载会显示为空框，全部图片直接加载（合计约 2.6MB）。
- 两段视频合计约 51MB，单文件最大 36.9MB，低于 GitHub 单文件 100MB 限制；**不要用 Git LFS 存储**，Pages 不解析 LFS 指针。
- 视频保持 H.264 + AAC，换成 HEVC/H.265 会导致部分浏览器无法播放。
- 播放器使用 `preload="none"` + 自定义封面，点击后才加载视频，不影响首屏性能；播放其中一段会自动暂停另一段。
- 实机演示区为两张 `.demo-card` 并列，锚点分别是 `#demo-ros` / `#demo-arm`；项目弹层通过 `PROJECTS[i].demo` 决定演示链接。
