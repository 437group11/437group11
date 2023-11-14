import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    Text,
    VStack
} from "@chakra-ui/react"
import React from "react"
import { ReviewWithAuthor } from "../pages/api/v2/albums/[spotifyId]/reviews"
import ProfilePicture from "./profile-picture"
import ReviewComments from "./review-comments"

function AlbumReviews({reviews}: {reviews: ReviewWithAuthor[]}) {
    return (
        <VStack align="stretch">
            {reviews.map((review) => (
                <Card maxW={"80ch"} bgColor="whiteAlpha.200">
                    <CardHeader>
                        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                            <ProfilePicture user={review.author}/>

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
