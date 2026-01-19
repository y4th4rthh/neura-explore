// export async function GET() {
//   try {
//     const response = await fetch(
//       "https://www.google.com/complete/search?client=chrome&q="
//     )
//     const data = await response.json()
//     const trendingSearches = (data[1] || []).slice(0, 7)
    
//     // Fallback trending searches in case API fails
//     const fallbackTrends = [
//       "Latest news today",
//       "Best AI tools 2025",
//       "Web development tips",
//       "JavaScript tutorials",
//       "React best practices",
//       "Python programming",
//       "Machine learning basics",
//     ]

//     return Response.json(trendingSearches.length > 0 ? trendingSearches : fallbackTrends)
//   } catch (error) {
//     console.error("[v0] Failed to fetch trending searches:", error)
//     return Response.json([
//       "Latest news today",
//       "Best AI tools 2025",
//       "Web development tips",
//       "JavaScript tutorials",
//       "React best practices",
//       "Python programming",
//       "Machine learning basics",
//     ])
//   }
// }

export const runtime = "nodejs"

export async function GET() {
  const fallback = [
    "Latest news today",
    "Best AI tools 2025",
    "Web development tips",
    "JavaScript tutorials",
    "React best practices",
    "Python programming",
    "Machine learning basics",
  ]

  try {
    const res = await fetch(
      "https://trends.google.com/trends/api/dailytrends?geo=IN",
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        cache: "no-store",
      }
    )

    const text = await res.text()
    const json = JSON.parse(text.replace(")]}',", ""))

    const searches =
      json.default.trendingSearchesDays[0].trendingSearches
        .map((x: any) => x.title.query)
        .slice(0, 7)

    return Response.json(searches.length ? searches : fallback)
  } catch (e) {
    console.error("Google Trends failed:", e)
    return Response.json(fallback)
  }
}
