"use client"

import { useState, useEffect } from "react"
import { Download, RefreshCw, CheckCircle, AlertCircle, Loader2, X } from "lucide-react"

const CURRENT_VERSION = "1.0.0"

interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

interface GitHubRelease {
  tag_name: string
  name: string
  body: string
  published_at: string
  assets: ReleaseAsset[]
}

interface UpdaterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdaterModal({ open, onOpenChange }: UpdaterModalProps) {
  const [loading, setLoading] = useState(false)
  const [release, setRelease] = useState<GitHubRelease | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const fetchLatestRelease = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        "https://api.github.com/repos/y4th4rthh/neura.ai-releases/releases/latest"
      )
      if (!res.ok) throw new Error("Failed to fetch release information")

      const data: GitHubRelease = await res.json()
      setRelease(data)

      const exe =
        data.assets.find(a =>
          a.name.toLowerCase().includes("neura.explore.exe")
        ) ??
        data.assets.find(a => a.name.toLowerCase().endsWith(".exe"))

      setDownloadUrl(exe?.browser_download_url ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) fetchLatestRelease()
  }, [open])

  const compareVersions = (v1: string, v2: string) => {
    const a = v1.replace(/^v/, "").split(".").map(Number)
    const b = v2.replace(/^v/, "").split(".").map(Number)
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const x = a[i] || 0
      const y = b[i] || 0
      if (x > y) return 1
      if (x < y) return -1
    }
    return 0
  }

  const isUpdateAvailable =
    release && compareVersions(release.tag_name, CURRENT_VERSION) > 0

  // const handleDownload = () => {
  //   if (downloadUrl) window.open(downloadUrl, "_blank")
  // }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      <div className="relative z-50 w-full max-w-md mx-4 bg-[#12121299]/50 border border-orange-500/30 rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Application Updater
              </h2>
              <p className="text-sm text-white mt-4">
                Check for updates and download the latest version
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4 py-4">

            {loading && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500/50" />
              </div>
            )}

            {error && (
              <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!loading && release && (
              <>
                <div className="flex justify-between items-center rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                  <span className="text-base text-orange-500/70">
                    Latest Version
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    isUpdateAvailable 
                      ? "bg-orange-500 text-white" 
                      : "bg-orange-500/20 text-orange-500"
                  }`}>
                    {release.tag_name}
                  </span>
                </div>

                {isUpdateAvailable ? (
                  <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                    <div className="flex items-center gap-2 text-orange-500">
                      <Download className="h-4 w-4" />
                      <span className="font-medium">Latest update available</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">You're up to date</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 px-4 py-2 rounded-md border border-orange-500/30 bg-orange-500/5 text-orange-500 hover:bg-orange-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={fetchLatestRelease}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              Check again
            </button>

            {downloadUrl && (
             <a
  href="https://github.com/y4th4rthh/neura.ai-releases/releases/download/v11.0/neura.explore.exe"
  target="_blank"
  rel="nofollow"
  data-view-component="true"
  data-view-component="false"
  className="flex-1 px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
>
  <Download className="h-4 w-4" />
  Download
</a>

            )}
          </div>
        </div>
      </div>
    </div>
  )
}
