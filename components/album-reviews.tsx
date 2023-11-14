import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    Text,
    VStack
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { ReviewWithAuthor } from "../pages/api/v2/albums/[spotifyId]/reviews"
import ReviewComments from "./review-comments"
import { useSession } from "next-auth/react"
import axios from "axios"

function AlbumReviews({reviews : initialReviews}: {reviews: ReviewWithAuthor[]}) {

    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]); 

    const [reviews, setReviews] = useState(initialReviews);

    const { data: session, status} = useSession();

    const handleDeleteReview = async (reviewId: number) => {
        try {
            const response = await axios.delete(`/api/v2/reviews/${reviewId}`);
            console.log(response.data);
            setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
        } catch (error) {
            console.log("Error deleting: ", error);
        }
    }

    return (
        <VStack align="stretch">
            {reviews.map((review) => (
                <Card key={review.id} maxW={"80ch"} bgColor="whiteAlpha.200">
                    <CardHeader>
                        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                            <Avatar src={review.author.image ?? undefined}></Avatar>
                            <Box>
                                <Heading size="md">
                                    {review.author.name} rated it{" "}
                                    {review.rating / 10}/10
                                </Heading>
                                <Text>
                                    Date published:{" "}
                                    {new Date(
                                        review.datePublished
                                    ).toDateString()}
                                </Text>
                            </Box>
                            {session?.user?.name == review.author.name && (<Button size="sm" colorScheme="red" onClick={() => handleDeleteReview(review.id)}>
                                Delete
                            </Button>)}
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        {review.content.length !== 0 && (
                            <Text>{review.content}</Text>
                        )}
                        <ReviewComments reviewId={review.id} />
                    </CardBody>
                </Card>
            ))}
        </VStack>
    )
}

export default AlbumReviews
