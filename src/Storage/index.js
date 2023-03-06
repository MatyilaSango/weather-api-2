"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDaily = exports.getDaily = exports.setDaily = exports.deleteHourly = exports.getHourly = exports.setHourly = exports.deleteToday = exports.getToday = exports.setToday = void 0;
let todayData = [];
let hourlyData = [];
let dailyData = [];
//today getter and setter
const setToday = (today) => {
    todayData.push(today);
};
exports.setToday = setToday;
const getToday = (location) => {
    return todayData.filter(today_ => today_.search_parameter.includes(location))[0];
};
exports.getToday = getToday;
const deleteToday = (location) => {
    todayData.filter(today_ => !today_.search_parameter.includes(location));
};
exports.deleteToday = deleteToday;
//hourly getter and setter
const setHourly = (hourly) => {
    hourlyData.push(hourly);
};
exports.setHourly = setHourly;
const getHourly = (location) => {
    return hourlyData.filter(hourly_ => hourly_.search_parameter.includes(location))[0];
};
exports.getHourly = getHourly;
const deleteHourly = (location) => {
    hourlyData.filter(hourly_ => !hourly_.search_parameter.includes(location));
};
exports.deleteHourly = deleteHourly;
//daily getter and setter
const setDaily = (daily_) => {
    dailyData.push(daily_);
};
exports.setDaily = setDaily;
const formatDateNow = (day) => {
    let correct_day = (Number(day) === 0 || Number(day) === 1) ? 0 : Number(day);
    let date = new Date();
    let date_now = `${date.getMonth() + 1}/${date.getDate() + Number(correct_day)}`;
    return date_now;
};
const getDaily = (location, day) => {
    let date_now = formatDateNow(day);
    return dailyData.filter(daily_ => daily_.search_parameter.includes(location))[0];
};
exports.getDaily = getDaily;
const deleteDaily = (location, day) => {
    let date_now = formatDateNow(day);
    dailyData = dailyData.filter(daily_ => !(daily_.search_parameter.includes(location) && daily_.date === date_now));
};
exports.deleteDaily = deleteDaily;
