import axios from "axios";
import cheerio = require("cheerio");
import { deleteDaily, getDaily, getHourly } from "../../Storage";
import { dailyDataType, dataType, dayNightType } from "../../Types/types";

export class Daily{

    private _dailyData: dailyDataType = {
        search_parameter: "",
        weather_site: "accuweather",
        date: "",
        data: []
    }

    private _NUMBEROFDAYS = 12

    constructor() {}

    public isFreshData = (data: dailyDataType): boolean => {
        if(data){
            let date: Date = new Date()
            let date_now: string = `${date.getDate()}/${date.getMonth() + 1}`;
            if(date_now === data.date){
                deleteDaily(data.search_parameter)
                return false
            }
            else{
                return true
            }
        }
        return false
    }

    public scrapDaily = async (search: string): Promise<void> => {
        if(this.isFreshData(getDaily(search))){
            this._dailyData = getDaily(search)
        }
        else{
            let hourlyLink = await axios
                .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                .then((prom) => prom.data)
                .then((results) => {
                    let $ = cheerio.load(results);
                    this._dailyData.search_parameter = $("head")
                        .find("title")
                        .text()
                        .trim();
                    return "https://www.accuweather.com"+$(".subnav-item").toArray()[2].attribs.href
                });

            //for(let dayIndx = 1; dayIndx <= this._NUMBEROFDAYS; dayIndx++ )
            let hourlyresponse = await axios
                .get(hourlyLink+"?day=1")
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
                    cloud_cover: ""
                }

                tempDayNightData.title = $(this).find(".title").text().trim()
                tempDayNightData.temperature = String($(this).find(".temperature").text()).trim()
                tempDayNightData.real_feel = $(this).find(".real-feel").text().split("\n")[3].trim()
                tempDayNightData.real_feel_shade = String($(this).find(".realfeel-shade-details").text().split("\n")[3]).trim()
                tempDayNightData.phrase = $(this).find(".phrase").text().trim()

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

            //End scrappind day and night data 

            let day_night_data: dayNightType = {
                day: tempDayNightList[0],
                night: tempDayNightList[1]
            }


        }
    }
     
    public getData = (location: string): dailyDataType => {
        return getDaily(location);
    };
            
}