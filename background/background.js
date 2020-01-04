let count={};
// get options from storage
let options={
    state:{
        "Tradeit.gg":true,
        "Dmarket.com":false,
        "Skins-table.xyz":true,
    }
};
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
    }
});
function changeOptions(request,sender,sendResponse){
    let isEmpty = request.state && !Object.keys(request.state).length;
    if (isEmpty){
        // send state
        sendResponse({status:"ok",options});   
    }
    else {
        // get state
        options.state=JSON.parse(JSON.stringify(request.state));
        sendResponse({status:"ok"});
        // put into LocalStorage 
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