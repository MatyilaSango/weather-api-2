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
        };
        this.isFreshData = (data) => {
            if (data) {
                let date_now = new Date();
                var data_time = Number(data.data.hour);
                if (date_now.getHours() > data_time) {
                    return false;
                }
            }
            return true;
        };
        this.scrapHourly = (search) => __awaiter(this, void 0, void 0, function* () {
            if ((0, Storage_1.getHourly)(search) && this.isFreshData((0, Storage_1.getHourly)(search))) {
                this._houryData = (0, Storage_1.getHourly)(search);
            }
            else {
                let hourlyLink = yield axios_1.default
                    .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
                    .then((prom) => prom.data)
                    .then((results) => {
                    let $ = cheerio.load(results);
                    return "https://www.accuweather.com/" + $(".subnav-item").toArray()[1].attribs.href;
                });
                let hourlyresponse = yield axios_1.default
                    .get(hourlyLink)
                    .then((prom) => prom.data)
                    .then((results) => results);
                let $ = cheerio.load(hourlyresponse);
            }
        });
        this.getData = (location) => {
            return (0, Storage_1.getHourly)(location);
        };
    }
}
exports.Hourly = Hourly;
