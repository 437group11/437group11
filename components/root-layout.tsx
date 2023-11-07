import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import Header from "./header"
import Main from "./main"
import React from "react";
import Head from "next/head";

const myFont = Lora({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
          {/*
          The head component allows us to append elements to <head> from the body.
          https://nextjs.org/docs/pages/api-reference/components/head
          */}
          <Head>
              <title>Beatbuff</title>
              <meta 
                name="description"
                content="Rate and share albums"
              />
          </Head>

          <Header></Header>
          <Main>
              {children}
          </Main>
      </>
  )
}
