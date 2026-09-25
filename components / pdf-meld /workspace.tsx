'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Eye, Layers, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPageCount, mergePdfs } from '@/lib/pdf'
import { Dropzone } from './dropzone'
import { FileList } from './file-list'
import { PreviewOverlay } from './preview-overlay'
import type { PdfDoc } from './types'

const MERGED_NAME = 'PdfMeld-merged.pdf'

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function Workspace() {
  const [docs, setDocs] = useState<PdfDoc[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const urlRef = useRef<string | null>(null)

  const resetMerged = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    setMergedUrl(null)
  }, [])

  useEffect(() => () => resetMerged(), [resetMerged])

  const addFiles = useCallback(
    (files: File[]) => {
      setError(null)
      resetMerged()
      const additions: PdfDoc[] = files.map((file) => ({
        id: createId(),
        file,
        pageCount: null,
      }))
      setDocs((prev) => [...prev, ...additions])

      additions.forEach(async (doc) => {
        try {
          const pageCount = await getPageCount(doc.file)
          setDocs((prev) =>
            prev.map((d) => (d.id === doc.id ? { ...d, pageCount } : d)),
          )
        } catch {
          setDocs((prev) =>
            prev.map((d) => (d.id === doc.id ? { ...d, error: true, pageCount: 0 } : d)),
          )
        }
      })
    },
    [resetMerged],
  )

  const removeDoc = useCallback(
    (id: string) => {
      resetMerged()
      setDocs((prev) => prev.filter((d) => d.id !== id))
    },
    [resetMerged],
  )

  const reorder = useCallback(
    (from: number, to: number) => {
      resetMerged()
      setDocs((prev) => {
        if (to < 0 || to >= prev.length) return prev
        const next = [...prev]
        const [moved] = next.splice(from, 1)
        next.splice(to, 0, moved)
        return next
      })
    },
    [resetMerged],
  )

  const clearAll = useCallback(() => {
    resetMerged()
    setDocs([])
    setError(null)
  }, [resetMerged])

  const handleMerge = useCallback(async () => {
    if (docs.length < 2) return
    setIsMerging(true)
    setError(null)
    try {
      const blob = await mergePdfs(docs.map((d) => d.file))
      resetMerged()
      const url = URL.createObjectURL(blob)
      urlRef.current = url
      setMergedUrl(url)
      setPreviewOpen(true)
    } catch (err) {
      console.log('[v0] merge failed:', err)
      setError('Something went wrong while merging. One of the files may be corrupted or protected.')
    } finally {
      setIsMerging(false)
    }
  }, [docs, resetMerged])

  const download = useCallback(() => {
    if (!mergedUrl) return
    const a = document.createElement('a')
    a.href = mergedUrl
    a.download = MERGED_NAME
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [mergedUrl])

  const totalPages = docs.reduce((sum, d) => sum + (d.pageCount ?? 0), 0)

  return (
    <div className="mx-auto w-full max-w-2xl">
      {docs.length === 0 ? (
        <Dropzone onFiles={addFiles} />
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {docs.length} file{docs.length === 1 ? '' : 's'} ready
              </h2>
              <p className="text-xs text-muted-foreground">
                {totalPages > 0 ? `${totalPages} pages total · ` : ''}Drag to set the merge order
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 />
              Clear all
            </Button>
          </div>

          <FileList docs={docs} onRemove={removeDoc} onReorder={reorder} />

          <Dropzone onFiles={addFiles} compact />

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              size="lg"
              className="flex-1"
              disabled={docs.length < 2 || isMerging}
              onClick={handleMerge}
            >
              {isMerging ? <Loader2 className="animate-spin" /> : <Layers />}
              {isMerging
                ? 'Merging…'
                : docs.length < 2
                  ? 'Add at least 2 PDFs to merge'
                  : `Merge ${docs.length} PDFs`}
            </Button>
            {mergedUrl && !isMerging && (
              <>
                <Button size="lg" variant="outline" onClick={() => setPreviewOpen(true)}>
                  <Eye />
                  Preview
                </Button>
                <Button size="lg" variant="secondary" onClick={download}>
                  <Download />
                  Download
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {previewOpen && mergedUrl && (
        <PreviewOverlay
          url={mergedUrl}
          fileName={MERGED_NAME}
          onClose={() => setPreviewOpen(false)}
          onDownload={download}
        />
      )}
    </div>
  )
}
