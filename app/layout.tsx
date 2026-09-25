import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script' // 🔽 Next.js skript komponenti
import './globals.css'

export const metadata: Metadata = {
  title: 'PdfMeld — Merge PDF files online for free',
  description:
    'PdfMeld is a fast, secure, and free online tool to merge multiple PDF files into one. Reorder, preview, and combine PDF documents right in your browser instantly.',
  keywords: [
    'merge pdf', 
    'combine pdf files', 
    'pdf joiner', 
    'merge pdf online free', 
    'convert pdf', 
    'secure pdf merger'
  ],
  authors: [{ name: 'PdfMeld' }],
  creator: 'PdfMeld',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'PdfMeld — Merge PDF files online',
    description: 'Fast, private, and free tool to merge multiple PDF files into one directly in your browser.',
    url: 'https://pdfmeld.com',
    siteName: 'PdfMeld',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PdfMeld — Merge PDF files online',
    description: 'Combine PDF files safely and quickly in your browser.',
  },
  // 🔽 Google AdSense Hesab Doğrulaması (Meta Etiket)
  other: {
    'google-adsense-account': 'ca-pub-9374245691910556',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* 🔽 AdSense skripti (PageSpeed balını korumak üçün lazyOnload tətbiq edilib) */}
        <Script
          async
          src="https://googlesyndication.com"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
