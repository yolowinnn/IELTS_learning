#!/usr/bin/env bash
# 安全部署到 Cloudflare Pages(个人账号)。
# 关键安全点:只用显式传入的 token;部署前先核对 token 归属账号,确认是个人账号才部署,
# 绝不使用机器上可能存在的公司 wrangler 登录态。
#
# 用法:
#   CLOUDFLARE_API_TOKEN=<个人账号token> EXPECT_ACCOUNT_ID=<个人account_id> bash deploy_cloudflare.sh
set -euo pipefail
cd "$(dirname "$0")"

# ── 隔离本机已有的 wrangler 登录态 ─────────────────────────────────────────
# 这台 Mac 上存着一份公司账号的 OAuth(~/Library/Preferences/.wrangler)。
# 把 XDG_CONFIG_HOME 指到一次性空目录,wrangler 就完全看不到它;
# 再配合下面必须显式传入的 CLOUDFLARE_API_TOKEN,不可能误用公司账号。
# (实测:XDG_CONFIG_HOME 指向空目录时 wrangler 报 "You are not authenticated";
#  设了 CLOUDFLARE_API_TOKEN 时 wrangler 优先用它,不回落到 OAuth。)
WRANGLER_SANDBOX="$(mktemp -d)"
export XDG_CONFIG_HOME="$WRANGLER_SANDBOX"
trap 'rm -rf "$WRANGLER_SANDBOX"' EXIT

: "${CLOUDFLARE_API_TOKEN:?必须提供个人账号的 CLOUDFLARE_API_TOKEN}"
: "${EXPECT_ACCOUNT_ID:?必须提供期望的【个人】Account ID(EXPECT_ACCOUNT_ID),用于核对}"

echo "▸ 核对 token 所属账号(防止误用公司账号)…"
RESP=$(curl -s -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" "https://api.cloudflare.com/client/v4/accounts")
echo "$RESP" | python3 - "$EXPECT_ACCOUNT_ID" <<'PY'
import sys, json
expect = sys.argv[1]
d = json.load(sys.stdin)
if not d.get("success"):
    print("❌ token 无效或无权限:", json.dumps(d.get("errors"))[:200]); sys.exit(2)
accts = d.get("result", [])
for a in accts:
    print(f"   账号:{a['name']}  id={a['id']}")
ids = [a["id"] for a in accts]
if expect not in ids:
    print(f"❌ 期望的个人账号 {expect} 不在该 token 可访问的账号里——已中止,绝不部署到别的账号。")
    sys.exit(3)
print(f"✅ 核对通过:将只部署到 {expect}")
PY

echo "▸ 部署 www/(含 functions/api 口语函数)到 Pages 项目 ielts75 …"
export CLOUDFLARE_ACCOUNT_ID="${EXPECT_ACCOUNT_ID}"
npx --yes wrangler@latest pages deploy www --project-name=ielts75 --branch=main --commit-dirty=true

echo
echo "▸ 完成。若口语要用,还需设置密钥(一次性):"
echo "  CLOUDFLARE_API_TOKEN=*** CLOUDFLARE_ACCOUNT_ID=${EXPECT_ACCOUNT_ID} npx wrangler pages secret put VERTEX_SA_KEY --project-name=ielts75"
