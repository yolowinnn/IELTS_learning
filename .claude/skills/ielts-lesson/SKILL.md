---
name: ielts-lesson
description: 把一次雅思课的素材(讲义 docx、真题 PDF、听力音频)做成 App/网页可用的「课程包」增量更新——听力能听、原卷题目能看能做、生词进 SRS、老师讲的技巧和同义替换进课程页。当用户说「我上完课了」「这是今天的课件」「data/2026xxxx 处理一下」「做个课程包」「更新到 App」时使用。
---

# 雅思课后增量更新流水线

一次课 → 一个 **lesson pack** → 网页立刻能用、装好的 APK 联网就能拿到。
用户只需要做一件事:**把这次课的所有文件丢进 `data/<YYYYMMDD>/`**。其余全部由这个技能完成。

## 输入约定(用户侧)

```
data/20260912/                      ← 文件夹名就是上课日期
  IELTS 18 T1 Lesson 1学生版.docx    ← 老师讲义/笔记(任意 .docx)
  IELTS 18 Test 1.pdf               ← 题目原卷(可以是扫描件)
  IELTS 18 autoscripts+answer.pdf   ← 原文脚本 + 标准答案
  *.mp3 / *.m4a                     ← 课上的音频(可选)
  照片.jpg                           ← 板书/纸质讲义拍照(可选)
```
文件叫什么名字都行,数量随意。剑桥真题音频若不在这个文件夹,去
`data/剑桥雅思/剑NN真题/剑桥雅思NN听力音频/Test N/Test N Part M.mp3` 找。

## 输出约定(标准格式)

```
www/packs/<pack-id>/pack.json        课程包本体(唯一事实来源)
www/packs/<pack-id>/assets/*         页图(.webp)+ 音频(.mp3)
www/packs/index.json                 自动生成:App 联网增量更新读它
www/data/packs.js                    自动生成:网页/APK 打包内置,离线可用
```
pack-id 一律 `lesson-YYYYMMDD`。字段说明见 `docs/lesson-pack-format.md`。

## 五步流程

### 1. 预处理(一条命令)
```bash
python3 tools/lesson/prep.py data/20260912 --date 2026-09-12
```
产出 `work/2026-09-12/`:讲义纯文本、每页 webp 页图、带页码的缩略拼版、`inventory.json`。

### 2. 读懂这次课
- 先读讲义文本(`work/<date>/text/*.txt`)。它决定**这次课讲了什么**:哪个 Test、哪个 Part、哪篇 Passage、老师强调的技巧、生词、课后作业。
- 再看缩略拼版 `pages/<pdf>/contact-1.jpg`,一次看清整本 PDF 的结构,定位:
  题目页 / 文章页 / 音频脚本页 / 答案页。只对需要的页用 Read 精读。
- **答案必须来自答案页**,不许凭记忆写。对完再和讲义里老师给的答案核对一遍;
  两者冲突时以官方答案页为准(讲义常有串行、笔误)。

### 3. 切素材
```bash
# 页图:--pages 是 PDF 物理页码(缩略拼版上的红色页码)
python3 tools/lesson/assets.py pages --src work/2026-09-12/pages/IELTS_18_Test_1 \
    --pages 2,3 --dest www/packs/lesson-20260912/assets --prefix listening-p2-q
# 音频:转单声道 64k,8 分钟约 3 MB;可选 --start/--end 裁剪
python3 tools/lesson/assets.py audio --src ".../Test 1 Part 2.mp3" \
    --dest www/packs/lesson-20260912/assets/listening-p2.mp3
```
命名规范:`<skill>-<part>-<用途><序号>.webp`,例如 `listening-p2-q1.webp`、
`reading-p1-text2.webp`、`listening-p2-script1.webp`。

### 4. 写 pack.json
照着 `www/packs/lesson-20260912/pack.json`(第一个包,当模板用)写。要点:

- **id 必须全局唯一且不与内置内容重名**:题目用 `l18t1p2` / `r18t1p1` 这种
  「剑桥册数+Test+Part」写法,单词用 `lv<YYMMDD>-NN`。build 脚本会检查冲突。
- **原文一律用页图,不要把剑桥文章/脚本重新打字进 JSON**。页图来自用户自己的
  PDF,是格式转换;整篇重打是复制。题干很短可以录入(为了能作答判分),
  正文、脚本靠 `sheets` / `transcriptSheets` 展示。
- **题型**:`mc`(单选,answer 是选项下标)、`multi`(选 TWO,answer 是下标数组,
  `marks: 2`,按选对个数给分)、`match`(A–G 配对,给 `bank` + 字母答案)、
  `gap`(填空,answer 给数组,把所有可接受写法都写上:`["1,000 kg","1000 kg"]`、
  `["flavour","flavor"]`、`["consumption","food consumption"]`)、`tfng` / `ynng`。
  `no` 填真题题号("11"、"14 & 15"),App 会照着显示。
