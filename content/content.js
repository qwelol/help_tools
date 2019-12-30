window.onload = function () {
	let host=window.location.hostname;

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
	function tableTracking() {
		let count = 0;
		function counter(){
			const table = document.querySelector("table.table.table-bordered");
			if (count !== table.tBodies[0].querySelectorAll("tr").length){
				count = table.tBodies[0].querySelectorAll("tr").length;
				console.log("count changed");
				//send count on background.js
				chrome.runtime.sendMessage({host,count}, (response)=>{
					console.log(response);
				})
			}
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
		window.onunload = () => {
			//remove counter message
			chrome.runtime.sendMessage({close:true, host}, (response)=>{
				console.log(response);
			});
		}
	}

	switch (host){
		case "tradeit.gg":{
			document.querySelector(".rmb-item-menu").remove();
			setTimeout(setListener,10000);
			break;
		}
		case "dmarket.com":{
			//status marker 
			let status = document.createElement("div");
			status.classList.add("extension-status");
			let navControls = document.querySelector(".c-exchangeHeader__inner--market .c-navigationControls.c-navigationControls--exchange");
			if (navControls) {
				navControls.appendChild(status);
			}
			
			let counter = 0;
			function setDmarketListener(){
				
				let appids = {
					"cs:go":"730",
					"dota 2": "570",
				}
				let rows = document.querySelectorAll("od-virtualrow");
				let gameContainer = document.querySelector(".c-dialogFilters__select-value");
				let currentGame = gameContainer? gameContainer.textContent.toLowerCase() : null;
				if (Object.keys(appids).indexOf(currentGame)!== -1 && rows.length) {	
					let appid = appids[currentGame];
					for (let i=0; i<rows.length; i++){
						let children = rows[i].querySelectorAll(".c-asset.ng-star-inserted");
						for (let j=0; j<children.length; j++){
							// search
							children[j].oncontextmenu = ()=> {
								let searchContext = children[j].querySelector(".c-asset__img").alt;
								window.open('https://steamcommunity.com/market/search?appid='+appid+'&q='+searchContext);
							}
							// highlighting 
							let icon = children[j].querySelector("span .c-asset__lockIcon");
							if (icon){
								let iconName = icon.getAttribute("inlinesvg");
								let cart = children[j].querySelector("div.c-asset__inner");
								if (iconName === "icon-unlock.svg") {
									cart.classList.add("highlited");
								}
								else {
									cart.classList.remove("highlited");
								}
							}
						}
					}
					navControls = document.querySelector(".c-exchangeHeader__inner--market .c-navigationControls.c-navigationControls--exchange");
					if (navControls) {
						navControls.appendChild(status);
					}
					if (!counter) {
						status.classList.add("good");
					}
					counter++;
				}
				// setTimeout(setDmarketListener,1000);
			}
			setInterval(setDmarketListener,1000);
			//setTimeout(setDmarketListener,5000);
			break;
		}
		case "skins-table.xyz":{
			const pathName = window.location.pathname;
			if (pathName === "/table/" ){
				tableTracking();
			}
			break;
		}
	}
}