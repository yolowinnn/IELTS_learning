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

# 本文件所在目录(无论从哪里 source 都能找到同级的 cf_verify.py)
CF_GUARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"

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

cf_verify_account() {
  echo "▸ 核对 token 归属(防止误用公司账号)…"
  python3 "$CF_GUARD_DIR/cf_verify.py" || exit $?
}

