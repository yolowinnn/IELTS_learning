#!/usr/bin/env python3
"""cf_verify.py — 动手之前核对 Cloudflare token 的归属。

从环境变量读(不走命令行,避免 token 出现在进程列表):
  CLOUDFLARE_API_TOKEN  个人账号的 API token
  EXPECT_ACCOUNT_ID     期望操作的【个人】Account ID

退出码:0 通过;2 token 无效;3 token 够不到目标账号,或够得到别的账号但够不到它。
"""
import json
import os
import sys
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"


def call(path):
    token = os.environ["CLOUDFLARE_API_TOKEN"]
    req = urllib.request.Request(API + path, headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read().decode("utf-8"))
        except Exception:
            return {"success": False, "errors": [{"message": f"HTTP {e.code}"}]}
    except Exception as e:
        return {"success": False, "errors": [{"message": str(e)}]}


def fail(code, msg):
    print(msg)
    sys.exit(code)


def main():
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
    expect = os.environ.get("EXPECT_ACCOUNT_ID", "")
    if not token:
        fail(2, "❌ 没给 CLOUDFLARE_API_TOKEN。")
    if not expect:
        fail(2, "❌ 没给 EXPECT_ACCOUNT_ID。")

    v = call("/user/tokens/verify")
    if not v.get("success"):
        errs = "; ".join(e.get("message", "") for e in (v.get("errors") or []))
        fail(2, f"❌ token 无效或已被吊销。{errs}")

    # 首选:列出 token 能访问的账号。权限不含 Account Settings:Read 时会返回空列表。
    acc = call("/accounts")
    accounts = acc.get("result") or [] if acc.get("success") else []
    for a in accounts:
        print(f"   账号:{a.get('name')}  id={a.get('id')}")
    if accounts:
        if expect in [a.get("id") for a in accounts]:
            print(f"✅ 核对通过:只操作 {expect}")
            return
        fail(3, f"❌ 目标账号 {expect} 不在该 token 的可访问范围内——已中止。")

    # 退路:直接探测目标账号是否可达(同样能证明归属)
    print("   (token 没有列账号的权限,改为直接探测目标账号)")
    probe = call(f"/accounts/{expect}/pages/projects?per_page=1")
    if probe.get("success"):
        names = [p.get("name") for p in (probe.get("result") or [])]
        print(f"✅ 核对通过:token 可访问 {expect}" + (f",现有项目 {names}" if names else ""))
        return
    errs = "; ".join(e.get("message", "") for e in (probe.get("errors") or []))
    fail(3, f"❌ 这个 token 够不到账号 {expect}——已中止,绝不拿它去碰别的账号。{errs}")


if __name__ == "__main__":
    main()
