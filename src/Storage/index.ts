import { todayDataType, hourlyDataType } from "../Types/types";

let todayData: todayDataType[] = [];
let hourlyData: hourlyDataType[] = [];

//today getter and setter
export const setToday = (today: todayDataType): void => {
    todayData.push(today);
}

export const getToday = (location: string): todayDataType => {
    return todayData.filter(data_ => data_.search_parameter.includes(location))[0];
}

//hourly getter and setter
export const setHourly = (hourly: hourlyDataType): void => {
    hourlyData.push(hourly);
}

export const getHourly = (location: string): hourlyDataType => {
    return hourlyData.filter(hourly_ => hourly_.search_parameter.includes(location))[0];
}

