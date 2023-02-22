import { todayDataType, hourlyDataType, dailyDataType } from "../Types/types";

let todayData: todayDataType[] = [];
let hourlyData: hourlyDataType[] = [];
let dailyData: dailyDataType[] = [];

//today getter and setter
export const setToday = (today: todayDataType): void => {
    todayData.push(today);
}

export const getToday = (location: string): todayDataType => {
    return todayData.filter(today_ => today_.search_parameter.includes(location))[todayData.length - 1];
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
    hourlyData.filter(hourly_ => !hourly_.search_parameter.includes(location))
}

//daily getter and setter
export const setDaily = (daily_: dailyDataType): void => {
    dailyData.push(daily_);
}

export const getDaily = (location: string): dailyDataType => {
    return dailyData.filter(daily_ => daily_.search_parameter.includes(location))[dailyData.length - 1];
}

export const deleteDaily = (location: string): void => {
    dailyData.filter(daily_ => !daily_.search_parameter.includes(location))
}

