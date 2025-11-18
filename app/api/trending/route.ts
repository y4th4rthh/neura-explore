export async function GET() {
  try {
    const response = await fetch(
      "https://www.google.com/complete/search?client=chrome&q="
    )
    const data = await response.json()
    const trendingSearches = (data[1] || []).slice(0, 7)
    
    // Fallback trending searches in case API fails
    const fallbackTrends = [
      "Latest news today",
      "Best AI tools 2025",
      "Web development tips",
      "JavaScript tutorials",
      "React best practices",
      "Python programming",
      "Machine learning basics",
    ]

    return Response.json(trendingSearches.length > 0 ? trendingSearches : fallbackTrends)
  } catch (error) {
    console.error("[v0] Failed to fetch trending searches:", error)
    return Response.json([
      "Latest news today",
      "Best AI tools 2025",
      "Web development tips",
      "JavaScript tutorials",
      "React best practices",
      "Python programming",
      "Machine learning basics",
    ])
  }
}
