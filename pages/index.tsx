import {
    Box,
    Button,
    Flex,
    Heading,
    Text
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import RootLayout from "../components/root-layout";
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
            <Flex direction={"column"} gap={10} my="10vh" mx={10}>
                <Heading fontSize='5xl'>
                    Welcome to Beatbuff!
                </Heading>
                <Box>
                    <Text fontSize={"xl"}>
                        Beatbuff is a website where users can rate music and share their recommendations.
                    </Text>
                    <Text fontSize={"xl"}>
                        To get started, sign in with one of your accounts:
                    </Text>
                </Box>

                <Flex direction={"row"} gap={5} flexWrap={"wrap"}>
                    <Button colorScheme="blue" onClick={() => signIn("google")}>Sign in with Google</Button>
                    <Button colorScheme="purple" onClick={() => signIn("github")}>Sign in with GitHub</Button>
                </Flex>

                
            </Flex>
        </RootLayout>
    )
}
