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
export const dynamic = "force-dynamic"

export async function GET() {
  const fallbackTrends = [
    "Latest news today",
    "Best AI tools 2025",
    "Web development tips",
    "JavaScript tutorials",
    "React best practices",
    "Python programming",
    "Machine learning basics",
  ]

  try {
    const r = await fetch("https://www.reddit.com/r/popular.json?limit=7", {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    })

    const h = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page", {
      cache: "no-store",
    })

    const reddit = await r.json()
    const hn = await h.json()

    const titles = [
      ...(reddit.data?.children || []).map((x: any) => x.data.title),
      ...(hn.hits || []).map((x: any) => x.title),
    ].slice(0, 7)

    return Response.json(titles.length ? titles : fallbackTrends)
  } catch (error) {
    console.error("[v0] Failed to fetch trending searches:", error)
    return Response.json(fallbackTrends)
  }
}

