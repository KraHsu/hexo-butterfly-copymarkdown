# hexo-butterfly-copyMarkdown

A Hexo plugin that allows direct copying of markdown from a web page, primarily developed for the butterfly theme, **but the basic copy functionality is universally**.

## How to install

```
npm i hexo-butterfly-copymarkdown --save
```

## Config

Add configuration in hexo's _config.yml file.

An Example:

```
copyMarkdown:
    enable: true
    pureMarkdown: false #使用true以禁用外挂转换 默认为 false
    keyboard: true #cv悬浮组件
    field: post # default: 每个页面   post: 仅文章页面（默认值）
    copyright: true # 是否添加版权信息 默认开启
    Reprint: true # 是否开启一键转载 默认开启
```

```
copyMarkdown:
    enable: true
    pureMarkdown: false # Set to true to disable extraneous conversion, default is false
    keyboard: true # CV floating component
    field: post # default: every page post: only article pages (default)
    copyright: true # whether to add copyright information, default is enabled
    Reprint: true # whether to enable one-click reprint, default is enabled
```

## preview

[Hexo插件 | 直接复制markdown](https://www.crowhsu.top/posts/6e818316.html?_sw-precache=83575f0c05e0f26a4f7a4eb6257822a1)

Except for mermaid, all tag plugins have been adapted by the plugin.

## License
hexo-butterfly-copyMarkdown is Copyright © 2023 Charles Hsu and released under the MIT license.

The project uses [turndown.js](https://github.com/domchristie/turndown), turndown is copyright © 2017+ Dom Christie and released under the MIT license.
