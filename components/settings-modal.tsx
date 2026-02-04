

// 'use client'

// import { useState, useEffect } from 'react'
// import { X } from 'lucide-react'

// interface SettingsModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onWallpaperChange: (wallpaper: string) => void
//   currentWallpaper: string
//   onPersonalizationChange: (settings: PersonalizationSettings) => void
//   currentPersonalization: PersonalizationSettings
// }

// export interface PersonalizationSettings {
//   userName: string
//   showWeatherWidget: boolean
//   showUpdaterButton: boolean
//   showCustomMessage: boolean
// }

// export default function SettingsModal({
//   isOpen,
//   onClose,
//   onWallpaperChange,
//   currentWallpaper,
//   onPersonalizationChange,
//   currentPersonalization,
// }: SettingsModalProps) {
//   const [wallpaperUrl, setWallpaperUrl] = useState(currentWallpaper)
//   const [uploadedImage, setUploadedImage] = useState < string | null > (null)
//   const [userName, setUserName] = useState(currentPersonalization.userName)
//   const [showWeatherWidget, setShowWeatherWidget] = useState(currentPersonalization.showWeatherWidget)
//   const [showUpdaterButton, setShowUpdaterButton] = useState(currentPersonalization.showUpdaterButton)
//   const [showCustomMessage, setShowCustomMessage] = useState(currentPersonalization.showCustomMessage)

//   useEffect(() => {
//     setWallpaperUrl(currentWallpaper)
//   }, [currentWallpaper])

