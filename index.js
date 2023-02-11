let config = hexo.config.copyMarkdown
let pureMarkdown = config.pureMarkdown || false
let field = config.field || 'post'
let copyright_enable = config.copyright ?? true
let Reprint_enable = config.Reprint ?? true

const css = hexo.extend.helper.get('css').bind(hexo);
const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.filter.register('after_generate', function () {
  if (hexo.config.copyMarkdown.enable) {
    var content = `<script data-pjax>const copyright_enable = ${copyright_enable} </script>` + js("https://unpkg.com/turndown/dist/turndown.js");
    if (!pureMarkdown) content += js('https://cdn.jsdelivr.net/npm/hexo-butterfly-copymarkdown@1.0.2/lib/copyMarkdown.js');
    else content += js('https://cdn.jsdelivr.net/npm/hexo-butterfly-copymarkdown@1.0.2/lib/pureMarkdown.js');
    if (Reprint_enable) {
      content += js('https://cdn.jsdelivr.net/npm/hexo-butterfly-copymarkdown@1.0.2/lib/reprint.js');
      hexo.extend.injector.register('head_end', () => {
        return css('https://cdn.jsdelivr.net/npm/hexo-butterfly-copymarkdown@1.0.2/lib/reprint.css');
      }, 'post');
    }
    hexo.extend.injector.register('body_end', content, field);
  }
});


