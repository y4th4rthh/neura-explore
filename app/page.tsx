"use client"
import SearchBar from "@/components/search-bar"
import NoInternet from "@/components/no-internet"
import WeatherTimeWidget from "@/components/weather-time-widget"
import SettingsModal from "@/components/settings-modal"
import { useState, useEffect } from "react"
import { Zap, Atom, Settings } from 'lucide-react'

export default function Home() {
  const [showGlobe, setShowGlobe] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [wallpaper, setWallpaper] = useState('')

  useEffect(() => {
    // Load wallpaper from localStorage on mount
    const savedWallpaper = localStorage.getItem('neura-wallpaper') || ''
    setWallpaper(savedWallpaper)
  }, [])

  useEffect(() => {
    // Check initial connection by making a lightweight request
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/trending", { method: "HEAD" })
        setIsOnline(response.ok)
      } catch (error) {
        setIsOnline(false)
      }
      setHasChecked(true)
    }

    checkConnection()

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowGlobe((prev) => !prev)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleWallpaperChange = (newWallpaper: string) => {
    setWallpaper(newWallpaper)
    localStorage.setItem('neura-wallpaper', newWallpaper)
    setShowSettings(false)
  }

  // Show loading state while checking connection
  if (!hasChecked) {
    return (
      <div
        className="font-sans min-h-screen bg-[#0a0a0a]"
        style={{
          background: wallpaper
            ? `url(${wallpaper}) center/cover no-repeat fixed`
            : `
          radial-gradient(ellipse at top, rgba(255, 107, 0, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(255, 107, 0, 0.05) 0%, transparent 50%),
          rgb(0, 0, 0)
        `,
        }}
      />
    )
  }

  if (!isOnline) {
    return <NoInternet />
  }

  return (
    <div
      className="font-sans min-h-screen bg-[#FFFFFF1A]"
      style={{
        background: wallpaper
          ? `url(${wallpaper}) center/cover no-repeat fixed`
          : `
          radial-gradient(ellipse at top, rgba(255, 107, 0, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(255, 107, 0, 0.05) 0%, transparent 50%),
          rgb(0, 0, 0)
        `,
      }}
    >
      <header className="fixed top-0 right-0 p-6 z-30 flex items-start gap-4">
        <button
          onClick={() => setShowSettings(true)}
          className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
          {wallpaper && (
        <WeatherTimeWidget />
      )}
      </header>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onWallpaperChange={handleWallpaperChange}
        currentWallpaper={wallpaper}
      />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo */}
        <div className="mb-16 text-center">
          {!wallpaper && (
            <div className="inline-flex animate-bounce items-center justify-center mb-6">
              <div className="w-18 h-18 bg-gradient-to-br from-[#ff6b00] to-[#ff8c42] rounded-2xl flex items-center justify-center shadow-lg">
                {showGlobe ? (
                  <Atom className="w-8 h-8 transition-opacity duration-300" />
                ) : (
                  <Zap className="w-8 h-8 transition-opacity duration-300" />
                )}
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
            Neura Explore
          </h1>
        </div>

        {/* Greeting */}
        <h2 className="text-xl md:text-2xl font-light text-white/70 mb-16 text-center max-w-2xl">
          What's your agenda today?
        </h2>

        {/* Search Bar */}
        <SearchBar />
      </main>
    </div>
  )
}
