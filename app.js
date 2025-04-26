{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // UUIDs del servicio y caracter\'edstica en tu ESP32\
const SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';\
const CHAR    = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';\
\
let lastUID = '';\
let seen = new Set();\
\
window.addEventListener('DOMContentLoaded', () => \{\
  const id = i => document.getElementById(i);\
  const status    = id('status');\
  const lastUIDel = id('lastUID');\
  const btnC      = id('btnConnect');\
  const btnAddT   = id('btnAddTool');\
  const nameInp   = id('toolName');\
  const toolsList = id('toolsList');\
  const btnNewL   = id('btnCreateList');\
  const listInp   = id('listName');\
  const selList   = id('selectList');\
  const selVer    = id('selectListVerify');\
  const btnAddL   = id('btnAddToList');\
  const btnVer    = id('btnVerify');\
  const resVer    = id('verifyResult');\
\
  let tools = JSON.parse(localStorage.getItem('tools') || '\{\}');\
  let lists = JSON.parse(localStorage.getItem('lists') || '\{\}');\
\
  function save() \{\
    localStorage.setItem('tools', JSON.stringify(tools));\
    localStorage.setItem('lists', JSON.stringify(lists));\
  \}\
  function refreshTools() \{\
    toolsList.innerHTML = '';\
    for (let uid in tools) \{\
      let li = document.createElement('li');\
      li.textContent = uid + ' \'97 ' + tools[uid];\
      toolsList.appendChild(li);\
    \}\
  \}\
  function refreshLists() \{\
    [selList, selVer].forEach(s => \{\
      s.innerHTML = '';\
      for (let name in lists) \{\
        let opt = document.createElement('option');\
        opt.value = name;\
        opt.textContent = name;\
        s.appendChild(opt);\
      \}\
    \});\
  \}\
\
  refreshTools(); refreshLists();\
\
  btnC.onclick = async () => \{\
    try \{\
      const device = await navigator.bluetooth.requestDevice(\{\
        filters: [\{ services: [SERVICE] \}]\
      \});\
      status.textContent = 'Conectando\'85';\
      const server = await device.gatt.connect();\
      const service = await server.getPrimaryService(SERVICE);\
      const char = await service.getCharacteristic(CHAR);\
      await char.startNotifications();\
      char.addEventListener('characteristicvaluechanged', e => \{\
        let v = new TextDecoder().decode(e.target.value);\
        lastUID = v; seen.add(v);\
        lastUIDel.textContent = v;\
      \});\
      status.textContent = 'Conectado';\
    \} catch (e) \{\
      console.error(e);\
      status.textContent = 'Error: ' + (e.message || e);\
    \}\
  \};\
\
  btnAddT.onclick = () => \{\
    if (!lastUID || !nameInp.value) return;\
    tools[lastUID] = nameInp.value;\
    save(); refreshTools();\
    nameInp.value = '';\
  \};\
\
  btnNewL.onclick = () => \{\
    if (!listInp.value) return;\
    lists[listInp.value] = [];\
    save(); refreshLists();\
    listInp.value = '';\
  \};\
\
  btnAddL.onclick = () => \{\
    let ln = selList.value;\
    if (!ln || !lastUID) return;\
    if (!lists[ln].includes(lastUID)) \{\
      lists[ln].push(lastUID);\
      save();\
      resVer.textContent = '';\
    \}\
  \};\
\
  btnVer.onclick = () => \{\
    let ln = selVer.value;\
    if (!ln) return;\
    let req = lists[ln];\
    let miss = req.filter(u => !seen.has(u));\
    resVer.textContent = miss.length === 0\
      ? '\uc0\u9989  Todos presentes'\
      : '\uc0\u10060  Faltan: ' + miss.join(', ');\
  \};\
\});}