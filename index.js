"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Objects_1 = require("./src/Addon/Objects/Objects");
const Search_1 = require("./src/Addon/Search/Search");
let cors = require("cors");
const port = process.env.PORT || 3000;
let app = (0, express_1.default)();
app.use(cors());
app.get("/", (request, response) => {
    response.json("A global weather API.");
});
app.get("/today/:param", (request, response) => {
    const query = request.params.param;
    (0, Search_1.getSearchOption)(query, "today").then((res) => {
        res === "today"
            ? response.json(Objects_1.todayObj.getData(query))
            : response.json(Objects_1.locationObj.getLocations());
    });
});
app.get("/hourly/:param", (request, response) => {
    const query = request.params.param;
    (0, Search_1.getSearchOption)(query, "hourly").then((res) => {
        res === "hourly"
            ? response.json(Objects_1.hourlyObj.getData(query))
            : response.json(Objects_1.locationObj.getLocations());
    });
});
app.get("/daily/:param/:day", (request, response) => {
    const location_query = request.params.param;
    const day_query = request.params.day;
    (0, Search_1.getSearchOption)(location_query, "daily", day_query).then((res) => {
        res === "daily"
            ? response.json(Objects_1.dailyObj.getData(location_query, day_query))
            : response.json(Objects_1.locationObj.getLocations());
    });
});
app.listen(port, () => {
    console.log("Server is running at port 3000.");
});
