import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import Header from "./header"
import Main from "./main"
import React from "react";

const myFont = Lora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beatbuff',
  description: 'Rate and share albums',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
          <Header></Header>
          <Main>
              {children}
          </Main>
      </>
  )
}
