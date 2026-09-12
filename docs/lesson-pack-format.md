# 课程包格式(lesson pack v1)

一次课的全部学习内容,打成一个 JSON + 一组资源文件。App 和网页用同一份。

```
www/packs/lesson-20260912/
  pack.json                 ← 内容
  assets/
    listening-p2.mp3        ← 真题录音(单声道 64k)
    listening-p2-q1.webp    ← 原卷题目页
    reading-p1-text1.webp   ← 原卷文章页
    listening-p2-script1.webp ← 原文脚本页
www/packs/index.json        ← 自动生成的目录,App 联网更新读它
www/data/packs.js           ← 自动生成,打包内置(离线)
```

生成命令:`node tools/lesson/build_pack.mjs www/packs/<id>/pack.json`

## 顶层字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `packVersion` | ✓ | 格式版本,当前 `1` |
| `id` | ✓ | `lesson-YYYYMMDD`,全局唯一 |
| `rev` | ✓ | 整数,从 1 开始。**改内容必须 +1**,否则已安装的 App 不会更新 |
| `date` | ✓ | 上课日期 `YYYY-MM-DD` |
| `title` | ✓ | 课程标题,如 `Class 1 · Cambridge 18 Test 1` |
| `source` |  | 来源标注,显示在每条内容上 |
| `assetBase` |  | 资源(音频/页图)的根地址。留空=跟 pack.json 放一起;填绝对地址=托管在对象存储(见 `docs/assets-hosting.md`) |
| `summary` |  | 一段话说明这次课做了什么 |
| `listening` / `reading` / `writing` / `speaking` / `vocab` |  | 内容数组,直接并进 `IELTS_DATA` 对应集合 |
| `notes` |  | `[{t, d}]` 课堂要点 |
| `synonyms` |  | `[{q, src, note}]` 题目说法 ≈ 原文说法 |
| `homework` |  | 字符串数组,课后作业清单(可勾选,进度会云同步) |

## listening 条目

```jsonc
{
  "id": "l18t1p2",                    // 不能和内置内容重名
  "title": "Becoming a volunteer for ACE",
  "section": "Part 2 · Cambridge 18 Test 1",
  "scenario": "Talk to a group of new volunteers",
  "audio": "assets/listening-p2.mp3", // 相对包目录;有它就用真实录音播放器
  "sheets":            [{"src": "assets/listening-p2-q1.webp", "label": "Questions 11–15"}],
  "transcriptSheets":  [{"src": "assets/listening-p2-script1.webp", "label": "Audioscript"}],
  "markers": [{"t": 65, "label": "Q11"}],   // 可选:音频章节跳转
  "instructions": "Questions 11–13: choose A, B or C…",
  "questions": [ /* 见下 */ ],
  "notes": [{"t": "标题", "d": "内容"}]
}
```
没有 `audio` 时退回原有的 TTS 逐句朗读(需要 `lines: [{speaker, text}]`)。

## reading 条目

同上,区别是:文章页图放 `sheets`,题目页图放 `questionSheets`;
纯文字文章用 `paras: ["段落1", ...]`(原创内容走这条路)。

## 题目类型

| type | 数据 | 判分 |
|---|---|---|
| `mc` | `options: []`,`answer` = 选项下标 | 对=满分 |
| `multi` | `options: []`,`answer: [下标…]`,`pick`,`marks` | 每选对一个得 1 分 |
| `match` | `bank: [{k:"A", t:"选项文字"}]`,`answer: "B"` | 对=满分 |
| `gap` | `answer: ["写法1","写法2"]` | 忽略大小写/逗号/空格差异 |
| `tfng` | `answer: "TRUE"/"FALSE"/"NOT GIVEN"` | 对=满分 |
| `ynng` | `answer: "YES"/"NO"/"NOT GIVEN"` | 对=满分 |

公共字段:`no`(真题题号,显示用)、`marks`(默认 1)、`explanation`(答案在哪、同义替换是什么)、`tip`(陷阱/技巧)。

## vocab 条目

```jsonc
{
  "id": "lv260912-01",          // lv<YYMMDD>-NN
  "word": "intensive farming",
  "pos": "n.", "ipa": "/ɪnˈtensɪv ˈfɑːmɪŋ/",
  "def_en": "…", "def_zh": "集约农业",
  "example": "…", "synonyms": "…", "topic": "Environment"
}
```
不写 `day` → 默认 0 → 排在每日新词队列最前面,当天就会出现在闪卡里;
在 Words → Browse by day 里单独成组(🎓 + 上课日期)。

## App 怎么拿到新包(三条路,同一份数据)

1. **打包内置** — `data/packs.js`。网页每次部署自动最新;APK 重新打包后离线可用。
2. **联网增量** — App 启动 2.5 秒后静默拉 `<站点>/packs/index.json`,发现新包或
   `rev` 变大就下载 `pack.json` 存进 localStorage。老 APK 不用重装。
   站点地址:网页版用同源;APK 默认 `https://ielts75.pages.dev`,可在 Profile 里改。
3. **手动导入** — Profile → Lesson packs → Import pack file,选一个 `pack.json`。
   完全离线;此时页图/音频按 `assetBase` 或默认站点取。

三条路都汇进 `js/packs.js` 的同一个合并函数:内容并进 `window.IELTS_DATA`,
题目进 Practice,单词进 SRS,课程页在 Practice → My classes。
