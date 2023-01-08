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
            else{
                //TODO: What to do if permission is on "denied"
                console.log("Geolocation denied. :(")
                deniedPage();
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
    
    
    //add new bg
    document.getElementById("container").style.backgroundImage = `url(${results.bg})`
    //get the main-content div
    let mainContent = document.getElementById('main-content');

    //remove the hidden attribute
    mainContent.removeAttribute("class", "hidden");
    
    let content = document.getElementById('content');

    //dynamically create elements:
    dynamicElement('h1', {'id':'weather'}, document.createTextNode(results.weather_params), content)
    dynamicElement('h2', null, document.createTextNode(`${results.weather_desc} in ${results.location}`), content)
    dynamicElement('img', {'src': results.icon_url}, null, weather)

    //weather details such as humidity 
    let weatherDetails = dynamicElement('div', {'id':'weather-details'}, null, content)
    dynamicElement('span', {'class': 'weather-details-icon material-symbols-outlined'}, document.createTextNode("humidity_percentage"), weatherDetails)
    dynamicElement('h3', null,  document.createTextNode(results.humidity), weatherDetails);
    dynamicElement('span', {'class': 'weather-details-icon material-symbols-outlined'}, document.createTextNode("device_thermostat"), weatherDetails)
    dynamicElement('h3', null, document.createTextNode(results.temperature), weatherDetails);
    
    let forecasts = dynamicElement('div', {'id': 'forecasts'}, null, content)
    dynamicElement('p', null, document.createTextNode("Forecast in the next hours..."), forecasts)

    let fc_results = results.forecasts 
    let forecastsContent = dynamicElement('ul', {'id':'forecasts-content'}, null, forecasts)
    
    fc_results.forEach((fc) => {
        let fc_container = dynamicElement('li', {'class': 'forecast'}, null, forecastsContent)

        let fc_weather = dynamicElement('p', {'class': 'forecast-weather'}, document.createTextNode(fc.weather), fc_container)
        dynamicElement('img', {'src': fc.icon}, null, fc_weather)
        dynamicElement('p', null, document.createTextNode(fc.weather_desc), fc_container)
        dynamicElement('p', null, document.createTextNode(fc.date), fc_container)
        dynamicElement('p', null, document.createTextNode(fc.time), fc_container)
    })
    

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

function deniedPage(){
    document.getElementById('permission').setAttribute("class", "hidden");
    document.getElementById('denied').removeAttribute("class", "hidden");
    
    let tryBtn = document.getElementById("retry-button");

    tryBtn.addEventListener('click', ()=>{
        window.location.reload();
    })
}


