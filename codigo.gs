const tgbot = new TGbot.tgbot("<API-KEY-BOT>");
const ss = SpreadsheetApp.openById("<ID-SHEETS>").getSheetByName("db_bot");

function doGet(e) {

  var index = HtmlService.createHtmlOutputFromFile("index");

  return index.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);


}

function recibirIp(ip) {

  var url = "https://api11.scamalytics.com/<NAME-OWNER>/?key=<KEY-API>8&ip="

  var response = UrlFetchApp.fetch(url + ip).getContentText();
  var data = JSON.parse(response);
  var lastRow = ss.getLastRow();
  var id_chat = ss.getRange(lastRow, 2).getValue();
  var request_username = ss.getRange(lastRow, 4).getValue();

  var cp = {
    status: data.status == 'ok' ? ('✅') : ('❌'),
    ip: data.ip,
    score: data.score,
    risk: data.risk,
    request_to: "@" + request_username,

    toString() {
      return `STATUS: ${this.status}\nIP: ${this.ip}\nFRAUD SCORE: ${this.score}\nRISK: ${this.risk}\nREQUEST: ${this.request_to}`;
    }
  }

  if (id_chat != "<ID-Owner>") {
    tgbot.sendMessage({ chat_id: "<ID-Owner", text: cp });
  }

  tgbot.sendMessage({ chat_id: id_chat, text: cp });

  return "Respuesta enviado al bot!!";

}

function doPost(e) {

  var c = JSON.parse(e.postData.contents);
  var text = c.message.text;
  var id = c.message.chat.id;
  var username = c.message.from.username;

  ss.appendRow([new Date(), id, text, username]);

  switch (text) {

    case "/start":

      var cp = {
        saludo: "BOT PARA CHECAR EL BANEO DE TU IP 📍 ",
        comando1: "/start Empezar BOT",
        comando2: "/link Checar IP",

        toString() {

          return `${this.saludo}\n\n${this.comando1}\n${this.comando2}`;    
        }
          
      }

      tgbot.sendMessage({ chat_id: id, text: cp });
      break;

    case "/link":

      tgbot.sendMessage({ chat_id: id, text: `https://ipaddress-bot.netlify.app`});
      break;

    default: 
      tgbot.sendMessage({ chat_id: id, text: "ERROR, INTENTA DE NUEVO❌" });

  }

}
