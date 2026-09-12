# 课程包资源放哪:对象存储选型与落地

> 要解决的三件事:① 仓库别被音频撑大;② 剑桥扫描页不要直接挂在公开静态站上;
> ③ 国内手机上听力能正常拖进度。
> 一句话结论:**用个人 Cloudflare 账号开一个 R2 桶,桶设私有,通过站点自己的
> `/packs/*` 函数读**。代码已经写好,只差你开桶 + 绑定。

## ⚠️ 先确认站点在谁的账号下

2026-09-12 实测:这台 Mac 上存着一份 **公司账号** 的 wrangler OAuth
(`jiawei.li@industrialmind.ai` → `Inframanager@taomoai.com's Account`,
id `6de392b8...`,配置在 `~/Library/Preferences/.wrangler/config/default.toml`)。
而 `ielts75.pages.dev` 已经是活的。两者一对照,**这个 Pages 项目很可能就建在公司账号下**。

确认方法:用公司账号登录 dash.cloudflare.com → Workers & Pages,看有没有 `ielts75`。
有的话:删掉它,再用个人账号重新部署(`deploy_cloudflare.sh` 已做隔离)。
注意 `*.pages.dev` 子域名是全局唯一的,公司账号下的 `ielts75` 不删,个人账号就占不到同名。

### 脚本怎么保证不碰公司账号

两条都实测过:

1. 设了 `CLOUDFLARE_API_TOKEN` 时,wrangler **优先用它**,不会回落到本机的 OAuth
   (拿一个无效 token 试,wrangler 直接报 Invalid Authorization header,而不是改用 OAuth)。
2. 把 `XDG_CONFIG_HOME` 指到一个空目录,wrangler 就**完全看不到**本机的登录态
   (报 `You are not authenticated`)。macOS 上 wrangler 默认读 `~/Library/Preferences/.wrangler`。

`deploy_cloudflare.sh` 和 `tools/lesson/upload_assets.sh` 两条都用上了:
一次性空 config 目录 + 必须显式传 token + 传进来的 token 必须能访问你给的个人 Account ID,
对不上直接退出。

如果想彻底清掉本机的公司登录态(会影响你用 wrangler 干公司的活,自己权衡):
```bash
npx --yes wrangler@latest logout
```

## 规模

| 项 | 数值 |
|---|---|
| 单个课程包 | 约 8.3 MB(两段听力 6.3 MB + 九张页图 1.1 MB + pack.json 33 KB) |
| 每周一次课 | 一年约 430 MB |
| 其中音频占比 | 约 75% |

页图和 pack.json 都很小,真正需要挪走的是音频。

## 候选方案

| 方案 | 免费额度 | 国内可用性 | 要不要备案/实名 | 要不要绑卡 | 结论 |
|---|---|---|---|---|---|
| **现状:放 git 仓库** | — | 和站点一样 | 否 | 否 | 能用,但仓库一年胖 430 MB,且扫描页公开可抓 |
| **Cloudflare R2**(推荐) | 10 GB 存储、出网流量全免 | 和你现在的 pages.dev 一样 | 否 | **要**(免费额度内不扣费) | 同一个账号、同一个域名、可做私有,最省事 |
| 阿里云 OSS / 腾讯云 COS | 新用户有试用包,之后按量 | 国内最快 | **绑自有域名要 ICP 备案** | 要 | 默认域名会强制下载,`<img>`/`<audio>` 直接废掉,必须备案+绑域名才可用 |
| Firebase Storage(你已有项目) | 5 GB | 差,googleapis 常被墙 | 否 | **要**(Storage 现在必须 Blaze) | 音频流在国内基本没法听,不选 |
| Backblaze B2 + Cloudflare | 10 GB | 需要挂 Cloudflare 才免流量费 | 否 | 注册要卡 | 多一个厂商,没有比 R2 更优的地方 |

几个容易踩的点,已经替你确认过:

- **阿里云 OSS 默认域名会给图片/音频强制加 `Content-Disposition: attachment`**,浏览器只会下载不会播放。
  想正常内联播放,必须绑自定义域名;而国内地域的 Bucket 绑域名**要求域名已 ICP 备案**。
  也就是说走阿里云 = 走你文档里写的"路线 C",顺带把备案做了才划算。香港地域可以不备案,
  但那样速度优势没了,和现在没区别。
