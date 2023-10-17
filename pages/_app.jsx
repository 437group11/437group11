/**
 * Overrides the default app to apply global styles.
 * https://nextjs.org/docs/pages/building-your-application/styling/css-modules#global-styles
 *
 * Additionally, sets up shared session state for next-auth.
 * https://next-auth.js.org/getting-started/example#configure-shared-session-state
 */
import '../styles/globals.css'
import {SessionProvider} from "next-auth/react"

export default function App({Component, pageProps: {session, ...pageProps}}) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps}/>
        </SessionProvider>
    )
}
