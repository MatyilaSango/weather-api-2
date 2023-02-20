"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodayStorage = void 0;
class TodayStorage {
    constructor() {
        this._data = [];
        this.setToday = (today) => {
            this._data.push(today);
        };
        this.getToday = (location) => {
            return this._data.filter(data => data.search_parameter.includes(location))[0];
        };
    }
}
exports.TodayStorage = TodayStorage;
