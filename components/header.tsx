import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Button, Flex, Heading, IconButton, useBreakpointValue, useToast } from "@chakra-ui/react";
import ProfilePicture from "components/profile-picture"
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import NotificationFeed from "./notification-feed";
import HamburgerMenu from "./hamburger-menu";

export default function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast()
    const [showScrollButton, setShowScrollButton] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false })

    
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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

        const collapsibleElements = (
            <>
                <Link href="/discover" key={"discover-link"}>
                    <Button>
                        Discovery
                    </Button>
                </Link>
                <>{profileButtonOrSignOut(session)}</>
            </>
        )

        return (
            <Flex gap={5}>
                {showScrollButton && (
                    <IconButton aria-label={"Scroll to top"} icon={<ArrowUpIcon />} onClick={scrollToTop} />
                )}
                <NotificationFeed session={session} key={"notification-feed"}/>
                {isMobile ? <HamburgerMenu>{collapsibleElements}</HamburgerMenu> : collapsibleElements}
            </Flex>
        )
    }

    function profileButtonOrSignOut(session: Session): JSX.Element {
        if (router.query.id === `${session.user?.id}`) {
            // Signed in and profile page: add button to sign out
            return (
                <Button onClick={handleSignOut} key={"sign-out"}>
                  Sign out
                </Button>
            );
        }
        
        // Otherwise, add link to profile
        return <ProfilePicture user={session.user} size="md" key={"my-profile"}/>
    }
    
    function scrollToTop() {
        toast({title: "Scrolled to top"})
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    let contents = headerContents()

    return (
        <header className="bg-header p-8 flex justify-between sticky top-0 z-40">
            <Heading>
                <Link href="/">
                    Beatbuff
                </Link>
            </Heading>
            {contents}
        </header>
    )
}