# IELTS 7.5 学习平台

8 周从 B2 冲刺雅思 7.5。**网页 + 安卓 App**,进度云同步,每日任务型学习。

🌐 **网页**:https://ielts75.vercel.app
📱 **安卓**:`bash build_apk.sh` 生成 APK 侧载安装

## 功能
- 🗂️ 单词 SRS 闪卡(342 词,C1–C2,云端英音 MP3 发音)
- 📖 阅读 / 🎧 听力(宽屏文章+题目同屏,听力内置音频)
- ✍️ 写作 / 🗣️ 口语(范文、句型、录音、AI 批改提示词)
- 📅 8 周计划 + 每日五项任务打卡 + 连续天数
- ☁️ Google 登录,网页/App 进度 Firestore 同步

## 技术
- 前端:原生 HTML/CSS/JS 单页应用(`www/`),清爽浅色绿主题
- 同步:Firebase Auth(Google) + Firestore
- 音频:打包时用 Google Cloud TTS 预生成,内置离线播放
- 打包:Capacitor → Android APK
- 部署:Vercel(根目录 `www`,推送自动部署)

## 开发
```bash
# 本地预览
node tools/devserver.mjs        # http://localhost:8080
# 重新生成音频(需 Vertex/Cloud TTS key)
node tools/gen_audio.mjs
# 打包安卓
bash build_apk.sh
```
