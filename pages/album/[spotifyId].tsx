import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AlbumDetails from "../../components/album-details";
import AlbumReviews from "../../components/album-reviews";
import ReviewModal from "../../components/review-modal";
import RootLayout from "../../components/root-layout";
import { useSession } from "next-auth/react";
import { Album } from "../../types/Album";
import { authOptions } from "../api/auth/[...nextauth]";
import { requestAlbum } from "../api/request-album";
import { ReviewWithAuthor } from "../api/v2/albums/[spotifyId]/reviews";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    )

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }

    // Must reassign to a different variable!!
    // https://stackoverflow.com/a/75793417
    // https://stackoverflow.com/questions/70092844/
    const sessionProp = session
    return {
        props: {
            sessionProp,
        },
    }
}


export default function AlbumPage({sessionProp}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const {spotifyId} = router.query;
    const [album, setAlbum] = useState<Album | null>(null);
    const [reviews, setReviews] = useState<ReviewWithAuthor[]>([]);
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [averageRating, setAverageRating] = useState<number>(0);
    const { data: session } = useSession(); 


    useEffect(() => {
        if (spotifyId) {
            requestAlbum(spotifyId as string, sessionProp.spotifyToken).then((albumData) => {
                setAlbum(albumData);
            });

            getReviews();
        }
    }, [spotifyId, sessionProp.spotifyToken]);

    const getReviews = async () => {
        try {
            const response = await axios.get(`/api/v2/albums/${spotifyId}/reviews`);
            setReviews(response.data.data.reviews);
        } catch (error) {
            console.log("Error getting reviews: ", error);
        }
    };

    const updateReviews = async () => {
        const response = await axios.get(`/api/v2/albums/${spotifyId}/reviews`);
        setReviews([...response.data.data.reviews]);
    }

    return (
        <RootLayout>
            <Box m={10} display="flex">
                <Flex mt={5} gap={10} flexDirection={{base: "column", sm: "column", md: "row", lg: "row"}}>
                    <Box maxW={300}>
                        <AlbumDetails album={album}/>
                        <Button my={5} onClick={() => setReviewModalOpen(true)}>Leave a Review</Button>
                    </Box>
                    <Box minW={"50vw"}>
                        <Heading size={"lg"}>Reviews</Heading>
                        <AlbumReviews reviews={reviews}/>
                    </Box>
                </Flex>
            </Box>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onReviewSubmit={updateReviews}
                album={album}
            />
        </RootLayout>
    )
}
