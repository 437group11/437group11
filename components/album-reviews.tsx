import React from "react"
import {
    Box,
    Text,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react"
import { Review } from "@prisma/client"
import { ReviewsWithAuthors } from "../pages/api/v2/albums/[spotifyId]/reviews"
import { FormData } from "next/dist/compiled/@edge-runtime/primitives"

interface AlbumReviewsProps {
    reviews: ReviewsWithAuthors
}

const AlbumReviews: React.FC<AlbumReviewsProps> = ({ reviews }) => {
    return (
        <VStack align="stretch">
            {reviews.map((review) => (
                <Card maxW={"80ch"}>
                    <CardHeader>
                        <Heading size="md">
                            {review.author.name} rated it {review.rating / 10}/10
                        </Heading>
                        <Text>
                            Date published:{" "}
                            {new Date(review.datePublished).toDateString()}
                        </Text>
                    </CardHeader>
                    <CardBody>
                        {review.content.length !== 0 && (
                            <Text>{review.content}</Text>
                        )}
                    </CardBody>
                </Card>
            ))}
        </VStack>
    )
}

export default AlbumReviews