//   useEffect(() => {
//     setUserName(currentPersonalization.userName)
//     setShowWeatherWidget(currentPersonalization.showWeatherWidget)
//     setShowUpdaterButton(currentPersonalization.showUpdaterButton)
//     setShowCustomMessage(currentPersonalization.showCustomMessage ?? true)
//   }, [currentPersonalization])

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (event) => {
//         const result = event.target?.result as string
//         setUploadedImage(result)
//         setWallpaperUrl(result)
//         onWallpaperChange(result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleUrlSubmit = () => {
//     if (wallpaperUrl.trim()) {
//       onWallpaperChange(wallpaperUrl)
//     }
//   }

//   const resetWallpaper = () => {
//     setWallpaperUrl('')
//     setUploadedImage(null)
//     onWallpaperChange('')
//   }

//   const handleSavePersonalization = () => {
//     onPersonalizationChange({
//       userName,
//       showWeatherWidget,
//       showUpdaterButton,
//       showCustomMessage,
//     })
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div
//         className="fixed inset-0 bg-black/50 backdrop-blur-sm"
//       />
//       <div
//         className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold text-white">Settings</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div
//           style={{
//             overflowY: "scroll",
//             scrollbarWidth: "none",
//             msOverflowStyle: "none"
//           }}
//           className='max-h-[400px] overflow-y-scroll [&::-webkit-scrollbar]:hidden'
//         >

//           <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
//             <h3 className="text-lg font-medium text-white">Personalization</h3>

//             {/* Name Input */}
//             <div className="space-y-2">
//               <label className="block">
//                 <span className="text-sm text-gray-300 mb-2 block">What should Neura call you?</span>
//                 <input
//                   type="text"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   placeholder="Enter your name"
//                   className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
//                 />
//               </label>
//             </div>

//             {/* Custom Message Toggle */}
//             <div className="flex items-center justify-between py-2">
//               <span className="text-sm text-gray-300">Show Custom Message</span>
//               <button
//                 onClick={() => setShowCustomMessage(!showCustomMessage)}
//                 className={`relative w-12 h-6 rounded-full transition-colors ${showCustomMessage ? 'bg-orange-500' : 'bg-gray-600'
//                   }`}
//               >
//                 <div
//                   className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showCustomMessage ? 'translate-x-6' : 'translate-x-0'
//                     }`}
//                 />
//               </button>
//             </div>

//             {/* Weather Widget Toggle */}
//             <div className="flex items-center justify-between py-2">
//               <span className="text-sm text-gray-300">Show Weather Widget</span>
//               <button
//                 onClick={() => setShowWeatherWidget(!showWeatherWidget)}
//                 className={`relative w-12 h-6 rounded-full transition-colors ${showWeatherWidget ? 'bg-orange-500' : 'bg-gray-600'
//                   }`}
//               >
//                 <div
//                   className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showWeatherWidget ? 'translate-x-6' : 'translate-x-0'
//                     }`}
//                 />
//               </button>
//             </div>

//             {/* Updater Button Toggle */}
//             <div className="flex items-center justify-between py-2">
//               <span className="text-sm text-gray-300">Show Updater Button</span>
//               <button
//                 onClick={() => setShowUpdaterButton(!showUpdaterButton)}
//                 className={`relative w-12 h-6 rounded-full transition-colors ${showUpdaterButton ? 'bg-orange-500' : 'bg-gray-600'
//                   }`}
//               >
//                 <div
//                   className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showUpdaterButton ? 'translate-x-6' : 'translate-x-0'
//                     }`}
//                 />
//               </button>
//             </div>

//             {/* Save Button */}
//             <button
//               onClick={handleSavePersonalization}
//               className="w-full py-2 px-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-lg font-medium transition-colors text-sm"
//             >
//               Save Personalization
//             </button>
//           </div>

//           {/* Wallpaper Section */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-white">Customize Wallpaper</h3>

//             {/* Upload Image */}
//             <div className="space-y-3">
//               <label className="block">
//                 <span className="text-sm text-gray-300 mb-2 block">Upload Image</span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileUpload}
//                   className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:border file:border-orange-500/20 file:text-orange-500/70 file:bg-orange-500/5 cursor-pointer"
//                 />
//               </label>
//             </div>

//             {/* URL Input */}
//             <div className="space-y-2">
//               <label className="block">
//                 <span className="text-sm text-gray-300 mb-2 block">Or Paste Image URL</span>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={wallpaperUrl}
//                     onChange={(e) => setWallpaperUrl(e.target.value)}
//                     placeholder="https://example.com/image.jpg"
//                     className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
//                   />
//                   <button
//                     onClick={handleUrlSubmit}
//                     className="px-4 py-2 border border-orange-500/20 bg-orange-500/5 text-orange-500/70 rounded-lg font-medium transition-colors text-sm"
//                   >
//                     Apply
//                   </button>
//                 </div>
//               </label>
//             </div>

//             {/* Preview */}
//             {wallpaperUrl && !wallpaperUrl.startsWith('http') && (
//               <div className="mt-4">
//                 <p className="text-sm text-gray-300 mb-2">Preview</p>
//                 <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-700">
//                   <img
//                     src={wallpaperUrl || "/placeholder.svg"}
//                     alt="Wallpaper preview"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Reset Button */}
//             <button
//               onClick={resetWallpaper}
//               className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors text-sm"
//             >
//               Reset to Default
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { X, Wifi, Activity } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onWallpaperChange: (wallpaper: string) => void
  currentWallpaper: string
  onPersonalizationChange: (settings: PersonalizationSettings) => void
  currentPersonalization: PersonalizationSettings
}

export interface PersonalizationSettings {
  userName: string
  showWeatherWidget: boolean
  showUpdaterButton: boolean
  showCustomMessage: boolean
}

export interface NetworkStats {
  download: number
  upload: number
  latency: number
  packetLoss: number
  speedLevel: 'fast' | 'moderate' | 'slow'
  shouldEnableDataSaver: boolean
}