- **每道题都要 explanation**:一句话说清答案在原文哪里 + 同义替换是什么。
  错误选项为什么错(尤其是「听到某个词就想选」的陷阱)写进 `tip`。
- **vocab**:从两处来 ——(a) 讲义里老师给的词;(b) 你自己扫这次的阅读/听力,挑出
  可迁移的学术词和搭配。每条要 `word/pos/ipa/def_en/def_zh/example/synonyms/topic`,
  例句用这次文章的语境重写(不要照抄原文整句)。
  **先查重**:`grep -ho 'word: *"[^"]*"' www/data/vocab*.js`,已有的词不要再收。
  课程词不写 `day`(默认 0),会自动排在每日新词队列最前面。
- **synonyms**:`{q: 题目里的说法, src: 音频/文章里的说法, note: 题号}`。
  这是听力阅读最值钱的产出,每道题至少一条。
- **notes**:老师讲的解题逻辑、长难句拆解、语法点、写作迁移。
- **homework**:老师布置的作业,逐条写成可勾选的一句话;把「盲听下一个 Part」
  这类作业顺手做成第二个 listening 条目(带 audio + 原卷),他才做得动。

### 5. 校验 + 安装 + 验收
```bash
node tools/lesson/build_pack.mjs www/packs/lesson-20260912/pack.json
```
校验 id 冲突、题型答案合法性、资源文件是否存在;通过后重建 index.json 和 data/packs.js。
然后本地起预览(`.claude/launch.json` 里的 `ielts`,端口 8080),至少确认:
听力能播、原卷页图能点开放大、全对能拿满分、单词页出现「🎓 本次课」分组。

改动已发布的包时:**必须把 `rev` 加 1**,否则装过的 App 不会重新下载。

### 6.(可选)资源挪到对象存储
音频占了一个包 75% 的体积。若用户已经开了 R2 桶,上传并瘦身:
```bash
CLOUDFLARE_API_TOKEN=... EXPECT_ACCOUNT_ID=... \
  bash tools/lesson/upload_assets.sh lesson-20260912 --prune
```
脚本会核对是**个人** Cloudflare 账号才动手,上传后把 `pack.json` 的 `assetBase` 指到线上、
删本地资源、重建索引。选型与一次性配置见 `docs/assets-hosting.md`。
没开桶就跳过这步,资源留在仓库里照常可用。

## 交付给用户的话

- 网页:`cd www && vercel deploy --prod --yes --scope ljw2556826312-6708s-projects`
  或 `CLOUDFLARE_API_TOKEN=... EXPECT_ACCOUNT_ID=... bash deploy_cloudflare.sh`。
  部署即生效,手机浏览器打开就能用。
- 已装的 APK:不用重装。开 App 2.5 秒后自动拉 `packs/index.json`;
  也可以在 Profile → Lesson packs → Check for new lessons 手动拉。
- 想让新包进 APK 离线内置:`bash build_apk.sh` 重新打包(不急,可以攒几次课一起打)。
- 完全离线的场合:把 `pack.json` 发给他,Profile → Import pack file 导入。

## 内容设计原则(为什么这么切)

课余时间提分,真正有效的是**窄而重的循环**,不是多听多做:

1. **原音 + 原卷**。用真人考试录音和真题原页做题,耳朵和眼睛都在真实难度上。
   TTS 朗读的自编材料适合打底,不适合逼近 7.5。
2. **同义替换是雅思的全部**。听力阅读的每一分都卡在「题目说法 ≠ 原文说法」。
   所以每个包强制产出 paraphrase pairs,并进 SRS 反复过。
3. **错因 > 分数**。每题写清陷阱类型(转折后才是答案、比较级要核对、重复词是诱饵),
   下次遇到同型题能提前设防。
4. **精听三遍法**:盲听做题 → 对脚本标转折/替换 → 跟读(shadowing)。作业里固定写进去。
   研究和考培实践都指向:看脚本复盘 + 听写/跟读,比单纯堆听力时长有效得多。
5. **词汇即刻进 SRS**。课上出现的词当天进队列(day 0 最优先),一周后自然到期复盘,
   而不是攒在笔记本里。
6. **每次课 45–60 分钟的可执行清单**,比「今天要多练听力」有用。homework 就是这张清单。

## 常见坑

- PDF 是扫描件(`pdftotext` 出 0 行)→ 只能看页图,别指望文字层。
- 页码有两套:PDF 物理页码(脚本用这个)和书上的印刷页码(答案页上写的是这个)。
  `--pages` 一律用物理页码。
- 剑桥真题一个 Test 的 4 个 Part 是 4 个独立 mp3,别把整场拼成一个文件。
- `data/` 没进 git(课件和真题不入库);`work/` 是中间产物,也不入库。
- 用户的 App 是纯静态前端,没有构建步骤:改完直接部署,不要引入打包器。
