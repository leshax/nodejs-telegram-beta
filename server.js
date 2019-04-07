const http = require('http');
const https = require('https');
const qs = require('querystring');
const url  = require('url');
const fs = require('fs');
const telegramConfig = JSON.parse(fs.readFileSync('telegram_config.json', 'utf8'));
const hostname = '127.0.0.1';
const port = 8080;
var lastTimeUpdated = new Date();


const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get('/', function(req, res) {
	console.log('Home');
	res.send('Hello World! 8080')
});
app.get('/post', async function(req, res){
	console.log('POST');
	 let json = JSON.parse(Object.keys(req.query)[0]);
	 //let parsed = JSON.parse(json);
	 console.log(json);
	 var msg = getMessageForTelegram(json);
	 var chatId = telegramConfig.chatId;
	 var botId = telegramConfig.botId;
	 var url = "https://api.telegram.org/bot"+botId+"/sendMessage?chat_id="+chatId+"&text="+msg;
	 

	if(json){
			console.log("1. JSON = " + json);
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
		}


	 res.status(200).send();
});


app.listen(8080, () => console.log('Express server is listening on port 8080'));

function getMessageForTelegram(json) {
	//console.log(JSON.parse(JSON.stringify(json)));
	//console.log(Object.keys(json));
	//for(var i=0; i<json)
	
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
		var str = url.parse(req.url).path.replace('/post/', "");
		console.log("STR: " + str);	
		var q = qs.unescape(str);
		console.log("Q: " + q);
		console.log("typeof: " + typeof q);
		var json = JSON.parse(q);
		console.log("json: " + json);
		return json;
	} catch(e) {
		console.log("Error parsing a json");
	}
}