export default function SettingsModal({
  isOpen,
  onClose,
  onWallpaperChange,
  currentWallpaper,
  onPersonalizationChange,
  currentPersonalization,
}: SettingsModalProps) {
  const [wallpaperUrl, setWallpaperUrl] = useState(currentWallpaper)
  const [uploadedImage, setUploadedImage] = useState < string | null > (null)
  const [userName, setUserName] = useState(currentPersonalization.userName)
  const [showWeatherWidget, setShowWeatherWidget] = useState(currentPersonalization.showWeatherWidget)
  const [showUpdaterButton, setShowUpdaterButton] = useState(currentPersonalization.showUpdaterButton)
  const [showCustomMessage, setShowCustomMessage] = useState(currentPersonalization.showCustomMessage)
  
  // Network & Diagnostics state
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null)
  const [isTestingNetwork, setIsTestingNetwork] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)

  useEffect(() => {
    setWallpaperUrl(currentWallpaper)
  }, [currentWallpaper])

  useEffect(() => {
    setUserName(currentPersonalization.userName)
    setShowWeatherWidget(currentPersonalization.showWeatherWidget)
    setShowUpdaterButton(currentPersonalization.showUpdaterButton)
    setShowCustomMessage(currentPersonalization.showCustomMessage ?? true)
  }, [currentPersonalization])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setUploadedImage(result)
        setWallpaperUrl(result)
        onWallpaperChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (wallpaperUrl.trim()) {
      onWallpaperChange(wallpaperUrl)
    }
  }

  const resetWallpaper = () => {
    setWallpaperUrl('')
    setUploadedImage(null)
    onWallpaperChange('')
  }

  const handleSavePersonalization = () => {
    onPersonalizationChange({
      userName,
      showWeatherWidget,
      showUpdaterButton,
      showCustomMessage,
    })
  }

  // Network speed test function
  const runNetworkTest = async () => {
    setIsTestingNetwork(true)
    setNetworkError(null)
    
    try {
      const testDownload = await testDownloadSpeed()
      const testUpload = await testUploadSpeed()
      const testLatency = await testLatency()
      const testPacketLoss = await estimatePacketLoss()

      // Determine speed level based on download speed
      let speedLevel: 'fast' | 'moderate' | 'slow' = 'moderate'
      if (testDownload > 25) speedLevel = 'fast'
      else if (testDownload < 5) speedLevel = 'slow'

      // Determine if data saver should be enabled
      const shouldEnableDataSaver = testDownload < 10 || testPacketLoss > 5

      const stats: NetworkStats = {
        download: Math.round(testDownload * 100) / 100,
        upload: Math.round(testUpload * 100) / 100,
        latency: Math.round(testLatency),
        packetLoss: Math.round(testPacketLoss * 100) / 100,
        speedLevel,
        shouldEnableDataSaver,
      }

      setNetworkStats(stats)
    } catch (error) {
      setNetworkError('Failed to test network. Please try again.')
      console.error('Network test error:', error)
    } finally {
      setIsTestingNetwork(false)
    }
  }

  // Test download speed
  const testDownloadSpeed = async (): Promise<number> => {
    const testFile = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
    const startTime = performance.now()
    
    try {
      const response = await fetch(testFile, { mode: 'no-cors' })
      const blob = await response.blob()
      const endTime = performance.now()
      
      const duration = (endTime - startTime) / 1000 // convert to seconds
      const fileSizeInBytes = blob.size
      const speedMbps = (fileSizeInBytes * 8) / (duration * 1_000_000)
      
      return speedMbps
    } catch {
      return 0
    }
  }

  // Test upload speed (simulated)
  const testUploadSpeed = async (): Promise<number> => {
    const startTime = performance.now()
    const testData = new Blob([new ArrayBuffer(1_000_000)]) // 1MB
    
    try {
      // Simulating upload with a simple fetch post
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: testData,
        mode: 'no-cors',
      }).catch(() => {
        // Expected to fail due to CORS, but timing still works
      })
      
      const endTime = performance.now()
      const duration = (endTime - startTime) / 1000
      const speedMbps = (testData.size * 8) / (duration * 1_000_000)
      
      return Math.max(0.5, speedMbps) // Minimum 0.5 Mbps
    } catch {
      return 5 // Default reasonable upload speed
    }
  }

  // Test latency
  const testLatency = async (): Promise<number> => {
    let totalLatency = 0
    const pings = 3

    for (let i = 0; i < pings; i++) {
      const startTime = performance.now()
      
      try {
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
        })
        const endTime = performance.now()
        totalLatency += endTime - startTime
      } catch {
        totalLatency += 100 // Default latency on error
      }
    }

    return totalLatency / pings
  }

  // Estimate packet loss
  const estimatePacketLoss = async (): Promise<number> => {
    let successfulRequests = 0
    const totalRequests = 5

    for (let i = 0; i < totalRequests; i++) {
      try {
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
        })
        successfulRequests++
      } catch {
        // Request failed
      }
    }

    return ((totalRequests - successfulRequests) / totalRequests) * 100
  }

  // Get speed recommendation
  const getSpeedRecommendation = () => {
    if (!networkStats) return null
    
    const { speedLevel, shouldEnableDataSaver, download, latency } = networkStats
    let recommendation = ''
    let color = ''

    if (speedLevel === 'fast') {
      recommendation = 'Your connection is excellent!'
      color = 'text-green-400'
    } else if (speedLevel === 'moderate') {
      recommendation = 'Your connection is adequate for most tasks.'
      color = 'text-yellow-400'
    } else {
      recommendation = 'Your connection is slow. Consider enabling Data Saver.'
      color = 'text-red-400'
    }

    return { recommendation, color, shouldEnableDataSaver }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div
          style={{
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
          className='max-h-[400px] overflow-y-scroll [&::-webkit-scrollbar]:hidden'
        >

          <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
            <h3 className="text-lg font-medium text-white">Personalization</h3>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm text-gray-300 mb-2 block">What should Neura call you?</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
                />
              </label>
            </div>

            {/* Custom Message Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">Show Custom Message</span>
              <button
                onClick={() => setShowCustomMessage(!showCustomMessage)}
                className={`relative w-12 h-6 rounded-full transition-colors ${showCustomMessage ? 'bg-orange-500' : 'bg-gray-600'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showCustomMessage ? 'translate-x-6' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Weather Widget Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">Show Weather Widget</span>
              <button
                onClick={() => setShowWeatherWidget(!showWeatherWidget)}
                className={`relative w-12 h-6 rounded-full transition-colors ${showWeatherWidget ? 'bg-orange-500' : 'bg-gray-600'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showWeatherWidget ? 'translate-x-6' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Updater Button Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">Show Updater Button</span>
              <button
                onClick={() => setShowUpdaterButton(!showUpdaterButton)}
                className={`relative w-12 h-6 rounded-full transition-colors ${showUpdaterButton ? 'bg-orange-500' : 'bg-gray-600'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showUpdaterButton ? 'translate-x-6' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSavePersonalization}
              className="w-full py-2 px-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-lg font-medium transition-colors text-sm"
            >
              Save Personalization
            </button>
          </div>

          {/* Network & Diagnostics Section */}
          <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-medium text-white">Network & Diagnostics</h3>
            </div>

            {/* Test Button */}
            <button
              onClick={runNetworkTest}
              disabled={isTestingNetwork}
              className="w-full py-2 px-4 bg-orange-500/10 hover:bg-orange-500/20 disabled:opacity-50 text-orange-500 border border-orange-500/20 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              {isTestingNetwork ? 'Testing...' : 'Check Network Speed'}
            </button>

            {/* Error Message */}
            {networkError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{networkError}</p>
              </div>
            )}

            {/* Network Stats */}
            {networkStats && (
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Download Speed</span>
                    <span className="text-sm font-semibold text-white">{networkStats.download} Mbps</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Upload Speed</span>
                    <span className="text-sm font-semibold text-white">{networkStats.upload} Mbps</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Latency</span>
                    <span className="text-sm font-semibold text-white">{networkStats.latency} ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Packet Loss</span>
                    <span className="text-sm font-semibold text-white">{networkStats.packetLoss}%</span>
                  </div>
                </div>

                {/* Speed Recommendation */}
                {getSpeedRecommendation() && (
                  <div className="space-y-2">
                    <p className={`text-sm font-medium ${getSpeedRecommendation()!.color}`}>
                      {getSpeedRecommendation()!.recommendation}
                    </p>
                    {getSpeedRecommendation()!.shouldEnableDataSaver && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-xs text-yellow-400">
                          💡 Tip: Consider enabling Data Saver mode to optimize performance on your connection.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wallpaper Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Customize Wallpaper</h3>

            {/* Upload Image */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-gray-300 mb-2 block">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:border file:border-orange-500/20 file:text-orange-500/70 file:bg-orange-500/5 cursor-pointer"
                />
              </label>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm text-gray-300 mb-2 block">Or Paste Image URL</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wallpaperUrl}
                    onChange={(e) => setWallpaperUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleUrlSubmit}
                    className="px-4 py-2 border border-orange-500/20 bg-orange-500/5 text-orange-500/70 rounded-lg font-medium transition-colors text-sm"
                  >
                    Apply
                  </button>
                </div>
              </label>
            </div>

            {/* Preview */}
            {wallpaperUrl && !wallpaperUrl.startsWith('http') && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Preview</p>
                <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-700">
                  <img
                    src={wallpaperUrl || "/placeholder.svg"}
                    alt="Wallpaper preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={resetWallpaper}
              className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors text-sm"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
