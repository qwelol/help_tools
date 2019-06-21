function setListener(){
	var items=document.querySelectorAll("div#sinv-loader li.item");
	for (let i=0; i<items.length; i++){
		items[i].oncontextmenu = function() {
			var span = items[i].querySelectorAll("div.tooltip-data strong span")
			var tmp = span[0].textContent.split(' ');
			if (tmp[0]==="Inscribed"){
				tmp.shift();
			}
			var appid = items[i].dataset.appid;
			var searchContext = tmp.join('+');
			window.open('https://steamcommunity.com/market/search?appid='+appid+'&q='+searchContext);
		}
	}
	setTimeout(setListener,3000);
}
var host=window.location.hostname;
switch (host){
	case "tradeit.gg":{
		document.querySelector(".rmb-item-menu").remove();
		setTimeout(setListener,10000);
		break;
	}
	case "cs.money":{
		;
	}
}