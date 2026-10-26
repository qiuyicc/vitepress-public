import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Novel","description":"","frontmatter":{},"headers":[],"relativePath":"pages/novel/index.md","filePath":"pages/novel/index.md","lastUpdated":1763602731000}');
const _sfc_main = { name: "pages/novel/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="novel" tabindex="-1">Novel <a class="header-anchor" href="#novel" aria-label="Permalink to &quot;Novel&quot;">​</a></h1><h2 id="记录" tabindex="-1">记录 <a class="header-anchor" href="#记录" aria-label="Permalink to &quot;记录&quot;">​</a></h2><h3 id="词句" tabindex="-1">词句 <a class="header-anchor" href="#词句" aria-label="Permalink to &quot;词句&quot;">​</a></h3><ol><li>过去无法挽回，未来可以改变</li></ol><h3 id="故事" tabindex="-1">故事 <a class="header-anchor" href="#故事" aria-label="Permalink to &quot;故事&quot;">​</a></h3></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/novel/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
