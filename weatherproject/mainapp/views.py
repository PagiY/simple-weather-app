from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse 

from django.views.decorators.csrf import ensure_csrf_cookie

import json

from dotenv import load_dotenv, find_dotenv
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
        
        #Weather data
        weather = req["weather"][0]
        #temperature data
        main = req["main"]

        #compile for json response
        response = {
            "weather_params" : weather["main"],
            "weather_desc"   : weather["description"],
            "temperature"    : main["temp"],
            "humidity"       : main["humidity"]
        }
        
        return JsonResponse(response)

    else:
        
        return render(request, "mainapp/index.html")

def weather(request):
    return HttpResponse(f"from weather")
    

        
    


