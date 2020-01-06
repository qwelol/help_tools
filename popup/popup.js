window.onload = function () { 
    let options = {};
    let state = {};
    let notifications={}; 
    const host ="popup";
    // send message to initiate state
    chrome.runtime.sendMessage({host,options}, (response)=>{
        options = response.options? JSON.parse(JSON.stringify(response.options)):{};
        state = options.state?JSON.parse(JSON.stringify(options.state)):{};
        notifications = options.notifications?JSON.parse(JSON.stringify(options.notifications)):{};
        console.log("notifications",notifications); 
        setListeners(); 
    })
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
    }
    function sendOptions() {
        chrome.runtime.sendMessage({host,options}, (response)=>{
            console.log(response);
        });
    }  
}