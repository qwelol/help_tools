window.onload = function () { 
    let options = {};
    let state = {};
    let notifications={}; 
    let itemsList = [];
    const host ="popup";
    // send message to initiate state
    chrome.runtime.sendMessage({host,options}, (response)=>{
        options = response.options? JSON.parse(JSON.stringify(response.options)):{};
        state = options.state?JSON.parse(JSON.stringify(options.state)):{};
        notifications = options.notifications?JSON.parse(JSON.stringify(options.notifications)):{};
        itemsList = options.itemsList? JSON.parse(JSON.stringify(options.itemsList)) : [];
        generator();
        setListeners(); 
    })
    function generator(){ 
        for (let i = 0; i < itemsList.length; i++) {
            createElement(itemsList[i],i);
        }
    }
    function setListeners() {
        let rows = document.getElementsByClassName("row");
        for (let i=0; i<rows.length; i++){
            // set class by state value 
            if (state[rows[i].dataset.option]){
                rows[i].classList.add("active"); 
            }
            // add toggle listener 
            rows[i].addEventListener("click", e=>{          
                e.currentTarget.classList.toggle("active"); 
                let key = e.currentTarget.dataset.option;
                let val = e.currentTarget.classList.contains("active");
                state[key]=val;
                options.state = JSON.parse(JSON.stringify(state));
                // send state 
                sendOptions();          
            })
        }
        let checks = document.getElementsByName("list-checks");
        for (let i=0; i<checks.length; i++){
            if (notifications===checks[i].dataset.notify){
                checks[i].checked = true;
            }
            checks[i].addEventListener("change", ()=> {
                notifications = checks[i].dataset.notify;
                options.notifications = JSON.parse(JSON.stringify(notifications));
                sendOptions();
            })
        }
        let count = document.getElementsByName("count")[0];
        count.value=options.count? options.count : 0;
        count.addEventListener("change", ()=> {
            options.count = count.value;          
            sendOptions();
        })
        let add = document.querySelector(".popup .list .li .add");
        let addition = document.querySelector(".popup .list .addition");
        let additionBtn = addition.querySelector(".addition-btn");
        let additionInput = addition.querySelector(".input");
        add.addEventListener("click", ()=> {
            addition.classList.toggle("active");
            add.textContent = add.textContent === "+"? "-" : "+";
        });
        additionBtn.addEventListener("click", ()=> {
            if (additionInput.value){
                addition.classList.remove("active");
                add.textContent = "+";
                itemsList.push(additionInput.value);
                createElement(itemsList[itemsList.length-1],itemsList.length-1);
                options.itemsList = JSON.parse(JSON.stringify(itemsList));
                sendOptions();
                additionInput.value = "";
            }
        });
    }
    function createElement(listItem, pos) {
        let table = document.querySelector(".tr.content");
        let tableItem = document.createElement("td");
        tableItem.classList.add("table-item");
        let text = document.createElement("div");
        text.classList.add("text");
        text.textContent = listItem;
        let removeBtn = document.createElement("button");
        removeBtn.classList.add("table-btn");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click",()=>{
            itemsList.splice(pos,1);
            tableItem.remove();
            options.itemsList = JSON.parse(JSON.stringify(itemsList));
            sendOptions();
        });
        tableItem.appendChild(text);
        tableItem.appendChild(removeBtn);
        table.appendChild(tableItem);
    }
    function sendOptions() {
        chrome.runtime.sendMessage({host,options}, (response)=>{
            console.log(response);
        });
    }  
}