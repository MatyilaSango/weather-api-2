import axios from "axios";
import cheerio = require("cheerio");
import { getHourly } from "../../Storage";
import { hourlyDataType } from "../../Types/types"

export class Hourly {
    private _houryData: hourlyDataType = {
        search_parameter: "",
        weather_site: "",
        data: {
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
            cloud_ceiling: ""
        }
    }
    constructor(){}

    public isFreshData = (data: hourlyDataType): boolean => {
        if(data){
            let date_now: Date = new Date();
            var data_time: Number = Number(data.data.hour);
            if(date_now.getHours() > data_time){
                return false
            }
        }
        return true
    }

    public scrapHourly = async (search: string): Promise<void> => {
        if(getHourly(search) && this.isFreshData(getHourly(search))){
            this._houryData = getHourly(search)
        }
        else{
            let hourlyLink= await axios
                .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                .then((prom) => prom.data)
                .then((results) => {
                    let $ = cheerio.load(results);
                    return "https://www.accuweather.com/"+$(".subnav-item").toArray()[1].attribs.href
                });

            let hourlyresponse = await axios
                .get(hourlyLink)
                .then((prom) => prom.data)
                .then((results) => results);

            let $ = cheerio.load(hourlyresponse);
        }
    }

    public getData = (location: string): hourlyDataType => {
        return getHourly(location);
    };
}