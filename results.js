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

window.get("working").then(working => console.log("working",working))
window.get("pageIndex").then(pageIndex => console.log("pageIndex",pageIndex))