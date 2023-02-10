var ArticleReprintedEvent = new Event("ArticleReprinted");

function ArticleReprinted() {
  let result = turndownService.turndown(document.querySelector("#article-container").innerHTML) + `\n\n-------\n\n` + turndownService.turndown(document.querySelector(".post-copyright").innerHTML)
  console.log(result)
  copyToClipboard(result)
  document.dispatchEvent(ArticleReprintedEvent);
  return;
}

async function copyToClipboard(str) {
  try {
    await navigator.clipboard.writeText(str);
    console.log('复制成功');
  } catch (err) {
    console.error('无法复制： ', err);
  }
}

const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
  headingStyle: 'atx'
});

function om() {
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
        result += description+': ['+name+']('+link+')\n![]('+url+')\n'
      }

      return `\n\n-------\n\n`+result+`\n\n-------\n\n`;
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
      let display = node.querySelector("button").textContent
      let text = toMarkdown(node.querySelector(".hide-content"))
      return ``+display+`: `+text+`\n`;
    }
  });

  turndownService.addRule('hide-block', {
    filter: function (node) {
      return (
        node.classList.contains('hide-block')
      );
    },
    replacement: function (content, node) {
      let display = node.querySelector("button").textContent
      let text = toMarkdown(node.querySelector(".hide-content"))
      return ``+display+` : `+text+`\n`;
    }
  });

  turndownService.addRule('hideToggle', {
    filter: function (node) {
      return (
        node.nodeName = 'details' &&
        node.classList.contains('toggle')
      );
    },
    replacement: function (a, node) {
      let display = node.querySelector(".toggle-button").textContent
      let content = toMarkdown(node.querySelector(".toggle-content"))
      return ``+display+`:\n` + content + `\n`;
    }
  });
  
  turndownService.addRule('tabs', {
    filter: function (node) {
      return (
        node.classList.contains('tabs')
      );
    },
    replacement: function (a, node) {
      let id = node.id
      let tabs = node.querySelectorAll(".nav-tabs .tab button")
      let contents = node.querySelectorAll(".tab-item-content")
      let result = ''
      for(let i = 0; i < tabs.length; i ++){
        result += `**`+tabs[i].textContent+`:**\n` + toMarkdown(contents[i]) + `\n\n`
      }
      return `\n\n-------\n\n**`+id+`:**\n`+result+`\n\n-------\n\n`
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
      return `\n!(`+text+`)[`+url+`]\n`;
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
        result += ``+title+`:`+content+`\n`;
      }
      // return `{% timeline "`+title+`" "`+color+`" %}\n`+result+`{% endtimeline %}`;
      return `\n\n-------\n\n**`+title+`**:\n `+result+`\n\n-------\n\n`;
    }
  });

  turndownService.addRule('flink', {
    filter: function (node) {
      return (
        node.classList.contains('flink')
      );
    },
    replacement: function (a, node) {
      let classes = node.querySelectorAll(".flink-name")
      let descriptions = node.querySelectorAll(".flink-desc") ?? []
      let lists = node.querySelectorAll(".flink-list")
      let result = ''
      for(let i = 0; i < classes.length; i ++){
        result += `- `+classes[i].textContent+`\n  `+descriptions[i] ? descriptions[i].textContent : ''+`\n`
        let items = lists[i].querySelectorAll(".flink-list-item")
        for(let j = 0; j < items.length; j ++){
          result += `    - [`+items[j].querySelector(".flink-item-name").textContent+`](`+items[j].querySelector("a").href+`)\n      `+items[i].querySelector(".flink-item-desc").textContent+`\n      ![](`+items[j].querySelector("img").src+`)\n`
        }
        result += '\n'
      }
      return `\n\n-------\n\n`+result+`\n\n-------\n\n`
    }
  });
}

