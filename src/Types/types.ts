//Today types

export type locationsType = {
    search_parameter: string,
    weather_site: string,
    available_locations: string[]
}

export type todayType = {
    title: string,
    time: string,
    date: Date,
    temp: string,
    real_feel: string,
    air_quality: string,
    wind: string,
    wind_gusts: string,
    type: string,
    icon: string
}

export type todayDataType = {
    search_parameter: string,
    weather_site: string,
    data: todayType
}

//Hourly types

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
    cloud_ceiling: string,
    icon: string
}

export type hourlyDataType = {
    search_parameter: string,
    weather_site: string,
    data: hourlydataType[]
}


//Daily types

export type dataType = {
    title: string,
    temperature: string,
    real_feel: string,
    real_feel_shade: string,
    phrase: string,
    max_uv_index: string,
    wind: string,
    wind_gusts: string,
    prob_of_precip: string,
    prob_of_thunderstorm: string,
    precip: string,
    cloud_cover: string,
    icon: string
}

export type dayNightType = {
    day: dataType
    night: dataType
}

export type sunriseSunsetType = {
    duration: string,
    rise: string,
    set: string,
}

export type riseSetType = {
    sunrise: sunriseSunsetType,
    sunset: sunriseSunsetType
}

export type highLowType = {
    high: string,
    low: string
}

export type temperature_historyType = {
    forcast: highLowType,
    average: highLowType,
    last_yr: highLowType
}

export type daySunTempType = {
    day_night: dayNightType,
    sunrise_sunset: riseSetType,
    temperature_history: temperature_historyType
}

export type dailyDataType = {
    search_parameter: string,
    weather_site: string,
    date: string,
    data: daySunTempType
}
