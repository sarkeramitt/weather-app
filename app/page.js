"use client"

import { useState, useEffect, useCallback } from "react"
import WeatherCard from "../components/WeatherCard"
import SearchBar from "../components/SearchBar"

export default function Home() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWeatherData = useCallback(async (searchLocation) => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching weather for location:", searchLocation) // Debug log

      const response = await fetch(`/api/weather?location=${encodeURIComponent(searchLocation)}`)
      console.log("Response status:", response.status) // Debug log

      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const data = await response.json()
      console.log("Received weather data:", data) // Debug log

      if (data.error) {
        throw new Error(data.error)
      }

      setWeatherData(data)
    } catch (err) {
      console.error("Error fetching weather data:", err)
      setError(err.message || "Unable to fetch weather data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherData(`${latitude},${longitude}`)
        },
        (error) => {
          console.error("Geolocation error:", error)
          fetchWeatherData("London") // Fallback to a default city
        },
      )
    } else {
      fetchWeatherData("London") // Fallback if geolocation is not supported
    }
  }, [fetchWeatherData])

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      fetchWeatherData(searchTerm)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Add debug info */}
      <div className="mb-4 text-sm text-gray-600">
        Status: {loading ? "Loading..." : error ? "Error" : weatherData ? "Data Ready" : "No Data"}
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>
      ) : weatherData ? (
        <WeatherCard weatherData={weatherData} />
      ) : null}
    </main>
  )
}

