chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.german-company-directory.com'},
            })], 
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {

    if(!window.set) window.set = (prop, value) => {
        chrome.storage.local.set({ [prop]: value })
    }
    
    if(!window.get) window.get = prop => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(prop, data => {
                if(data && data[prop]){
                    resolve(data[prop])
                }
                else{
                    resolve(null)
                }
            })
        })
    }

    if (info.status === 'complete') {

        window.get("working").then(working => {
            if(working){
                chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                    chrome.tabs.executeScript(
                        tabs[0].id,
                        { file: "start.js" }
                    );
                });
            }
        })
    }
});