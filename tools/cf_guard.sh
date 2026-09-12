#!/usr/bin/env bash
# cf_guard.sh — Cloudflare 操作前的两道保险,供 deploy_cloudflare.sh / upload_assets.sh 引用。
#
# 保险一:隔离本机 wrangler 登录态。这台 Mac 上存着公司账号的 OAuth
#        (~/Library/Preferences/.wrangler/config/default.toml)。把 XDG_CONFIG_HOME 指到
#        一次性空目录,wrangler 就完全看不到它。
#        实测:空目录时 wrangler 报 "You are not authenticated";设了 CLOUDFLARE_API_TOKEN
#        时 wrangler 优先用它,不会回落到 OAuth。
# 保险二:核对 token 确实能访问你指定的【个人】Account ID,访问不到就中止。
#        token 权限不足以列账号列表时,改用对该账号的直接探测(同样能证明归属)。
#
# 用法(在调用脚本里):
#   source "$(dirname "$0")/tools/cf_guard.sh"   # 或相对路径
#   cf_sandbox
#   cf_require_env
#   cf_verify_account

cf_sandbox() {
  CF_SANDBOX="$(mktemp -d)"
  export XDG_CONFIG_HOME="$CF_SANDBOX"
  trap 'rm -rf "$CF_SANDBOX"' EXIT
}

cf_require_env() {
  # 显式检查 + exit,不依赖 ${VAR:?}(它在函数里不保证把整个脚本带退出)
  if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
    echo "❌ 没给 CLOUDFLARE_API_TOKEN。必须显式传【个人账号】的 token,否则 wrangler 会去用本机存的公司 OAuth。"
    exit 2
  fi
  if [ -z "${EXPECT_ACCOUNT_ID:-}" ]; then
    echo "❌ 没给 EXPECT_ACCOUNT_ID。必须写明要操作哪个【个人】账号,用于核对。"
    exit 2
  fi
  export CLOUDFLARE_ACCOUNT_ID="${EXPECT_ACCOUNT_ID}"   # 明确指定账号,wrangler 不会自己挑
}

cf_api() {
  curl -s -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
       -H "Content-Type: application/json" "https://api.cloudflare.com/client/v4$1"
}

cf_verify_account() {
  echo "▸ 核对 token 归属(防止误用公司账号)…"

  # token 先自检:无效直接退出
  if ! cf_api "/user/tokens/verify" | grep -q '"success":true'; then
    echo "❌ token 无效或已被吊销。"; exit 2
  fi

  # 首选:列出 token 能访问的账号
  local resp
  resp="$(cf_api "/accounts")"
  if echo "$resp" | grep -q '"success":true'; then
    echo "$resp" | python3 - "$EXPECT_ACCOUNT_ID" <<'PY'
import sys, json
expect = sys.argv[1]
d = json.load(sys.stdin)
accts = d.get("result", [])
for a in accts:
    print(f"   账号:{a.get('name')}  id={a.get('id')}")
if expect not in [a.get("id") for a in accts]:
    print(f"❌ 期望的个人账号 {expect} 不在该 token 的可访问范围内——已中止。")
    sys.exit(3)
print(f"✅ 核对通过:只操作 {expect}")
PY
    return $?
  fi

  # 退路:token 权限不含「列账号」时,直接探测目标账号可达性
  echo "   (token 无列账号权限,改用直接探测)"
  if cf_api "/accounts/${EXPECT_ACCOUNT_ID}/pages/projects?per_page=1" | grep -q '"success":true'; then
    echo "✅ 核对通过:token 可访问 ${EXPECT_ACCOUNT_ID},后续操作全部显式指向该账号"
    return 0
  fi
  echo "❌ 这个 token 访问不了账号 ${EXPECT_ACCOUNT_ID}——已中止,绝不拿它去碰别的账号。"
  exit 3
}
