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
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const cheerio = require("cheerio");
let app = (0, express_1.default)();
let output = 0;
let locations = {
    search_parameter: "",
    weather_site: "accuweather",
    available_locations: []
};
let data_by_location = {
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
    }
};
const getLocations = (search) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield axios_1.default.get(`https://www.accuweather.com/en/search-locations?query=${search}`)
        .then(prom => prom.data)
        .then(results => results);
    let $ = cheerio.load(response);
    let locations = $(".locations-list a").text()
        .split("\t")
        .filter(cell => cell.trim() !== '');
    return locations;
});
const getDataByLocation = (location) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield axios_1.default.get(`https://www.accuweather.com/en/search-locations?query=${location}`)
        .then(prom => prom.data)
        .then(results => results);
    let $ = cheerio.load(response);
    data_by_location.data.time = $(".cur-con-weather-card").find(".cur-con-weather-card__subtitle").text().trim();
    data_by_location.data.temp = $(".cur-con-weather-card").find(".temp-container .temp").text().trim();
    data_by_location.data.type = $(".cur-con-weather-card").find(".spaced-content").find(".phrase").text();
    $(".cur-con-weather-card").find(".details-container").find(".spaced-content").each(function () {
        switch ($(this).find(".label").text()) {
            case "RealFeel Shade™":
                data_by_location.data.real_feel = $(this).find(".value").text();
            case "air Quality":
                data_by_location.data.air_quality = $(this).find(".value").text();
            case "Wind":
                data_by_location.data.wind = $(this).find(".value").text();
            case "Wind Gusts":
                data_by_location.data.wind_gusts = $(this).find(".value").text();
        }
    });
});
const getSearchData = (location) => {
    getLocations(location).then(res => {
        if (res.length === 0) {
            data_by_location.search_parameter = location;
            getDataByLocation(location);
            output = 1;
        }
        else if (res.length > 0) {
            locations.search_parameter = location;
            locations.available_locations = res;
            output = 2;
        }
    });
};
getSearchData("Cape Town, Western Cape");
app.get("/", (request, response) => {
    (output === 1) ? response.json(data_by_location) : response.json(locations);
});
app.listen(3000, () => {
    console.log("Server is running at port 3000.");
});