export type locationsType = {
    search_parameter: string,
    weather_site: string,
    available_locations: string[]
}

export type dataType = {
    title: string,
    time: string,
    date: Date,
    temp: string,
    real_feel: string,
    air_quality: string,
    wind: string,
    wind_gusts: string,
    type: string,
}

export type todayDataType = {
    search_parameter: string,
    weather_site: string,
    data: dataType
}

