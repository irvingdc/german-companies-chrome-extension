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

if(!window.getList) window.getList = companies => {
    
    console.log("getting list...",companies)
    window.set("gettingDetails", false)

    let count = 0
    let interval = window.setInterval(()=>{
        if(count < companies.length){
            window.get("gettingDetails").then(gettingDetails => {
                console.log("gettingDetails",gettingDetails)
                if(!gettingDetails){
                    window.set("gettingDetails", true)
                    window.open(companies[count].href, "_blank")
                    count++
                }
            })
        }
        else{
            window.get("pageIndex").then(pageIndex => {
                if(!pageIndex) pageIndex = 1
                let newUrl = Array.from(document.querySelectorAll(".inactivelinkwrap a")).find(it => parseInt(it.innerText) == pageIndex + 1)
                
                if(newUrl){ // there's more to scrape
                    window.set("pageIndex", pageIndex + 1)
                    window.clearInterval(interval)
                    setTimeout(()=>window.open(newUrl,"_self"),2000)
                }
                else{ //no more company pages
                    window.set("working", false)
                }
            })
        }
    },1000)
}

if(!window.getDetails) window.getDetails = () => {
    console.log("getting details...")

    let elements = Array.from(document.querySelectorAll(".ui-tabs-panel .contentleft .bodytext"))
    let contactDetails = elements.find(it=>(it.innerText.includes("Email") || it.innerText.includes("Homepage")))
    let emailData = "", websiteData = ""
    if(contactDetails){
        emailData = Array.from(contactDetails.querySelectorAll("a")).find(it => it.innerText.includes("@"))
        websiteData = Array.from(contactDetails.querySelectorAll("a")).find(it => it.href && it.href.includes("http"))
    }
    let companyName = document.querySelector(".detailheader").innerText
    if(companyName){
        fetch('https://www.appinchina.co/admin/NEW_API/germanCompaniesTest.php', {
            method: 'post',
            body: JSON.stringify({ 
                contact: contactDetails ? contactDetails.innerText : "",
                email: emailData ? emailData.innerText : "",
                website: websiteData ? websiteData.href : "",
                name: companyName,
            })
        }).then(response => {
            return response.text()
        }).then(data => {
            setTimeout(()=>{
                window.set("gettingDetails", false)
                window.close()
            },500)
        });
    }
}

window.companies = Array.from(document.querySelectorAll(".listtable td:first-child a")).map(it=>({name: it.innerText, href: it.href}))

if(window.companies.length){ //it is on companies list page
    window.getList(window.companies)
}
else{ //it is on company details page
   window.getDetails()
}