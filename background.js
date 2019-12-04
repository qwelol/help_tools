let count={};
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    if (request.host === "skins-table.xyz"){
        count[sender.tab.id] = request.count? request.count: count[sender.tab.id];
        console.log("count", count);
        sendResponse({status:"ok"});
        if (request.close){
            delete count[sender.tab.id];
            console.log("closed counter for",sender.tab.id);
            console.log("count", count);
        }
    }
});