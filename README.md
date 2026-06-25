# 📝 Markdown 阅读器 — 手机版

一个可以**安装到手机上的** Markdown 文件查看器（PWA）。

别人发你 `.md` 文件 → 直接「分享到」这个应用 → 漂亮地显示出来。

## 功能

- 📂 打开本地 .md / .markdown / .txt 文件
- 📤 从微信/QQ/邮件等应用「分享」文件到本应用
- 🌙 深色/浅色模式切换
- 🎨 代码语法高亮（GitHub 风格）
- 📱 支持添加到手机主屏幕，像原生 App 一样
- 📶 离线可用（首次加载后缓存）
- 🖱️ 拖拽、粘贴都支持

## 🚀 部署到手机（3步）

### 第 1 步：上传到 GitHub Pages

1. 在 GitHub 新建一个仓库（例如 `md-viewer`）
2. 把本目录下所有文件上传到仓库根目录：
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon.svg`
3. 进入仓库 **Settings → Pages**
4. Source 选择 `main` 分支，点 **Save**
5. 等待几秒，你会得到一个网址，例如：
   ```
   https://你的用户名.github.io/md-viewer/
   ```

> ⚠️ **必须用 HTTPS**（GitHub Pages 自带），PWA 才能安装。

### 第 2 步：在手机上打开

用手机浏览器（Chrome / Safari）打开刚才那个网址。

### 第 3 步：添加到主屏幕

- **Android (Chrome):** 会自动弹出「添加到主屏幕」的提示，或点右上角 ⋮ → 添加到主屏幕
- **iPhone (Safari):** 点底部中间的分享按钮 → 「添加到主屏幕」

✅ 搞定！现在你的手机桌面上有一个「MD阅读器」App 了。

## 📱 使用方法

### 方式一：从其他应用分享过来
1. 微信/QQ/邮件中收到 .md 文件
2. 点文件 → 分享/用其他应用打开
3. 选择「MD阅读器」
4. 自动打开并渲染显示

### 方式二：在 App 内打开文件
1. 打开 MD 阅读器
2. 点右上角「📂 打开」
3. 选择手机上的 .md 文件

### 方式三：直接粘贴
1. 复制 Markdown 文本内容
2. 打开 MD 阅读器
3. 自动识别并渲染（长按页面粘贴）

## 🛠️ 其他部署方式

除了 GitHub Pages，也可以用：

- **Netlify:** 拖拽文件夹到 Netlify Drop
- **Vercel:** `vercel --prod`
- **任何静态托管:** 把文件放上去就行，不需要服务器
- **本地测试:** 在电脑上开 HTTP 服务器（比如 `npx serve .`），手机连同一 WiFi 用电脑 IP 访问

## 📋 技术栈

- 纯 HTML/CSS/JS，零依赖框架
- [marked.js](https://marked.js.org/) — Markdown 渲染
- [highlight.js](https://highlightjs.org/) — 代码高亮
- PWA Service Worker — 离线缓存 + 分享目标处理
