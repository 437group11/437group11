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

export default function Home() {
    const { data: session } = useSession()
    const router = useRouter()
    if (session) {
        router.push("/feed")
    }

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
