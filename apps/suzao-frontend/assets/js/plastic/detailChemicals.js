const jsonToHtml = (json, title = "") => {
  if (json) {
    try {
      const base = JSON.parse(json)
      let htmlStr = ''
      Object.entries(base).filter(([key, value]) => {
        htmlStr += `<tr class="c-row">
                <td class="c-col-0">
                  ${key}
                </td>
                <td class="c-col-1">
                  ${value}
                </td>
              </tr>`
      })
      if (htmlStr) {
        return `<table class="c-tb mask-box" cellspacing="0">
                    <tr class="c-row c-row-h c-row-2 en">
                      <td class="c-col-0">${title}</td>
                      <td class="c-col-1"></td>
                    </tr>
                    ${htmlStr}
                  </table>`
      }
    } catch (error) {
      console.error(error);
    }
    return ''
  }
}
const textToHtml = (text, title = "", className = '') => {
  if (text) {
    return `<table class="c-tb" cellspacing="0">
                  <tr class="c-row c-row-h">
                    <td class="c-col-0">${title}</td>
                  </tr>
                  <tr class="c-row">
                    <td class="c-col-0 ${className}">${text}</td>
                  </tr>
                </table>`
  }
  return ''
}
function on(parent, eventType, selector, callback) {
  parent.addEventListener(eventType, function(event) {
    const targets = parent.querySelectorAll(selector);
    for (let target of targets) {
      if (target === event.target || target.contains(event.target)) {
        callback.call(target, event);
        break;
      }
    }
  });
}
fetch('/data/123.json').then((res) => {
  return res.json()
}).then(({
  basic_json,
  anquan_json,
  bianhao_json,
  shengchan_json,
  wuhua_json,
  hecheng_processed,
  sDS_1_processed,
  sDS_2_processed,
  mSDS_processed,
}) => {
  const domBody = document.querySelector('.body')
  if (domBody) {
    const processed = `${sDS_1_processed ? '<div class="wrap-dl">' + sDS_1_processed + '</div>' : ''}
    ${sDS_2_processed ? '<div class="wrap-dl">' + sDS_2_processed + '</div>' : ''}
    ${mSDS_processed ? '<div class="wrap-dl">' + mSDS_processed + '</div>' : ''}`
    domBody.innerHTML = `${jsonToHtml(basic_json, '产品信息')}
        ${jsonToHtml(bianhao_json, '编号系统')}
        ${jsonToHtml(wuhua_json, '物化性质')}
        ${jsonToHtml(anquan_json, '安全信息')}
        ${jsonToHtml(shengchan_json, '生产方法及用途')}
        ${textToHtml(hecheng_processed, '合成路线', 'synthetic')}
        ${textToHtml(processed, 'MSDS', 'msds map')}`

    const msdsDom = document.querySelector('.msds.map')
    if (msdsDom) {
      on(msdsDom, 'click', '.tit, .wrap-dt', (event) => {
        event.preventDefault();
        const specificParent = event.target.closest('.wrap-dl');
        const classList = specificParent.classList
        if (classList) {
          const flag = classList.contains('active')
          if (flag) {
            classList.remove('active')
          } else {
            classList.add('active')
          }
        }
      })
    }
  }
})

//动态配置页面根标签字体
! function(a) {
  function b() {
    a.rem = f.getBoundingClientRect().width / 16;
    if (a.rem > 35) {
      f.style.fontSize = '35px';
    } else {
      f.style.fontSize = a.rem + "px";
      var j = parseFloat(a.getComputedStyle(f, null).fontSize);
      if (a.rem != j) {
        a.rem = a.rem * a.rem / j;
        f.style.fontSize = a.rem + "px"
      }
    }
  }

  var c, d = a.navigator.appVersion.match(/iphone/gi) ? a.devicePixelRatio : 1,
    e = 1,
    f = document.documentElement,
    g = document.createElement("meta");
  if (a.dpr = d, a.addEventListener("resize", function() {
    clearTimeout(c), c = setTimeout(b, 300)
  }, !1), a.addEventListener("pageshow", function(a) {
    a.persisted && (clearTimeout(c), c = setTimeout(b, 300))
  }, !1), f.setAttribute("data-dpr", d), g.setAttribute("name", "viewport"), g.setAttribute("content",
    "initial-scale=" + e + ", maximum-scale=" + e + ", minimum-scale=" + e + ", user-scalable=no"), f
      .firstElementChild) f.firstElementChild.appendChild(g);
  else {
    var h = document.createElement("div");
    h.appendChild(g), document.write(h.innerHTML)
  }
  b();
  document.documentElement.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
  });
}(window);