- **Cloudflare R2 免费额度要先在账号里存一张卡**才能开通,不超额不扣费。这是目前唯一的门槛。
- **Firebase Storage 从 2024 年 10 月起新桶必须升级到 Blaze(按量付费)**,免费额度还在,但一样要绑卡;
  更关键的是国内访问 Google 域名不稳,听力音频会转圈。

## 推荐做法:R2 + 站点自己的函数(私有桶)

```
手机/浏览器  →  https://ielts75.pages.dev/packs/lesson-20260912/assets/listening-p2.mp3
                                 │
                      functions/packs/[[path]].js   ← 已入库
                                 │  (R2 binding: PACKS)
                              r2://ielts-packs/packs/lesson-20260912/assets/...
```

这样做的好处:

1. **URL 不变**。App 里的地址还是 `packs/<id>/assets/x.mp3`,前端一行不用改。
2. **桶是私有的**。R2 桶不开公共访问,只有这个函数能读。想再加一层,把函数里加一句
   校验(比如要求带 Firebase 登录后的 token),扫描页就只有登录过的人能看。
3. **国内可用性不变**。资源和站点同一个域名、同一张 Cloudflare 网,你现在能开站就能听音频。
4. **不影响 Vercel 那份**。给 pack.json 写上 `assetBase`,两个站点共用同一个资源源。
5. **可回退**。函数里没绑桶就自动回落到仓库里的静态文件;哪天不想用了,把文件放回仓库即可。

### 落地步骤

**一次性(你在控制台做,约 10 分钟)**

1. Cloudflare Dashboard → R2 → 开通(这里会让你加支付方式)。
2. 建桶 `ielts-packs`,**不要**开 Public access。
3. My Profile → API Tokens → Create Token,权限选 `Account · Workers R2 Storage · Edit`,
   记下 token;Account ID 在 R2 页面右侧。
4. Pages 项目 `ielts75` → Settings → Functions → **R2 bucket bindings** →
   变量名填 `PACKS`,选桶 `ielts-packs` → 保存 → 重新部署一次。

**每次课(我来跑,一条命令)**

```bash
CLOUDFLARE_API_TOKEN=<个人token> EXPECT_ACCOUNT_ID=<个人account_id> \
  bash tools/lesson/upload_assets.sh lesson-20260912 --prune
```

脚本会:核对 token 属于个人账号(不是公司账号,和 `deploy_cloudflare.sh` 同一套保险)→
建桶(已存在则跳过)→ 按正确的 Content-Type 逐个上传 → 把 `pack.json` 的 `assetBase`
指到线上 → 删掉本地资源 → 重建索引。第一次可以先不加 `--prune`,线上验证没问题再瘦身。

**验证**

```bash
curl -I https://ielts75.pages.dev/packs/lesson-20260912/assets/listening-p2.mp3
# 期望:200、content-type: audio/mpeg、accept-ranges: bytes
curl -r 0-99 -s -o /dev/null -w '%{http_code}\n' \
  https://ielts75.pages.dev/packs/lesson-20260912/assets/listening-p2.mp3
# 期望:206(能拖进度)
```

## 不想绑卡怎么办

维持现状即可,功能完全一样,代价是仓库变大和扫描页公开。折中:

- **只发 APK,不上网站**:把 `www/packs/` 加进 `.gitignore` 之外的发布排除项,网站不带资源,
  APK 打包时带。缺点是网页版听不了课程包内容。
- **给站点加登录门禁**:Cloudflare Access 免费版可以给 `ielts75.pages.dev` 加一层邮箱验证,
  只有你的邮箱能进。这条不需要对象存储,10 分钟能配完,能解决"公网可抓"的问题,
  但解决不了仓库变大。

## 成本估算(按每周一包)

| 方案 | 一年存储 | 一年费用 |
|---|---|---|
| Cloudflare R2 | 0.43 GB(免费额度 10 GB) | 0 元 |
| 阿里云 OSS 标准存储 | 0.43 GB | 存储约 0.6 元;流量按 0.5 元/GB,自己听不了几 GB |

两边都便宜到可以忽略,差别在**门槛**:R2 要卡,OSS 要实名 + 备案。
