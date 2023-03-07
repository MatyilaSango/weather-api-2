import axios from "axios";
import cheerio = require("cheerio");
import { locationsType } from "../../Types/types";

export class Locations {

    private _locations: locationsType = {
        search_parameter: "",
        weather_site: "accuweather",
        available_locations: [],
    };

    constructor() { }

    public scrapLocations = async (search: string): Promise<void> => {
        console.log("in scrapLocations")
        this._locations.search_parameter = search;
        let response = await axios
            .get(`https://www.accuweather.com/en/search-locations?query=${search}`)
            .then((prom) => prom.data)
            .then((results) => results)
            .catch(err => {console.log("caught an error")});

        let $ = cheerio.load(response);
        this._locations.available_locations = $(".locations-list a")
            .text()
            .split("\t")
            .filter((cell) => cell.trim() !== "");
    };

    public getLocations = (): locationsType => {
        return this._locations;
    };
}
