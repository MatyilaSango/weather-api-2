import { todayDataType, hourlyDataType } from "../Types/types";

let todayData: todayDataType[] = [];
let hourlyData: hourlyDataType[] = [];

//today getter and setter
export const setToday = (today: todayDataType): void => {
    todayData.push(today);
}

export const getToday = (location: string): todayDataType => {
    return todayData.filter(today_ => today_.search_parameter.includes(location))[0];
}

export const deleteToday = (location: string): void => {
    todayData.filter(today_ => !today_.search_parameter.includes(location))
}

//hourly getter and setter
export const setHourly = (hourly: hourlyDataType): void => {
    hourlyData.push(hourly);
}

export const getHourly = (location: string): hourlyDataType => {
    return hourlyData.filter(hourly_ => hourly_.search_parameter.includes(location))[hourlyData.length - 1];
}

export const deleteHourly = (location: string): void => {
    todayData.filter(hourly_ => !hourly_.search_parameter.includes(location))
}

