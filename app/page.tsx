"use client"
import SearchBar from "@/components/search-bar"
import NoInternet from "@/components/no-internet"
import { useState, useEffect } from "react"
import { Zap, Globe } from 'lucide-react'

export default function Home() {
  const [showGlobe, setShowGlobe] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

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

  // Show loading state while checking connection
  if (!hasChecked) {
    return (
      <div
        className="font-sans min-h-screen bg-[#FFFFFF1A]"
        style={{
          background: `
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
        background: `
        radial-gradient(ellipse at top, rgba(255, 107, 0, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(255, 107, 0, 0.05) 0%, transparent 50%),
        rgb(0, 0, 0)
      `,
      }}
    >
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo */}
        <div className="mb-16 text-center">
          <div className="inline-flex animate-bounce items-center justify-center mb-6">
            <div className="w-18 h-18 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              {showGlobe ? (
                <Globe className="w-8 h-8 transition-opacity duration-300" />
              ) : (
                <Zap className="w-8 h-8 transition-opacity duration-300" />
              )}
            </div>
          </div>
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
