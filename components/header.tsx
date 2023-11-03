import Link from "next/link";
import { useRouter } from "next/router";
import { getUsername } from "utils/userManager";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@chakra-ui/react";

export default function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { pathname } = router;

    function headerContents(): JSX.Element {
        if (!session) {
            // Not signed in: return basic header
            return (
                <>
                    <Link href="/">
                            Beatbuff
                    </Link>
                </>
            )
        }
        
        if (pathname === `/profile/[id]`) {
            // Signed in and profile page: add button to sign out
            return (
                <>
                    <Link href="/feed">
                        Beatbuff
                    </Link>
                    <Button onClick={() => signOut()} colorScheme="red">Sign out</Button>
                </>
            )
        }
        // Otherwise, add link to profile
        return (
            <>
                <Link href="/feed">
                    Beatbuff
                </Link>

                <Button onClick={() => router.push(`/profile/${session.user?.id}`)}>Profile</Button>
            </>
        )
    }
    
    let contents = headerContents()

    return (
        <header className="bg-bg-darker p-8 flex justify-between">
            {contents}
        </header>
    )
}
