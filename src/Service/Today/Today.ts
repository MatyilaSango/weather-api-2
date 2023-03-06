import axios from "axios";
import cheerio = require("cheerio");
import { todayDataType } from "../../Types/types";
import { setToday, getToday, deleteToday } from "../../Storage"

export class Today {

    private _data_by_location: todayDataType  = {
        search_parameter: "",
        weather_site: "accuweather",
        data: {
            title: "Current weather",
            time: "",
            offset: "",
            date: new Date(),
            temp: "",
            real_feel: "",
            air_quality: "",
            wind: "",
            wind_gusts: "",
            type: "",
            icon: ""
        },
    };

    constructor() {}

    public isFreshData = (data: todayDataType): boolean => {
        if(data){
            let date_now: Date = new Date();
            var data_time = new Date(data.data.date.getTime())
            data_time.setMinutes(data_time.getMinutes() + 5)
            if(date_now.getTime() > data_time.getTime()){
                deleteToday(data.search_parameter)
                return false
            }
            else{
                return true
            }
        }
        return false
    }

    public scrapToday = async (search: string): Promise<void> => {
        if(getToday(search) && this.isFreshData(getToday(search))){
            this._data_by_location = getToday(search)
        }
        else{
            let response = await axios
                .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                .then((prom) => prom.data)
                .then((results) => results);

            let $ = cheerio.load(response);
            var that = this;
            this._data_by_location.data.time = $(".cur-con-weather-card")
                .find(".cur-con-weather-card__subtitle")
                .text()
                .trim();
            this._data_by_location.data.date = new Date();
            this._data_by_location.data.temp = $(".cur-con-weather-card")
                .find(".temp-container .temp")
                .text()
                .trim();
            this._data_by_location.data.type = $(".cur-con-weather-card")
                .find(".spaced-content")
                .find(".phrase")
                .text();

            this._data_by_location.data.icon = "https://www.accuweather.com"+<string> $(".cur-con-weather-card").find(".weather-icon").data("src")

            $(".cur-con-weather-card")
                .find(".details-container")
                .find(".spaced-content")
                .each(function () {
                    switch ($(this).find(".label").text()) {
                        case "RealFeel Shade™":
                            that._data_by_location.data.real_feel = $(this)
                                .find(".value")
                                .text();

                        case "air Quality":
                            that._data_by_location.data.air_quality = $(this)
                                .find(".value")
                                .text();

                        case "Wind":
                            that._data_by_location.data.wind = $(this).find(".value").text();

                        case "Wind Gusts":
                            that._data_by_location.data.wind_gusts = $(this)
                                .find(".value")
                                .text();
                    }
                });
            this._data_by_location.search_parameter = search
            this._data_by_location.data.offset = `${(this._data_by_location.data.time.includes("PM")) ? (Number(this._data_by_location.data.time.split(":")[0]) + 12) - (new Date().getUTCHours()) : Number(this._data_by_location.data.time.split(":")[0]) - (new Date().getUTCHours())}`
            setToday(this._data_by_location);
        }
    };

    public getData = (location: string): todayDataType => {
        return getToday(location);
    };
}
