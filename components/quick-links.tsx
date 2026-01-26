'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface QuickLink {
  url: string
  title: string
  favicon: string
}

interface QuickLinksProps {
  links: QuickLink[]
  onLinksChange: (links: QuickLink[]) => void
}

export default function QuickLinks({ links, onLinksChange }: QuickLinksProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRemoveLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index)
    onLinksChange(updated)
  }

  const fetchFaviconAndTitle = async (urlString: string) => {
    setLoading(true)
    setError('')

    try {
      let url = urlString
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      const response = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(url)}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch website metadata')
      }

      const data = await response.json()

      const newLink = {
        url: data.url || url,
        title: data.title || new URL(url).hostname,
        favicon: data.favicon || `https://www.google.com/s2/favicons?sz=128&domain=${new URL(url).hostname}`,
      }

      onLinksChange([...links, newLink])
      setNewUrl('')
      setShowAddModal(false)
    } catch (error) {
      console.error('Error fetching metadata:', error)
      
      try {
        const url = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`
        const hostname = new URL(url).hostname
        
        const newLink = {
          url: url,
          title: hostname,
          favicon: `https://www.google.com/s2/favicons?sz=128&domain=${hostname}`,
        }

        onLinksChange([...links, newLink])
        setNewUrl('')
        setShowAddModal(false)
      } catch {
        setError('Invalid URL. Please enter a valid website URL.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    if (!newUrl.trim()) {
      setError('Please enter a URL')
      return
    }
    fetchFaviconAndTitle(newUrl)
  }

  return (
    <div className="mt-6 flex justify-center">
      {/* Quick Links Grid */}
      <div className="flex flex-wrap items-center justify-center gap-5">
        {links.map((link, index) => (
          <div
            key={index}
            className="group relative"
          >
            <a
              href={link.url}
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-1.5 rounded-md bg-white/10 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-xl hover:shadow-lg w-16"
            >
              <div className="relative">
                <img
                  src={link.favicon}
                  alt={link.title}
                  className="w-6 h-6 rounded object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
                  }}
                />
              </div>
              <span className="text-[8px] text-center text-white/70 line-clamp-1 group-hover:text-white transition-colors">
                {link.title}
              </span>
            </a>
            
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveLink(index)}
              className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 hover:bg-red-600 rounded-full p-0.5 shadow-lg"
            >
              <X className="w-2 h-2 text-white" />
            </button>
          </div>
        ))}

        {/* Add New Link Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex flex-col items-center justify-center gap-1 p-1.5 rounded-md bg-white/10 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all backdrop-blur-xl duration-300 group w-16"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded bg-transparent transition-colors">
            <Plus className="w-3 h-3 text-white/70 group-hover:text-orange-500 transition-colors" />
          </div>
          <span className="text-[8px] text-center text-white/70 group-hover:text-orange-500 transition-colors line-clamp-1">
            Add
          </span> 
        </button>
      </div>

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Quick Link</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={newUrl}
                onChange={(e) => {
                  setNewUrl(e.target.value)
                  setError('')
                }}
                placeholder="https://example.com"
                disabled={loading}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none text-sm disabled:opacity-50"
              />
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
