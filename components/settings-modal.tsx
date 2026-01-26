

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
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null)
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
//         style={{
//           overflowY: "scroll",
//           scrollbarWidth: "none",
//           msOverflowStyle: "none"
//         }}
//         className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 max-h-[500px] overflow-y-scroll [&::-webkit-scrollbar]:hidden max-w-md w-full shadow-2xl"
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

//         <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
//           <h3 className="text-lg font-medium text-white">Personalization</h3>

//           {/* Name Input */}
//           <div className="space-y-2">
//             <label className="block">
//               <span className="text-sm text-gray-300 mb-2 block">What should Neura call you?</span>
//               <input
//                 type="text"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 placeholder="Enter your name"
//                 className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
//               />
//             </label>
//           </div>

//           {/* Custom Message Toggle */}
//           <div className="flex items-center justify-between py-2">
//             <span className="text-sm text-gray-300">Show Custom Message</span>
//             <button
//               onClick={() => setShowCustomMessage(!showCustomMessage)}
//               className={`relative w-12 h-6 rounded-full transition-colors ${
//                 showCustomMessage ? 'bg-orange-500' : 'bg-gray-600'
//               }`}
//             >
//               <div
//                 className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
//                   showCustomMessage ? 'translate-x-6' : 'translate-x-0'
//                 }`}
//               />
//             </button>
//           </div>

//           {/* Weather Widget Toggle */}
//           <div className="flex items-center justify-between py-2">
//             <span className="text-sm text-gray-300">Show Weather Widget</span>
//             <button
//               onClick={() => setShowWeatherWidget(!showWeatherWidget)}
//               className={`relative w-12 h-6 rounded-full transition-colors ${
//                 showWeatherWidget ? 'bg-orange-500' : 'bg-gray-600'
//               }`}
//             >
//               <div
//                 className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
//                   showWeatherWidget ? 'translate-x-6' : 'translate-x-0'
//                 }`}
//               />
//             </button>
//           </div>

//           {/* Updater Button Toggle */}
//           <div className="flex items-center justify-between py-2">
//             <span className="text-sm text-gray-300">Show Updater Button</span>
//             <button
//               onClick={() => setShowUpdaterButton(!showUpdaterButton)}
//               className={`relative w-12 h-6 rounded-full transition-colors ${
//                 showUpdaterButton ? 'bg-orange-500' : 'bg-gray-600'
//               }`}
//             >
//               <div
//                 className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
//                   showUpdaterButton ? 'translate-x-6' : 'translate-x-0'
//                 }`}
//               />
//             </button>
//           </div>

//           {/* Save Button */}
//           <button
//             onClick={handleSavePersonalization}
//             className="w-full py-2 px-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-lg font-medium transition-colors text-sm"
//           >
//             Save Personalization
//           </button>
//         </div>

//         {/* Wallpaper Section */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-medium text-white">Customize Wallpaper</h3>

//           {/* Upload Image */}
//           <div className="space-y-3">
//             <label className="block">
//               <span className="text-sm text-gray-300 mb-2 block">Upload Image</span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileUpload}
//                 className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:border file:border-orange-500/20 file:text-orange-500/70 file:bg-orange-500/5 cursor-pointer"
//               />
//             </label>
//           </div>

//           {/* URL Input */}
//           <div className="space-y-2">
//             <label className="block">
//               <span className="text-sm text-gray-300 mb-2 block">Or Paste Image URL</span>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={wallpaperUrl}
//                   onChange={(e) => setWallpaperUrl(e.target.value)}
//                   placeholder="https://example.com/image.jpg"
//                   className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm"
//                 />
//                 <button
//                   onClick={handleUrlSubmit}
//                   className="px-4 py-2 border border-orange-500/20 bg-orange-500/5 text-orange-500/70 rounded-lg font-medium transition-colors text-sm"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </label>
//           </div>

//           {/* Preview */}
//           {wallpaperUrl && !wallpaperUrl.startsWith('http') && (
//             <div className="mt-4">
//               <p className="text-sm text-gray-300 mb-2">Preview</p>
//               <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-700">
//                 <img
//                   src={wallpaperUrl || "/placeholder.svg"}
//                   alt="Wallpaper preview"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Reset Button */}
//           <button
//             onClick={resetWallpaper}
//             className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors text-sm"
//           >
//             Reset to Default
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from 'react'
import { X, Upload, RotateCw, ImageIcon } from 'lucide-react'

