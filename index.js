let config = hexo.config.copyMarkdown
let pureMarkdown = config.pureMarkdown || false
let keyboard = config.keyboard || false
let field = config.field || 'post'
let copyright_enable = config.copyright.enable || true
let copyright_container = config.copyright.container || '#article-container'
let Reprint_enable = config.Reprint.enable || true
let Reprint_container = config.Reprint.container || '.post-copyright'


const css = hexo.extend.helper.get('css').bind(hexo);
const fs = require('fs');
const path = require('path');
const jsPath = path.join(__dirname, 'lib', 'copyMarkdown.js');
const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.filter.register('after_generate', function(){
  if(hexo.config.copyMarkdown.enable){
    fs.readFile(jsPath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const content = js("https://unpkg.com/turndown/dist/turndown.js") + `<script data-pjax>${data}</script>`;
      hexo.extend.injector.register('body_end', content, "post");
    });
  }
  hexo.extend.injector.register('head_end', () => {
    return `<style type="text/css">#reprintedButton {
      display: flex;
      height: 0;
      flex-direction: row-reverse;
    }
    
    #reprintedButton i{
      position: relative;
      font-size: 34px;
      top: -25px;
      right: -10px;
      color: #e5e5e5;
      cursor: pointer;
    }</style>`;
  }, 'post');  
});


