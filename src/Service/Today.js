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
const StorageToday_1 = require("../Storage/StorageToday");
class Today {
    constructor() {
        this._data_by_location = {
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
        this._storage_today = new StorageToday_1.TodayStorage();
        this.scrapLocation = (search) => __awaiter(this, void 0, void 0, function* () {
            if (this._storage_today.getToday(search)) {
                console.log("exist");
                this._data_by_location = this._storage_today.getToday(search);
            }
            else {
                console.log("scrapping");
                let response = yield axios_1.default
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
        });
        this.getData = (location) => {
            return this._storage_today.getToday(location);
        };
    }
}
exports.Today = Today;
