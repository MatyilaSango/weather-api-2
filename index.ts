import express, { Request, Response } from "express";
import { dailyObj, hourlyObj, locationObj, todayObj } from "./src/Addon/Objects/Objects"
import { getSearchOption } from "./src/Addon/Search/Search";

let cors = require("cors");


const port = process.env.PORT || 3000;

let app = express();

app.use(cors());


app.get("/", (request: Request, response: Response): void => {
    response.json("A global weather API.");
});

app.get("/today/:param", (request: Request, response: Response): void => {
    const query: string = request.params.param;
    getSearchOption(query, "today").then((res) => {
        res === "today"
            ? response.json(todayObj.getData(query))
            : response.json(locationObj.getLocations());
    });
});

app.get("/hourly/:param", (request: Request, response: Response): void => {
    const query: string = request.params.param;
    getSearchOption(query, "hourly").then((res) => {
        res === "hourly"
            ? response.json(hourlyObj.getData(query))
            : response.json(locationObj.getLocations());
    });
})

app.get("/daily/:param/:day", (request: Request, response: Response): void => {
    const location_query: string = request.params.param;
    const day_query: string = request.params.day;

    getSearchOption(location_query, "daily", day_query).then((res) => {
        res === "daily"
            ? response.json(dailyObj.getData(location_query, day_query))
            : response.json(locationObj.getLocations());
    });
})


app.listen(port, () => {
    console.log("Server is running at port 3000.");
});
