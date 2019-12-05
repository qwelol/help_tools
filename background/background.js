let count={};
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    if (request.host === "skins-table.xyz"){
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
});
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