# IELTS 7.5 · 8周冲刺 App — 工程进度

> 目标:8 周(约 56 天)从 B2 冲刺雅思 7.5。离线安卓 APP(APK 侧载,不上架)。
> 每天覆盖:背单词(SRS)+ 阅读 + 听力 + 写作 + 口语。

## 网页版 + 云同步(2026-06-06 起)
- **网页已上线**: https://ielts75.vercel.app(Vercel 个人账号 `ljw2556826312-6708s-projects/ielts75`,team_bL2ivoUdlQzOnqYZiwxszBAk;**禁用工作账号 industrial-mind-ai-team**)。部署:`cd www && vercel deploy --prod --yes --scope ljw2556826312-6708s-projects`。已关 Deployment Protection。
- **UI v3 清爽浅色**:旧 UI 被嫌丑两次,改浅色现代风(白底+靛蓝青),网页/App 共用 style.css。
- **登录+同步(代码就绪,待用户 Firebase 配置)**:firebase-config.js(占位)+ firebase-sync.js(Google 登录+Firestore,users/{uid} 存 JSON,跨设备智能合并;离线/未配置降级本地)。storage.js 加 onChange/snapshot/applyRemote。me.js 账户卡。app.js Sync.init()。
- **同步项目**:用户个人 Gmail(lynnzx88@gmail.com)新建 Firebase。待用户发 firebaseConfig → 填 firebase-config.js → 重部署 + 重打包 APK。
- **在线 AI/任务型**:下一阶段,AI 走公司 Vertex key 的 Vercel serverless 代理(www/api/),不内置 key。


## 课后增量更新流水线(2026-09-12 起)
上完课把文件丢进 `data/<YYYYMMDD>/` → 产出一个**课程包(lesson pack)** → 网页部署即生效、
已装 APK 联网自动拉取,不用重装。技能说明 `.claude/skills/ielts-lesson/SKILL.md`,
格式说明 `docs/lesson-pack-format.md`。

- 工具链:`tools/lesson/prep.py`(docx→文本、PDF→页图 webp+缩略拼版、音频探测)、
  `tools/lesson/assets.py`(挑页装包、音频转单声道 64k)、
  `tools/lesson/build_pack.mjs`(校验 id/题型/答案/资源 → 装进 www/packs → 重建 index.json 和 data/packs.js)
- 运行时:`www/js/packs.js`(内置 + 联网增量 + 手动导入,三条路合并进 IELTS_DATA)、
  `www/js/sheets.js`(原卷页图查看器,可缩放翻页)、`www/js/modules/lesson.js`(课程页)
- 题型扩展:`quiz.js` 加 `multi`(选 TWO,按选对个数给分)和 `match`(A–G 配对),支持 `marks` 分值制和真题题号 `no`
- 听力支持真人录音单文件播放(进度拖动/±10s/变速),阅读支持原卷页图;老的 TTS 内容照常工作
- 课堂生词 `day: 0` → 排在每日新词队列最前;Words 页按「🎓 哪节课」单独成组
- 首页出现「Latest class」卡片;Practice 新增「My classes」标签;Profile 可查更新/导入包/改内容服务器
- 首个包:`www/packs/lesson-20260912`(剑18 Test1:听力 P2 真题+P3 作业、阅读 P1、28 个生词、
  14 组同义替换、8 条作业),听力 10 分 / 阅读 13 分实测满分判定正确
- 第二个包:`www/packs/lesson-20260919`(第 2 节课 写作+口语:Task2「科学的首要目标」、
  Task1 折线图「四国城市化 1970-2040」带图表页图、口语 Part1 四步法 + Part2/3 食物题卡、
  17 个生词(34 条离线发音)、10 组同义替换、8 条作业)
- 为此扩了 writing 模块:条目支持 `sheets`(Task1 图表可点开放大)和 `chart_data`
  (AI 评分看不到图 → 把坐标数据一起发给 Gemini,才能核对数字准不准)

## 2026-09-12 本轮实做记录(部署 + 音频 + 打包)

### Cloudflare 归属问题(重要)
- 本机 `~/Library/Preferences/.wrangler/config/default.toml` 存的是**公司账号** OAuth
  (`jiawei.li@industrialmind.ai` → `Inframanager@taomoai.com's Account`)。
  任何 wrangler 命令不显式给 token 就会打到公司账号。
- 雅思站 `ielts75` 实际在**个人账号** `Ljw2556826312@gmail.com's Account`
  (`5cf6ad023efbef7a1da68509b1b0da1e`),六月底用 `wrangler login` OAuth 部署的,
  之后本机登录态被公司账号覆盖。线上那份停在 2026-06-28(字节比对确认 = commit 77cdabb)。
