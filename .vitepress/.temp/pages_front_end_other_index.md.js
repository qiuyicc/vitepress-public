import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"pages/front_end/other/index.md","filePath":"pages/front_end/other/index.md","lastUpdated":1763602731000}');
const _sfc_main = { name: "pages/front_end/other/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="npm-依赖分类" tabindex="-1">npm 依赖分类 <a class="header-anchor" href="#npm-依赖分类" aria-label="Permalink to &quot;npm 依赖分类&quot;">​</a></h2><p>dependencies:</p><ol><li>运行项目业务逻辑所需要依赖的第三方库；</li><li>npm install 安装的依赖包； devDependencies:</li><li>开发模式工作流下依赖的第三方库；</li><li>单元测试，语法转换，lint工具，程序构建，本地开发等； peerDependencies:</li><li>需要核心依赖库，不能脱离依赖库单独使用</li></ol></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/front_end/other/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
