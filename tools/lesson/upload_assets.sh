#!/usr/bin/env bash
# 把一个课程包的音频/页图传到【个人】Cloudflare R2 桶,让它们不再进 git 仓库。
#
# 安全点(和 deploy_cloudflare.sh 一致):只用显式传入的 token,上传前先核对 token 属于哪个账号,
# 确认是个人账号才动手;绝不使用机器上可能存在的公司 wrangler 登录态。
#
# 用法:
#   CLOUDFLARE_API_TOKEN=<个人token> EXPECT_ACCOUNT_ID=<个人account_id> \
#     bash tools/lesson/upload_assets.sh lesson-20260912
#
#   加 --prune 会在上传成功后删掉本地资源、把 pack.json 的 assetBase 指到线上、重建索引:
#     ... bash tools/lesson/upload_assets.sh lesson-20260912 --prune
#
# 可选环境变量:
#   R2_BUCKET      桶名,默认 ielts-packs
#   ASSET_BASE     资源对外地址,默认 https://ielts75.pages.dev
set -euo pipefail
cd "$(dirname "$0")/../.."

PACK_ID="${1:-}"
PRUNE="${2:-}"
BUCKET="${R2_BUCKET:-ielts-packs}"
BASE="${ASSET_BASE:-https://ielts75.pages.dev}"

[ -n "$PACK_ID" ] || { echo "用法: bash tools/lesson/upload_assets.sh <pack-id> [--prune]"; exit 2; }
: "${CLOUDFLARE_API_TOKEN:?必须提供个人账号的 CLOUDFLARE_API_TOKEN(需 R2 读写权限)}"
: "${EXPECT_ACCOUNT_ID:?必须提供期望的【个人】Account ID,用于核对}"

DIR="www/packs/${PACK_ID}/assets"
[ -d "$DIR" ] || { echo "❌ 找不到 $DIR"; exit 1; }

echo "▸ 核对 token 所属账号(防止误用公司账号)…"
curl -s -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/accounts" | python3 - "$EXPECT_ACCOUNT_ID" <<'PY'
import sys, json
expect = sys.argv[1]
d = json.load(sys.stdin)
if not d.get("success"):
    print("❌ token 无效或无权限:", json.dumps(d.get("errors"))[:200]); sys.exit(2)
for a in d.get("result", []):
    print(f"   账号:{a['name']}  id={a['id']}")
if expect not in [a["id"] for a in d.get("result", [])]:
    print(f"❌ 期望的个人账号 {expect} 不在该 token 可访问的账号里——已中止,绝不上传到别的账号。")
    sys.exit(3)
print(f"✅ 核对通过:只操作 {expect}")
PY

export CLOUDFLARE_ACCOUNT_ID="${EXPECT_ACCOUNT_ID}"
WRANGLER="npx --yes wrangler@latest"

echo "▸ 确保桶存在:${BUCKET}"
$WRANGLER r2 bucket create "$BUCKET" 2>/dev/null || echo "   (桶已存在,跳过)"

echo "▸ 上传 ${DIR}/*"
COUNT=0
for f in "$DIR"/*; do
  [ -f "$f" ] || continue
  name="$(basename "$f")"
  case "$name" in
    *.mp3) ct="audio/mpeg" ;;
    *.m4a) ct="audio/mp4" ;;
    *.wav) ct="audio/wav" ;;
    *.webp) ct="image/webp" ;;
    *.png) ct="image/png" ;;
    *.jpg|*.jpeg) ct="image/jpeg" ;;
    *.pdf) ct="application/pdf" ;;
    *) ct="application/octet-stream" ;;
  esac
  $WRANGLER r2 object put "${BUCKET}/packs/${PACK_ID}/assets/${name}" \
    --file="$f" --content-type="$ct" --remote >/dev/null
  echo "   ✓ ${name} ($(du -h "$f" | cut -f1), ${ct})"
  COUNT=$((COUNT+1))
done
echo "▸ 已上传 ${COUNT} 个文件 → r2://${BUCKET}/packs/${PACK_ID}/assets/"

if [ "$PRUNE" = "--prune" ]; then
  echo "▸ 改 pack.json 的 assetBase → ${BASE}/packs/${PACK_ID}"
  node -e '
    const fs=require("fs"); const [p,base]=process.argv.slice(1);
    const j=JSON.parse(fs.readFileSync(p,"utf8")); j.assetBase=base;
    fs.writeFileSync(p, JSON.stringify(j,null,2)+"\n");
  ' "www/packs/${PACK_ID}/pack.json" "${BASE}/packs/${PACK_ID}"
  echo "▸ 删除本地资源(仓库瘦身)"
  rm -rf "$DIR"
  node tools/lesson/build_pack.mjs --all
  echo "✅ 完成。资源现在只在 R2,仓库里只剩 pack.json。"
else
  echo "✅ 完成。本地资源仍保留;确认线上能放之后,可以再跑一次加 --prune 瘦身。"
fi

echo
echo "还需要一次性做的事(在 Cloudflare 控制台):"
echo "  Pages 项目 ielts75 → Settings → Functions → R2 bucket bindings"
echo "  变量名 PACKS → 选择桶 ${BUCKET} → 保存后重新部署一次"
