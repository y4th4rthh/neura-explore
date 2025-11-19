"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface Suggestion {
  text: string
  type: "autocomplete" | "trending"
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [trendingSearches, setTrendingSearches] = useState<string[]>([])
  const [isInputFocused, setIsInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTrendingSearches()
  }, [])

  const fetchTrendingSearches = async () => {
    try {
      const response = await fetch("/api/trending")
      const trends = await response.json()
      setTrendingSearches(trends.slice(0,3))
    } catch (error) {
      console.error("[v0] Failed to fetch trending:", error)
      setTrendingSearches([])
    }
  }

  const fetchGoogleSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions(
        trendingSearches.map((text) => ({
          text,
          type: "trending" as const,
        }))
      )
      return
    }

    try {
      const response = await fetch(`/api/suggestions?q=${encodeURIComponent(searchQuery)}`)
      const googleSuggestions = await response.json()

      const formattedSuggestions = (googleSuggestions || []).map((text: string) => ({
        text,
        type: "autocomplete" as const,
      }))

      setSuggestions(formattedSuggestions.slice(0,3))
    } catch (error) {
      console.error("[v0] Failed to fetch suggestions")
      setSuggestions([])
    }
  }

  useEffect(() => {
    if (!isInputFocused) return

    const timer = setTimeout(() => {
      fetchGoogleSuggestions(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, isInputFocused])

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    let url = ""

    if (searchQuery.startsWith("http://") || searchQuery.startsWith("https://")) {
      url = searchQuery
    } else if (searchQuery.includes(".") && !searchQuery.includes(" ")) {
      url = `https://${searchQuery}`
    } else {
      url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
    }

    window.location.href = url
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    handleSearch(suggestion.text)
  }

  const handleInputFocus = () => {
    setIsInputFocused(true)
    setShowSuggestions(true)
    if (!query.trim()) {
      setSuggestions(
        trendingSearches.map((text) => ({
          text,
          type: "trending" as const,
        }))
      )
    } else {
      fetchGoogleSuggestions(query)
    }
  }

  const handleInputBlur = () => {
    setIsInputFocused(false)
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Search Input Container */}
      <div className="relative">
        <div className="text-gray-200 bg-[#FFFFFF1A] backdrop-blur-md w-full px-3 py-2 pr-10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500">
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
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Search anything, visit websites..."
              className="flex-1  bg-transparent text-white placeholder-white/40 outline-none text-base font-light"
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

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl overflow-hidden z-10 shadow-2xl max-h-96 overflow-y-auto">
            {/* Autocomplete suggestions */}
            {suggestions
              .filter((s) => s.type === "autocomplete")
              .map((suggestion, index) => (
                <button
                  key={`autocomplete-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-5 py-3 text-left hover:bg-white/10 transition-colors text-white/70 hover:text-white border-b border-white/5 flex items-center gap-3 group"
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

            {/* Trending searches section */}
            {suggestions
              .filter((s) => s.type === "trending")
              .map((suggestion, index) => (
                <button
                  key={`trending-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-5 py-3 text-left hover:bg-white/10 transition-colors text-white/70 hover:text-white border-b border-white/5 last:border-b-0 flex items-center gap-3 group"
                >
                  <svg
                    className="w-4 h-4 text-orange-400/60 group-hover:text-orange-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
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
