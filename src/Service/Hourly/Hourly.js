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
exports.Hourly = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const Storage_1 = require("../../Storage");
class Hourly {
    constructor() {
        this._houryData = {
            search_parameter: "",
            weather_site: "accuwether",
            data: []
        };
        this.isFreshData = (data) => {
            if (data) {
                let date_now = new Date();
                var data_hour = (data.data[0].hour.split(" ")[1] === "PM") ? Number(data.data[0].hour.split(" ")[0]) + 12 : Number(data.data[0].hour.split(" ")[0]);
                if (date_now.getHours() > data_hour) {
                    (0, Storage_1.deleteHourly)(data.search_parameter);
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        };
        this.scrapHourly = (search) => __awaiter(this, void 0, void 0, function* () {
            if (this.isFreshData((0, Storage_1.getHourly)(search))) {
                this._houryData = (0, Storage_1.getHourly)(search);
            }
            else {
                let hourlyLink = yield axios_1.default
                    .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                    .then((prom) => prom.data)
                    .then((results) => {
                    let $ = cheerio.load(results);
                    return "https://www.accuweather.com" + $(".subnav-item").toArray()[1].attribs.href;
                });
                let hourlyresponse = yield axios_1.default
                    .get(hourlyLink)
                    .then((prom) => prom.data)
                    .then(results => results);
                var that = this;
                let $ = cheerio.load(hourlyresponse);
                $(".hourly-wrapper").find(".accordion-item").each(function () {
                    let tempHourlyData = {
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
                    };
                    tempHourlyData.hour = $(this).find(".hourly-card-nfl-header").find(".date").text();
                    tempHourlyData.temp = $(this).find(".hourly-card-nfl-header").find(".temp").text();
                    tempHourlyData.precip = $(this).find(".hourly-card-nfl-header").find(".precip").text().trim();
                    tempHourlyData.type = $(this).find(".hourly-card-nfl-content").find(".phrase").text();
                    tempHourlyData.icon = "https://www.accuweather.com" + $(this).find(".hourly-card-nfl-header").find(".hourly-card-subcontaint:nth-child(1)").find("svg").data("src");
                    let next_child = 1;
                    while (next_child <= 12) {
                        let tempdata = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).text();
                        if (tempdata.includes("RealFeel®")) {
                            tempHourlyData.real_feel = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("RealFeel Shade")) {
                            tempHourlyData.real_feel_shade = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Max UV Index")) {
                            tempHourlyData.max_uv_index = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Wind")) {
                            tempHourlyData.wind = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Gusts")) {
                            tempHourlyData.gusts = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Humidity")) {
                            tempHourlyData.humidity = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Indoor Humidity")) {
                            tempHourlyData.indoor_humidity = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Dew Point")) {
                            tempHourlyData.dew_point = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Air Quality")) {
                            tempHourlyData.air_quality = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Cloud Cover")) {
                            tempHourlyData.cloudy_cover = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Visibility")) {
                            tempHourlyData.visibility = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else if (tempdata.includes("Cloud Ceiling")) {
                            tempHourlyData.cloud_ceiling = $(this).find(".hourly-card-nfl-content").find(`.panel p:nth-child(${next_child})`).find("span").text();
                            next_child += 1;
                            continue;
                        }
                        else {
                            next_child += 1;
                        }
                    }
                    that._houryData.data.push(tempHourlyData);
                });
                this._houryData.search_parameter = search;
                (0, Storage_1.setHourly)(this._houryData);
            }
        });
        this.getData = (location) => {
            return (0, Storage_1.getHourly)(location);
        };
    }
}
exports.Hourly = Hourly;
