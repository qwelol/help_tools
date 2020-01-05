let count={};
let options={};
// get options from storage
chrome.storage.sync.get(['options'], result => {
    console.log('received options ', result.options);
    options=JSON.parse(JSON.stringify(result.options));
});

chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    switch (request.host){
        case "skins-table.xyz":{
            counterTracking(request,sender,sendResponse);
            break;
        }
        case "popup":{
            changeOptions(request,sender,sendResponse);
            break; 
        }
        case "options":{
            sendResponse({status:"ok",options});
            break;
        }
        default:{
            sendResponse({status:"not found"});
        }
    }
});
function changeOptions(request,sender,sendResponse){
    let isEmpty = request.options && !Object.keys(request.options).length;
    if (isEmpty){
        // send state
        sendResponse({status:"ok",options});   
    }
    else {
        // get state
        console.log("request",request);
        options=JSON.parse(JSON.stringify(request.options));
        console.log("options",options);  
        sendResponse({status:"ok"});
        // put into storage
        chrome.storage.sync.set({options}, () => {
            console.log('saved options',options);
        }); 
    }
}
function counterTracking(request,sender,sendResponse) {
    let difference = count[sender.tab.id] && request.count? request.count - count[sender.tab.id] : 0;
    count[sender.tab.id] = request.count? request.count: count[sender.tab.id];
    console.log("count", count);
    sendResponse({status:"ok"});
    // notification 
    if (difference>0) {
        showNotification(difference);
    }
    // clear count if tab close
    if (request.close){
        delete count[sender.tab.id];
        console.log("closed counter for",sender.tab.id);
        console.log("count", count);
    }
}
function showNotification(difference) {
    let notificationOptions = {
        type:"basic",
        iconUrl: "background/icon.png",
        title:"Skins-table",
        message:"New " + difference + " Items on Skins-table",
        isClickable:false,
    }
    chrome.notifications.create("",notificationOptions,id=>{
        console.log("notification created ", id);
    });
}