
// 'use client'

// import { useState, useEffect } from 'react'
// import { X, Wifi, Activity } from 'lucide-react'

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

// export interface NetworkStats {
//   download: number
//   upload: number
//   latency: number
//   packetLoss: number
//   speedLevel: 'fast' | 'moderate' | 'slow'
//   shouldEnableDataSaver: boolean
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
  
//   // Network & Diagnostics state
//   const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null)
//   const [isTestingNetwork, setIsTestingNetwork] = useState(false)
//   const [networkError, setNetworkError] = useState<string | null>(null)

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

//   // Network speed test function
//   const runNetworkTest = async (): Promise<void> => {
//     setIsTestingNetwork(true)
//     setNetworkError(null)
    
//     try {
//       const testDownloadResult = await testDownloadSpeed()
//       const testUploadResult = await testUploadSpeed()
//       const testLatencyResult = await testLatency()
//       const testPacketLossResult = await estimatePacketLoss()

//       // Determine speed level based on download speed
//       let speedLevel: 'fast' | 'moderate' | 'slow' = 'moderate'
//       if (testDownloadResult > 25) speedLevel = 'fast'
//       else if (testDownloadResult < 5) speedLevel = 'slow'

//       // Determine if data saver should be enabled
//       const shouldEnableDataSaver = testDownloadResult < 10 || testPacketLossResult > 5

//       const stats: NetworkStats = {
//         download: Math.round(testDownloadResult * 100) / 100,
//         upload: Math.round(testUploadResult * 100) / 100,
//         latency: Math.round(testLatencyResult),
//         packetLoss: Math.round(testPacketLossResult * 100) / 100,
//         speedLevel,
//         shouldEnableDataSaver,
//       }

//       setNetworkStats(stats)
//     } catch (error) {
//       setNetworkError('Failed to test network. Please try again.')
//       console.error('Network test error:', error)
//     } finally {
//       setIsTestingNetwork(false)
//     }
//   }

//   // Test download speed - using a larger test file for better accuracy
//   const testDownloadSpeed = async (): Promise<number> => {
//     const testFile = 'https://speed.cloudflare.com/__down?bytes=1000000'
//     const startTime = performance.now()
    
//     try {
//       const response = await fetch(testFile)
//       if (!response.ok) throw new Error('Failed to fetch test file')
      
//       const blob = await response.blob()
//       const endTime = performance.now()
      
//       const duration = (endTime - startTime) / 1000 // convert to seconds
//       const fileSizeInBits = blob.size * 8
//       const speedMbps = fileSizeInBits / (duration * 1_000_000)
      
//       return Math.max(0.1, speedMbps) // Minimum 0.1 Mbps
//     } catch (error) {
//       console.error('Download speed test error:', error)
//       return 5 // Default to 5 Mbps on error
//     }
//   }

//   // Test upload speed with proper error handling
//   const testUploadSpeed = async (): Promise<number> => {
//     const testDataSize = 500_000 // 500KB test
//     const testData = new Blob([new ArrayBuffer(testDataSize)])
//     const startTime = performance.now()
    
//     try {
//       const response = await fetch('https://httpbin.org/post', {
//         method: 'POST',
//         body: testData,
//       })
      
//       if (!response.ok) throw new Error('Upload test failed')
      
//       const endTime = performance.now()
//       const duration = (endTime - startTime) / 1000
//       const speedMbps = (testDataSize * 8) / (duration * 1_000_000)
      
//       return Math.max(0.1, speedMbps)
//     } catch (error) {
//       console.error('Upload speed test error:', error)
//       return 8 // Default to 8 Mbps on error
//     }
//   }

//   // Test latency with multiple pings for better accuracy
//   const testLatency = async (): Promise<number> => {
//     let totalLatency: number = 0
//     const pings = 5
//     let successfulPings = 0

//     for (let i = 0; i < pings; i++) {
//       const startTime = performance.now()
      
