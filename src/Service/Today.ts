import axios from "axios";
import cheerio = require("cheerio");
import { todayDataType } from "../Types/types";
import { TodayStorage } from "../Storage/StorageToday"

export class Today {

    private _data_by_location: todayDataType  = {
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
        },
    };

    private _storage_today: TodayStorage = new TodayStorage();

    constructor() { }

    public scrapLocation = async (search: string): Promise<void> => {
        if(this._storage_today.getToday(search)){
            console.log("exist")
            this._data_by_location = this._storage_today.getToday(search)
        }
        else{
            console.log("scrapping")
            let response = await axios
                .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                .then((prom) => prom.data)
                .then((results) => results);

            let $ = cheerio.load(response);

            var that = this;
            this._data_by_location.search_parameter = $("head")
                .find("title")
                .text()
                .trim();
            this._data_by_location.data.time = $(".cur-con-weather-card")
                .find(".cur-con-weather-card__subtitle")
                .text()
                .trim();
            this._data_by_location.data.temp = $(".cur-con-weather-card")
                .find(".temp-container .temp")
                .text()
                .trim();
            this._data_by_location.data.type = $(".cur-con-weather-card")
                .find(".spaced-content")
                .find(".phrase")
                .text();

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
            this._storage_today.setToday(this._data_by_location);
        }
    };

    public getData = (location: string): todayDataType => {
        return this._storage_today.getToday(location);
    };
}
