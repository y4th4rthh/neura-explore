export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || !query.trim()) {
    return Response.json([])
  }

  try {
    const response = await fetch(
      `https://www.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`
    )
    const data = await response.json()
    const suggestions = (data[1] || []).slice(0, 8)
    return Response.json(suggestions)
  } catch (error) {
    console.error("[v0] Failed to fetch Google suggestions:", error)
    return Response.json([])
  }
}
