import axios from "axios";
import cheerio = require("cheerio");
import { deleteDaily, getDaily, setDaily } from "../../Storage";
import { dailyDataType, dataType, dayNightType, highLowType, riseSetType, sunriseSunsetType, temperature_historyType } from "../../Types/types";

export class Daily{

    private _dailyData: dailyDataType = {
        search_parameter: "",
        weather_site: "accuweather",
        date: "",
        data: {
            day_night: {
                day: {
                    title: "",
                    temperature: "",
                    real_feel: "",
                    real_feel_shade: "",
                    phrase: "",
                    max_uv_index: "",
                    wind: "",
                    wind_gusts: "",
                    prob_of_precip: "",
                    prob_of_thunderstorm: "",
                    precip: "",
                    cloud_cover: "",
                    icon: ""
                },
                night: {
                    title: "",
                    temperature: "",
                    real_feel: "",
                    real_feel_shade: "",
                    phrase: "",
                    max_uv_index: "",
                    wind: "",
                    wind_gusts: "",
                    prob_of_precip: "",
                    prob_of_thunderstorm: "",
                    precip: "",
                    cloud_cover: "",
                    icon: ""
                }
            },
            sunrise_sunset: {
                sunrise: {
                    duration: "",
                    rise: "",
                    set: ""
                },
                sunset: {
                    duration: "",
                    rise: "",
                    set: ""
                }
            },
            temperature_history: {
                forcast: {
                    high: "",
                    low: ""
                },
                average: {
                    high: "",
                    low: ""
                },
                last_yr: {
                    high: "",
                    low: ""
                }
            }
        }
    }

    private _NUMBEROFDAYS = 12

    constructor() {}

    public formatDateNow = (day: string): String => {
        let correct_day: Number = (Number(day) === 0 || Number(day) === 1) ? 0 : Number(day)
        let date: Date = new Date()
        let date_now: string = `${date.getMonth() + 1}/${date.getDate() + Number(correct_day) - 1}`;
        return date_now
    }

    public isFreshData = (data: dailyDataType, day: string): boolean => {
        if(data){
            let date: Date = new Date()
            let date_now: String = this.formatDateNow(day)
            if(date_now !== data.date){
                deleteDaily(data.search_parameter, day)
                return false
            }
            else{
                return true
            }
        }
        return false
    }

