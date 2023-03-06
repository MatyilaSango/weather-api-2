import { todayDataType, hourlyDataType, dailyDataType } from "../Types/types";

let todayData: todayDataType[] = [];
let hourlyData: hourlyDataType[] = [];
let dailyData: dailyDataType[] = [];

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
    return hourlyData.filter(hourly_ => hourly_.search_parameter.includes(location))[0];
}

export const deleteHourly = (location: string): void => {
    hourlyData.filter(hourly_ => !hourly_.search_parameter.includes(location))
}

//daily getter and setter
export const setDaily = (daily_: dailyDataType): void => {
    dailyData.push(daily_);
}

const formatDateNow = (day: string): String => {
    let correct_day: Number = (Number(day) === 0 || Number(day) === 1) ? 0 : Number(day)
    let date: Date = new Date()
    let date_now: string = `${date.getMonth() + 1}/${date.getDate() + Number(correct_day)}`;
    return date_now
}

export const getDaily = (location: string, day: string): dailyDataType => {
    let date_now: String = formatDateNow(day)
    return dailyData.filter(daily_ => daily_.search_parameter.includes(location))[0];
}

export const deleteDaily = (location: string, day: string): void => {
    let date_now: String = formatDateNow(day)
    dailyData = dailyData.filter(daily_ => !(daily_.search_parameter.includes(location) && daily_.date === date_now))
}

