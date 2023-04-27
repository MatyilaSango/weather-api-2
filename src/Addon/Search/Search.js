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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchOption = void 0;
const Objects_1 = require("../Objects/Objects");
const getSearchOption = (search, parameterType, day) => __awaiter(void 0, void 0, void 0, function* () {
    yield Objects_1.locationObj.scrapLocations(search);
    if (Objects_1.locationObj.getLocations().available_locations.length === 0) {
        switch (parameterType) {
            case "today":
                yield Objects_1.todayObj.scrapToday(search);
                return "today";
            case "hourly":
                yield Objects_1.hourlyObj.scrapHourly(search);
                return "hourly";
            case "daily":
                yield Objects_1.dailyObj.scrapDaily(search, day);
                return "daily";
        }
    }
    else if (Objects_1.locationObj.getLocations().available_locations.length > 0) {
        return "locations";
    }
    return "";
});
exports.getSearchOption = getSearchOption;
