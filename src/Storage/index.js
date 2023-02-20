"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHourly = exports.setHourly = exports.getToday = exports.setToday = void 0;
let todayData = [];
let hourlyData = [];
//today getter and setter
const setToday = (today) => {
    todayData.push(today);
};
exports.setToday = setToday;
const getToday = (location) => {
    return todayData.filter(data_ => data_.search_parameter.includes(location))[0];
};
exports.getToday = getToday;
//hourly getter and setter
const setHourly = (hourly) => {
    hourlyData.push(hourly);
};
exports.setHourly = setHourly;
const getHourly = (location) => {
    return hourlyData.filter(hourly_ => hourly_.search_parameter.includes(location))[0];
};
exports.getHourly = getHourly;
