import axios from "axios";
import cheerio = require("cheerio");
import { deleteHourly, getHourly, setHourly } from "../../Storage";
import { hourlydataType, hourlyDataType } from "../../Types/types"

export class Hourly {

    private _houryData: hourlyDataType = {
        search_parameter: "",
        weather_site: "accuwether",
        data: []
    }
    constructor(){}

    public isFreshData = (data: hourlyDataType): boolean => {
        if(data){
            let date_now: Date = new Date();
            var data_hour: Number = (data.data[0].hour.split(" ")[1] === "PM") ? Number(data.data[0].hour.split(" ")[0]) + 12 : Number(data.data[0].hour.split(" ")[0]);
            if(date_now.getHours() > data_hour){
                deleteHourly(data.search_parameter)
                return false
            }
            else{
                return true
            }
        }
        return false
    }

    public scrapHourly = async (search: string): Promise<void> => {
        if(this.isFreshData(getHourly(search))){
            this._houryData = getHourly(search)
        }
        else{
            let hourlyLink = await axios
                .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                .then((prom) => prom.data)
                .then((results) => {
                    let $ = cheerio.load(results);
                    return "https://www.accuweather.com"+$(".subnav-item").toArray()[1].attribs.href
                });

            let hourlyresponse = await axios
                .get(hourlyLink)
                .then((prom) => prom.data)
                .then(results => results);
            
            var that = this
            let $ = cheerio.load(hourlyresponse);
            
            $(".hourly-wrapper").find(".accordion-item").each(function(this){

                let tempHourlyData: hourlydataType = {
                    hour: "",
                    temp: "",
                    precip: "",
                    type: "",
                    real_feel: "",
                    real_feel_shade: "",
                    max_uv_index: "",
                    wind: "",
                    gusts: "",
                    humidity: "",
                    indoor_humidity: "",
                    dew_point: "",
                    air_quality: "",
                    cloudy_cover: "",
                    visibility: "",
                    cloud_ceiling: "",
                    icon: ""
                }

                tempHourlyData.hour = $(this).find(".hourly-card-nfl-header").find(".date").text()
                tempHourlyData.temp = $(this).find(".hourly-card-nfl-header").find(".temp").text()
                tempHourlyData.precip = $(this).find(".hourly-card-nfl-header").find(".precip").text().trim()
                tempHourlyData.type = $(this).find(".hourly-card-nfl-content").find(".phrase").text()
                tempHourlyData.icon = "https://www.accuweather.com" + <string> $(this).find(".hourly-card-nfl-header").find(".hourly-card-subcontaint:nth-child(1)").find("svg").data("src")

                let next_child: number = 1;
                while(next_child <= 12){
                    let tempdata: string = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).text()
                    if(tempdata.includes("RealFeel®")){
                        tempHourlyData.real_feel = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("RealFeel Shade")){
                        tempHourlyData.real_feel_shade = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Max UV Index")){
                        tempHourlyData.max_uv_index = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Wind")){
                        tempHourlyData.wind = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Gusts")){
                        tempHourlyData.gusts = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Humidity")){
                        tempHourlyData.humidity = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Indoor Humidity")){
                        tempHourlyData.indoor_humidity = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Dew Point")){
                        tempHourlyData.dew_point = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Air Quality")){
                        tempHourlyData.air_quality = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Cloud Cover")){
                        tempHourlyData.cloudy_cover = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Visibility")){
                        tempHourlyData.visibility = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    }
                    else if(tempdata.includes("Cloud Ceiling")){
                        tempHourlyData.cloud_ceiling = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text()
                        next_child+=1 
                        continue
                    } 
                    else{
                        next_child+=1 
                    }              
                }           
                that._houryData.data.push(tempHourlyData)      
            })
            this._houryData.search_parameter = search  
            setHourly(this._houryData)
        }
    }

    public getData = (location: string): hourlyDataType => {
        return getHourly(location);
    };
}