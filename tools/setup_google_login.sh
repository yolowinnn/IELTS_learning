#!/usr/bin/env bash
# 一键打通「App 原生谷歌登录」。前提:你已运行过一次  npx firebase-tools login  (用你个人谷歌账号)
# 然后直接:  bash tools/setup_google_login.sh
set -e
cd "$(dirname "$0")/.."

PROJECT="ielts-study-9a0f5"
PKG="com.ielts.study"
SHA1="BDFB04D82F801E05E91986D901DDAA1468C48589"        # debug 签名 SHA-1(无冒号)
SHA256="655C311A72C282E582AA359AE3B23872DF30D319A7854BFE6C7666262FD86397"  # debug SHA-256
FB="npx --yes firebase-tools"

echo "▸ 检查 firebase 登录状态…"
if ! $FB login:list 2>/dev/null | grep -qiE "@"; then
  echo "❌ 还没登录。请先运行一次(会打开浏览器,用你个人谷歌账号授权):"
  echo "     npx firebase-tools login"
  exit 1
fi

echo "▸ 查找/创建 Android 应用 ($PKG) …"
APPID=$($FB apps:list ANDROID --project "$PROJECT" 2>/dev/null | grep -oE "1:[0-9]+:android:[a-zA-Z0-9]+" | head -1 || true)
if [ -z "$APPID" ]; then
  $FB apps:create ANDROID "IELTS 7.5 Android" --package-name "$PKG" --project "$PROJECT" || true
  APPID=$($FB apps:list ANDROID --project "$PROJECT" 2>/dev/null | grep -oE "1:[0-9]+:android:[a-zA-Z0-9]+" | head -1 || true)
fi
[ -z "$APPID" ] && { echo "❌ 没拿到 Android App ID,请把上面输出发我"; exit 1; }
echo "  App ID = $APPID"

echo "▸ 注册签名指纹 SHA-1 / SHA-256(已存在会跳过)…"
$FB apps:android:sha:create "$APPID" "$SHA1"   --project "$PROJECT" 2>/dev/null || echo "  (SHA-1 可能已存在,跳过)"
$FB apps:android:sha:create "$APPID" "$SHA256" --project "$PROJECT" 2>/dev/null || echo "  (SHA-256 可能已存在,跳过)"

echo "▸ 下载 google-services.json → android/app/ …"
$FB apps:sdkconfig ANDROID "$APPID" --project "$PROJECT" --out android/app/google-services.json
[ -s android/app/google-services.json ] || { echo "❌ 配置文件没下到"; exit 1; }
echo "  ✓ android/app/google-services.json 就位"

echo "▸ 重新打包(启用谷歌登录)…"
bash build_apk.sh

echo ""
echo "✅ 完成!谷歌登录已打通。装上新的『雅思7.5冲刺.apk』,用你原来的谷歌账号登录,"
echo "   网页端的云端学习进度会自动同步回 App。"
