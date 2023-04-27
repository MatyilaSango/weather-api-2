import { dailyObj, hourlyObj, locationObj, todayObj } from "../Objects/Objects"

export const getSearchOption = async (search: string, parameterType: string, day?: string): Promise<string> => {
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