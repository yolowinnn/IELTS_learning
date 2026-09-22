import { onRequestOptions as __api_gemini_js_onRequestOptions } from "/Users/jiaweili/main_folder/personalize/IELTS_app/functions/api/gemini.js"
import { onRequestPost as __api_gemini_js_onRequestPost } from "/Users/jiaweili/main_folder/personalize/IELTS_app/functions/api/gemini.js"
import { onRequestGet as __packs___path___js_onRequestGet } from "/Users/jiaweili/main_folder/personalize/IELTS_app/functions/packs/[[path]].js"
import { onRequestHead as __packs___path___js_onRequestHead } from "/Users/jiaweili/main_folder/personalize/IELTS_app/functions/packs/[[path]].js"

export const routes = [
    {
      routePath: "/api/gemini",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_gemini_js_onRequestOptions],
    },
  {
      routePath: "/api/gemini",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_gemini_js_onRequestPost],
    },
  {
      routePath: "/packs/:path*",
      mountPath: "/packs",
      method: "GET",
      middlewares: [],
      modules: [__packs___path___js_onRequestGet],
    },
  {
      routePath: "/packs/:path*",
      mountPath: "/packs",
      method: "HEAD",
      middlewares: [],
      modules: [__packs___path___js_onRequestHead],
    },
  ]