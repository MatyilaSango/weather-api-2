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
exports.Daily = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const Storage_1 = require("../../Storage");
class Daily {
    constructor() {
        this._dailyData = {
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
        };
        this._NUMBEROFDAYS = 12;
        this.formatDateNow = (day) => {
            let correct_day = (Number(day) === 0 || Number(day) === 1) ? 0 : Number(day);
            let date = new Date();
            let date_now = `${date.getMonth() + 1}/${date.getDate() + Number(correct_day) - 1}`;
            return date_now;
        };
        this.isFreshData = (data, day) => {
            if (data) {
                let date = new Date();
                let date_now = this.formatDateNow(day);
                if (date_now !== data.date) {
                    (0, Storage_1.deleteDaily)(data.search_parameter, day);
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        };
        this.scrapDaily = (search, day) => __awaiter(this, void 0, void 0, function* () {
            if (this.isFreshData((0, Storage_1.getDaily)(search, day), day)) {
                this._dailyData = (0, Storage_1.getDaily)(search, day);
            }
            else {
                let hourlyLink = yield axios_1.default
                    .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                    .then((prom) => prom.data)
                    .then((results) => {
                    let $ = cheerio.load(results);
                    return "https://www.accuweather.com" + $(".subnav-item").toArray()[2].attribs.href;
                });
                let hourlyresponse = yield axios_1.default
                    .get(hourlyLink + `?day=${day}`)
                    .then((prom) => prom.data)
                    .then(results => results);
                var that = this;
                let tempDayNightList = [];
                let $ = cheerio.load(hourlyresponse);
                //Scrapping the day and night data.
                $(".half-day-card").each(function () {
                    let tempDayNightData = {
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
                    };
                    tempDayNightData.title = $(this).find(".title").text().trim();
                    tempDayNightData.temperature = String($(this).find(".temperature").text()).trim();
                    tempDayNightData.real_feel = $(this).find(".real-feel").text().split("\n")[3].trim();
                    tempDayNightData.real_feel_shade = String($(this).find(".realfeel-shade-details").text().split("\n")[3]).trim();
                    tempDayNightData.phrase = $(this).find(".phrase").text().trim();
                    tempDayNightData.icon = "https://www.accuweather.com" + $(this).find("svg").data("src");
                    that._dailyData.date = $(this).find(".short-date").text().trim();
                    for (let next_child = 1; next_child <= 4; next_child++) {
                        let tempPanelData = $(this).find(`.left .panel-item:nth-child(${next_child})`).text().trim();
                        if (tempPanelData.includes("Max UV Index")) {
                            tempDayNightData.max_uv_index = $(this).find(`.left .panel-item:nth-child(${next_child}) .value`).text().trim();
                            continue;
                        }
                        else if (tempPanelData.includes("Gusts")) {
                            tempDayNightData.wind_gusts = $(this).find(`.left .panel-item:nth-child(${next_child}) .value`).text().trim();
                            continue;
                        }
                        else if (tempPanelData.includes("Wind")) {
                            tempDayNightData.wind = $(this).find(`.left .panel-item:nth-child(${next_child}) .value`).text().trim();
                            continue;
                        }
                        else if (tempPanelData.includes("Probability")) {
                            tempDayNightData.prob_of_precip = $(this).find(`.left .panel-item:nth-child(${next_child}) .value`).text().trim();
                            continue;
                        }
                    }
                    for (let next_child = 1; next_child <= 3; next_child++) {
                        let tempPanelData = $(this).find(`.right .panel-item:nth-child(${next_child})`).text().trim();
                        if (tempPanelData.includes("Probability")) {
                            tempDayNightData.prob_of_thunderstorm = $(this).find(`.right .panel-item:nth-child(${next_child}) .value`).text().trim();
                            continue;
                        }
                        else if (tempPanelData.includes("Precipitation")) {
                            tempDayNightData.precip = $(this).find(`.right .panel-item:nth-child(${next_child}) .value`).text().trim();
                            continue;
                        }
                        else if (tempPanelData.includes("Cloud")) {
                            tempDayNightData.cloud_cover = $(this).find(`.right .panel-item:nth-child(${next_child}) .value`).text().trim();
                            continue;
                        }
                    }
                    tempDayNightList.push(tempDayNightData);
                });
                let day_night_data = {
                    day: tempDayNightList[0],
                    night: tempDayNightList[1]
                };
                //End scrappind day and night data 
                //Scrapping sunrise/sunset data.
                let tempRiseSetList = [];
                $(".sunrise-sunset").find(".panel").each(function () {
                    let tempRiseSetData = {
                        duration: "",
                        rise: "",
                        set: ""
                    };
                    let durationList = String($(this).find(".spaced-content:nth-child(1)").find(".duration").text()).trim().split("\n");
                    tempRiseSetData.duration = `${durationList[0]} ${durationList[durationList.length - 1].trim()}`;
                    tempRiseSetData.rise = $(this).find(".spaced-content:nth-child(2)").find(".text-value:nth-child(2)").text().trim();
                    tempRiseSetData.set = $(this).find(".spaced-content:nth-child(3)").find(".text-value:nth-child(2)").text().trim();
                    tempRiseSetList.push(tempRiseSetData);
                });
                let sunrise_sunset_data = {
                    sunrise: tempRiseSetList[0],
                    sunset: tempRiseSetList[1]
                };
                //End scrapping sunrise/sunset data.
                //Scrapping temperature history.
                let tempHighLowList = [];
                $(".temp-history").find(".row").each(function () {
                    let tempHighLowData = {
                        high: "",
                        low: ""
                    };
                    tempHighLowData.high = $(this).find(".temperature:nth-child(2)").text().trim();
                    tempHighLowData.low = $(this).find(".temperature:nth-child(3)").text().trim();
                    tempHighLowList.push(tempHighLowData);
                });
                let TemperatureHistory = {
                    forcast: tempHighLowList[0],
                    average: tempHighLowList[1],
                    last_yr: tempHighLowList[2]
                };
                //End scrapping temperature history data.
                this._dailyData.data.day_night = day_night_data;
                this._dailyData.data.sunrise_sunset = sunrise_sunset_data;
                this._dailyData.data.temperature_history = TemperatureHistory;
                this._dailyData.search_parameter = search;
                (0, Storage_1.setDaily)(this._dailyData);
            }
        });
        this.getData = (location, day) => {
            return (0, Storage_1.getDaily)(location, day);
        };
    }
}
exports.Daily = Daily;
