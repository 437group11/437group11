import RootLayout from "../components/root-layout";
import ButtonLink from "../components/button-link";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router";

export default function Home() {
    const { data: session } = useSession()
    const router = useRouter()
    if (session) {
        router.push("/feed")
    }

    return (
        <RootLayout>
            <h1 className='text-6xl my-8'>
                Welcome to Beatbuff!
            </h1>
            <p className='text-xl my-8'>
                Beatbuff is a website where users can rate music and share their recommendations.
                To get started, create an account or sign in:
            </p>
            <div className="my-8">
                <Button onClick={() => signIn()}>Sign in</Button>
            </div>
        </RootLayout>
    )
}
