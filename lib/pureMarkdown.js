"use strict";
var ArticleReprintedEvent = new Event("ArticleReprinted");

const ArticleReprinted = () => {
  let result = turndownService.turndown(document.querySelector("#article-container").innerHTML);
  if(copyright_enable) result += `\n\n-------\n\n` + turndownService.turndown(document.querySelector(".post-copyright").innerHTML);
  console.log(result);
  copyToClipboard(result);
  document.dispatchEvent(ArticleReprintedEvent);
  return;
}

async function copyToClipboard(str) {
  try {
    await navigator.clipboard.writeText(str);
    Snackbar.show({
      text:"复制成功(*^▽^*)",
      backgroundColor:"light"===document.documentElement.getAttribute("data-theme")?GLOBAL_CONFIG.Snackbar.bgLight:GLOBAL_CONFIG.Snackbar.bgDark,
      duration:5e5,
      pos:GLOBAL_CONFIG.Snackbar.position,
      actionText:"我知道了",
      actionTextColor:"#fff"
    })
  } catch (err) {
    console.error('无法复制： ', err);
  }
}

const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
  headingStyle: 'atx'
});

turndownService.addRule("ignore-headerlink", {
  filter: function (node) {
    return (
      node.nodeName === "A" &&
      node.classList.contains("headerlink")
    );
  },
  replacement: function (content, node) {
    return "";
  },
});

turndownService.addRule('.note', {
  filter: (node) => node.matches('.note'),
  replacement: (content, node) => '> ' + content.trim() + '\n'
});

turndownService.addRule('gallery-group', {
  filter: function (node) {
    return (
      node.classList.contains('gallery-group-main')
    );
  },
  replacement: function (content, node) {
    let items = node.querySelectorAll('.gallery-group');
    let result = '';
    for (let i = 0; i < items.length; i++) {
      let name = items[i].querySelector('.gallery-group-name').textContent;
      let description = items[i].querySelector('figcaption p').textContent;
      let link = items[i].querySelector('figcaption a').href;
      let url = items[i].querySelector('img').src;
      result += description + ': [' + name + '](' + link + ')\n![](' + url + ')\n';
    }

    return `\n\n-------\n\n` + result + `\n\n-------\n\n`;
  }
});

turndownService.addRule('gallery', {
  filter: function (node) {
    return (
      node.classList.contains('gallery')
    );
  },
  replacement: function (content, node) {
    let items = node.querySelectorAll('.fj-gallery-item img');
    let result = '';
    for (let i = 0; i < items.length; i++) {
      result += '!()[' + items[i].src + ']\n';
    }
    return `\n\n-------\n\n` + result + `\n\n-------\n\n`;
  }
});

turndownService.addRule('hide-inline', {
  filter: function (node) {
    return (
      node.classList.contains('hide-inline')
    );
  },
  replacement: function (content, node) {
    let display = node.querySelector("button").textContent;
    let text = toMarkdown(node.querySelector(".hide-content"));
    return `` + display + `: ` + text + `\n`;
  }
});

turndownService.addRule('hide-block', {
  filter: function (node) {
    return (
      node.classList.contains('hide-block')
    );
  },
  replacement: function (content, node) {
    let display = node.querySelector("button").textContent;
    let text = toMarkdown(node.querySelector(".hide-content"));
    return `` + display + ` : ` + text + `\n`;
  }
});

turndownService.addRule('hideToggle', {
  filter: function (node) {
    return (
      node.nodeName == 'details' &&
      node.classList.contains('toggle')
    );
  },
  replacement: function (a, node) {
    let display = node.querySelector(".toggle-button").textContent;
    let content = toMarkdown(node.querySelector(".toggle-content"));
    return `` + display + `:\n` + content + `\n`;
  }
});

turndownService.addRule('tabs', {
  filter: function (node) {
    return (
      node.classList.contains('tabs')
    );
  },
  replacement: function (a, node) {
    let id = node.id;
    let tabs = node.querySelectorAll(".nav-tabs .tab button");
    let contents = node.querySelectorAll(".tab-item-content");
    let result = '';
    for (let i = 0; i < tabs.length; i++) {
      result += `**` + tabs[i].textContent + `:**\n` + toMarkdown(contents[i]) + `\n\n`;
    }
    return `\n\n-------\n\n**` + id + `:**\n` + result + `\n\n-------\n\n`;
  }
});

turndownService.addRule('btn', {
  filter: function (node) {
    return (
      node.nodeName === 'A' &&
      node.classList.contains('btn-beautify')
    );
  },
  replacement: function (content, node) {
    let url = node.getAttribute('href') ?? '';
    let text = node.querySelector('span')?.textContent ?? '';
    return `\n!(` + text + `)[` + url + `]\n`;
  }
});

turndownService.addRule('label', {
  filter: function (node) {
    return (
      node.nodeName === 'MARK' &&
      node.classList.contains('hl-label')
    );
  },
  replacement: function (content, node) {
    let text = node.textContent;
    return '`' + text + '`';
  }
});

turndownService.addRule('timeline', {
  filter: function (node) {
    return node.classList.contains('timeline');
  },
  replacement: function (content, node) {
    let title = node.querySelector('.timeline-item.headline .timeline-item-title .item-circle > p').textContent;
    let items = node.querySelectorAll('.timeline-item:not(.headline)');
    let result = '';
    for (let i = 0; i < items.length; i++) {
      let title = items[i].querySelector('.timeline-item-title p').textContent;
      let content = items[i].querySelector('.timeline-item-content') ? items[i].querySelector('.timeline-item-content').textContent : '';
      result += `` + title + `:` + content + `\n`;
    }
    // return `{% timeline "`+title+`" "`+color+`" %}\n`+result+`{% endtimeline %}`;
    return `\n\n-------\n\n**` + title + `**:\n ` + result + `\n\n-------\n\n`;
  }
});

turndownService.addRule('flink', {
  filter: function (node) {
    return (
      node.classList.contains('flink')
    );
  },
  replacement: function (a, node) {
    let classes = node.querySelectorAll(".flink-name");
    let descriptions = node.querySelectorAll(".flink-desc") ?? [];
    let lists = node.querySelectorAll(".flink-list");
    let result = '';
    for (let i = 0; i < classes.length; i++) {
      result += `- ` + classes[i].textContent + `\n  ` + descriptions[i] ? descriptions[i].textContent : '' + `\n`;
      let items = lists[i].querySelectorAll(".flink-list-item");
      for (let j = 0; j < items.length; j++) {
        result += `    - [` + items[j].querySelector(".flink-item-name").textContent + `](` + items[j].querySelector("a").href + `)\n      ` + items[i].querySelector(".flink-item-desc").textContent + `\n      ![](` + items[j].querySelector("img").src + `)\n`;
      }
      result += '\n';
    }
    return `\n\n-------\n\n` + result + `\n\n-------\n\n`;
  }
});

document.addEventListener('copy', (event) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const markdown = toMarkdown(range.cloneContents());

  event.clipboardData.setData('text/plain', markdown);
  event.preventDefault();
});

function toMarkdown(node) {
  let tmp = node;
  const container = document.createElement('div');
  container.appendChild(tmp);
  let res = turndownService.turndown(container.innerHTML);
  container.remove();
  return res;
}

function h2m(html) {
  console.log(turndownService.turndown(html));
}