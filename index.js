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
const express_1 = __importDefault(require("express"));
const Today_1 = require("./src/Service/Today/Today");
const Hourly_1 = require("./src/Service/Hourly/Hourly");
const Daily_1 = require("./src/Service/Daily/Daily");
const Locations_1 = require("./src/Service/Locations/Locations");
let cors = require("cors");
const port = process.env.PORT || 3000;
let app = (0, express_1.default)();
app.use(cors());
let todayObj;
let hourlyObj;
let dailyObj;
let locationObj;
const getSearchOption = (search, parameterType, day) => __awaiter(void 0, void 0, void 0, function* () {
    yield locationObj.scrapLocations(search);
    if (locationObj.getLocations().available_locations.length === 0) {
        switch (parameterType) {
            case "today":
                yield todayObj.scrapToday(search);
                return "today";
            case "hourly":
                yield hourlyObj.scrapHourly(search);
                return "hourly";
            case "daily":
                yield dailyObj.scrapDaily(search, day);
                return "daily";
        }
    }
    else if (locationObj.getLocations().available_locations.length > 0) {
        return "locations";
    }
    return "";
});
app.get("/", (request, response) => {
    response.json("A global weather API.");
});
app.get("/today/:param", (request, response) => {
    todayObj = new Today_1.Today();
    locationObj = new Locations_1.Locations();
    const query = request.params.param;
    getSearchOption(query, "today").then((res) => {
        res === "today"
            ? response.json(todayObj.getData(query))
            : response.json(locationObj.getLocations());
    });
});
app.get("/hourly/:param", (request, response) => {
    hourlyObj = new Hourly_1.Hourly();
    locationObj = new Locations_1.Locations();
    const query = request.params.param;
    getSearchOption(query, "hourly").then((res) => {
        res === "hourly"
            ? response.json(hourlyObj.getData(query))
            : response.json(locationObj.getLocations());
    });
});
app.get("/daily/:param/:day", (request, response) => {
    dailyObj = new Daily_1.Daily();
    locationObj = new Locations_1.Locations();
    const location_query = request.params.param;
    const day_query = request.params.day;
    getSearchOption(location_query, "daily", day_query).then((res) => {
        res === "daily"
            ? response.json(dailyObj.getData(location_query, day_query))
            : response.json(locationObj.getLocations());
    });
});
app.listen(port, () => {
    console.log("Server is running at port 3000.");
});
