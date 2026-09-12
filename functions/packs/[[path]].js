/* Cloudflare Pages Function: /packs/*
   课程包的音频和页图从 R2 桶里取(桶是私有的,只有这个函数能读)。

   绑定:Pages 项目 → Settings → Functions → R2 bucket bindings → 变量名 PACKS → 选桶。
   没绑桶时 context.next() 回落到仓库里的静态文件,所以加上这个文件不会影响现状。

   - pack.json / index.json 永远走静态文件(跟代码版本走,不进桶)
   - 支持 Range 请求,听力音频才能拖进度
   - 走 ETag 协商缓存,重新切过的音频能及时更新 */

const STATIC_SUFFIX = /\.json$/i;

export async function onRequestGet(context) {
  const { request, env, params } = context;
  const bucket = env.PACKS;
  if (!bucket) return context.next();

  const rel = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  if (!rel || rel.includes('..')) return context.next();
  if (STATIC_SUFFIX.test(rel)) return context.next();

  const key = 'packs/' + rel;
  const range = request.headers.get('range');
  const obj = await bucket.get(key, {
    range: range ? request.headers : undefined,
    onlyIf: request.headers,
  });
  if (obj === null) return context.next();            // 桶里没有 → 试仓库里的静态文件

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=604800');
  headers.set('access-control-allow-origin', '*');    // Vercel 那份也能用同一个资源源
  headers.set('accept-ranges', 'bytes');

  if (!obj.body) return new Response(null, { status: 304, headers });

  if (obj.range && range) {
    const r = obj.range;
    const start = 'offset' in r ? r.offset : obj.size - r.suffix;
    const len = 'length' in r ? r.length : obj.size - start;
    headers.set('content-range', `bytes ${start}-${start + len - 1}/${obj.size}`);
    headers.set('content-length', String(len));
    return new Response(obj.body, { status: 206, headers });
  }
  headers.set('content-length', String(obj.size));
  return new Response(obj.body, { status: 200, headers });
}

export async function onRequestHead(context) {
  const res = await onRequestGet(context);
  return new Response(null, { status: res.status, headers: res.headers });
}
