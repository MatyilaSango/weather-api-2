"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Today = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const Storage_1 = require("../../Storage");
class Today {
    constructor() {
        this._data_by_location = {
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
        this.isFreshData = (data) => {
            if (data) {
                let date_now = new Date();
                var data_time = new Date(data.data.date.getTime());
                data_time.setMinutes(data_time.getMinutes() + 5);
                if (date_now.getTime() > data_time.getTime()) {
                    (0, Storage_1.deleteToday)(data.search_parameter);
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        };
        this.scrapToday = (search) => __awaiter(this, void 0, void 0, function* () {
            if ((0, Storage_1.getToday)(search) && this.isFreshData((0, Storage_1.getToday)(search))) {
                this._data_by_location = (0, Storage_1.getToday)(search);
            }
            else {
                let response = yield axios_1.default
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
                this._data_by_location.data.icon = "https://www.accuweather.com" + $(".cur-con-weather-card").find(".weather-icon").data("src");
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
                this._data_by_location.search_parameter = search;
                this._data_by_location.data.offset = `${(this._data_by_location.data.time.includes("PM")) ? (Number(this._data_by_location.data.time.split(":")[0]) + 12) - (new Date().getUTCHours()) : Number(this._data_by_location.data.time.split(":")[0]) - (new Date().getUTCHours())}`;
                (0, Storage_1.setToday)(this._data_by_location);
            }
        });
        this.getData = (location) => {
            return (0, Storage_1.getToday)(location);
        };
    }
}
exports.Today = Today;
