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
const Today_1 = require("./Today");
const Locations_1 = require("./Locations");
const port = process.env.PORT || 3000;
let app = (0, express_1.default)();
let todayObj = new Today_1.Today();
let locationObj = new Locations_1.Locations();
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
app.get("/weather/:param", (request, response) => {
    const query = request.params.param;
    getSearchOption(query).then((res) => {
        res === 1
            ? response.json(todayObj.getData())
            : response.json(locationObj.getLocations());
    });
});
app.listen(port, () => {
    console.log("Server is running at port 3000.");
});
