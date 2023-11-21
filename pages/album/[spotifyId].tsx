import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Album } from "../../types/Album";
import { ReviewWithAuthor } from "../api/v2/albums/[spotifyId]/reviews";
import AlbumDetails from "../../components/album-details";
import AlbumReviews from "../../components/album-reviews";
import { requestAlbum } from "../api/request-album"
import axios from "axios";
import RootLayout from "../../components/root-layout";
import { InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]"
import { Flex, Box, Heading, Button, Text } from "@chakra-ui/react"
import ReviewForm from "../../components/review-form";
import ReviewModal from "../../components/review-modal";

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
  const [reviews, setReviews] = useState<ReviewWithAuthor[]>([]);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);

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
      getAverageRating(response.data.data.reviews);
    } catch (error) {
      console.log("Error getting reviews: ", error);
    }
  }

  const updateReviews = async () => {
    const response = await axios.get(`/api/v2/albums/${spotifyId}/reviews`);
    setReviews([...response.data.data.reviews]);
    getAverageRating(response.data.data.reviews);
    // In theory, setReviews should cause the AlbumReviews component to reload.
    // But it doesn't. So, we reload the whole page.
    // If we have time, we should probably fix this.
    // https://stackoverflow.com/a/68015879
    router.replace(router.asPath)
  }

  const getAverageRating = (reviews: ReviewWithAuthor[]) => {
    let sum = 0;
    if (reviews.length == 0){
      setAverageRating(0);
      return;
    }
    for (let review of reviews) {
      sum += review.rating;
    }
    console.log(sum);
    console.log(reviews.length);
    const average = sum/reviews.length;
    const roundedAverage = Math.round(average * 10) / 10;
    setAverageRating(roundedAverage);
  }

  return (
    <RootLayout>
        <Box m={10}>
            <Flex mt={5} gap={10}>
                <Box minW={300}>
                    <AlbumDetails album={album} />
                    {averageRating !== 0 ? (
                    <Text mt={5} fontSize="xl" fontWeight="bold">
                      Average Rating: {averageRating}
                    </Text> ) : (
                    <Text mt={5} fontSize="xl" fontWeight="bold">
                      No Ratings Yet
                    </Text>)}
                    <Button my={5} onClick={() => setReviewModalOpen(true)}>Leave a Review</Button>
                </Box>
                <Box minW={"50vw"}>
                    <Heading size={"md"}>Reviews</Heading>
                    <AlbumReviews reviews={reviews} />
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
