import { todayDataType } from "../Types/types";

let data: todayDataType[] = [];

export const setToday = (today: todayDataType): void => {
    data.push(today);
}

export const getToday = (location: string): todayDataType => {
    return data.filter(data_ => data_.search_parameter.includes(location))[0];
}
