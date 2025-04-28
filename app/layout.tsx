import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trading1501',
  description: 'Trading1501 Filter Analysis'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
