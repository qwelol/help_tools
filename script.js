function setListener(){
	let items=document.querySelectorAll("div#sinv-loader li.item");
	for (let i=0; i<items.length; i++){
		items[i].oncontextmenu = function() {
			let span = items[i].querySelectorAll("div.tooltip-data strong span")
			let tmp = span[0].textContent.split(' ');
			if (tmp[0]==="Inscribed"){
				tmp.shift();
			}
			let appid = items[i].dataset.appid;
			let searchContext = tmp.join('+');
			window.open('https://steamcommunity.com/market/search?appid='+appid+'&q='+searchContext);
		}
	}
	setTimeout(setListener,3000);
}

window.onload = function () {
	let host=window.location.hostname;
	switch (host){
		case "tradeit.gg":{
			document.querySelector(".rmb-item-menu").remove();
			setTimeout(setListener,10000);
			break;
		}
		case "cs.money":{
			break;
		}
		case "dmarket.com":{
			let status = document.createElement("div");
			status.classList.add("extension-status");
			status.style.cssText = 
				"position: absolute; width: 10px; height: 10px; z-index: 1; background-color: #ff0000; top: 15px; left: -12px; " + 
					"border-radius: 100px; cursor:default; user-select:none; transition: 1s;";
			let navControls = document.querySelector(".c-exchangeHeader__inner--market .c-navigationControls.c-navigationControls--exchange");
			navControls.appendChild(status);
			let counter = 0;
			function setDmarketListener(){
				let appids = {
					"CS:GO":"730",
					"Dota 2": "570",
				}
				let rows = document.querySelectorAll("od-virtualrow");
				let currentGame = document.querySelector(".c-dialogFilters__select-value").textContent;
				if (currentGame === "CS:GO" || currentGame === "Dota 2") {
					let appid = appids[currentGame];
					for (let i=0; i<rows.length; i++){
						for (let j=0; j<rows[i].children.length; j++){
							rows[i].children[j].oncontextmenu = ()=> {
								let searchContext = rows[i].children[j].querySelector(".c-asset__img").alt;
								window.open('https://steamcommunity.com/market/search?appid='+appid+'&q='+searchContext);
							}
						}
					}
				}
				if (!counter) {
					document.querySelector(".extension-status").style.backgroundColor = "#00ff00";
				}
				counter++;
				setTimeout(setDmarketListener,3000);
			}
			setTimeout(setDmarketListener,10000);
			break;
		}
		case "skins-table.xyz":{
			function counter(){
				let count = 0;
				const table = document.querySelector("table.table.table-bordered");
				count = table.tBodies[0].querySelectorAll("tr").length;
				console.log("count:",count);
				const refreshInput = document.getElementsByName("refresh")[0];
				let refreshRate = +refreshInput.value * 1000;
				console.log("refreshRate:",refreshRate);
				clearTimeout(timerId);
				timerId = setTimeout(counter,refreshRate);
				refreshInput.onchange = () => {
					clearTimeout(timerId);
					refreshRate = +refreshInput.value * 1000;
					console.log("refreshRate:",refreshRate);
					timerId = setTimeout(counter,refreshRate);
				}				
			}
			let timerId = setTimeout(counter,1000);
			break;
		}
	}
}