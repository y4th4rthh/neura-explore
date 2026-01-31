
"use client"
import SearchBar from "@/components/search-bar"
import { useRouter } from "next/navigation";
import NoInternet from "@/components/no-internet"
import WeatherTimeWidget from "@/components/weather-time-widget"
import SettingsModal, { PersonalizationSettings } from "@/components/settings-modal"
import UpdaterModal from "@/components/updater"
import { useState, useEffect } from "react"
import { Zap, Atom, Settings, RefreshCw } from 'lucide-react'

const DEFAULT_WALLPAPER = 'https://raw.githubusercontent.com/y4th4rthh/neura-explore/refs/heads/main/app/macOS-Catalina-Light-mode.jpg'

export default function Home() {
  const router = useRouter();
  const [showGlobe, setShowGlobe] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [wallpaper, setWallpaper] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('neura-wallpaper') || DEFAULT_WALLPAPER
  }
  return DEFAULT_WALLPAPER
})
  const [showUpdater, setShowUpdater] = useState(false)
  const [greeting, setGreeting] = useState("")
  const [personalization, setPersonalization] = useState<PersonalizationSettings>({
    userName: '',
    showWeatherWidget: true,
    showUpdaterButton: true,
    showCustomMessage: true,
  })

  // ====== DEVELOPER CONFIGURATION ======
  // Customize your message here:
  const CUSTOM_MESSAGE = {
    type: 'text', // 'text' or 'image'
    content: '🚀 Try the new v11.1 prerelease update!', // Text content or image URL
    link: 'https://github.com/y4th4rthh/neura.ai-releases/releases/download/v11.1/neura.explore.exe', // Optional: URL to navigate when clicked (leave empty for no link)
  }
  // =====================================

  useEffect(() => {
    // Load wallpaper from localStorage on mount
    const savedWallpaper = localStorage.getItem('neura-wallpaper')
    if (savedWallpaper) {
      setWallpaper(savedWallpaper)
    }

    const savedPersonalization = localStorage.getItem('neura-personalization')
    if (savedPersonalization) {
      setPersonalization(JSON.parse(savedPersonalization))
    }
  }, [])

   useEffect(() => {
    const hour = new Date().getHours()
    const baseName = personalization.userName ? `, ${personalization.userName}` : ''

    if (hour >= 5 && hour < 12) {
      setGreeting(`Good Morning${baseName}`)
    } else if (hour >= 12 && hour < 17) {
      setGreeting(`Good Afternoon${baseName}`)
    } else if (hour >= 17 && hour < 21) {
      setGreeting(`Good Evening${baseName}`)
    } else {
      setGreeting(`Good Evening${baseName}`)
    }
  }, [personalization.userName])

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
    localStorage.removeItem('neura-wallpaper')
    localStorage.setItem('neura-wallpaper', newWallpaper)
    setShowSettings(false)
  }

   const handlePersonalizationChange = (newSettings: PersonalizationSettings) => {
    setPersonalization(newSettings)
    localStorage.setItem('neura-personalization', JSON.stringify(newSettings))
  }

  const handleCustomMessageClick = () => {
    if (CUSTOM_MESSAGE.link) {
      router.push(CUSTOM_MESSAGE.link)
    }
  }

  // Show loading state while checking connection
  if (!hasChecked) {
    return (
      <div
        className="font-sans min-h-screen bg-[#101010]"
        style={{
          background: wallpaper
            ? `url(${wallpaper}) center/cover no-repeat fixed`
            : `
         
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
      className="font-sans min-h-screen bg-[#101010]"
      style={{
        background: wallpaper
          ? `url(${wallpaper}) center/cover no-repeat fixed`
          : `
          
        `,
      }}
    >
      <header className="fixed top-0 right-0 p-6 z-30 flex items-start gap-4">
        {/* Custom Message */}
        {personalization.showCustomMessage && (
          CUSTOM_MESSAGE.type === 'text' ? (
            <div
              onClick={handleCustomMessageClick}
              className={`text-white/80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium ${
                CUSTOM_MESSAGE.link ? 'cursor-pointer hover:bg-white/20 transition-colors' : ''
              }`}
              title={CUSTOM_MESSAGE.link ? 'Click to learn more' : ''}
            >
              {CUSTOM_MESSAGE.content}
            </div>
          ) : (
            <div
              onClick={handleCustomMessageClick}
              className={`${CUSTOM_MESSAGE.link ? 'cursor-pointer' : ''}`}
              title={CUSTOM_MESSAGE.link ? 'Click to learn more' : ''}
            >
              <img
                src={CUSTOM_MESSAGE.content}
                alt="Custom message"
                className="h-10 w-auto rounded-lg hover:opacity-80 transition-opacity"
              />
            </div>
          )
        )}

        {personalization.showUpdaterButton && (
          <button
            onClick={() => setShowUpdater(true)}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            title="Check for updates"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        )}
        
        <button
          onClick={() => setShowSettings(true)}
          className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

        {personalization.showWeatherWidget && <WeatherTimeWidget />}
      </header>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onWallpaperChange={handleWallpaperChange}
        currentWallpaper={wallpaper}
        onPersonalizationChange={handlePersonalizationChange}
        currentPersonalization={personalization}
      />

      <UpdaterModal
        open={showUpdater}
        onOpenChange={setShowUpdater}
      />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          {!wallpaper && (
            <div className="inline-flex animate-bounce items-center justify-center mb-6">
              <div className="w-18 h-18 bg-gradient-to-br from-[#ff6b00] to-[#ff8c42] rounded-[16px] flex items-center justify-center shadow-lg [@media(max-height:600px)]:hidden">
                {showGlobe ? (
                  <Atom className="w-10 h-10 transition-opacity duration-300" />
                ) : (
                  <Zap className="w-10 h-10 transition-opacity duration-300" />
                )}
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
            {greeting}
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