- 防护抽成 `tools/cf_guard.sh` + `tools/cf_verify.py`,两个 Cloudflare 脚本共用:
  ① 一次性空 `XDG_CONFIG_HOME` 沙箱,wrangler 完全看不到本机登录态;
  ② 必须显式传 token,缺了直接退出;
  ③ 核对 token 确实够得到指定的个人 Account ID,够不到就中止。
  实测:假 token 退出 2;真 token + 公司 Account ID 退出 3;真 token + 个人 ID 通过。

### 部署
- `bash deploy_cloudflare.sh` → https://ielts75.pages.dev 已更新到今天这版(829 个文件)。
- **Vercel 未部署**:本机 vercel CLI 登录的是公司账号 `jiawei-li-imai`(默认团队 industrial-mind-ai-team),
  个人 scope `ljw2556826312-6708s-projects` 报 scope does not exist。需个人账号 token 才能发,
  命令:`cd www && vercel deploy --prod --yes --token <个人token>`。
- 七月那批未提交的口语改动(WAV 录音 + 429 限速)已补提交并推 GitHub,main 与 origin/main 对齐。
- Functions 已编译(口语 `/api/gemini` + 新的 `/packs/*` R2 路由)。
- **待办**:口语 AI 考官还需设 `GEMINI_API_KEY`(个人 Gemini key,当前线上没有)。
- 已知限制:Cloudflare Pages 静态资源不支持 Range 请求(老的 `/audio/**` 也一样),
  听力音频整包返回。接上 R2 后 `functions/packs/[[path]].js` 会补上 206。

### 课程包发音(离线 TTS)
- 新增 `tools/lesson/gen_pack_audio.py`:用 macOS 自带英音 `Daniel` + ffmpeg,
  给课程包生词生成**单词 + 例句**两条 MP3(单声道 64k)。完全本机生成,
  不碰任何云服务、不花钱、不需要 key。
- lesson-20260912 的 28 个词 → 56 个音频,1.05 MB。pack.json 写入 `audio` / `audioEx`。
- 运行时:`AudioFX.speakVocab(w)` / `AudioFX.speakExample(w)` 优先放内置 MP3,
  没有再退回系统 TTS。闪卡三处发音(自动发音、🔊 单词、🔊 例句)都已接上。
- 改了已发布的包 → `rev` 升到 2,装过的 App 会自动重新下载。

### 听力循环播放(v1.9)
- 播放器加 Repeat:×1 / ×3 / ×5 / ×10 / ∞,每遍间隔 1.2s,徽章显示「loop n / N」。
- 跑满自动停并归位;间隔期内再点播放即中止循环。选择存 `Store('loopTimes')` 并纳入云同步。
- 对应精听三遍法:盲听做题 → 对脚本标同义替换 → 跟读。

### 打包
- `android/app/build.gradle` → versionCode 9 / versionName **1.8**,后升至 **1.9 / versionCode 10**(含循环播放)。
- `bash build_apk.sh` → `雅思7.5冲刺.apk` **40 MB**(课程包 70 个文件已内置,离线可用)。

## 技术栈
- 前端:原生 HTML/CSS/JS 单页应用(离线,数据内置为 JS 全局对象)
- 听力/发音:WebView 自带语音合成 TTS(`speechSynthesis`)
- 口语:每日主题 + 题卡 + 录音回放(MediaRecorder)+ 一键跳 Gemini
- 打包:Capacitor → 标准 Android 工程 → Gradle 出 APK
- 工具链:JDK 21 (`/opt/homebrew/opt/openjdk@21/...`) + Android SDK (`~/Library/Android/sdk`, platform android-35, build-tools 35.0.0)

## 阶段进度
- [x] P0 环境:Node/npm/brew;JDK21;Android SDK(platform 35+36, build-tools 35+36, platform-tools)
- [x] P1 应用外壳:index.html / style.css / 底部导航
- [x] P1 引擎:storage / tts / srs / plan / quiz
- [x] P2 页面模块:dashboard / vocab / reading / listening / writing / speaking / practice / me + app.js(浏览器验证通过,无报错)
- [x] P4 Capacitor 接入 + 出 APK → **雅思7.5冲刺.apk (4.0M, v1.0)** 已生成
- [x] P5 安装说明(安装与使用说明.md)+ 交付 v1
- [ ] P3 内容数据(进行中):v1.1 已覆盖约前 3 周。后续迭代补全 4-8 周
  - 单词:已 190 (v001-v190, day1-19) / 目标 ~650-900
  - 阅读:已 5 篇 40题 / 目标 ~18-24
  - 听力:已 5 段 30题 / 目标 ~18-24
  - 写作:已 8 / 目标 ~16
  - 口语:已 8 / 目标 ~16-24
