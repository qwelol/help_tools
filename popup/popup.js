window.onload = function () { 
    let state = {};
    let options = {};
    let host ="popup";
    // send message to initiate state
    chrome.runtime.sendMessage({host,options}, (response)=>{
        options = response.options? JSON.parse(JSON.stringify(response.options)):{};
        state = options.state?JSON.parse(JSON.stringify(options.state)):{};
        console.log("state",state); 
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
                chrome.runtime.sendMessage({host,options}, (response)=>{
                    console.log(response);
                })           
            })
        }
    }  
}