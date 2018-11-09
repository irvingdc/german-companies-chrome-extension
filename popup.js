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

window.executeFile = file => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { file }
        );
    });
}

document.querySelector("#scrape").onclick = () => {
    window.set("working", true)
    window.executeFile("start.js")
};

document.querySelector("#results").onclick = () => {
    window.executeFile("results.js")
}

document.querySelector("#clear").onclick = () => {
    window.executeFile("clear.js")
}

document.querySelector("#stop").onclick = () => {
    window.executeFile("stop.js")
}