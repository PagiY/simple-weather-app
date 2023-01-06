window.addEventListener('DOMContentLoaded', (event) => {

    //Check if navigator geolocation api is available in the user's browser
    if(navigator.geolocation){
        
        //check navigator permissions, specifically geolocation
        navigator.permissions.query({name: "geolocation"}).then(function(result) {

            // Will return ['granted', 'prompt', 'denied']
            console.log(result.state)

            if(result.state === "granted"){
                navigator.geolocation.getCurrentPosition(getPosition)
            }
            else if(result.state === "prompt"){
                console.log(result.state)
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

function getPosition(position){

    console.log("Getting location data")

    let locData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }

    fetch('',
    {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        credentials: "same-origin",
        body: JSON.stringify(locData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
}

