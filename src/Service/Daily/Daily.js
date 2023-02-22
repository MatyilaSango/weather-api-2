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
            data: []
        };
        this._NUMBEROFDAYS = 12;
        this.isFreshData = (data) => {
            if (data) {
                let date = new Date();
                let date_now = `${date.getDate()}/${date.getMonth() + 1}`;
                if (date_now === data.date) {
                    (0, Storage_1.deleteDaily)(data.search_parameter);
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        };
        this.scrapDaily = (search) => __awaiter(this, void 0, void 0, function* () {
            if (this.isFreshData((0, Storage_1.getDaily)(search))) {
                this._dailyData = (0, Storage_1.getDaily)(search);
            }
            else {
                let hourlyLink = yield axios_1.default
                    .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                    .then((prom) => prom.data)
                    .then((results) => {
                    let $ = cheerio.load(results);
                    this._dailyData.search_parameter = $("head")
                        .find("title")
                        .text()
                        .trim();
                    return "https://www.accuweather.com" + $(".subnav-item").toArray()[2].attribs.href;
                });
                //for(let dayIndx = 1; dayIndx <= this._NUMBEROFDAYS; dayIndx++ )
                let hourlyresponse = yield axios_1.default
                    .get(hourlyLink + "?day=1")
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
                        cloud_cover: ""
                    };
                    tempDayNightData.title = $(this).find(".title").text().trim();
                    tempDayNightData.temperature = String($(this).find(".temperature").text()).trim();
                    tempDayNightData.real_feel = $(this).find(".real-feel").text().split("\n")[3].trim();
                    tempDayNightData.real_feel_shade = String($(this).find(".realfeel-shade-details").text().split("\n")[3]).trim();
                    tempDayNightData.phrase = $(this).find(".phrase").text().trim();
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
                //End scrappind day and night data 
                let day_night_data = {
                    day: tempDayNightList[0],
                    night: tempDayNightList[1]
                };
            }
        });
        this.getData = (location) => {
            return (0, Storage_1.getDaily)(location);
        };
    }
}
exports.Daily = Daily;
