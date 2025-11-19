"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react'

interface WeatherData {
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  icon: "sun" | "cloud" | "rain"
}

export default function WeatherTimeWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
 

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user's location from IP
        const ipResponse = await fetch("https://ipapi.co/json/")
        const ipData = await ipResponse.json()
        const { latitude, longitude } = ipData

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius`
        )
        const weatherData = await weatherResponse.json()
        const current = weatherData.current

        // Map weather code to icon type
        let icon: "sun" | "cloud" | "rain" = "sun"
        if (current.weather_code >= 45 && current.weather_code <= 48) {
          icon = "cloud"
        } else if (current.weather_code >= 51 && current.weather_code <= 67) {
          icon = "rain"
        } else if (current.weather_code >= 71 && current.weather_code <= 85) {
          icon = "rain"
        }

        setWeather({
          temp: Math.round(current.temperature_2m),
          condition: icon === "rain" ? "Rainy" : icon === "cloud" ? "Cloudy" : "Sunny",
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          icon,
        })
      } catch (error) {
        console.log("[v0] Weather fetch error, using defaults")
        setWeather({
          temp: 22,
          condition: "Sunny",
          humidity: 65,
          windSpeed: 12,
          icon: "sun",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const getWeatherIcon = () => {
    if (!weather) return null
    switch (weather.icon) {
      case "sun":
        return <Sun className="w-5 h-5 text-yellow-400" />
      case "cloud":
        return <Cloud className="w-5 h-5 text-gray-400" />
      case "rain":
        return <CloudRain className="w-5 h-5 text-blue-400" />
      default:
        return <Sun className="w-5 h-5 text-yellow-400" />
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Time Widget */}

      {/* Weather Widget */}
      {weather && !loading && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-lg px-4 py-3 backdrop-blur-sm hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-white/60 font-medium">Weather</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-white">{weather.temp}°</p>
                <p className="text-xs text-white/70">{weather.condition}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              {getWeatherIcon()}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/10 flex gap-3 text-xs text-white/70">
            <div className="flex items-center gap-1">
              <span>💧</span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
