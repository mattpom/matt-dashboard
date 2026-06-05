import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Matt Business Dashboard',
  description: 'Mattpom Digital Ventures — Revenue, Products, Stack',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
