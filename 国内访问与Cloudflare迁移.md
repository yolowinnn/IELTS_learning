# 国内访问 + 迁移 Cloudflare 落地指南

> 目标:让网页国内也能稳定访问。现状:站点在 Vercel(https://ielts75.vercel.app)。

## 一句话结论
- `*.vercel.app` 与 Cloudflare 免费的 `*.pages.dev` **在中国大陆都常被墙/限速**,光迁到 Cloudflare Pages **不保证**国内能开。
- **真正稳的国内访问 = 自有域名 +(最好)ICP 备案**。下面三条路按"省事→最稳"排序。

---

## 路线 A:迁到 Cloudflare Pages(你要的第一步,我来做)
**需要你给我:**个人 Cloudflare 的 **API Token**(My Profile → API Tokens → 模板「Edit Cloudflare Pages」,Account 选**个人**)+ 个人 **Account ID**。

我拿到后执行(脚本已入库 `deploy_cloudflare.sh`,部署前会先核对 token 属于哪个账号、确认是个人号才部署):
```bash
CLOUDFLARE_API_TOKEN=<你的token> EXPECT_ACCOUNT_ID=<个人account_id> bash deploy_cloudflare.sh
# 口语功能再设密钥:
npx wrangler pages secret put VERTEX_SA_KEY --project-name=ielts75
```
得到 `https://ielts75.pages.dev`。**注意:.pages.dev 国内仍可能打不开**,它主要是为下一步绑自有域名做准备。

## 路线 B:自有域名 + Cloudflare(较快,国内"时好时坏")
1. 买个域名(阿里云/Namesilo 等)。
2. 域名 NS 指到 Cloudflare;在 Pages 项目里 **Custom domains** 绑定它。
3. 比 .pages.dev 好些,但 Cloudflare 在中国无企业级节点,仍可能慢/偶尔不通。

## 路线 C:自有域名 + ICP 备案 + 国内托管(**最稳,国内秒开**)
1. 买**国内可备案**的域名(阿里云/腾讯云)。
2. 做 **ICP 备案**(实名,约 1–2 周;静态站点用对象存储/轻量服务器即可备案)。
3. 把 `www/` 静态文件传到**国内对象存储 + CDN**(阿里云 OSS+CDN / 腾讯云 COS+CDN)。
4. 口语 AI 的 `/api/gemini` 放一个海外/可访问 Google 的函数(Cloudflare Functions 或自有服务器),前端跨域调它。
- 这是面向国内用户**真正可靠**的方案,代价是备案周期。

---

## 我的建议
先走 **A**(你给 token 我立刻部署),同时你决定要不要买域名:
- 只给你自己/小范围用 → A 或 B 够了(配合科学上网)。
- 要给**大量国内用户**用 → 必须 **C(备案)**,我可以帮你把静态站打包、配好 CDN、把 API 跨域接好。

> 登录方式:已加**邮箱注册/登录**(Google 之外)。需你在 Firebase 控制台 `ielts-study` → Authentication → Sign-in method → 启用 **Email/Password**,即生效。
