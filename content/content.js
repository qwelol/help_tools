window.onload = function () {
	// get options
	const host=window.location.hostname;
	chrome.runtime.sendMessage({host:"options"}, (response)=>{
		const options = response.options? JSON.parse(JSON.stringify(response.options)):{};
		const state = options.state? JSON.parse(JSON.stringify(options.state)):{};
		if (state[host]){
			console.log("approved");
			switch (host){
				case "tradeit.gg":{
					document.querySelector(".rmb-item-menu").remove();
					setTimeout(setListener,10000);
					break;
				}
				case "dmarket.com":{
					dmarketController();
					break;
				}
				case "skins-table.xyz":{
					const pathName = window.location.pathname;
					if (pathName.indexOf("/table") !== -1 ){
						tableTracking();
					}
					break;
				}
			}
		}
	})
	// tradeit 
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
	// dmarket 
	function dmarketController() {
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
			let gameContainer = document.querySelector(".c-dialogFilters__select-value");
			let currentGame = gameContainer? gameContainer.textContent.toLowerCase() : null;
			if (Object.keys(appids).indexOf(currentGame)!== -1) {	
				let appid = appids[currentGame];
				let children = document.querySelectorAll("asset-card");
				for (let j=0; j<children.length; j++){
					// search
					children[j].oncontextmenu = e => {
						e.preventDefault();
						e.stopPropagation();
						let searchContext = children[j].querySelector(".c-asset__img").alt;
						window.open('https://steamcommunity.com/market/search?appid='+appid+'&q='+searchContext);
					}
					// highlighting 
					let icon = children[j].querySelector("span .c-asset__lockIcon");
					if (icon){
						let iconName = icon.querySelector("use").href.baseVal;
						let cart = children[j].querySelector("div.c-asset__inner");
						if (iconName && iconName.search("icon-unlock") !== -1) {
							cart.classList.add("highlited");
						}
						else {
							cart.classList.remove("highlited");
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
	}
	// skins-table
	function tableTracking() {
		let count = 0;
		let itemsOld=[];
		function counter(){
			const table = document.querySelector("table.table.table-bordered");
			let nameCells = table.getElementsByClassName("clipboard");
			let items = [];
			let changeItems = false;
			for (let i = 0; i < nameCells.length; i++) {
				items.push(nameCells[i].textContent);
				if (search(itemsOld, nameCells[i].textContent)){
					changeItems=true;
				}
			}
			let condition = changeItems || !!(itemsOld.length-items.length);
			if (condition){
				count = items.length;
				console.log("count changed");
				//send data on background
				chrome.runtime.sendMessage({host,count, items}, (response)=>{
					console.log(response);
				})
				itemsOld=JSON.parse(JSON.stringify(items));
			}
			console.log("items",items);
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
	function search(arr, val){
		for (let i=0; i<arr.length; i++){
			if (arr[i].indexOf(val)!==-1){
				return false;
			}
		}
		return true; 
	}
}