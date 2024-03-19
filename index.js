const axiost = require("axios");
const { JSDOM } = require("jsdom");
const { XMLParser } = require("fast-xml-parser");
var qs = require('qs');
const moment = require("moment/moment");





async function One() {
  var config = {
    method: "GET",
    headers: {
      "Host": "apps.pertamina.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  };

  try {
    const response = await fetch("https://apps.pertamina.com/LIMS/login.htm", config);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let cookie = response.headers.get("set-cookie").split(" ")[0];
    return cookie;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Propagate the error for handling higher up in the call stack if needed
  }
}


async function LoginForm(jsession) {
  const data = new URLSearchParams({
    'loginForm:username': 'sutanto',
    'loginForm:password': 'XXXXXXXXXXX',
    'loginForm:password_lwentransmitter': '4kZBuVwmDa4NXnaSw2RjXxM6Ruda5TaVmxG2jnZaeSiGIBbBZx//5AxCpM+3KKHhkoeAEFDe2ZELhYG6WpI/PRfBuahkPL6iRRlX5wBkCi4o37U5KOaJyADWcgvfHZIf1knogAUE2ySUqwFEWmA17YYnYCaaOjsl1AV887VeG6U=',
    'lw.viewguid': 'ecid_c10d524c1815e8faa82623d4a4b17e67',
    'javax.faces.ViewState': 'ecruiser.util.SerializedComponent$TreeStructure@307106c3',
    'loginForm': 'true'
  });

  const config = {
    method: 'POST',
    headers: {
      'Host': 'apps.pertamina.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': '*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.toString().length.toString(),
      'Origin': 'https://apps.pertamina.com',
      'Connection': 'keep-alive',
      'Referer': 'https://apps.pertamina.com/LIMS/login.htm',
      'Cookie': `${jsession}  ec_aurl=L0xJTVMvbG9naW4uaHRt;`,
      'Upgrade-Insecure-Requests': '1'
    },
    redirect: 'manual',
    body: data,
  };

  try {
    const response = await fetch('https://apps.pertamina.com/LIMS/login.htm?ec_eid=onclick&ec_cid=loginForm%3AlogButton', config);


    const setCookieHeader = response.headers.get('set-cookie');
    const cookie1 = setCookieHeader.split(", ")[4].split(" ")[0];
    return cookie1;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function mainPage(jsession) {
  var config = {
    method: 'GET',
    headers: {
      'Host': 'apps.pertamina.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': '*',
      'Referer': 'https://apps.pertamina.com/LIMS/login.htm',
      'Connection': 'keep-alive',
      'Cookie': `${jsession} ec_aurl=L0xJTVMvbG9naW4uaHRt; lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton`,
      'Upgrade-Insecure-Requests': '1'
    }
  };

  try {
    const response = await fetch('https://apps.pertamina.com/LIMS/index.htm?init_weblims=true&ec_eid=onclick&ec_cid=loginForm%3AlogButton', config);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const htmlText = await response.text();
    const dom1 = new JSDOM(htmlText);
    const viewstate1 = dom1.window.document.getElementById("javax.faces.ViewState").value;
    const uid = dom1.window.document.getElementsByName('mf:workFlowTabPane:sel')[0].value;
    const menus = dom1.window.document.querySelectorAll('.sub>.mc>.mct');
    const menus_array = Array.from(menus);
    const ec_aurl = response.headers.get('set-cookie');
    const all = menus_array.filter((x) => {
      const split = x.innerHTML.split(' ')[1];
      return split == "DI";
    }).map((x) => {
      return x.parentElement.id.split(":")[1];
    });

    return { viewstate1, uid, all, ec_aurl };
  } catch (error) {
    console.error(error);
    throw error;
  }
}


async function openQuery(jsession, viewstate2, uid, uriid, ec_aurl) {
  var data = new URLSearchParams({
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
    method: 'POST',
    headers: {
      'Host': 'apps.pertamina.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': '*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.toString().length.toString(),
      'Origin': 'https://apps.pertamina.com',
      'Connection': 'keep-alive',
      'Referer': 'https://apps.pertamina.com/LIMS/index.htm?init_weblims=true&ec_eid=onclick&ec_cid=loginForm%3AlogButton',
      'Cookie': `${jsession} _ga=GA1.2.1113838315.1658209289; ${ec_aurl} lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton`
    },
    body: data,
    redirect: 'manual'
  };

  try {
    const response = await fetch(`https://apps.pertamina.com/LIMS/index.htm?ec_eid=onclick&ec_cid=mf%3A${uriid}&ec_ajax=true&ts=${Date.now()}`, config);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const xmlText = await response.text();
    const xml_obj = (new XMLParser()).parse(xmlText);
    const uri = xml_obj.resp.eval.expr.split('\'')[3];
    return uri;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function openTable(jsession4, uri, ec_aurl) {
  let config = {
    method: 'GET',
    headers: {
      'host': 'apps.pertamina.com',
      'connection': 'keep-alive',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      'referer': 'https://apps.pertamina.com/LIMS/index.htm?init_weblims=true&ec_eid=onclick&ec_cid=loginForm%3AlogButton',
      'accept-encoding': '*',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': `lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; ${jsession4} lw_focus_=bWY6c2VhcmNo`,
    }
  };

  try {
    const response = await fetch(`https://apps.pertamina.com/LIMS/${uri}`, config);
    const responseData = await response.text();
    const table_dom = new JSDOM(responseData);
    const run_button = table_dom.window.document.getElementsByTagName('img');
    const button_array = Array.from(run_button);
    const button_filter = button_array.filter((x) => {
      return x['title'] == 'Run';
    });
    const button_run_id = button_filter[0].parentElement.id.split(':')[2];
    const table_el_arr = table_dom.window.document.getElementsByClassName('dataTableMain');
    const table_id_arr = Array.from(table_el_arr).map((x) => {
      return x.id.split(":mainRow")[0];
    });
    const popup_arr = table_dom.window.document.getElementsByClassName('popup');
    const popup = Array.from(popup_arr).map((x) => {
      return x.id;
    });
    // const viewguid = table_dom.window.document.getElementById('lw.viewguid').value;
    const viewstate = table_dom.window.document.getElementById('javax.faces.ViewState').value;
    const menus2 = table_dom.window.document.getElementsByClassName('mct');
    const menus_array2 = Array.from(menus2);
    const all2 = menus_array2.filter((x) => {
      const split = x.innerHTML.split(' ')[1];
      return split == "DI";
    }).map((x) => {
      return x.parentElement.id.split(":")[2];
    });
    const extern2 = menus_array2.filter((x) => {
      const split = x.innerHTML.split(' ')[1];
      return split == "EXT";
    }).map((x) => {
      return x.parentElement.id.split(":")[2];
    });

    return [[button_run_id, table_id_arr, popup, viewstate], all2, extern2];
  } catch (error) {
    console.log(error);
  }
}


async function openDate(jsession, uri, run_button, table_id, popup, viewstate) {
  const formData = new URLSearchParams();
  formData.append('mf:search:label', '');
  formData.append('mf:search', '');
  formData.append(`${table_id[0]}:editcache`, '');

  // Append other form data parameters here...

  formData.append('javax.faces.ViewState', viewstate);
  formData.append('mf', 'true');
  formData.append('', '');

  const headers = new Headers({
    'host': 'apps.pertamina.com',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.5',
    'accept-encoding': '*',
    'content-type': 'application/x-www-form-urlencoded',
    'origin': 'https://apps.pertamina.com',
    'connection': 'keep-alive',
    'referer': `https://apps.pertamina.com/LIMS/${uri}`,
    'cookie': `${jsession} lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt;`
  });

  try {
    const response = await fetch(`https://apps.pertamina.com/LIMS/${uri}?ec_eid=onclick&ec_cid=mf%3Atp%3A${run_button}&ec_ajax=true&ts=${Date.now()}`, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    const text = await response.text();
    const xml_obj = (new XMLParser()).parse(text);
    const html = xml_obj.resp.updateComp.html;
    const dom = new JSDOM(html);
    const button = dom.window.document.getElementsByTagName('button')[0].id;
    const html1 = xml_obj.resp.viewState;
    const dom1 = new JSDOM(html1);
    const viewstate1 = dom1.window.document.getElementById('javax.faces.ViewState').value;

    return [button, dom, viewstate1];
  } catch (error) {
    console.log(error);
  }
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
  const data = new URLSearchParams(obj).toString();
  const but_arr = button.split(":")

  try {
    const response = await fetch(`https://apps.pertamina.com/LIMS/${uri}?ec_eid=onclick&ec_cid=${but_arr[0]}%3A${but_arr[1]}&ec_ajax=true&ts=${Date.now()}`, {
      method: 'POST',
      headers: {
        'host': 'apps.pertamina.com',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'content-type': 'application/x-www-form-urlencoded',
        'accept': '*/*',
        'origin': 'https://apps.pertamina.com',
        'referer': `https://apps.pertamina.com/LIMS/${uri}`,
        'accept-encoding': '*',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': `${jsession} ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt; lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; lw_focus_=${lwfocus}; ec_focus=${ecfocus}`
      },
      body: data
    });

    const responseData = await response.text();
    const xml_obj = (new XMLParser()).parse(responseData);
    const html = xml_obj.resp.updateComp.html;
    const dom_table_final = new JSDOM(html);
    const html1 = xml_obj.resp.viewState;
    const dom1 = new JSDOM(html1);
    const newViewState = dom1.window.document.getElementById('javax.faces.ViewState').value;
    const onHidelink = xml_obj.resp.jsCall[0].comp;

    return { dom_table_final, viewstate: newViewState, lwfocus, ecfocus, onHidelink };
  } catch (error) {
    console.log(error);
  }
}


async function onHide(jsession, uri, viewstate, lwfocus, ecfocus, onHidelink) {
  const url = `https://apps.pertamina.com/LIMS/${uri}`;
  const params = new URLSearchParams({
    ec_eid: 'onhide',
    ec_cid: onHidelink,
    ec_ajax: 'true',
    ts: Date.now(),
  });

  const headers = new Headers({
    'host': 'apps.pertamina.com',
    'proxy-connection': 'keep-alive',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': '*/*',
    'origin': 'https://apps.pertamina.com',
    'referer': `https://apps.pertamina.com/LIMS/${uri}`,
    'accept-encoding': 'gzip, deflate',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': `${jsession} lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt; lw_focus_=${lwfocus} ec_focus=${ecfocus}`
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'POST',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();
    const xml_obj = new XMLParser().parse(text);
    const html1 = xml_obj.resp.viewState;
    const dom1 = new JSDOM(html1);
    const viewstate6 = dom1.window.document.getElementById('javax.faces.ViewState').value;
    return viewstate6;
  } catch (error) {
    console.error(error);
  }
}


async function refreshTable(jsession, uri, switch_button, table_id, popup, viewguid, viewstate) {
  const data = new URLSearchParams({
    'mf:search:label': '',
    'mf:search': '',
    [`${table_id[0]}:editcache`]: '',
    [`${table_id[0]}:1:3:TbCheckBox`]: 'true',
    [`${table_id[0]}:2:3:TbCheckBox`]: 'true',
    // ... (add other form fields as needed)
    'mf:tp:_uid_5A0013F8_:curPos': '',
    [`${table_id[1]}:_fc_`]: '',
    [`${table_id[1]}:columnWidths`]: '',
    [`${popup[0]}:hasContent`]: 'true',
    [`${popup[1]}:hasContent`]: 'true',
    'lw.viewguid': viewguid,
    'javax.faces.ViewState': viewstate,
    'mf': 'true',
    '': ''
  });

  const headers = new Headers({
    'host': 'apps.pertamina.com',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.5',
    'accept-encoding': '*',
    'content-type': 'application/x-www-form-urlencoded',
    'origin': 'https://apps.pertamina.com',
    'connection': 'keep-alive',
    'referer': `https://apps.pertamina.com/LIMS/${uri}`,
    'cookie': `${jsession} lims_dsNameCookie=LabWareV6Prod; queryStringCookie=ec_eid=onclick&ec_cid=loginForm%3AlogButton; ec_aurl=L1dlYkxJTVMvZXJyb3IuaHRt; `
  });

  try {
    const response = await fetch(`https://apps.pertamina.com/LIMS/${uri}?ec_eid=onclick&ec_cid=mf%3Atp%3A${switch_button}&ec_ajax=true&ts=${Date.now()}`, {
      method: 'POST',
      headers: headers,
      body: data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Process the response if needed

  } catch (error) {
    console.log(error);
  }
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
  return [sample_malem, sample_pagi, sample_sore]
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
  const pro_agent = require('proxying-agent').globalize('http://miftachul.huda:pertamina%402025@172.17.3.161:8080');
  async function callAxiosWithRetry(config, depth, failMassage) {
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    try {
      return await axiost(config)
    } catch (e) {
      if (depth > 10) {
        throw e;
      }
      console.log(e)
      await wait(2 ** depth * 100);
      console.log("Retrying .. " + depth)
      return callAxiosWithRetry(config, depth + 1, failMassage);
    }
  }
  let encoded = encodeURIComponent(message);
  var config = {
    httpAgent: pro_agent,
    httpsAgent: pro_agent,
    method: 'post',
    url: `https://api.telegram.org/bot5266529032:AAG6oq2TOmKOXrt5qaeVLk3ehvYF0bJZ6ko/sendMessage?chat_id=-805440157&parse_mode=HTML&text=${encoded}`,
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
async function proceesArray(array_in) {
  const samples_di = Array.from(array_in).map((x) => {
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



  function ShiftNow() {
    var date = new Date()
    if (date.getHours() < 8) {
      return "Malam"
    } else if (date.getHours() >= 8 && date.getHours() < 16) {
      return "Pagi"
    } else {
      return "Sore"
    }
  }
  const shift = ShiftNow()
  if (sorted[2].length > 5 && shift == "Sore") {
    return ["Sore", sorted[2]]
  } else if (sorted[1].length > 5 && shift == "Pagi") {
    return ["Pagi", sorted[1]]
  } else if (sorted[0].length > 5 && shift == "Malam") {
    return ["Malam", sorted[0]]
  } else {
    return ["Empty", sorted]
  }
}
async function main() {
  const startTime = performance.now();
  const jsession1 = await One();
  const jsession2 = await LoginForm(jsession1)
  const { viewstate1, uid, all, ec_aurl } = await mainPage(jsession2)
  const uri_1 = await openQuery(jsession2, viewstate1, uid, all, ec_aurl)
  const open_table_1 = await openTable(jsession2, uri_1, ec_aurl)
  const open_date_1 = await openDate(jsession2, uri_1, ...open_table_1[0])
  const { dom_table_final, viewState5, lwfocus, ecfocus, onHidelink } = await clickOK(jsession2, uri_1, ...open_date_1)
  const viewstate6 = await onHide(jsession2, uri_1, viewState5, lwfocus, ecfocus, onHidelink)
  await refreshTable(jsession2, uri_1, open_table_1[2], open_table_1[0][2], open_table_1[0][3], open_table_1[0][4], viewstate6)
  const open_date_2 = await openDate(jsession2, uri_1, ...open_table_1[0])
  const x = await clickOK(jsession2, uri_1, ...open_date_2)
  async function delayScriptExecution() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Script execution delayed by 3 seconds.');
  }

  // var test = dom_table_final.window.document.getElementsByClassName('dataTableInner')
  if (dom_table_final.window.document.getElementsByClassName('dataTableInner')) {
    if (dom_table_final.window.document.getElementsByClassName('dataTableInner').length > 0) {
      const sample_arr_di = dom_table_final.window.document.getElementsByClassName('dataTableInner')[0].children[1].children
      var data = await proceesArray(sample_arr_di)
      if (data[0] == "Empty") {
        console.log("delay 5 minutes")
        await delayScriptExecution()
        console.log("retry affter 5 minutes")
        await main();
      } else {

        for (const val of data[1]) {
          if (val.length > 0) {
            const casted = await castSample(val)
            const reduced = stringRep(casted)
            await sendMessage(reduced)
          }
        }

        if (x.dom_table_final.window.document.getElementsByClassName('dataTableInner').length > 0) {
          const sample_arr_ext = x.dom_table_final.window.document.getElementsByClassName('dataTableInner')[0].children[1].children
          const data1 = await proceesArray(sample_arr_ext)
          for (const val of data1[1]) {
            if (val.length > 0) {
              const casted = await castSample(val)
              const reduced = stringRep(casted)
              await sendMessage(reduced)
            }
          }
        } else {
          console.log("LOC I & LOC III No data yet")
          await sendMessage("LOC I & LOC III No data yet")
        }
      }
    } else {
      console.log("LOC II No data yet")
      await sendMessage("LOC II No data yet")
    }
  } else {
    console.log("table not available")
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  const formattedTime = (executionTime / 1000).toFixed(2) + " Seconds";
  await sendMessage(formattedTime)
}
main();
