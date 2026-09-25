'use client'

import { useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PreviewOverlayProps = {
  url: string
  fileName: string
  onClose: () => void
  onDownload: () => void
}

export function PreviewOverlay({ url, fileName, onClose, onDownload }: PreviewOverlayProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="PDF preview"
      className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm"
    >
      <header className="flex items-center gap-3 border-b border-white/10 bg-background px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground" title={fileName}>
          {fileName}
        </p>
        <Button size="sm" onClick={onDownload}>
          <Download />
          <span className="hidden sm:inline">Download</span>
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Close preview" onClick={onClose}>
          <X />
        </Button>
      </header>
      <div className="min-h-0 flex-1 bg-muted">
        <iframe title="Merged PDF preview" src={url} className="size-full border-0" />
      </div>
    </div>
  )
}
