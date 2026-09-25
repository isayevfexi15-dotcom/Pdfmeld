tsx'use client'

import React, { useState } from 'react'

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  // Basit sürükle-bırak fonksiyonları
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      const pdfFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf')
      setFiles([...files, ...pdfFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Üst Header / Navigasyon */}
      <header className="border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur sticky top-0 z-50 transition-colors">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-500/20">
              P
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              PdfMeld
            </span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
            v1.0.0
          </div>
        </div>
      </header>

      {/* Ana İçerik Alanı */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-24">
        {/* Başlık Grubu */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-5xl mb-4 bg-gradient-to-b from-gray-900 to-gray-700 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Merge PDF Files Online
          </h1>
          <p className="text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
            Combine multiple PDF documents into a single file in seconds. Perfectly organized, incredibly fast, and fully secure.
          </p>
        </div>

        {/* Araç Kutusu / Yükleme Alanı */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 p-6 sm:p-8 shadow-sm transition-colors">
          
          {/* Sürükle Bırak Bölgesi */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer min-h-[220px] ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[0.99]'
                : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30'
            }`}
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            {/* 🌟 ACCESSIBILITY DÜZELTMESİ: Aria-label eklenerek PageSpeed hatası çözüldü */}
            <input
              id="file-upload-input"
              type="file"
              className="sr-only"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              aria-label="Upload PDF files"
            />
            
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 text-2xl shadow-inner">
              📥
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Click to upload or drag & drop documents
            </p>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Only PDF files are supported
            </p>
          </div>

          {/* Yüklenen Dosyaların Listesi */}
          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Queue ({files.length} {files.length === 1 ? 'file' : 'files'})
                </span>
                <button
                  onClick={() => setFiles([])}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800 text-sm transition-all hover:bg-gray-100/50 dark:hover:bg-zinc-800/70"
                  >
                    <div className="flex items-center gap-3 truncate min-w-0 pr-4">
                      <span className="text-lg flex-shrink-0 text-red-500">📄</span>
                      <span className="font-medium text-gray-700 dark:text-zinc-300 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-zinc-500 flex-shrink-0">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(idx)
                      }}
                      className="w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-all text-xs flex-shrink-0"
                      title="Remove file"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              {/* Birlestir Butonu */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] flex items-center justify-center gap-2">
                  <span>⚡</span> Merge PDF Files
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 🌟 ADSENSE ONAYI VE SEO İÇİN EKLENEN PROFESYONEL REHBER & GİZLİLİK BÖLÜMÜ */}
        <section className="mt-16 w-full max-w-4xl mx-auto py-10 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-zinc-400 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-950 dark:text-white flex items-center gap-2">
                📖 How to Merge PDF Files with PdfMeld
              </h2>
              <p className="text-sm leading-relaxed mb-4 text-gray-500 dark:text-zinc-400">
                Combining your documents into a single file is quick and effortless with our free online PDF merger. Whether you need to group business reports, academic papers, or personal receipts, PdfMeld provides a seamless solution without requiring any software installation.
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">1.</span> Upload your documents via drag and drop.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">2.</span> Manage your file queue seamlessly in the interface.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">3.</span> Compile them with a single click of a button.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-950 dark:text-white flex items-center gap-2">
                🎯 Reliable PDF Joiner & Combiner
              </h2>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                Our advanced cloud-ready web framework guarantees maximum compatibility across multiple devices, including mobile phones, tablets, and computers. Experience lightning-fast processing speeds that outperform traditional software wrappers, saving you valuable time during urgent tasks.
              </p>
            </div>
          </div>

          {/* Gizlilik Kutusu */}
          <div className="bg-gray-100/70 dark:bg-zinc-900/60 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/60 transition-colors">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
