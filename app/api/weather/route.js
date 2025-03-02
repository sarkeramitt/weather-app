export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
  
    if (!location) {
      return new Response(JSON.stringify({ error: "Location parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
  
    try {
      const apiKey = process.env.WEATHERAPI_KEY // Changed to match the environment variable name
  
      if (!apiKey) {
        throw new Error("Weather API key is not configured")
      }
  
      console.log("Fetching weather data for:", location) // Debug log
  
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=5&aqi=no`,
      )
  
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`)
      }
  
      const weatherData = await response.json()
      console.log("Raw API response:", weatherData) // Debug log
  
      // Transform WeatherAPI.com data to match our app's structure
      const transformedData = {
        location: {
          name: weatherData.location.name,
          country: weatherData.location.country,
        },
        current: {
          temperature: weatherData.current.temp_c,
          feelsLike: weatherData.current.feelslike_c,
          condition: weatherData.current.condition.text,
          humidity: weatherData.current.humidity,
          windSpeed: Math.round(weatherData.current.wind_mph),
        },
        hourlyForecast: weatherData.forecast.forecastday[0].hour
          .filter((hour) => {
            const hourTime = new Date(hour.time).getHours()
            const currentHour = new Date().getHours()
            return hourTime >= currentHour
          })
          .slice(0, 5)
          .map((hour) => ({
            time: new Date(hour.time).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            }),
            temperature: hour.temp_c,
            condition: hour.condition.text,
          })),
        dailyForecast: weatherData.forecast.forecastday.map((day) => ({
          date: day.date,
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          condition: day.day.condition.text,
        })),
        lastUpdated: new Date(weatherData.current.last_updated).toLocaleString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
  
      console.log("Transformed data:", transformedData) // Debug log
  
      return new Response(JSON.stringify(transformedData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      console.error("Error fetching weather data:", error)
      return new Response(
        JSON.stringify({
          error: "Failed to fetch weather data",
          details: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  }
  
  