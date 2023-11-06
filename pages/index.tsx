import RootLayout from "../components/root-layout";
import ButtonLink from "../components/button-link";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router";
import { 
    Input, Box, UnorderedList, ListItem, Link, Container, SimpleGrid,
    Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
    ModalFooter, Img, Text, Center, Slider, SliderTrack, SliderFilledTrack,
    SliderThumb, ModalHeader, Textarea, Button, ButtonGroup, Heading
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next"
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Redirect to the feed page *before* page load if the user is signed in.
    // https://next-auth.js.org/configuration/nextjs#in-getserversideprops
    // https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
    
    const session = await getServerSession(context.req, context.res, authOptions)

    if (session) {
        return {
            redirect: {
                destination: "/feed",
                permanent: false,
            },
        }
    }

    return {
        props: {
        },
    }
}
export default function Home() {
    return (
        <RootLayout>
            <Box color={"white"} className="container mx-auto" height="calc(100vh - 64px)">
            <Heading fontSize='6xl' p="10px">
                Welcome to Beatbuff!
            </Heading>
            <p className='text-xl my-8'>
                Beatbuff is a website where users can rate music and share their recommendations.
                To get started, create an account or sign in:
            </p>
            <div className="my-8">
                <Button onClick={() => signIn()}>Sign in</Button>
            </div>
            </Box>
        </RootLayout>
    )
}
