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
const Today_1 = require("./Service/Today");
const Locations_1 = require("./Service/Locations");
const port = process.env.PORT || 3000;
let app = (0, express_1.default)();
let todayObj;
let locationObj;
const getSearchOption = (search) => __awaiter(void 0, void 0, void 0, function* () {
    yield locationObj.scrapLocations(search);
    if (locationObj.getLocations().available_locations.length === 0) {
        yield todayObj.scrapLocation(search);
        return 1;
    }
    else if (locationObj.getLocations().available_locations.length > 0) {
        return 2;
    }
    return 0;
});
app.get("/", (request, response) => {
    response.json("A global weather API.");
});
app.get("/today/:param", (request, response) => {
    todayObj = new Today_1.Today();
    locationObj = new Locations_1.Locations();
    const query = request.params.param;
    getSearchOption(query).then((res) => {
        res === 1
            ? response.json(todayObj.getData(query))
            : response.json(locationObj.getLocations());
    });
});
app.get("/hourly/:param", (request, response) => {
    const query = request.params.param;
});
app.get("/daily/:param", (request, response) => {
    const query = request.params.param;
});
app.listen(port, () => {
    console.log("Server is running at port 3000.");
});
