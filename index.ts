import express, { Request, Response } from "express";
import { Today } from "./src/Service/Today/Today";
import { Hourly } from "./src/Service/Hourly/Hourly";
import { Daily } from "./src/Service/Daily/Daily";
import { Locations } from "./src/Service/Locations/Locations";

let cors = require("cors");


const port = process.env.PORT || 3000;

let app = express();

app.use(cors());

let todayObj: Today;
let hourlyObj: Hourly;
let dailyObj: Daily;
let locationObj: Locations;

const getSearchOption = async (search: string, parameterType: string, day?: string): Promise<string> => {
    await locationObj.scrapLocations(search);
    if (locationObj.getLocations().available_locations.length === 0) {
        switch(parameterType){
            case "today":
                await todayObj.scrapToday(search);
                return "today";
                
            case "hourly":
                await hourlyObj.scrapHourly(search);
                return "hourly";

            case "daily":
                await dailyObj.scrapDaily(search, day);
                return "daily";
        }

    } else if (locationObj.getLocations().available_locations.length > 0) {
        return "locations";
    }

    return "";
};

app.get("/", (request: Request, response: Response): void => {
    response.json("A global weather API.");
});

app.get("/today/:param", (request: Request, response: Response): void => {
    todayObj = new Today();
    locationObj = new Locations();
    const query: string = request.params.param;
    getSearchOption(query, "today").then((res) => {
        res === "today"
            ? response.json(todayObj.getData(query))
            : response.json(locationObj.getLocations());
    });
});

app.get("/hourly/:param", (request: Request, response: Response): void => {
    hourlyObj = new Hourly();
    locationObj = new Locations();
    const query: string = request.params.param;
    getSearchOption(query, "hourly").then((res) => {
        res === "hourly"
            ? response.json(hourlyObj.getData(query))
            : response.json(locationObj.getLocations());
    });
})

app.get("/daily/:param/:day", (request: Request, response: Response): void => {
    dailyObj = new Daily();
    locationObj = new Locations();
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
