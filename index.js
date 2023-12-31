const axios = require("axios");
const { JSDOM } = require("jsdom");
const { XMLParser } = require("fast-xml-parser");
var qs = require('qs');
const moment = require("moment/moment");




async function One() {
  var config = {
    method: "get",
    url: "https://apps.pertamina.com/WebLIMS/login.htm",
    headers: {
      host: "apps.pertamina.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.5",
      "accept-encoding": "gzip, deflate",
      connection: "keep-alive",
      "upgrade-insecure-requests": "1",
    },
  };

  return axios(config)
    .then(function (response) {
      let cookie = response.headers["set-cookie"][0].split(" ")[0];
      return cookie;
    })
    .catch(function (error) {
      console.log(error);
    });
}


async function LoginForm(jsession) {
  var data = qs.stringify({
    'loginForm:username': 'sutanto',
    'loginForm:password': 'XXXXXXXXXXX',
    'loginForm:password_lwentransmitter': '4kZBuVwmDa4NXnaSw2RjXxM6Ruda5TaVmxG2jnZaeSiGIBbBZx//5AxCpM+3KKHhkoeAEFDe2ZELhYG6WpI/PRfBuahkPL6iRRlX5wBkCi4o37U5KOaJyADWcgvfHZIf1knogAUE2ySUqwFEWmA17YYnYCaaOjsl1AV887VeG6U=',
    'lw.viewguid': 'ecid_c10d524c1815e8faa82623d4a4b17e67',
    'javax.faces.ViewState': 'ecruiser.util.SerializedComponent$TreeStructure@307106c3',
    'loginForm': 'true'
  });
  var config = {
    method: 'post',
    url: 'https://apps.pertamina.com/WebLIMS/login.htm?ec_eid=onclick&ec_cid=loginForm%3AlogButton',
    headers: {
      'host': 'apps.pertamina.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.5',
      'accept-encoding': '*',
      'content-length': 427,
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://apps.pertamina.com',
      'connection': 'keep-alive',
      'referer': 'https://apps.pertamina.com/WebLIMS/login.htm',
      'cookie': `${jsession}  ec_aurl=L1dlYkxJTVMvbG9naW4uaHRt;`,
      'upgrade-insecure-requests': '1'
    },
    maxRedirects: 0,
    data: data,
    validateStatus: function (status) {
      return status >= 200 && status <= 302
    }
  };

  return axios(config)
    .then(function (response) {
      let cookie1 = response.headers["set-cookie"][2].split(" ")[0];
      return cookie1
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function mainPage(jsession) {

  var config = {
    method: 'get',
    url: 'https://apps.pertamina.com/WebLIMS/index.htm?init_weblims=true&ec_eid=onclick&ec_cid=loginForm%3AlogButton',
    headers: {
      'host': 'apps.pertamina.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.5',
      'accept-encoding': '*',
      'referer': 'https://apps.pertamina.com/WebLIMS/login.htm',
      'connection': 'keep-alive',
      'cookie': `${jsession} ec_aurl=L1dlYkxJTVMvbG9naW4uaHRt; lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton`,
      'upgrade-insecure-requests': '1'
    }
  };

  return axios(config)
    .then(function (response) {
      const dom1 = new JSDOM(response.data)
      const viewstate1 = dom1.window.document.getElementById("javax.faces.ViewState").value
      const uid = dom1.window.document.getElementsByName('mf:workFlowTabPane:sel')[0].value
      const menus = dom1.window.document.querySelectorAll('.sub>.mc>.mct')
      const menus_array = Array.from(menus)
      const all = menus_array.filter((x) => {
        const split = x.innerHTML.split(' ')[1]
        return split == "DI"
      }).map((x) => {
        return x.parentElement.id.split(":")[1]
      })

      return { viewstate1, uid, all }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function openQuery(jsession, viewstate2, uid, uriid) {
  var data = qs.stringify({
    'mf:search:label': '',
    'mf:search': '',
    'mf:workFlowTabPane:sel': uid,
    'mf:workFlowTabPane_clPane': uid,
    'mf:workFlowTabPane:_fc_': '',
    'lw.viewguid': 'ecid_c10d524c1815e8faa82623d4a4b17e67',
    'javax.faces.ViewState': viewstate2,
    'mf': 'true',
    '': ''
  });
  var config = {
    method: 'post',
    url: `https://apps.pertamina.com/WebLIMS/index.htm?ec_eid=onclick&ec_cid=mf%3A${uriid}&ec_ajax=true&ts=${Date.now()}`,
    headers: {
      'host': 'apps.pertamina.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.5',
      'accept-encoding': '*',
      'content-length': 289,
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://apps.pertamina.com',
      'connection': 'keep-alive',
      'referer': 'https://apps.pertamina.com/WebLIMS/index.htm?init_weblims=true&ec_eid=onclick&ec_cid=loginForm%3AlogButton',
      'cookie': `${jsession} _ga=GA1.2.1113838315.1658209289; ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt; lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton`
    },
    data: data,
    maxRedirects: 0
  };

  return axios(config)
    .then(function (response) {
      const xml_obj = (new XMLParser()).parse(response.data);
      const uri = xml_obj.resp.eval.expr.split('\'')[3]
      return uri
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function openTable(jsession, uri) {
  var options = {
    method: 'GET',
    url: `https://apps.pertamina.com/WebLIMS/${uri}`,
    headers: {
      host: 'apps.pertamina.com',
      'proxy-connection': 'keep-alive',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      referer: 'https://apps.pertamina.com/WebLIMS/index.htm?init_weblims=true&ec_eid=onclick&ec_cid=loginForm%3AlogButton',
      'accept-encoding': '*',
      'accept-language': 'en-US,en;q=0.9',
      cookie: `${jsession} lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt`
    }
  };



  return axios(options)
    .then(function (response) {
      const table_dom = new JSDOM(response.data)
      const run_button = table_dom.window.document.getElementsByTagName('img')
      const button_array = Array.from(run_button)
      const button_filter = button_array.filter((x) => {
        return x['title'] == 'Run'
      })
      const button_run_id = button_filter[0].parentElement.id.split(':')[2];
      const table_el_arr = table_dom.window.document.getElementsByClassName('dataTableMain')
      const table_id_arr = Array.from(table_el_arr).map((x) => {
        return x.id.split(
          ":mainRow"
        )[0]
      })
      const popup_arr = table_dom.window.document.getElementsByClassName('popup')
      const popup = Array.from(popup_arr).map((x) => {
        return x.id
      })
      const viewguid = table_dom.window.document.getElementById('lw.viewguid').value
      const viewstate = table_dom.window.document.getElementById('javax.faces.ViewState').value
      const menus2 = table_dom.window.document.getElementsByClassName('mct')
      const menus_array2 = Array.from(menus2)
      const all2 = menus_array2.filter((x) => {
        const split = x.innerHTML.split(' ')[1]
        return split == "DI"
      }).map((x) => {
        return x.parentElement.id.split(":")[2]
      })
      const extern2 = menus_array2.filter((x) => {
        const split = x.innerHTML.split(' ')[1]
        return split == "EXT"
      }).map((x) => {
        return x.parentElement.id.split(":")[2]
      })

      return [[button_run_id, table_id_arr, popup, viewguid, viewstate], all2, extern2]
    })
    .catch(function (error) {
      console.log(error);
    });
}



async function openDate(jsession, uri, run_button, table_id, popup, viewguid, viewstate) {
  var data = qs.stringify({
    'mf:search:label': '',
    'mf:search': '',
    [`${table_id[0]}:editcache`]: '',
    [`${table_id[0]}:1:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:2:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:3:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:4:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:5:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:7:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:9:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:10:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:13:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:14:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:15:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:16:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:17:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:18:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:19:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:20:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:21:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:22:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:23:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:24:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:TbDBEntry`]: '',
    [`${table_id[0]}:TbComboBox`]: '',
    [`${table_id[0]}:TbComboBox:value`]: '',
    [`${table_id[0]}:TbFile`]: '',
    [`${table_id[0]}:TbDBEntryWizard`]: '',
    [`${table_id[0]}:TbInterval`]: '0 00:00:00',
    [`${table_id[0]}:TbString`]: '',
    [`${table_id[0]}:TbDate`]: 'dd-mmm-yyyy',
    //[`${table_id[0]}:_ecid245193080`]: '',
    [`${table_id[0]}:TbTime`]: '',
    [`${table_id[0]}:TbDateTime`]: 'dd-mmm-yyyy hh:mm:ss',
    //   [`${table_id[0]}:_ecid245193082`]: '',
    [`${table_id[0]}:TbDBFile`]: '',
    [`${table_id[0]}:TbMultiList`]: '',
    [`${table_id[0]}:TbFloa`]: '',
    [`${table_id[0]}:TbInteger`]: '',
    [`${table_id[0]}:TbDBEntry`]: '',
    [`${table_id[0]}:TbComboBox`]: '',
    [`${table_id[0]}:TbComboBox:value`]: '',
    [`${table_id[0]}:TbFile`]: '',
    [`${table_id[0]}:TbDBEntryWizard`]: '',
    [`${table_id[0]}:TbInterval`]: '0 00:00:00',
    [`${table_id[0]}:TbString`]: '',
    [`${table_id[0]}:TbDate`]: 'dd-mmm-yyyy',
    //  [`${table_id[0]}:_ecid245193080`]: '',
    [`${table_id[0]}:TbTime`]: '',
    [`${table_id[0]}:TbDateTime`]: 'dd-mmm-yyyy hh:mm:ss',
    //   [`${table_id[0]}:_ecid245193082`]: '',
    [`${table_id[0]}:TbDBFile`]: '',
    [`${table_id[0]}:TbMultiList`]: '',
    [`${table_id[0]}:TbFloat`]: '',
    [`${table_id[0]}:TbInteger`]: '',
    [`${table_id[0]}:columnWidths`]: '',
    [`${table_id[0]}:selection`]: '0 0 1 1',
    [`${table_id[0]}:editCell`]: '',
    [`${table_id[0]}:rowHeights`]: '',
    [`${table_id[0]}:editedRows`]: '',
    [`${table_id[0]}:editControl`]: '',
    //   'mf:tp:_uid_5A0013F8_:curPos': '',
    [`${table_id[1]}:_fc_`]: '',
    [`${table_id[1]}:columnWidths`]: '',
    [`${popup[0]}:hasContent`]: 'true',
    [`${popup[1]}:hasContent`]: 'true',
    'lw.viewguid': viewguid,
    'javax.faces.ViewState': viewstate,
    'mf': 'true',
    '': ''
  });
  var config = {
    method: 'post',
    url: `https://apps.pertamina.com/WebLIMS/${uri}?ec_eid=onclick&ec_cid=mf%3Atp%3A${run_button}&ec_ajax=true&ts=${Date.now()}`,
    headers: {
      'host': 'apps.pertamina.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.5',
      'accept-encoding': '*',
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://apps.pertamina.com',
      'connection': 'keep-alive',
      'referer': `https://apps.pertamina.com/WebLIMS/${uri}`,
      'cookie': `${jsession} lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt; `
    },
    data: data
  };

  return axios(config)
    .then(function (response) {
      const xml_obj = (new XMLParser()).parse(response.data);
      const html = xml_obj.resp.updateComp.html
      const dom = new JSDOM(html)
      const button = dom.window.document.getElementsByTagName('button')[0].id
      const html1 = xml_obj.resp.viewState
      const dom1 = new JSDOM(html1)
      const viewstate1 = dom1.window.document.getElementById('javax.faces.ViewState').value

      return [button, dom, viewstate1]
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function clickOK(jsession, uri, button, dom, viewstate) {
  var date = moment().format("DD-MMM-YYYY")
  var date2 = moment().format("YYYY-MM-DD")

  const doc_arr = dom.window.document.getElementsByTagName('input')

  const doc = Array.from(doc_arr).map((x) => {
    return x.getAttribute('id')
  })
  const lwview = doc_arr[10].value
  const weblist = doc_arr[0].getAttribute('popup')
  const ecnum = doc[0].split(":")[0].slice(11, 14)
  const ecnum_int = parseInt(ecnum)
  const ec = doc[0].split(":")[0].slice(0, 11)
  const inp = dom.window.document.getElementsByClassName("iconinput-input")[1].value
  const obj = {
    [`${doc[6].slice(0, -11)}:popupState`]: "popup",

    [`${doc[6].slice(0, -11)}:order`]: "3",
    "lw.viewguid": `${lwview}`,
    "javax.faces.ViewState": "",
    [`${doc[0].split(":")[0]}`]: "true",
    [`${doc[0].slice(0, -4)}`]: "",
    [`${doc[0].slice(0, -4)}:value`]: "",
    [`${doc[2].slice(0, -2)}`]: inp,
    [`${doc[0].split(":")[0]}:${ec}${ecnum_int + 2}:_fc_`]: "",
    [`${doc[0].split(":")[0]}:${ec}${ecnum_int + 2}`]: date2,
    [`${doc[0].split(":")[0]}:${ec}${ecnum_int + 1}:hasContent`]: "true",
    [`${doc[4].slice(0, -2)}`]: inp,
    [`${doc[0].split(":")[0]}:${ec}${ecnum_int + 4}:_fc_`]: "",
    [`${doc[0].split(":")[0]}:${ec}${ecnum_int + 4}`]: date2,
    [`${doc[0].split(":")[0]}:${ec}${ecnum_int + 3}:hasContent`]: "true",
    [`${doc[0].split(":")[0]}:${weblist}:hasContent`]: "true",
    [`${doc[6].slice(0, -11)}:windowState`]: "window:normal;",
    [`${doc[6].slice(0, -11)}:hasContent`]: "true",
    [`${doc[6].slice(0, -11)}:windowSize`]: "420@209",
    "": ""
  }
  const lwfocus = Buffer.from(doc[0].slice(0, -4)).toString('base64')
  const ecfocus = Buffer.from(button).toString('base64')
  const data = qs.stringify(obj);
  const but_arr = button.split(":")
  var config = {
    method: 'post',
    url: `https://apps.pertamina.com/WebLIMS/${uri}?ec_eid=onclick&ec_cid=${but_arr[0]}%3A${but_arr[1]}&ec_ajax=true&ts=${Date.now()}`,
    headers: {
      'host': 'apps.pertamina.com',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      'content-type': 'application/x-www-form-urlencoded',
      'accept': '*/*',

      'origin': 'https://apps.pertamina.com',
      'referer': `https://apps.pertamina.com/WebLIMS/${uri}`,
      'accept-encoding': '*',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': `${jsession} ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt; lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; lw_focus_=${lwfocus}; ec_focus=${ecfocus}`
    },
    data: data
  };

  return axios(config)
    .then(function (response) {
      const xml_obj = (new XMLParser()).parse(response.data);
      const html = xml_obj.resp.updateComp.html
      const dom_table_final = new JSDOM(html)
      const html1 = xml_obj.resp.viewState
      const dom1 = new JSDOM(html1)
      const viewstate = dom1.window.document.getElementById('javax.faces.ViewState').value
      const onHidelink = xml_obj.resp.jsCall[0].comp
      return { dom_table_final, viewstate, lwfocus, ecfocus, onHidelink }
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function onHide(jsession, uri, viewstate, lwfocus, ecfocus, onHidelink) {
  var options = {
    method: 'POST',
    url: `https://apps.pertamina.com/WebLIMS/${uri}`,
    params: {
      ec_eid: 'onhide',
      ec_cid: onHidelink,
      ec_ajax: 'true',
      ts: Date.now()
    },
    headers: {
      host: 'apps.pertamina.com',
      'proxy-connection': 'keep-alive',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'content-type': 'application/x-www-form-urlencoded',
      accept: '*/*',
      origin: 'https://apps.pertamina.com',
      referer: `https://apps.pertamina.com/WebLIMS/${uri}`,
      'accept-encoding': 'gzip, deflate',
      'accept-language': 'en-US,en;q=0.9',
      cookie: `${jsession} lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt; lw_focus_=${lwfocus} ec_focus=${ecfocus}`
    },

  };

  return axios.request(options).then(function (response) {
    const xml_obj = (new XMLParser()).parse(response.data);
    const html1 = xml_obj.resp.viewState
    const dom1 = new JSDOM(html1)
    const viewstate6 = dom1.window.document.getElementById('javax.faces.ViewState').value
    return viewstate6
  }).catch(function (error) {
    console.error(error);
  });
}
async function refreshTable(jsession, uri, switch_button, table_id, popup, viewguid, viewstate) {
  const data = qs.stringify({
    'mf:search:label': '',
    'mf:search': '',
    [`${table_id[0]}:editcache`]: '',
    [`${table_id[0]}:1:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:2:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:3:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:4:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:5:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:7:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:9:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:10:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:13:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:14:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:15:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:16:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:17:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:18:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:19:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:20:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:21:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:22:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:23:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:24:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:TbDBEntry`]: '',
    [`${table_id[0]}:TbComboBox`]: '',
    [`${table_id[0]}:TbComboBox:value`]: '',
    [`${table_id[0]}:TbFile`]: '',
    [`${table_id[0]}:TbDBEntryWizard`]: '',
    [`${table_id[0]}:TbInterval`]: '0 00:00:00',
    [`${table_id[0]}:TbString`]: '',
    [`${table_id[0]}:TbDate`]: 'dd-mmm-yyyy',
    //[`${table_id[0]}:_ecid245193080`]: '',
    [`${table_id[0]}:TbTime`]: '',
    [`${table_id[0]}:TbDateTime`]: 'dd-mmm-yyyy hh:mm:ss',
    //   [`${table_id[0]}:_ecid245193082`]: '',
    [`${table_id[0]}:TbDBFile`]: '',
    [`${table_id[0]}:TbMultiList`]: '',
    [`${table_id[0]}:TbFloa`]: '',
    [`${table_id[0]}:TbInteger`]: '',
    [`${table_id[0]}:TbDBEntry`]: '',
    [`${table_id[0]}:TbComboBox`]: '',
    [`${table_id[0]}:TbComboBox:value`]: '',
    [`${table_id[0]}:TbFile`]: '',
    [`${table_id[0]}:TbDBEntryWizard`]: '',
    [`${table_id[0]}:TbInterval`]: '0 00:00:00',
    [`${table_id[0]}:TbString`]: '',
    [`${table_id[0]}:TbDate`]: 'dd-mmm-yyyy',
    //  [`${table_id[0]}:_ecid245193080`]: '',
    [`${table_id[0]}:TbTime`]: '',
    [`${table_id[0]}:TbDateTime`]: 'dd-mmm-yyyy hh:mm:ss',
    //   [`${table_id[0]}:_ecid245193082`]: '',
    [`${table_id[0]}:TbDBFile`]: '',
    [`${table_id[0]}:TbMultiList`]: '',
    [`${table_id[0]}:TbFloat`]: '',
    [`${table_id[0]}:TbInteger`]: '',
    [`${table_id[0]}:columnWidths`]: '',
    [`${table_id[0]}:selection`]: '0 0 1 1',
    [`${table_id[0]}:editCell`]: '',
    [`${table_id[0]}:rowHeights`]: '',
    [`${table_id[0]}:editedRows`]: '',
    [`${table_id[0]}:editControl`]: '',
    //   'mf:tp:_uid_5A0013F8_:curPos': '',
    [`${table_id[1]}:_fc_`]: '',
    [`${table_id[1]}:columnWidths`]: '',
    [`${popup[0]}:hasContent`]: 'true',
    [`${popup[1]}:hasContent`]: 'true',
    'lw.viewguid': viewguid,
    'javax.faces.ViewState': viewstate,
    'mf': 'true',
    '': ''
  });
  const config = {
    method: 'post',
    url: `https://apps.pertamina.com/WebLIMS/${uri}?ec_eid=onclick&ec_cid=mf%3Atp%3A${switch_button}&ec_ajax=true&ts=${Date.now()}`,
    headers: {
      'host': 'apps.pertamina.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.5',
      'accept-encoding': '*',
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://apps.pertamina.com',
      'connection': 'keep-alive',
      'referer': `https://apps.pertamina.com/WebLIMS/${uri}`,
      'cookie': `${jsession} lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt; `
    },
    data: data
  };

  return axios(config)
    .then(function (response) {

    })
    .catch(function (error) {
      console.log(error);
    });
}

async function sortSample(raw_sam) {
  var sample_malem = raw_sam.filter((sample_obj) => {
    var date = new Date(Date.parse(sample_obj.date))
    return date.getHours() < 8
  })
  var sample_pagi = raw_sam.filter((sample_obj) => {
    var date = new Date(Date.parse(sample_obj.date))
    return date.getHours() >= 8 && date.getHours() < 16
  })
  var sample_sore = raw_sam.filter((sample_obj) => {
    var date = new Date(Date.parse(sample_obj.date))
    return date.getHours() >= 16 && date.getHours() < 23

  })
  return { sample_malem, sample_pagi, sample_sore }

}
function detectShift(sample_obj) {
  if (sample_obj.length > 0) {
    var date = new Date(Date.parse(sample_obj[0].date))
    if (date.getHours() < 8) {
      return "Malam"
    } else if (date.getHours() >= 8 && date.getHours() < 16) {
      return "Pagi"
    } else {
      return "Sore"
    }
  } else {
    return "No Sample"
  }
}


async function castSample(sam) {
  var shift = detectShift(sam)
  var obj_list = sam.reduce(function (acc, curr) {
    if (!acc[curr.code]) {
      acc[curr.code] = [];
    }
    acc[curr.code].push(curr);
    return acc;
  }, {});
  var arr_list = Object.values(obj_list).sort((a, b) => a[0].code - b[0].code);
  var final_sample = arr_list.reduce(
    function (acc, curr) {
      let sample_name = curr[0].code
      let point_detail = curr.reduce(function (acc, curr1) {
        str = `${curr1.param} : ${curr1.value} ${curr1.unit} \n`
        acc = `${acc} ${str}`
        return acc;
      }, "")
      acc = `${acc}<b>${sample_name} :</b>\n${point_detail}`

      return acc;
    }, "")
  return `<b>Shift : ${shift}</b> \n${final_sample}`
}
async function sendMessage(message) {
  console.log(message)
  async function callAxiosWithRetry(config, depth, failMassage) {
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    try {
      return await axios(config)
    } catch (e) {
      if (depth > 10) {
        throw e;
      }
      console.log(failMassage.red)
      await wait(2 ** depth * 100);
      console.log("Retrying .. ".green + depth)
      return callAxiosWithRetry(config, depth + 1, failMassage);
    }
  }
  let encoded = encodeURIComponent(message);
  var config = {
    method: 'post',
    url: `https://api.telegram.org/bot5266529032:AAG6oq2TOmKOXrt5qaeVLk3ehvYF0bJZ6ko/sendMessage?chat_id=-887497688&parse_mode=HTML&text=${encoded}`,
    headers: {}
  };

  await callAxiosWithRetry(config, 0, "Fail Send Telegram")
    .then(function (response) {
      console.log("Telegram message Sent");
    })
    .catch(function (error) {
      console.log("Failed sending Telegram message");
    });
}
function stringRep(text) {

  var mapObj = {
    "Kinematic Viscosity at 40°C": "Visco 40°C",
    "Kinematic Viscosity at 60°C": "Visco 60°C",
    "Kinematic Viscosity at 100°C": "Visco 100°C",
    "Flash Point COC": "FP COC",
    "Flash Point PMCC": "FP PMCC",
    "Refractive Index 70°C": "RI 70°C",
    "Refractive Index 20°C": "RI 20°C",
    "Appearance": "App",
    "Specific Gravity at 70°C": "Sg 70°C",
    "Colour ASTM": "Color",
    "Conradson Carbon Residue": "CCR",
    "Specific Gravity at 60/60°F": "Sg 60/60°F",
    "Viscosity Gravity Constant": "VGC",
    "Pour Point": "PP",
    "Viscosity Index": "VI",
    "Traces Methyl Ethyl Ketone": "Traces MEK",
    "MM2_S": "cSt",
    "NONE": "",
    "DEG_C": "°C",
    "ASTM_UNIT": "",
    "DEG_F": "°F",
    "PCT_MM": "",
  };

  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
  str = text.replace(re, function (matched) {
    return mapObj[matched];
  });
  return str
}
async function main() {
  console.time()
  const jsession1 = await One();
  const jsession2 = await LoginForm(jsession1)
  const { viewstate1, uid, all } = await mainPage(jsession2)
  const uri_1 = await openQuery(jsession2, viewstate1, uid, all)
  const open_table_1 = await openTable(jsession2, uri_1)
  const open_date_1 = await openDate(jsession2, uri_1, ...open_table_1[0])
  const { dom_table_final, viewState5, lwfocus, ecfocus, onHidelink } = await clickOK(jsession2, uri_1, ...open_date_1)
  const viewstate6 = await onHide(jsession2, uri_1, viewState5, lwfocus, ecfocus, onHidelink)
  await refreshTable(jsession2, uri_1, open_table_1[2], open_table_1[0][2], open_table_1[0][3], open_table_1[0][4], viewstate6)
  const open_date_2 = await openDate(jsession2, uri_1, ...open_table_1[0])
  const x = await clickOK(jsession2, uri_1, ...open_date_2)
  const sample_arr_di = dom_table_final.window.document.getElementsByClassName('dataTableInner')[0].children[1].children
  const sample_arr_ext = x.dom_table_final.window.document.getElementsByClassName('dataTableInner')[0].children[1].children

  const samples_di = Array.from(sample_arr_di).map((x) => {
    const sample = x.children
    return {
      section: sample[2].innerHTML,
      date: sample[1].innerHTML,
      code: sample[4].innerHTML,
      value: sample[8].innerHTML,
      param: sample[6].innerHTML,
      unit: sample[7].innerHTML
    }
  })
  const samples_ext = Array.from(sample_arr_ext).map((x) => {
    const sample = x.children
    return {
      section: sample[2].innerHTML,
      date: sample[1].innerHTML,
      code: sample[4].innerHTML,
      value: sample[8].innerHTML,
      param: sample[6].innerHTML,
      unit: sample[7].innerHTML
    }
  })
  const sorted = await sortSample(samples_di)

  for (const val of Object.values(sorted)) {
    if (val.length > 0) {
      const casted = await castSample(val)
      const reduced = stringRep(casted)
      await sendMessage(reduced)
      console.log(casted)
    }
  }

  console.timeEnd()

}
main();
