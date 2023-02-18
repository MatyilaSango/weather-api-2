import axios from "axios";
import cheerio = require("cheerio");
import { todayDataType } from "./types";

export class Today {
    private _searchParam: string = "";

    private _data_by_location: todayDataType = {
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

    constructor() { }

    public scrapLocation = async (search: string): Promise<void> => {
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
    };

    public getData = (): todayDataType => {
        return this._data_by_location;
    };
}
