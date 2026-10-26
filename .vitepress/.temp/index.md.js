import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"秋忆CC的知识库","text":"千里之行，始于足下","tagline":"菜就多练,每天进步一点点","image":{"src":"/bg.jpg","alt":"bg"},"actions":[{"theme":"brand","text":"Markdown 基本语法","link":"/pages/markdown"},{"theme":"brand","text":"Daily Read","link":"/pages/longDailyRead"},{"theme":"brand","text":"好站记录","link":"/pages/good_sites"}]},"features":[{"title":"前端","details":"2025年前端冲冲冲"},{"title":"后端","details":"Node算不算是后端"},{"title":"爱好","details":"前端、游戏、桌游、小说"}]},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1763632539000}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
