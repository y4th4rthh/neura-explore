import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Fetch the HTML of the website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`)
    }

    const html = await response.text()

    // Parse the HTML to extract title and favicon
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname

    // Look for favicon in multiple places
    let favicon = null

    // Check for icon link tags
    const faviconPatterns = [
      /<link[^>]*rel=["']?(apple-touch-icon|icon|shortcut icon)["']?[^>]*href=["']([^"']+)["'][^>]*>/gi,
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/gi,
    ]

    for (const pattern of faviconPatterns) {
      const match = pattern.exec(html)
      if (match && match[2]) {
        favicon = match[2]
        break
      }
    }

    // If no favicon found in HTML, use Google's favicon service
    if (!favicon) {
      favicon = `https://www.google.com/s2/favicons?sz=128&domain=${new URL(url).hostname}`
    } else {
      // Make sure favicon URL is absolute
      if (!favicon.startsWith('http')) {
        const baseUrl = new URL(url)
        favicon = favicon.startsWith('/') 
          ? `${baseUrl.protocol}//${baseUrl.host}${favicon}`
          : `${baseUrl.protocol}//${baseUrl.host}/${favicon}`
      }
    }

    return NextResponse.json({
      url: url,
      title: title,
      favicon: favicon,
    })
  } catch (error) {
    console.error('Error fetching metadata:', error)
    
    // Fallback: Return a basic response with favicon service
    try {
      const url = new URL(request.nextUrl.searchParams.get('url') || '')
      return NextResponse.json({
        url: url.toString(),
        title: url.hostname,
        favicon: `https://www.google.com/s2/favicons?sz=128&domain=${url.hostname}`,
      })
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch metadata' },
        { status: 500 }
      )
    }
  }
}