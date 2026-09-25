'use client'

import { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

type DropzoneProps = {
  onFiles: (files: File[]) => void
  compact?: boolean
}

export function Dropzone({ onFiles, compact = false }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return
      const files = Array.from(fileList).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
      )
      if (files.length) onFiles(files)
    },
    [onFiles],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Add PDF files"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setIsDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={cn(
        'group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card text-center transition-colors',
        'hover:border-primary/50 hover:bg-primary/[0.03] focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
        isDragging && 'border-primary bg-primary/5',
        compact ? 'gap-2 px-6 py-6' : 'gap-4 px-6 py-14 sm:py-20',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105',
          compact ? 'size-10' : 'size-14',
        )}
      >
        <UploadCloud className={compact ? 'size-5' : 'size-7'} />
      </div>
      <div className="space-y-1">
        <p className={cn('font-medium text-foreground', compact ? 'text-sm' : 'text-base')}>
          {compact ? 'Add more PDFs' : 'Drag & drop your PDFs here'}
        </p>
        {!compact && (
          <p className="text-sm text-muted-foreground">
            or <span className="font-medium text-primary">browse files</span> — merged in your
            browser, never uploaded
          </p>
        )}
      </div>
      {/* 🌟 ACCESSIBILITY FIX: aria-label="Upload PDF files" əlavə edildi */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="sr-only"
        aria-label="Upload PDF files"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
