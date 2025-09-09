addEventListener('load', () => {
  
  const detail = $info['detail'];

  const clientType = suzao.userAgent
  const params = suzao.paramObj()
  const lang = params.lang ? params.lang : 'zh'
  const mfrsFullName = $info['mfrs_full_name_' + lang]

  const isEmail = userSession.user && (userSession.domain === 'b' || userSession.emailStatus === 1)

  const translations = {
    '干态': {
      zh: '干态',
      en: 'Dry State'
    },
    '制造商': {
      zh: '制造商',
      en: 'Manufacturer'
    },
    '其他证书': {
      zh: '其他证书',
      en: 'Other Certificates'
    },
    '认证证书': {
      zh: '认证证书',
      en: 'Certificate'
    }
  }
  const handler = {
    get: function(obj, prop) {
      return prop in obj ? obj[prop][lang] : '';
    },
  };
  const transProxy = new Proxy(translations, handler);

  const formatDatasheetCol = function(colKey, col, basicData, data, pv, tv, iv) {
    let r = '';
    const measure = {
      pv: { 1: 'MPa', 2: 'kg/cm²', 3: 'psi', 4: 'lb/in²' },
      tv: { 1: '°C', 2: '°F' },
      iv: { 1: 'J/m', 2: 'kJ/m²', 3: 'kg-cm/cm', 4: 'ft-lb/in' }
    };

    const measureIdx = {
      'MPa': { key: 'pv', chg: { 2: 'mpa2kgf', 3: 'mpa2psi', 4: 'mpa2lb' } },
      'kg/cm²': { key: 'pv', chg: { 1: 'kgf2mpa', 3: 'kgf2psi', 4: 'kgf2lb' } },
      'psi': { key: 'pv', chg: { 1: 'psi2mpa', 2: 'psi2kgf', 4: 'psi2lb' } },
      'lb/in²': { key: 'pv', chg: { 1: 'lb2mpa', 2: 'lb2kgf', 3: 'lb2psi' } },
      '°C': { key: 'tv', chg: { 2: 'c2f' } },
      '°F': { key: 'tv', chg: { 1: 'f2c' } },
      'J/m': { key: 'iv', chg: { 2: 'jm2kjm2', 3: 'jm2kgcm', 4: 'jm2ftlb' } },
      'kJ/m²': { key: 'iv', chg: { 1: 'kjm2jm', 3: 'kjm2kgcm', 4: 'kjm2ftlb' } },
      'kg-cm/cm': { key: 'iv', chg: { 1: 'kgcm2jm', 2: 'kgcm2kjm', 4: 'kgcm2ftlb' } },
      'ft-lb/in': { key: 'iv', chg: { 1: 'ftlb2jm', 2: 'ftlb2kjm', 3: 'ftlb2kgcm' } }
    };

    if (col) {
      switch (col.colType) {
        case 'checkbox':
          const checkboxTmp = [];
          for (const v of data[colKey]) {
            if (basicData[v]?.[lang]) {
              checkboxTmp.push(basicData[v][lang]);
            }
          }
          r = checkboxTmp.join(' ');
          break;

        case 'list':
          r = basicData[data[colKey]]?.[lang] || '';
          if (colKey === 'measure' && measureIdx[r]) {
            const key = measureIdx[r].key;
            r = measure[key]?.[this[key]] || r;
          }
          break;

        case 'input':
          r = data[colKey];
          if (r && colKey.substring(0, 4) === 'data') {
            if (data.measure && typeof data.measure === 'string'
              && basicData[data.measure]?.[lang]
              && measureIdx[basicData[data.measure][lang]]) {
              const mAlias = basicData[data.measure][lang];
              if (measureIdx[mAlias].chg[this[measureIdx[mAlias].key]]) {
                const pAlias = measureIdx[mAlias].chg[this[measureIdx[mAlias].key]];
                r = r.replace(/[0-9.]+/g, (m) => this.custom[pAlias](m));
              }
            }
          }
          break;

        case 'text':
          r = env != 'online' || typeof data[colKey] === 'string'
            ? data[colKey]
            : '后台数据有误, colType为text但data不是text类型';
          break;

        case 'object':
          if (colKey.substring(0, 4) === 'data' && data.measure
            && !data[colKey].measure) {
            data[colKey].measure = data.measure;
          }
          const groupOut = {};

          for (const [k, v] of Object.entries(col.col)) {
            const dataKey = 'data' + k;
            const gid = v.groupId || 'default';

            if (!groupOut[gid]) {
              groupOut[gid] = {
                hasData: false,
                output: ''
              };
            }
            if (dataKey in data[colKey]) {
              const input = formatDatasheetCol(dataKey, v, basicData, data[colKey], pv, tv, iv);
              if (!input) {
                if (groupOut[gid].output.endsWith('~')) {
                  groupOut[gid].output = groupOut[gid].output.slice(0, -1);
                }
              } else {
                if (v.colType !== 'text') {
                  groupOut[gid].hasData = true;
                }
                if (input !== '~' || groupOut[gid].output !== '') {
                  groupOut[gid].output += input;
                }
              }
            }
          }

          r = Object.values(groupOut)
            .filter(v => v.hasData)
            .map(v => v.output)
            .join('&nbsp;');
          break;

        case 'st_name':
          const langIndex = { zh: 0, en: 1 };
          r = data[colKey]['data' + langIndex[lang]];
          if (clientType !== 'PC') {
            const short = {
              '熔融流动指数': '熔融指数',
              '简支梁缺口冲击强度': '简支梁缺口冲击',
              '简支梁无缺口冲击强度': '简支梁无缺口冲击',
              '悬臂梁缺口冲击强度': '悬臂梁缺口冲击',
              '悬臂梁无缺口冲击强度': '悬臂梁无缺口冲击',
              '热变形温度': '热变形',
              '灼热丝相对温度': 'GWFI',
              '灼热丝起燃温度': 'GWIT',
              '维卡软化温度': '维卡软化',
              'Deflection Temperature': 'HDT',
              'Vicat Softening Temperature': 'Vicat',
              'Glass Transition Temperature': 'TG',
              'Coefficient of Linear Expansion': 'CTE'
            };
            r = short[r] || r;
          }
          break;

        case 'st_materialid':
          r = data['st_' + colKey];
          break;

        case 'st_use':
          const useTmp = [];
          for (const v of data[colKey]) {
            if (basicData[v]?.[lang]) {
              useTmp.push(basicData[v][lang]);
            }
          }
          r = useTmp.length ? `<ul class="st_use"><li>${useTmp.join('</li><li>')}</li></ul>` : '';
          break;
      }
    }
    return r;
  }

  const blurValue = (buff) => {
    if (_SZ_HAS_LOGIN) {
      return buff
    }
    return buff.replace(/(<td class="col-d c-col-[12345]">)(.*?)(<\/td>)/g, (match, p1, p2, p3) => {
      const len = p2.length * 8;
      let percent = Math.floor((len / 175) * 100);
      if (percent > 90) {
        percent = 90;
      }
      const html = `<span class="motionblur_left"></span>
      <span class="motionblur" style="width:${percent}%"></span>
      <span class="motionblur_right"></span>`;
      return p1 + html + p3;
    });
  }
  // 遍历每个详情模块
  let html = ''
  detail.filter($v => {
    // 根据模块类型确定具体样式
    const moduleType = $v['mod_id'];
    const $cols = $v['cols']
    const $stans = $v['stans']

    // 检查模块是否应该显示
    const shouldSkip = !preview && (!$mod[moduleType]?.f_show || $mod[moduleType].f_show === 0);
    if (shouldSkip) {
      return;
    }
    // 构建行样式类名
    const baseClass = 'c-row c-row-h';
    let moduleSpecificClass = '';
    const isProcessingModule = $mod[moduleType]?.comment === '加工方式';
    const hasWetData = $cols.includes('data_wet');
    switch (moduleType) {
      case 'base':
        moduleSpecificClass = 'c-row-2'; // 基础信息样式
        break;
      case 'Glassfiberproperty':
        moduleSpecificClass = 'c-row-6'; // 玻璃纤维属性样式
        break;
      default:
        if (isProcessingModule || moduleType === 'Referenceformula') {
          moduleSpecificClass = 'c-row-3'; // 加工方式和参考公式样式
        } else if (hasWetData) {
          moduleSpecificClass = 'c-row-5'; // 含水数据样式
        } else {
          moduleSpecificClass = 'c-row-4'; // 默认数据样式
        }
    }
    const rowClass = `${baseClass} ${moduleSpecificClass}`;
    let headers = ''
    let i = 0
    $cols.filter($va => {
      if ($va === 'condition' && $mod[moduleType]?.cols?.name) {
        return;
      }
      headers += `<th class="c-col-${i}">`;
      if ($va === 'name') {
        headers += $mod[moduleType][$va][lang];
      } else if (moduleType === 'base' && $va === 'data') {
        return;
      } else if ($va === 'data' && hasWetData) {
        headers += transProxy['干态'];
      } else {
        if ($mod[moduleType]['cols'][$va]) {
          headers += $mod[moduleType]['cols'][$va][lang]
        }
      }
      i++
      headers += '</th>';
    });
    const tableHeaders = `<tr class="${rowClass}">${headers}</tr>`;

    // 制造商
    const htmlMfrsFullName = () => {
      return `<tr>
            <td class="c-col-0">${transProxy['制造商']}</td>
            <td class="c-col-1">${mfrsFullName}</td>
          </tr>`
    }
    // 其他证书
    const htmlOtherCertificates = () => {
      const htmlStart = `<tr>
            <td class="c-col-0">${transProxy['其他证书']}</td>
            <td class="c-col-1">
              <ul class="zshu">`
      const htmlEnd = `</ul></td></tr>`
      const listItems = Object.entries(ALLOW_TYPES)
        .filter(([_, value]) => value !== 'ul' && $info[`${value}_id`])
        .map(([key, _]) => `<li><a>${key}</a></li>`)
        .join('');
      if (listItems) {
        return `${htmlStart}${listItems}${htmlEnd}`;
      }
      return ''
    }
    // 认证证书
    const htmlCertificates = () => {
      const html = Object.entries(ALLOW_TYPES)
        .filter(([_, value]) => $info[`${value}_id`])
        .map(([key, value]) => {
          if (isEmail) {
            return `<a href="${_SZ_HAS_LOGIN ? `/plastic/getFileV2?id=${$info.uuid}&type=${value}` : 'javascript:void(0)'}" 
                target="_blank" 
                title="${key}">
                <img src="/images/certificate/fj_${value}.png">
              </a>`;
          } else {
            return `<a onclick="setByEmailVisible(${isEmail})" 
                title="${key}">
                <img src="/images/certificate/fj_${value}.png">
              </a>`;
          }
        }).join('');
      if (html) {
        return `<tr>
            <td class="c-col-0">${transProxy['认证证书']}</td>
            <td class="c-col-1">
              <div class="file">
                ${html}
              </div>
            </td>
          </tr>`;
      }
      return ''
    };
    // 产品信息其他行
    const renderRowList = ($va) => {
      let html = '';
      $va['row_list'].forEach(($vb, index) => {
        if (!$row_show[$vb['row_id']]) return;
        let rowHtml = `<tr class="${index % 2 ? 'even' : 'odd'}">`;
        let hasContent = false;
        $cols.forEach((col, i) => {
          const isDataCol = col.substring(0, 4) === 'data';
          const tdClass = `${isDataCol ? 'col-d' : 'col-n'} c-col-${i}`;
          const value = Boolean(params.units) ? $vb.infoValueStan : $vb.infoValue;
          const basic_data = []
          let content = formatDatasheetCol(col, $vb['row_type'][col], basic_data, value, params.pv, params.tv, params.iv, $info);
          if (col === 'data' && content !== '') {
            hasContent = true;
            content = content.replace(/^~+|~+$/g, ''); // trim ~ characters
          }
          rowHtml += `<td class="${tdClass}">${content}</td>`;
        });
        rowHtml += '</tr>';
        if (hasContent) {
          html += rowHtml;
        }
      });

      return html;
    }
    // 非产品信息行
    const generateTableRows = ($va, $mod, modId) => {
      let html = '';
      $va['row_list'].forEach($vb => {
        if (!$row_show[$vb['row_id']]) return;
        html += '<tr>';
        $cols.forEach((col, index) => {
          if (col === 'condition' && $mod[modId].cols.name) return;
          const colClass = col.substring(0, 4) === 'data' ? 'col-d' : 'col-n';
          html += `<td class="${colClass} c-col-${index}">`;
          const value = Boolean(params.units) ? $vb.infoValueStan : $vb.infoValue;
          const basic_data = []
          let content = formatDatasheetCol(col, $vb['row_type'][col], basic_data, value, params.pv, params.tv, params.iv);
          switch (col) {
            case 'name':
              if ($mod[modId]['cols']['condition']) {
                const conditionContent = formatDatasheetCol('condition', $vb['row_type']['condition'], basic_data, value, params.pv, params.tv, params.iv);
                content += '&nbsp;&nbsp;&nbsp;' + conditionContent;
              }
              break;

            case col.substring(0, 4) === 'data' && col:
              if (content === '<=') content = '';
              if (content !== '') {
                content = content.trim().replace(/^~+|~+$/g, '');
              }
              break;

            default:
              if (content !== '') {
                content = content.trim().replace(/^~+|~+$/g, '');
              }
              break;
          }
          html += content;
          html += '</td>';
        });

        html += '</tr>';
      });

      return html;
    }

    let tableContenr = ''
    $stans.filter($va => {
      if (['ALL', 'ASTM'].includes($va['stan_id'])) {
        if (moduleType == 'base') {
          tableContenr = `${htmlMfrsFullName()}${htmlOtherCertificates()}${renderRowList($va)}${htmlCertificates()}`
        } else {
          tableContenr = generateTableRows($va, $mod, moduleType)
        }
      }
    })

    if (tableContenr) {
      html += `<table cellspacing="0" class="${moduleType} c-tb">${tableHeaders}${tableContenr}</table>`
    }
  })

  
  const dom = document.querySelector("#table")
  dom.innerHTML = blurValue(html)
})