    public scrapDaily = async (search: string, day: string | any): Promise<void> => {
        if(this.isFreshData(getDaily(search, day), day)){
            this._dailyData = getDaily(search, day)
            
        }
        else{
            
            let hourlyLink = await axios
                .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                .then((prom) => prom.data)
                .then((results) => {
                    let $ = cheerio.load(results);
                    return "https://www.accuweather.com"+$(".subnav-item").toArray()[2].attribs.href
                });
  
            let hourlyresponse = await axios
                .get(hourlyLink+`?day=${day}`)
                .then((prom) => prom.data)
                .then(results => results);
            
            var that = this

            let tempDayNightList: dataType[] = []

            let $ = cheerio.load(hourlyresponse);

            //Scrapping the day and night data.
            $(".half-day-card").each(function(this){
                
                let tempDayNightData: dataType = {
                    title: "",
                    temperature: "",
                    real_feel: "",
                    real_feel_shade: "",
                    phrase: "",
                    max_uv_index: "",
                    wind: "",
                    wind_gusts: "",
                    prob_of_precip: "",
                    prob_of_thunderstorm: "",
                    precip: "",
                    cloud_cover: "",
                    icon: ""
                }

                tempDayNightData.title = $(this).find(".title").text().trim()
                tempDayNightData.temperature = String($(this).find(".temperature").text()).trim()
                tempDayNightData.real_feel = $(this).find(".real-feel").text().split("\n")[3].trim()
                tempDayNightData.real_feel_shade = String($(this).find(".realfeel-shade-details").text().split("\n")[3]).trim()
                tempDayNightData.phrase = $(this).find(".phrase").text().trim()
                tempDayNightData.icon = "https://www.accuweather.com" + <string> $(this).find("svg").data("src")

                that._dailyData.date = $(this).find(".short-date").text().trim()

                for(let next_child = 1; next_child <= 4; next_child++) {
                    let tempPanelData: string = $(this).find(`.left .panel-item:nth-child(${next_child})`).text().trim()
                    if(tempPanelData.includes("Max UV Index")){
                        tempDayNightData.max_uv_index = $(this).find(`.left .panel-item:nth-child(${next_child}) .value`).text().trim()
                        continue
                    }
                    else if(tempPanelData.includes("Gusts")){
                        tempDayNightData.wind_gusts = $(this).find(`.left .panel-item:nth-child(${next_child}) .value`).text().trim()
                        continue
                    }
                    else if(tempPanelData.includes("Wind")){
                        tempDayNightData.wind = $(this).find(`.left .panel-item:nth-child(${next_child}) .value`).text().trim()
                        continue
                    }
                    else if(tempPanelData.includes("Probability")){
                        tempDayNightData.prob_of_precip = $(this).find(`.left .panel-item:nth-child(${next_child}) .value`).text().trim()
                        continue
                    }
                }

                for(let next_child = 1; next_child <= 3; next_child++) {
                    let tempPanelData: string = $(this).find(`.right .panel-item:nth-child(${next_child})`).text().trim()
                    if(tempPanelData.includes("Probability")){
                        tempDayNightData.prob_of_thunderstorm = $(this).find(`.right .panel-item:nth-child(${next_child}) .value`).text().trim()
                        continue
                    }
                    else if(tempPanelData.includes("Precipitation")){
                        tempDayNightData.precip = $(this).find(`.right .panel-item:nth-child(${next_child}) .value`).text().trim()
                        continue
                    }
                    else if(tempPanelData.includes("Cloud")){
                        tempDayNightData.cloud_cover = $(this).find(`.right .panel-item:nth-child(${next_child}) .value`).text().trim()
                        continue
                    }
                }

                tempDayNightList.push(tempDayNightData)
            })  

            let day_night_data: dayNightType = {
                day: tempDayNightList[0],
                night: tempDayNightList[1]
            }

            //End scrappind day and night data 

            //Scrapping sunrise/sunset data.

            let tempRiseSetList: sunriseSunsetType[] = []

            $(".sunrise-sunset").find(".panel").each(function(this){
                
                let tempRiseSetData: sunriseSunsetType = {
                    duration: "",
                    rise: "",
                    set: ""
                }

                let durationList: string[] = String($(this).find(".spaced-content:nth-child(1)").find(".duration").text()).trim().split("\n")
                tempRiseSetData.duration =  `${durationList[0]} ${durationList[durationList.length - 1].trim()}`
                tempRiseSetData.rise = $(this).find(".spaced-content:nth-child(2)").find(".text-value:nth-child(2)").text().trim()
                tempRiseSetData.set = $(this).find(".spaced-content:nth-child(3)").find(".text-value:nth-child(2)").text().trim()

                tempRiseSetList.push(tempRiseSetData)
            })

            let sunrise_sunset_data: riseSetType = {
                sunrise: tempRiseSetList[0],
                sunset: tempRiseSetList[1]
            }

            //End scrapping sunrise/sunset data.

            //Scrapping temperature history.

            let tempHighLowList: highLowType[] = []

            $(".temp-history").find(".row").each(function(this){
                 let tempHighLowData: highLowType = {
                    high: "",
                    low: ""
                 }
                 
                 tempHighLowData.high = $(this).find(".temperature:nth-child(2)").text().trim()
                 tempHighLowData.low = $(this).find(".temperature:nth-child(3)").text().trim()
                 
                 tempHighLowList.push(tempHighLowData)
            })

            let TemperatureHistory: temperature_historyType = {
                forcast: tempHighLowList[0],
                average: tempHighLowList[1],
                last_yr: tempHighLowList[2]
            }

            //End scrapping temperature history data.

            this._dailyData.data.day_night = day_night_data
            this._dailyData.data.sunrise_sunset = sunrise_sunset_data
            this._dailyData.data.temperature_history = TemperatureHistory

            this._dailyData.search_parameter = search
            setDaily(this._dailyData)
            
        }
    }
     
    public getData = (location: string, day: string): dailyDataType => {
        return getDaily(location, day);
    };
            
}