#!/usr/bin/env bash
# 安全部署到 Cloudflare Pages(个人账号)。
# 关键安全点:只用显式传入的 token;部署前先核对 token 归属账号,确认是个人账号才部署,
# 绝不使用机器上可能存在的公司 wrangler 登录态。
#
# 用法:
#   CLOUDFLARE_API_TOKEN=<个人账号token> EXPECT_ACCOUNT_ID=<个人account_id> bash deploy_cloudflare.sh
#
# 个人账号(2026-09-12 确认):Ljw2556826312@gmail.com's Account
#   EXPECT_ACCOUNT_ID=5cf6ad023efbef7a1da68509b1b0da1e
# 注意:本机 wrangler 存的是公司账号 OAuth,脚本已用一次性 XDG_CONFIG_HOME 隔离,不会误用。
set -euo pipefail
cd "$(dirname "$0")"

source "$(dirname "$0")/tools/cf_guard.sh"
cf_sandbox
cf_require_env
cf_verify_account

echo "▸ 部署 www/(含 functions/api 口语函数)到 Pages 项目 ielts75 …"
npx --yes wrangler@latest pages deploy www --project-name=ielts75 --branch=main --commit-dirty=true

echo
echo "▸ 完成。若口语 AI 考官要用,还需设置密钥(一次性,名字必须是 GEMINI_API_KEY):"
echo "  CLOUDFLARE_API_TOKEN=*** CLOUDFLARE_ACCOUNT_ID=${EXPECT_ACCOUNT_ID} \\"
echo "    XDG_CONFIG_HOME=\$(mktemp -d) npx --yes wrangler@latest pages secret put GEMINI_API_KEY --project-name=ielts75"
