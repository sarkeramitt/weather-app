"use client"

import { useState } from "react"

export default function WeatherCard({ weatherData }) {
  const [unit, setUnit] = useState("celsius")

  if (!weatherData) return null

  const { location, current, hourlyForecast, dailyForecast, lastUpdated } = weatherData

  if (!weatherData || !hourlyForecast) {
    return (
      <div className="w-full max-w-md rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-6 font-sans overflow-hidden relative">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-white/20 rounded w-3/4"></div>
          <div className="h-24 bg-white/20 rounded"></div>
          <div className="h-32 bg-white/20 rounded"></div>
          <div className="h-48 bg-white/20 rounded"></div>
        </div>
      </div>
    )
  }

  const convertTemp = (temp) => {
    if (unit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32)
    }
    return Math.round(temp)
  }

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) {
      return "sunny"
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return conditionLower.includes("partly") ? "partly_cloudy_day" : "cloud"
    } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return "rainy"
    } else if (conditionLower.includes("snow")) {
      return "weather_snowy"
    } else if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
      return "thunderstorm"
    } else {
      return "cloud"
    }
  }

  const getDayName = (dateStr) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const date = new Date(dateStr)
    return days[date.getDay()]
  }

  const toggleUnit = () => {
    setUnit(unit === "celsius" ? "fahrenheit" : "celsius")
  }

  return (
    <div className="w-full max-w-md rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-6 font-sans overflow-hidden relative hover:shadow-xl transition-shadow duration-300">
      <div className="absolute top-0 right-0 w-16 h-16 cursor-pointer" onClick={toggleUnit}>
        <svg
          className="w-full h-full text-yellow-400 opacity-70 hover:opacity-100"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path>
        </svg>
      </div>

      <div className="flex items-center space-x-3 mb-5">
        <span className="material-symbols-rounded text-3xl text-white">location_on</span>
        <h2 className="text-xl font-bold text-white tracking-wide">
          {location.name}, {location.country}
        </h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-5xl font-bold text-white mb-1">
            {convertTemp(current.temperature)}°{unit === "celsius" ? "C" : "F"}
          </div>
          <div className="text-blue-100">
            {"Feels like "}
            {convertTemp(current.feelsLike)}°{unit === "celsius" ? "C" : "F"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-white text-xl font-semibold">{current.condition}</div>
          <div className="text-blue-100">
            {"Humidity: "}
            {current.humidity}%
          </div>
          <div className="text-blue-100">
            {"Wind: "}
            {current.windSpeed} mph
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
        <h3 className="text-white font-semibold mb-3">{"Today's Forecast"}</h3>
        <div className="flex justify-between">
          {hourlyForecast?.slice(0, 5).map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center transform hover:scale-110 transition-transform duration-200"
            >
              <div className="text-sm text-blue-100">{index === 0 ? "Now" : hour.time}</div>
              <span className="material-symbols-rounded text-yellow-300 my-1">{getWeatherIcon(hour.condition)}</span>
              <div className="text-white font-medium">{convertTemp(hour.temperature)}°</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">{"5-Day Forecast"}</h3>
        <div className="space-y-2">
          {dailyForecast.map((day, index) => (
            <div
              key={index}
              className="flex justify-between items-center hover:bg-white/10 p-2 rounded transition-colors duration-200"
            >
              <div className="text-blue-100 w-20">{getDayName(day.date)}</div>
              <span className="material-symbols-outlined text-yellow-300">{getWeatherIcon(day.condition)}</span>
              <div className="text-white">
                {convertTemp(day.maxTemp)}° / {convertTemp(day.minTemp)}°
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-center text-blue-100 opacity-80 hover:opacity-100 transition-opacity duration-300">
        {"Last updated: "}
        {lastUpdated}
      </div>
    </div>
  )
}

