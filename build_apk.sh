#!/usr/bin/env bash
# 一键打包 APK。用法: bash build_apk.sh
set -e
cd "$(dirname "$0")"

export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "▸ 同步 web 资源到安卓工程..."
npx cap sync android

echo "▸ 用 Gradle 构建 debug APK..."
cd android
./gradlew assembleDebug

OUT="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$OUT" ]; then
  cp "$OUT" "../雅思7.5冲刺.apk"
  echo "✅ 打包成功 → 雅思7.5冲刺.apk ($(du -h "../雅思7.5冲刺.apk" | cut -f1))"
else
  echo "❌ 未找到 APK 输出"; exit 1
fi
