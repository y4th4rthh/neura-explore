"use client"

import { useState, useEffect } from "react"
import { Download, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

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

export function UpdaterModal({ open, onOpenChange }: UpdaterModalProps) {
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

  const handleDownload = () => {
    if (downloadUrl) window.open(downloadUrl, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Application Updater
          </DialogTitle>
          <DialogDescription>
            Check for updates and download the latest version
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between rounded-lg border p-3">
            <span className="text-sm text-muted-foreground">
              Current Version
            </span>
            <Badge variant="secondary">v{CURRENT_VERSION}</Badge>
          </div>

          {loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="flex gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {!loading && release && (
            <>
              <div className="flex justify-between rounded-lg border p-3">
                <span className="text-sm text-muted-foreground">
                  Latest Version
                </span>
                <Badge variant={isUpdateAvailable ? "default" : "secondary"}>
                  {release.tag_name}
                </Badge>
              </div>

              {isUpdateAvailable ? (
                <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Download className="h-5 w-5" />
                    Update available
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-5 w-5" />
                    You’re up to date
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={fetchLatestRelease}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Check again
          </Button>

          {downloadUrl && (
            <Button className="flex-1" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