function nom() {
  turndownService.addRule('figure', {
    filter: function (node) {
      return node.nodeName === 'FIGURE';
    },
    replacement: function (content, node) {
      let lines = node.querySelectorAll("td.code .line");
      let code = "";
      lines.forEach(line => {
        code += line.textContent + "\n";
      });
      const language = node.classList[node.classList.length - 1];
      return '```' + language + '\n' + code + '\n```';
    }
  });

  turndownService.addRule('timeline', {
    filter: function (node) {
      return node.classList.contains('timeline');
    },
    replacement: function (content, node) {
      let color = node.className.match(/timeline (\w+)/) ? node.className.match(/timeline (\w+)/)[1] : '';
      let title = node.querySelector('.timeline-item.headline .timeline-item-title .item-circle > p').textContent;
      let items = node.querySelectorAll('.timeline-item:not(.headline)');
      let result = '';
      for (let i = 0; i < items.length; i++) {
        let title = items[i].querySelector('.timeline-item-title p').textContent;
        let content = items[i].querySelector('.timeline-item-content') ? items[i].querySelector('.timeline-item-content').textContent : '';
        result += `<!-- timeline `+title+` -->\n`+content+`\n<!-- endtimeline -->\n`;
      }
      // return `{% timeline "`+title+`" "`+color+`" %}\n`+result+`{% endtimeline %}`;
      return `{% timeline `+title+`,`+color+` %}\n`+result+`{% endtimeline %}`;
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
      let className = node.className;
      let color = className.match(/hl-label (\w+)/) ? className.match(/hl-label (\w+)/)[1] : '';
      let text = node.textContent;
      return `{% label `+text+` `+color+` %}`;
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
      let op = node.classList;
      let url = node.getAttribute('href') ?? '';
      let text = node.querySelector('span')?.textContent ?? '';
      let icon = node.querySelector('i')?.classList[0] ?? '';
      return `{% btn `+url+`,`+text+`,`+icon+`,`+op.value.replace('btn-beautify ', '')+` %}`;
    }
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
        result += `{% galleryGroup `+name+` `+description+` `+link+` `+url+` %}\n`
      }

      return `<div class="gallery-group-main">\n` + result + `</div>`;
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
      return `{% gallery %}\n` + result + `{% endgallery %}`;
    }
  });

  turndownService.addRule('hide-inline', {
    filter: function (node) {
      return (
        node.classList.contains('hide-inline')
      );
    },
    replacement: function (content, node) {
      let button = node.querySelector("button")
      let display = button.textContent
      let text = toMarkdown(node.querySelector(".hide-content"))
      let bg = button.style.backgroundColor ?? ''
      let color = button.style.color ?? ''
      return `{% hideInline `+text+`,`+display+`,`+bg+`,`+color+` %}`;
    }
  });

  turndownService.addRule('hide-block', {
    filter: function (node) {
      return (
        node.classList.contains('hide-block')
      );
    },
    replacement: function (content, node) {
      let button = node.querySelector("button")
      let display = button.textContent
      let text = toMarkdown(node.querySelector(".hide-content"))
      let bg = button.style.backgroundColor ?? ''
      let color = button.style.color ?? ''
      return `{% hideBlock `+display+`,`+bg+`,`+color+` %}\n`+text+`\n{% endhideBlock %}\n`;
    }
  });

  turndownService.addRule('hideToggle', {
    filter: function (node) {
      return (
        node.nodeName = 'details' &&
        node.classList.contains('toggle')
      );
    },
    replacement: function (a, node) {
      let button = node.querySelector(".toggle-button")
      let display = button.textContent
      let content = toMarkdown(node.querySelector(".toggle-content"))
      let bg = button.style.backgroundColor ?? ''
      let color = button.style.color ?? ''
      return `{% hideToggle `+display+`,`+bg+`,`+color+` %}\n` + content + `\n{% endhideToggle %}\n`;
    }
  });

  turndownService.addRule('note', {
    filter: function (node) {
      return (
        node.classList.contains('note') &&
        node.classList.contains('icon-padding')
      );
    },
    replacement: function (a, node) {
      let str = node.classList.value
      let shadow = str.split(" ").map(function (item) {return "." + item;}).join("")
      let icon = document.querySelector(shadow).querySelector(".note-icon").classList.value.replace("note-icon", '')
      let color = str.match(/note (.+) icon-padding/) ?? {1:''};
      let style = str.match(/icon-padding (.+)/) ?? {1:''};
      return `{% note `+color[1]+` '`+icon+`' `+style[1]+` %}\n` + node.querySelector("p").textContent + `\n{% endnote %}\n`;
    }
  });
  
  turndownService.addRule('note', {
    filter: function (node) {
      return (
        node.classList.contains('note') &&
        !node.classList.contains('icon-padding')
      );
    },
    replacement: function (a, node) {
      let str = node.classList.value
      let content = toMarkdown(node.querySelector("p"))
      return `{% `+str+` %}\n` + content + `\n{% endnote %}\n`;
    }
  });

  turndownService.addRule('tabs', {
    filter: function (node) {
      return (
        node.classList.contains('tabs')
      );
    },
    replacement: function (a, node) {
      let id = node.id
      let tabs = node.querySelectorAll(".nav-tabs .tab button")
      let contents = node.querySelectorAll(".tab-item-content")
      let result = ''
      for(let i = 0; i < tabs.length; i ++){
        let icon = tabs[i].querySelector("i")
        result += `<!-- tab `+tabs[i].textContent+` '`+icon?.classList ?? ''+`' -->\n` + toMarkdown(contents[i]) + `\n<!-- endtab -->\n`
      }
      return `{% tabs `+id+` %}\n`+result+`{% endtabs %}\n`
    }
  });

  turndownService.addRule('flink', {
    filter: function (node) {
      return (
        node.classList.contains('flink')
      );
    },
    replacement: function (a, node) {
      let classes = node.querySelectorAll(".flink-name")
      let descriptions = node.querySelectorAll(".flink-desc") ?? []
      let lists = node.querySelectorAll(".flink-list")
      let result = ''
      for(let i = 0; i < classes.length; i ++){
        result += `- class_name: `+classes[i].textContent+`\n  class_desc: `+descriptions[i] ? descriptions[i].textContent : ''+`\n  link_list:\n`
        let items = lists[i].querySelectorAll(".flink-list-item")
        for(let j = 0; j < items.length; j ++){
          result += `    - name: `+items[j].querySelector(".flink-item-name").textContent+`\n      link: '`+items[j].querySelector("a").href+`'\n      avatar: '`+items[j].querySelector("img").src+`'\n      descr: `+items[i].querySelector(".flink-item-desc").textContent+`\n`
        }
        result += '\n'
      }
      return `{% flink %}\n`+result+`{% endflink %}\n`
    }
  });
}


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
  container.remove()
  return res;
}

function h2m(html){
  console.log(turndownService.turndown(html))
}

let reprintButton = document.createElement("div");
reprintButton.id = "reprintedButton";
reprintButton.innerHTML = '<i class="fas fa-paste copy-button"></i>';
let parentElement = document.getElementById("post")
parentElement.insertBefore(reprintButton, parentElement.firstChild);
reprintButton.querySelector("i").addEventListener("click", ArticleReprinted)