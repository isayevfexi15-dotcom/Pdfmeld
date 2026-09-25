'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, FileText, GripVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatBytes } from '@/lib/pdf'
import type { PdfDoc } from './types'

type FileListProps = {
  docs: PdfDoc[]
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
}

export function FileList({ docs, onRemove, onReorder }: FileListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  return (
    <ol className="flex flex-col gap-2">
      {docs.map((doc, index) => (
        <li
          key={doc.id}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragEnter={() => setOverIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnd={() => {
            if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
              onReorder(dragIndex, overIndex)
            }
            setDragIndex(null)
            setOverIndex(null)
          }}
          className={cn(
            'flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all',
            dragIndex === index && 'opacity-50',
            overIndex === index && dragIndex !== index && 'border-primary ring-2 ring-ring/30',
          )}
        >
          <span
            aria-hidden
            className="hidden cursor-grab text-muted-foreground/60 active:cursor-grabbing sm:block"
          >
            <GripVertical className="size-4" />
          </span>

          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-4.5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground" title={doc.file.name}>
              {doc.file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {doc.error
                ? 'Could not read this PDF'
                : doc.pageCount === null
                  ? 'Reading…'
                  : `${doc.pageCount} page${doc.pageCount === 1 ? '' : 's'}`}
              {' · '}
              {formatBytes(doc.file.size)}
            </p>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Move ${doc.file.name} up`}
              disabled={index === 0}
              onClick={() => onReorder(index, index - 1)}
            >
              <ArrowUp />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Move ${doc.file.name} down`}
              disabled={index === docs.length - 1}
              onClick={() => onReorder(index, index + 1)}
            >
              <ArrowDown />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${doc.file.name}`}
              onClick={() => onRemove(doc.id)}
            >
              <X />
            </Button>
          </div>
        </li>
      ))}
    </ol>
  )
}
