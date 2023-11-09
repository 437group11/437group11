import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Album } from "../../types/Album";
import { Review } from "@prisma/client"
import AlbumDetails from "../../components/album-details";
import AlbumReviews from "../../components/album-reviews";
import { requestAlbum } from "../api/request-album"
import axios from "axios";
import RootLayout from "../../components/root-layout";
import { InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]"
import { Flex, Box, Heading, Button } from "@chakra-ui/react"
import ReviewForm from "../../components/review-form";

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
  const { spotifyId } = router.query;
  const [album, setAlbum] = useState<Album | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (spotifyId) {
      requestAlbum(spotifyId as string, sessionProp.spotifyToken).then((albumData) => {
        setAlbum(albumData);
      });

      axios.get(`/api/v2/albums/${spotifyId}/reviews`).then((response) => {
        setReviews(response.data.data.reviews);
      });
    }
  }, [spotifyId, sessionProp.spotifyToken]);

  return (
    <RootLayout>
        <Flex m={10} gap={10}>
            <Box>
                {album && <AlbumDetails album={album} />}
            </Box>
            <Box minW={"50vw"}>
                <Heading>Reviews:</Heading>
                <ReviewForm />
                {reviews.length > 0 && <AlbumReviews reviews={reviews} />}
            </Box>

        </Flex>
    </RootLayout>
  );
};
