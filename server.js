const http = require('http');
const https = require('https');
const qs = require('querystring');
const url  = require('url');
const fs = require('fs');
const telegramConfig = JSON.parse(fs.readFileSync('telegram_config.json', 'utf8'));
const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {

	var json = createJson(req);
	var msg = getMessageForTelegram(json);
	var chatId = telegramConfig.chatId;
	var botId = telegramConfig.botId;
	var url = "https://api.telegram.org/bot"+botId+"/sendMessage?chat_id="+chatId+"&text="+msg;
	
	https.get(url, (resp) => { 
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			console.log(JSON.parse(data).explanation);
		});
		resp.on("error", (err) => {
			console.log("Error: " + err.message);
		});
		
	});
		
	console.log("MSG:" + json);
 
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getMessageForTelegram(json) {
	try {
		var message = "";
		Object.keys(json).forEach(function(key,index) {
			message += json[key].b1 + "/" + json[key].b2 + " " + json[key].gameType + ": %0A" + json[key].team1 + " vs " + json[key].team2 + " %0A" + json[key].percent+"%" + "%0A Last time updated: " + json[key].time + "; %0A%0A";
		});		
		console.log("message ", message); 
		return message;
	} catch (e){		
		console.log("Error on creating telegram message");
	}
	
}
function createJson(req){
	try{		
		var str = url.parse(req.url).path.replace('/', "");
		console.log("STR: " + str);	
		var q = qs.unescape(str);
		console.log("Q: " + q);
		console.log("typeof: " + typeof q);
		var json = JSON.parse(q);
		console.log("json: " + json);
		return json;
	} catch(e) {
		console.log(e);
		console.log("Error parsing a json");
	}
}
