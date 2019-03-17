
function getNewItems(){
	var items = document.querySelectorAll("#bets-listview .item");
	var json = null;
	for(var i=0; i<items.length; i++) {
		var item = items[i];
		var idAttr = item.getAttribute("data-key");
		if(localStorage.getItem(idAttr)) continue;
		var percent = item.querySelector(".vperc").innerText;
		var team1 = item.querySelector(".team-name1").innerText;
		var team2 = item.querySelector(".team-name2").innerText;
		var gameType = item.querySelector(".it-sp").innerText;
		var time = item.querySelector(".vilkhr").innerText;
		var b1 = item.querySelectorAll(".it-name")[0].innerText;
		var b2 = item.querySelectorAll(".it-name")[1].innerText;
		var jsonItem = { };
		jsonItem["idAttr"] = idAttr;
		jsonItem["percent"] = percent;
		jsonItem["team1"] = team1;
		jsonItem["team2"] = team2;
		jsonItem["gameType"] = gameType;
		jsonItem["time"] = time;
		jsonItem["b1"] = b1;
		jsonItem["b2"] = b2;
		if(!json) json = {};
		json[idAttr] = jsonItem;
		localStorage.setItem(idAttr, jsonItem);
	}
	console.log(json);
	return json;
}
function sendRequest(json) {
	if(!json){ return } 
	var str = JSON.stringify(json);
	console.log("str", str);	
	var s = document.createElement("script");
	//s.src = "https://lofty-bolt-234212.appspot.com/post/" + str;
	s.src = "http://localhost:8080/post/" + str;
	document.body.appendChild(s);
}
(function() {
    var s0 = document.createElement("script");
    //s0.src = "https://lofty-bolt-234212.appspot.com/updatetime/";
    s0.src = "http://localhost:8080/updatetime/";
    document.body.appendChild(s0);
}());
sendRequest(getNewItems());
setTimeout(function() {
    location.reload(); 
}, 5000);



