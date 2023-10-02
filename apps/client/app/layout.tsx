import './globals.css'
import type { Metadata } from 'next'
import { Lora } from 'next/font/google'

const myFont = Lora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'group11_website',
  description: 'Rate and share albums',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  )
}
