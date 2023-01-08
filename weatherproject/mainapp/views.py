from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse 

from django.views.decorators.csrf import ensure_csrf_cookie

import json

from dotenv import load_dotenv, find_dotenv
from datetime import datetime
import os 
import requests 

load_dotenv(find_dotenv())
API_KEY = os.environ["API_KEY"]

# Create your views here.

@ensure_csrf_cookie
def index(request):
    
    if request.method == "POST":
        
        print("> post method requested")
        
        data = json.loads(request.body)
        
        #params
        latitude = data["latitude"]
        longitude = data["longitude"]
        units = "metric"
        
        #URL for current weather data 
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={API_KEY}&units={units}"
        req = requests.get(url = url).json()
        
        
        url_forecast = f"https://api.openweathermap.org/data/2.5/forecast?lat={latitude}&lon={longitude}&appid={API_KEY}&units={units}"
        req_forecast = requests.get(url = url_forecast).json()
        

        #Handle current time
        current_utc = int(req["dt"]) 
        current_dt = datetime.fromtimestamp(current_utc)
         
        #Weather data
        weather = req["weather"][0]
        
        #Temperature data
        main = req["main"]
        icon = weather["icon"]
        
        forecasts = []
        #Handle forecast data:
        for i,fc in enumerate(req_forecast["list"]):
            if len(forecasts) >= 5:
                break 
            else:
                dt = fc["dt_txt"]
                
                forecast_dt = convert_datetime(dt)
                
                if forecast_dt > current_dt:
                    forecasts.append(fc)
                else:
                    continue
        
        #compile for json response
        response = {
            "weather_params" : weather["main"],
            "weather_desc"   : weather["description"].capitalize(),
            "temperature"    : main["temp"],
            "humidity"       : main["humidity"],
            "location"       : req["name"],
            "icon_url"       : f"http://openweathermap.org/img/wn/{icon}@2x.png",
            "forecasts"      : forecasts
        }
        
        return JsonResponse(response)

    else:

        return render(request, "mainapp/index.html")
    
    
def convert_datetime(dt):
    
    dt_split = dt.split()
    date = dt_split[0]
    time = dt_split[1]
    
    time_split = time.split(":")
    date_split = date.split("-")
    
    converted_dt = datetime(int(date_split[0]), int(date_split[1]), int(date_split[2]), int(time_split[0]), int(time_split[1]), int(time_split[2]))
    
    return converted_dt

    

        
    


