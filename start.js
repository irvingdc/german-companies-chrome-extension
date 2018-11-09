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

window.companies = Array.from(document.querySelectorAll(".listtable td:first-child a")).map(it=>({name: it.innerText, href: it.href}))

if(window.companies.length){ //it is on companies list page
    window.get("companies").then(storedCompanies => {

        if(storedCompanies && typeof storedCompanies === "object"){ //the object of companies exists
            window.companies = companies.concat(storedCompanies)
        }
        window.set("companies", window.companies)
        window.get("pageIndex").then(pageIndex => {
            if(!pageIndex) pageIndex = 1
            let newUrl = Array.from(document.querySelectorAll(".inactivelinkwrap a")).find(it => parseInt(it.innerText) == pageIndex + 1)
            
            if(newUrl){ // there's more to scrape
                window.set("pageIndex", pageIndex + 1)
                window.open(newUrl,"_self")
            }
            else{ //no more company pages
                window.set("working", false)
            }
        })
    })
}
else{ //it is on company details page
    
}