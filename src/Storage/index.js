"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHourly = exports.getHourly = exports.setHourly = exports.deleteToday = exports.getToday = exports.setToday = void 0;
let todayData = [];
let hourlyData = [];
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
    return hourlyData.filter(hourly_ => hourly_.search_parameter.includes(location))[hourlyData.length - 1];
};
exports.getHourly = getHourly;
const deleteHourly = (location) => {
    todayData.filter(hourly_ => !hourly_.search_parameter.includes(location));
};
exports.deleteHourly = deleteHourly;
