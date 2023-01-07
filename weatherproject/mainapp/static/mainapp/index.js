window.addEventListener('DOMContentLoaded', (event) => {

    //Check if navigator geolocation api is available in the user's browser
    if(navigator.geolocation){
        
        //check navigator permissions, specifically geolocation
        navigator.permissions.query({name: "geolocation"}).then(function(result) {

            // Will return ['granted', 'prompt', 'denied']
            console.log(result.state)

            if(result.state === "granted"){
                
                navigator.geolocation.getCurrentPosition(getPos)
                    
            }
            else if(result.state === "prompt"){
                //TODO: What to do if permission is on "prompt"
                console.log("Please enable geolocation.")
            }
            else{
                //TODO: What to do if permission is on "denied"
                console.log("Geolocation denied. :(")
            }
   
        });

    }
    

    

});


function getCookie(cname) {

    let name = cname + "=";
    
    let decodedCookie = decodeURIComponent(document.cookie);
    
    let ca = decodedCookie.split(';');
    
    for(let i = 0; i <ca.length; i++) {

      
      let c = ca[i];
      
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }

    }

    return "";
}


async function getPos(position){
    //Fetch weather data 
    console.log("Getting location data")
                
    let locData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
    }
                
    const settings = {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
            credentials: "same-origin",
             body: JSON.stringify(locData)
        }
                    
        let promise = await fetch('', settings)
                        
        if(promise.status == 200){
            let results = await promise.json()
                    
            console.log("Successfully Get Weather Data:")
            
            updatePage(results)
            
        }
        else{
            //TODO: add error page
        }
}

function updatePage(results){
    
    console.log(results)

    //hide the permission div
    document.getElementById('permission').setAttribute("class", "hidden");
    
    //get the main-content div
    let mainContent = document.getElementById('main-content');

    //remove the hidden attribute
    mainContent.removeAttribute("class", "hidden");
    
    let content = document.getElementById('content');

    //dynamically create elements:
    dynamicElement('h1', {'id':'weather'}, document.createTextNode(results.weather_params), content)
    dynamicElement('h2', null, document.createTextNode(results.weather_desc), content)
    dynamicElement('img', {'src': results.icon_url}, null, weather)

    let weatherDetails = dynamicElement('div', {'id':'weather-details'}, null, content)
    dynamicElement('h3', null,  document.createTextNode(results.humidity), weatherDetails);
    dynamicElement('h3', null, document.createTextNode(results.temperature), weatherDetails);
    
}  

function dynamicElement(element, attributes, appendWithin, appendTo){
    let elem = document.createElement(element);

    if(attributes){
        let attribute = Object.keys(attributes);
        let values    = Object.values(attributes);
        
        attribute.forEach((attr, i) => {
            elem.setAttribute(attr, values[i])
        })
    }

    if(appendWithin){
        elem.appendChild(appendWithin);
    }

    appendTo.appendChild(elem);

    return elem; 

}


