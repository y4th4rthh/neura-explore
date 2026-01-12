'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onWallpaperChange: (wallpaper: string) => void
  currentWallpaper: string
}

export default function SettingsModal({
  isOpen,
  onClose,
  onWallpaperChange,
  currentWallpaper,
}: SettingsModalProps) {
  const [wallpaperUrl, setWallpaperUrl] = useState(currentWallpaper)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    setWallpaperUrl(currentWallpaper)
  }, [currentWallpaper])

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className=" bg-[#12121299]/50 border border-orange-500/30 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl">
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
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
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
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm"
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
  )
}
