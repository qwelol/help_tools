window.onload = function () { 
    let state = {};
    let host ="popup";
    // send message to initiate state
    chrome.runtime.sendMessage({host,state}, (response)=>{
        let res = JSON.parse(JSON.stringify(response));
        if (res.options.state){
            state=JSON.parse(JSON.stringify(res.options.state));
        }
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
                // send state 
                chrome.runtime.sendMessage({host,state}, (response)=>{
                    console.log(response);
                })           
            })
        }
    }  
}