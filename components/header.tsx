import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Heading } from "@chakra-ui/react";

export default function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { pathname } = router;

    function headerContents(): JSX.Element {
        if (!session) {
            // Not signed in: return basic header
            return <></>
        }
        
        if (pathname === `/profile/[id]`) {
            // Signed in and profile page: add button to sign out
            return <Button onClick={() => {signOut();}} bgColor={"white"}>Sign out</Button>
        }
        
        // Otherwise, add link to profile
        return <Button bgColor={"white"} onClick={() => router.push(`/profile/${session.user?.id}`)}>Profile</Button>
    }
    
    let contents = headerContents()

    return (
        <header className="bg-header p-8 flex justify-between">
            <Heading>
                <Link href="/">
                    Beatbuff
                </Link>
            </Heading>
            {contents}
        </header>
    )
}
