export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
  
    if (!search) {
      return new Response(JSON.stringify({ error: "Search parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }
  
    try {
      const apiKey = process.env.WEATHERAPI_KEY
      if (!apiKey) {
        throw new Error("Weather API key is not configured")
      }
  
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(search)}`,
      )
  
      if (!response.ok) {
        throw new Error("Failed to fetch location suggestions")
      }
  
      const data = await response.json()
  
      // Transform the API response to include only necessary data
      const suggestions = data.map((item) => ({
        name: item.name,
        region: item.region,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
      }))
  
      return new Response(JSON.stringify(suggestions), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
      return new Response(JSON.stringify({ error: "Failed to fetch location suggestions" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  }
  
  