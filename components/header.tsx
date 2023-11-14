import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Flex, Heading } from "@chakra-ui/react";
import ProfilePicture from "components/profile-picture"

export default function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { pathname } = router;

    const handleSignOut = () => {
        console.log("g");
        signOut()
          .then(() => {
            window.location.href = '/';
        })
          .catch((error) => {
            console.error('Sign out error:', error);
          });
      };
    

    function headerContents(): JSX.Element {
        if (!session) {
            // Not signed in: return basic header
            return <></>
        }

        if (router.query.id === `${session.user?.id}`) {
            // Signed in and profile page: add button to sign out
            return (
                <Button onClick={handleSignOut}>
                  Sign out
                </Button>
              );
        }
        
        // Otherwise, add link to profile
        return <ProfilePicture user={session.user} size="md" />
    }
    
    let contents = headerContents()

    return (
        <header className="bg-header p-8 flex justify-between sticky top-0 z-40">
            <Heading>
                <Link href="/">
                    Beatbuff
                </Link>
            </Heading>
            <Flex gap={5}>
                <Button onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'})}}>↑</Button>
                {contents}
            </Flex>
        </header>
    )
}