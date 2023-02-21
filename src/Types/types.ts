export type locationsType = {
    search_parameter: string,
    weather_site: string,
    available_locations: string[]
}

export type todaydataType = {
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
    data: todaydataType
}

export type hourlydataType = {
    hour: string,
    temp: string,
    precip: string,
    type: string,
    real_feel: string,
    real_feel_shade: string,
    max_uv_index: string,
    wind: string,
    gusts: string,
    humidity: string,
    indoor_humidity: string,
    dew_point: string,
    air_quality: string,
    cloudy_cover: string,
    visibility: string,
    cloud_ceiling: string
}

export type hourlyDataType = {
    search_parameter: string,
    weather_site: string,
    data: hourlydataType[]
}

