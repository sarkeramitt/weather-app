"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)

  // Handle clicks outside of the search component
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch location suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/locations?search=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to fetch suggestions")

      const data = await response.json()
      setSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchTerm)
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchTerm, fetchSuggestions])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name)
    onSearch(suggestion.name)
    setShowSuggestions(false)
  }

  return (
    <div className="w-full relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            className="w-full p-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            placeholder="Search for a city or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">{loading ? "sync" : "search"}</span>
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-2">location_on</span>
                <div>
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500">
                    {suggestion.region && `${suggestion.region}, `}
                    {suggestion.country}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