export interface PersonalizationSettings {
  userName: string
  showWeatherWidget: boolean
  showUpdaterButton: boolean
  showCustomMessage: boolean
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onWallpaperChange: (wallpaper: string) => void
  currentWallpaper: string
  onPersonalizationChange: (settings: PersonalizationSettings) => void
  currentPersonalization: PersonalizationSettings
}

export default function SettingsModal({
  isOpen,
  onClose,
  onWallpaperChange,
  currentWallpaper,
  onPersonalizationChange,
  currentPersonalization,
}: SettingsModalProps) {
  const [wallpaperUrl, setWallpaperUrl] = useState('')
  const [personalization, setPersonalization] = useState(currentPersonalization)
  const [wallpaperMode, setWallpaperMode] = useState<'random' | 'custom' | 'default'>('random')

  useEffect(() => {
    setPersonalization(currentPersonalization)
  }, [currentPersonalization])

  useEffect(() => {
    const mode = localStorage.getItem('neura-wallpaper-mode') || 'random'
    setWallpaperMode(mode as 'random' | 'custom' | 'default')
  }, [isOpen])

  if (!isOpen) return null

  const handleWallpaperModeChange = (mode: 'random' | 'custom' | 'default') => {
    setWallpaperMode(mode)
    localStorage.setItem('neura-wallpaper-mode', mode)
    
    if (mode === 'default') {
      onWallpaperChange('')
      localStorage.removeItem('neura-wallpaper')
    } else if (mode === 'random') {
      // Trigger a new random wallpaper
      window.location.reload()
    }
  }

  const handleCustomWallpaper = () => {
    if (wallpaperUrl.trim()) {
      handleWallpaperModeChange('custom')
      onWallpaperChange(wallpaperUrl)
      setWallpaperUrl('')
    }
  }

  const handlePersonalizationUpdate = (key: keyof PersonalizationSettings, value: any) => {
    const updated = { ...personalization, [key]: value }
    setPersonalization(updated)
    onPersonalizationChange(updated)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Personalization Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Personalization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Your Name</label>
                <input
                  type="text"
                  value={personalization.userName}
                  onChange={(e) => handlePersonalizationUpdate('userName', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Show Weather Widget</span>
                <button
                  onClick={() => handlePersonalizationUpdate('showWeatherWidget', !personalization.showWeatherWidget)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    personalization.showWeatherWidget ? 'bg-[#ff6b00]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      personalization.showWeatherWidget ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Show Update Button</span>
                <button
                  onClick={() => handlePersonalizationUpdate('showUpdaterButton', !personalization.showUpdaterButton)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    personalization.showUpdaterButton ? 'bg-[#ff6b00]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      personalization.showUpdaterButton ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Show Custom Message</span>
                <button
                  onClick={() => handlePersonalizationUpdate('showCustomMessage', !personalization.showCustomMessage)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    personalization.showCustomMessage ? 'bg-[#ff6b00]' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      personalization.showCustomMessage ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Wallpaper Section */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Wallpaper Settings</h3>
            
            {/* Wallpaper Mode Selection */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleWallpaperModeChange('random')}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                  wallpaperMode === 'random'
                    ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <RotateCw className="w-5 h-5" />
                <div className="text-left flex-1">
                  <div className="font-medium">Random Wallpapers (Default)</div>
                  <div className="text-sm opacity-70">Auto-shuffle every minute</div>
                </div>
              </button>

              <button
                onClick={() => handleWallpaperModeChange('custom')}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                  wallpaperMode === 'custom'
                    ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <div className="text-left flex-1">
                  <div className="font-medium">Custom Wallpaper</div>
                  <div className="text-sm opacity-70">Use your own image URL</div>
                </div>
              </button>

              <button
                onClick={() => handleWallpaperModeChange('default')}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                  wallpaperMode === 'default'
                    ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
                <div className="text-left flex-1">
                  <div className="font-medium">No Wallpaper</div>
                  <div className="text-sm opacity-70">Use default dark background</div>
                </div>
              </button>
            </div>

            {/* Custom Wallpaper Input */}
            {wallpaperMode === 'custom' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={wallpaperUrl}
                      onChange={(e) => setWallpaperUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                    />
                    <button
                      onClick={handleCustomWallpaper}
                      className="px-6 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8c42] transition-colors font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    Enter a direct URL to an image (JPG, PNG, etc.)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