//       try {
//         await fetch('https://www.cloudflare.com', {
//           method: 'HEAD',
//           cache: 'no-store',
//         })
//         const endTime = performance.now()
//         totalLatency += endTime - startTime
//         successfulPings++
//       } catch (error) {
//         console.error('Latency test error:', error)
//       }
//     }

//     return successfulPings > 0 ? totalLatency / successfulPings : 50 // Default to 50ms
//   }

//   // Estimate packet loss with timeout handling
//   const estimatePacketLoss = async (): Promise<number> => {
//     let successfulRequests: number = 0
//     const totalRequests = 10

//     for (let i = 0; i < totalRequests; i++) {
//       try {
//         const controller = new AbortController()
//         const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
//         await fetch('https://www.cloudflare.com', {
//           method: 'HEAD',
//           signal: controller.signal,
//         })
//         clearTimeout(timeoutId)
//         successfulRequests++
//       } catch (error) {
//         console.error('Packet loss test error:', error)
//       }
//     }

//     return ((totalRequests - successfulRequests) / totalRequests) * 100
//   }

//   // Get speed recommendation
//   const getSpeedRecommendation = () => {
//     if (!networkStats) return null
    
//     const { speedLevel, shouldEnableDataSaver, download, latency } = networkStats
//     let recommendation = ''
//     let color = ''

//     if (speedLevel === 'fast') {
//       recommendation = 'Your connection is excellent!'
//       color = 'text-green-400'
//     } else if (speedLevel === 'moderate') {
//       recommendation = 'Your connection is adequate for most tasks.'
//       color = 'text-yellow-400'
//     } else {
//       recommendation = 'The Connection is slow. Consider switching to a better network.'
//       color = 'text-red-400'
//     }

