"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface Suggestion {
  text: string
  type: "search" | "url"
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const newSuggestions: Suggestion[] = []

    // Add search suggestion
    newSuggestions.push({
      text: `Search for "${query}"`,
      type: "search",
    })

    // Add URL suggestions if query looks like a domain
    if (query.includes(".")) {
      if (!query.startsWith("http")) {
        newSuggestions.push({
          text: `https://${query}`,
          type: "url",
        })
      } else {
        newSuggestions.push({
          text: query,
          type: "url",
        })
      }
    }

    // Add common suggestions
    const commonSites = ["google.com", "github.com", "stackoverflow.com", "youtube.com"]
    commonSites.forEach((site) => {
      if (site.includes(query.toLowerCase())) {
        newSuggestions.push({
          text: `https://${site}`,
          type: "url",
        })
      }
    })

    setSuggestions(newSuggestions)
    setShowSuggestions(true)
  }, [query])

  // Detect URL type and navigate
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    let url = ""

    // Check if it's a perfect URL (starts with http/https)
    if (searchQuery.startsWith("http://") || searchQuery.startsWith("https://")) {
      url = searchQuery
    }
    // Check if it's a domain (contains . and no spaces)
    else if (searchQuery.includes(".") && !searchQuery.includes(" ")) {
      url = `https://${searchQuery}`
    }
    // Otherwise, treat as search query
    else {
      url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
    }

    window.location.href = url
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === "url") {
      // Extract the URL part
      const url = suggestion.text.startsWith("https://") ? suggestion.text : `https://${suggestion.text}`
      window.location.href = url
    } else {
      handleSearch(suggestion.text.replace('Search for "', "").replace('"', ""))
    }
  }

  return (
    <div className="w-full max-w-3xl">
      {/* Search Input Container */}
      <div className="relative">
        <div className="text-gray-200 bg-[#FFFFFF1A] w-full px-3 py-2 pr-10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500">
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search anything, visit websites..."
              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-base font-light"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSearch()}
              className="p-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/60 hover:text-white flex-shrink-0"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl overflow-hidden z-10 shadow-2xl">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-5 py-3 text-left hover:bg-white/10 transition-colors text-white/70 hover:text-white border-b border-white/5 last:border-b-0 flex items-center gap-3 group"
              >
                <svg
                  className="w-4 h-4 text-white/30 group-hover:text-white/50 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm font-light">{suggestion.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Text */}
      <p className="text-center text-white/40 text-xs mt-6 font-light tracking-wide">
        Press Enter or click the arrow to search
      </p>
    </div>
  )
}
