let count={};
let items=[];
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
        // send options
        sendResponse({status:"ok",options});   
    }
    else {
        // get options
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
    switch (options.notifications){
        case "change":{
            let difference = count[sender.tab.id] && request.count? request.count - count[sender.tab.id] : 0;
            count[sender.tab.id] = request.count? request.count: count[sender.tab.id];
            // notification 
            if (difference>0) {
                showNotification("New " + difference + " Items on Skins-table");
            }
            break;
        }
        case "more":{
            count[sender.tab.id] = request.count? request.count: count[sender.tab.id];
            // notification
            if (count[sender.tab.id]>options.count) {
                showNotification("More then " + options.count + " Items on Skins-table");
            } 
            break;
        }
        case "list": {
            count[sender.tab.id] = request.count? request.count: count[sender.tab.id];
            items = request.items? request.items.slice() : [];           
        }
        default: {
            count[sender.tab.id] = request.count? request.count: count[sender.tab.id];
            break;
        }
    }
    console.log("count", count);
    sendResponse({status:"ok"});
    // clear count if tab close
    if (request.close){
        delete count[sender.tab.id];
        console.log("closed counter for",sender.tab.id);
        console.log("count", count);
    }
}
function showNotification(message) {
    let notificationOptions = {
        type:"basic",
        iconUrl: "background/icon.png",
        title:"Skins-table",
        message:message,
        isClickable:false,
    }
    chrome.notifications.create("",notificationOptions,id=>{
        console.log("notification created ", id);
    });
}