//     return { recommendation, color, shouldEnableDataSaver }
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
//       <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl">
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
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null)
  
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

  // Check if current wallpaper is video
  const isCurrentVideoWallpaper = currentWallpaper && 
    (currentWallpaper.endsWith('.mp4') || currentWallpaper.endsWith('.webm') || currentWallpaper.endsWith('.mov'))

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isVideo = file.type.startsWith('video/')
      
      if (isVideo) {
        // For video files, check size (limit to 50MB for practical reasons)
        if (file.size > 50 * 1024 * 1024) {
          alert('Video file is too large. Please keep it under 50MB.')
          return
        }
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setUploadedImage(result)
        setWallpaperUrl(result)
        setUploadedVideoName(isVideo ? file.name : null)
        onWallpaperChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (wallpaperUrl.trim()) {
      onWallpaperChange(wallpaperUrl)
      setUploadedVideoName(null)
    }
  }

  const resetWallpaper = () => {
    setWallpaperUrl('')
    setUploadedImage(null)
    setUploadedVideoName(null)
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
  const runNetworkTest = async (): Promise<void> => {
    setIsTestingNetwork(true)
    setNetworkError(null)
    
    try {
      const testDownloadResult = await testDownloadSpeed()
      const testUploadResult = await testUploadSpeed()
      const testLatencyResult = await testLatency()
      const testPacketLossResult = await estimatePacketLoss()

      // Determine speed level based on download speed
      let speedLevel: 'fast' | 'moderate' | 'slow' = 'moderate'
      if (testDownloadResult > 25) speedLevel = 'fast'
      else if (testDownloadResult < 5) speedLevel = 'slow'

      // Determine if data saver should be enabled
      const shouldEnableDataSaver = testDownloadResult < 10 || testPacketLossResult > 5

      const stats: NetworkStats = {
        download: Math.round(testDownloadResult * 100) / 100,
        upload: Math.round(testUploadResult * 100) / 100,
        latency: Math.round(testLatencyResult),
        packetLoss: Math.round(testPacketLossResult * 100) / 100,
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

  // Test download speed - using a larger test file for better accuracy
  const testDownloadSpeed = async (): Promise<number> => {
    const testFile = 'https://speed.cloudflare.com/__down?bytes=1000000'
    const startTime = performance.now()
    
    try {
      const response = await fetch(testFile)
      if (!response.ok) throw new Error('Failed to fetch test file')
      
      const blob = await response.blob()
      const endTime = performance.now()
      
      const duration = (endTime - startTime) / 1000 // convert to seconds
      const fileSizeInBits = blob.size * 8
      const speedMbps = fileSizeInBits / (duration * 1_000_000)
      
      return Math.max(0.1, speedMbps) // Minimum 0.1 Mbps
    } catch (error) {
      console.error('Download speed test error:', error)
      return 5 // Default to 5 Mbps on error
    }
  }

  // Test upload speed with proper error handling
  const testUploadSpeed = async (): Promise<number> => {
    const testDataSize = 500_000 // 500KB test
    const testData = new Blob([new ArrayBuffer(testDataSize)])
    const startTime = performance.now()
    
    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: testData,
      })
      
      if (!response.ok) throw new Error('Upload test failed')
      
      const endTime = performance.now()
      const duration = (endTime - startTime) / 1000
      const speedMbps = (testDataSize * 8) / (duration * 1_000_000)
      
      return Math.max(0.1, speedMbps)
    } catch (error) {
      console.error('Upload speed test error:', error)
      return 8 // Default to 8 Mbps on error
    }
  }

  // Test latency with multiple pings for better accuracy
  const testLatency = async (): Promise<number> => {
    let totalLatency: number = 0
    const pings = 5
    let successfulPings = 0

    for (let i = 0; i < pings; i++) {
      const startTime = performance.now()
      
      try {
        await fetch('https://www.cloudflare.com', {
          method: 'HEAD',
          cache: 'no-store',
        })
        const endTime = performance.now()
        totalLatency += endTime - startTime
        successfulPings++
      } catch (error) {
        console.error('Latency test error:', error)
      }
    }

    return successfulPings > 0 ? totalLatency / successfulPings : 50 // Default to 50ms
  }

  // Estimate packet loss with timeout handling
  const estimatePacketLoss = async (): Promise<number> => {
    let successfulRequests: number = 0
    const totalRequests = 10

    for (let i = 0; i < totalRequests; i++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        await fetch('https://www.cloudflare.com', {
          method: 'HEAD',
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        successfulRequests++
      } catch (error) {
        console.error('Packet loss test error:', error)
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
      recommendation = 'The Connection is slow. Consider switching to a better network.'
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

            {/* Save Button */}
            <button
              onClick={handleSavePersonalization}
              className="w-full py-2 px-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-lg font-medium transition-colors text-sm"
            >
              Save Personalization
            </button>
          </div>

          {/* Wallpaper Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Customize Wallpaper</h3>
            
            {/* Info about video support */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                💡 You can upload videos (MP4, WebM, MOV) under 15 seconds. Videos will loop automatically.
              </p>
            </div>

            {/* Upload Image/Video */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-gray-300 mb-2 block">Upload Image or Video</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:border file:border-orange-500/20 file:text-orange-500/70 file:bg-orange-500/5 cursor-pointer"
                />
              </label>
              {uploadedVideoName && (
                <p className="text-xs text-green-400">✓ Video loaded: {uploadedVideoName}</p>
              )}
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm text-gray-300 mb-2 block">Or Paste Image/Video URL</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={wallpaperUrl}
                    onChange={(e) => setWallpaperUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg or video.mp4"
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

            {/* Preview for Images */}
            {wallpaperUrl && !wallpaperUrl.startsWith('http') && !isCurrentVideoWallpaper && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Image Preview</p>
                <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-700">
                  <img
                    src={wallpaperUrl || "/placeholder.svg"}
                    alt="Wallpaper preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Video Status */}
            {isCurrentVideoWallpaper && (
              <div className="mt-4">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <p className="text-xs text-purple-300">
                    ▶️ Video wallpaper active - will loop continuously
                  </p>
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
