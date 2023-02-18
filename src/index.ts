import express, { Request, Response } from "express";
import { Today } from "./Today";
import { Locations } from "./Locations";

const port = process.env.PORT || 3000;

let app = express();

let todayObj: Today = new Today();

let locationObj: Locations = new Locations();

const getSearchOption = async (search: string): Promise<number | any> => {
    await locationObj.scrapLocations(search);
    if (locationObj.getLocations().available_locations.length === 0) {
        await todayObj.scrapLocation(search);
        return 1;
    } else if (locationObj.getLocations().available_locations.length > 0) {
        return 2;
    }

    return 0;
};

app.get("/", (request: Request, response: Response): void => {
    response.json("A global weather API.");
});

app.get("/weather/:param", (request: Request, response: Response): void => {
    const query: string = request.params.param;
    getSearchOption(query).then((res) => {
        res === 1
            ? response.json(todayObj.getData())
            : response.json(locationObj.getLocations());
    });
});

app.listen(port, () => {
    console.log("Server is running at port 3000.");
});
