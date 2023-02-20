"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToday = exports.setToday = void 0;
let data = [];
const setToday = (today) => {
    data.push(today);
};
exports.setToday = setToday;
const getToday = (location) => {
    return data.filter(data_ => data_.search_parameter.includes(location))[0];
};
exports.getToday = getToday;