- [ ] 每补一批内容 → 重新 `bash build_apk.sh` 出新 APK 给用户覆盖安装(进度本地保存不丢)

### 内容文件结构(扩展用 push,新批次新建文件并在 index.html 注册)
- 基础:data/{vocab,reading,listening,writing,speaking,plan}.js
- 第2批:data/{vocab_b2,vocab_b3,vocab_b4,reading_b2,listening_b2,writing_b2,speaking_b2}.js
- 下一批用 _b5.. 等命名,vocab 续 v191+ / day20+,reading r006+,listening l006+,writing w009+,speaking s009+
- 校验脚本逻辑见 /tmp/validate.js(检查重复ID、字段、题目答案合法性)
- 可用子代理并行生成(general-purpose),严格指定格式+ID区间+双引号+自跑 node --check

### 版本
- v1.0 (versionCode 1):第1周内容,已交付
- v1.1 (versionCode 2):约前3周内容(单词190等)
- v1.2 (versionCode 3):**UI 大改版**(渐变Hero、技能配色图标、3D翻转闪卡、玻璃卡片、发光按钮、判分✓✗动效、彩屑庆祝、过场动画)+ 修复4个bug(写作计时器泄漏/听力TTS离开续播/口语计时器与麦克风未释放/子页顶栏标题);内容同 v1.1

- v1.3 (versionCode 4):**云端离线音频**(打包时用 Vertex/Cloud TTS 生成英音 MP3 内置,手机不依赖系统语音引擎;key 只在本机) + **词库 190→342 唯一词**(新增 C1-C2 难词 v191-v410,自动去重)+ 每日新词默认 12→20 + 新词不再硬性按天锁
  - 音频流水线:`node tools/gen_audio.mjs`(google-auth-library 取 token → Cloud TTS,带缓存),输出 www/audio/ + www/data/audio_index.js
  - 播放器:www/js/audioplayer.js(优先内置 MP3,缺失退回系统 TTS);vocab/listening 已接入
  - Vertex SA key:/Users/jiaweili/main_folder/projects/imdatamgmt/im-drawing-462011-cc19ce1b6850.json(项目 im-drawing-462011)

### 待办(本次 /loop 续作)
- [x] UI design-review 第一轮:首页 Hero 大环改为「今日完成度」+ 底部总进度细条 + 文案分隔符 + 任务状态 pill(还差X项)。预览改无缓存服务器(tools/devserver.mjs)
- [~] 在线 AI:portal = https://imapps-portal.vercel.app,/api/vertex 接 {model,messages}(OpenAI风格→Vertex Gemini)。**阻塞**:① 生产环境缺 VERTEX_KEY_JSON(返回500),需用户在 Vercel→Settings→Environment Variables 配置 SA key 并 redeploy;② 无 CORS → App 端用 CapacitorHttp(原生请求绕过)。等用户配好 key 后再接。
- [ ] 联网内容更新:App 从远程拉新词包/题包(可挂同一 portal 或静态托管)
- [x] 补 4-8 周内容:b3+b4 两批。现总计 **阅读11篇88题 / 听力11段66题(全配音频) / 写作16 / 口语16 / 单词342**(v1.7)。内容已接近全8周满量。
- [ ] (可放缓)再加内容深度 / UI 第二轮(底部导航 SVG 图标)/ 联网内容包下载——等用户反馈再定优先级

### 已知小事项 / 后续
- 内容仍需补全 4-8 周(单词 v311+ / day32+ 等),用子代理批量生成 + 校验 + 重打包
- 真机注意:听力TTS依赖系统语音引擎;口语录音首次需授权麦克风
- UI 交互清理机制:App.onLeave(fn) 注册离开页面的清理(定时器/录音);go()/open() 自动执行

## 打包命令
`bash build_apk.sh`(自动 cap sync + gradlew assembleDebug + 复制到 雅思7.5冲刺.apk)
环境:JAVA_HOME=/opt/homebrew/opt/openjdk@21/...,ANDROID_HOME=~/Library/Android/sdk

## 内容规模目标
- 单词:8周 × 7天 × ~12词 ≈ 650-900 词(AWL 学术词 + 雅思分话题词),SRS 调度
- 阅读:每周 2-3 篇学术风格文章 + 题(T/F/NG、配对、选择、填空)
- 听力:每周 2-3 段脚本(对话/讲座),TTS 朗读 + 题,可调语速
- 写作:Task1(图表/流程/地图)+ Task2(议论文),范文 + 结构模板 + 句型 + 评分自查
- 口语:Part1/2/3 主题、题卡、范例、句型;每日口语主题 + 跳 Gemini

## 给用户的下一步(做完后)
见交付时生成的 README / 安装说明。
