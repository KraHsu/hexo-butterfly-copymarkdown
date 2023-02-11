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
    if (!pureMarkdown) content += js('https://cdn.jsdelivr.net/npm/hexo-butterfly-copymarkdown@1.0.3/lib/copyMarkdown.min.js');
    else content += js('https://cdn.jsdelivr.net/npm/hexo-butterfly-copymarkdown@1.0.3/lib/pureMarkdown.min.js');
    if (Reprint_enable) {
      content += js('https://cdn.jsdelivr.net/npm/hexo-butterfly-copymarkdown@1.0.3/lib/reprint.min.js');
      hexo.extend.injector.register('head_end', () => {
        return css('https://cdn.jsdelivr.net/npm/hexo-butterfly-copymarkdown@1.0.3/lib/reprint.min.css');
      }, 'post');
    }
    hexo.extend.injector.register('body_end', content, field);
  }
});


