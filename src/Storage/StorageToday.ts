import { todayDataType } from "../Types/types";

export class TodayStorage{

    private _data: todayDataType[] = [];

    constructor(){}

    public setToday = (today: todayDataType): void => {
        this._data.push(today);
    }

    public getToday = (location: string): todayDataType => {
        return this._data.filter(data => data.search_parameter.includes(location))[0];
    }
} 