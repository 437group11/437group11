/**
 * Overrides the default app to apply global styles.
 * https://nextjs.org/docs/pages/building-your-application/styling/css-modules#global-styles
 */
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from "next-auth/react"

import '../styles/globals.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </SessionProvider>
    )
}
