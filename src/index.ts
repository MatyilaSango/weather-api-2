import axios from "axios"
import express, { request, Request, Response } from "express"
import cheerio = require("cheerio");

let app = express()

let output: number = 0;

type searchType = {
    search_parameter: string,
    weather_site: string,
    available_locations: string[]
}

type dataType = {
    title: string,
    time: string,
    temp: string,
    real_feel: string,
    air_quality: string,
    wind: string,
    wind_gusts: string,
    type: string,
}

type location_data = {
    search_parameter: string,
    weather_site: string,
    data: dataType
}

let locations: searchType = {
    search_parameter: "",
    weather_site: "accuweather",
    available_locations: []
};

let data_by_location: location_data = {
    search_parameter: "",
    weather_site: "accuweather",
    data: {
        title: "Current weather",
        time: "",
        temp: "",
        real_feel: "",
        air_quality: "",
        wind: "",
        wind_gusts: "",
        type: "",
        }
}

const getLocations = async (search: string): Promise<string[]> => {
    let response = await axios.get(`https://www.accuweather.com/en/search-locations?query=${search}`)
    .then(prom => prom.data)
    .then(results => results)

    let $ = cheerio.load(response)
    let locations: string[] = $(".locations-list a").text()
                                                    .split("\t")
                                                    .filter(cell => cell.trim() !== '')
                                                    
    return locations
}

const getDataByLocation = async (location: string): Promise<any> => {
    let response = await axios.get(`https://www.accuweather.com/en/search-locations?query=${location}`)
    .then(prom => prom.data)
    .then(results => results)

    let $ = cheerio.load(response)

    data_by_location.search_parameter = $("head").find("title").text().trim()
    data_by_location.data.time = $(".cur-con-weather-card").find(".cur-con-weather-card__subtitle").text().trim()
    data_by_location.data.temp = $(".cur-con-weather-card").find(".temp-container .temp").text().trim()
    data_by_location.data.type = $(".cur-con-weather-card").find(".spaced-content").find(".phrase").text()

    $(".cur-con-weather-card").find(".details-container").find(".spaced-content").each(function(){
        switch($(this).find(".label").text()){
            case "RealFeel Shade™":
                data_by_location.data.real_feel = $(this).find(".value").text()
            
            case "air Quality":
                data_by_location.data.air_quality = $(this).find(".value").text()

            case "Wind":
                data_by_location.data.wind = $(this).find(".value").text()
            
            case "Wind Gusts":
                data_by_location.data.wind_gusts = $(this).find(".value").text()
        }
    })

}

const getSearchData = (location: string): void =>{ 
    getLocations(location).then(res => {
        if(res.length === 0){
            getDataByLocation(location);
        
            output = 1
        }
        else if(res.length > 0){
            locations.search_parameter = location
            locations.available_locations = res

            output = 2
        }
    })    
}

app.get("/", (request: Request, response: Response): void => {
    response.json("A global weather API.")
})

app.get("/weather/:param", (request: Request, response: Response): void =>{
    const query: string = request.params.param;
    getSearchData(query);
    (output === 1) ? response.json(data_by_location) : response.json(locations)
})

app.listen(3000, ()=>{
    console.log("Server is running at port 3000.")
})
