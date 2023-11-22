import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    VStack
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { ReviewWithAuthor } from "../pages/api/v2/albums/[spotifyId]/reviews"
import ProfilePicture from "./profile-picture"
import ReviewComments from "./review-comments"
import { useSession } from "next-auth/react"
import axios from "axios"

function AlbumReviews({reviews : initialReviews}: {reviews: ReviewWithAuthor[]}) {

    const [reviews, setReviews] = useState(initialReviews);
    const { data: session, status} = useSession();
    const [editingReview, setEditingReview] = useState<ReviewWithAuthor | null>(null);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
   
    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]); 

    const handleDeleteReview = async (reviewId: number) => {
        try {
            const response = await axios.delete(`/api/v2/reviews/${reviewId}`);
            console.log(response.data);
            setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
        } catch (error) {
            console.log("Error deleting: ", error);
        }
    }

    const handleEditReview = (review: ReviewWithAuthor) => {
        setEditingReview(review);
        setIsEditingModalOpen(true);
    };

    const handleEditButton = (review: ReviewWithAuthor) => {
        setEditingReview(review);
        setIsEditingModalOpen(true);
    }

    const handleSubmitReview = async () => {
        try {
            const response = axios.post(`/api/v2/albums/${editingReview?.albumId}/reviews`, {
                rating: editingReview?.rating,
                content: editingReview?.content
            })
            console.log(response);
            setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.id === editingReview?.id
                    ? {
                        ...review,
                        rating: editingReview?.rating,
                        content: editingReview?.content,
                    }
                    : review
                )
            );
            setIsEditingModalOpen(false);
            setEditingReview(null);
        } catch (error) {
        }
    };

    const reviewCards = (<>
        {reviews.map((review) => (
            <Card key={review.id} maxW={"80ch"} bgColor="whiteAlpha.200">
                <CardHeader>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <ProfilePicture user={review.author}/>

                        <Box>
                            <Heading size="md">
                                {review.author.name} rated it{" "}
                                {review.rating}/10
                            </Heading>
                            <Text>
                                Date published:{" "}
                                {new Date(
                                    review.datePublished
                                ).toDateString()}
                            </Text>
                        </Box>
                        {session?.user?.name == review.author.name && (
                        <>
                            <Button size="sm" colorScheme="blue" onClick={() => handleEditButton(review)}>
                                Edit
                            </Button>
                            <Button size="sm" colorScheme="red" onClick={() => handleDeleteReview(review.id)}>
                                Delete
                            </Button>
                        </>
                        )}
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
    </>)

    const editReviewModal = (
        <Modal isOpen={isEditingModalOpen} onClose={() => setIsEditingModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Review</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Textarea
                        value={editingReview?.content}
                        onChange={(e) => setEditingReview((prevReview) => ({
                            ...prevReview!,
                            content: e.target.value,
                        }))}
                        maxLength={8000}
                        placeholder="Edit your review content"
                    />
                    <input
                        type="number"
                        value={editingReview?.rating}
                        onChange={(e) => setEditingReview((prevReview) => ({
                            ...prevReview!,
                            rating: Number(e.target.value),
                        }))}
                        placeholder="Edit your rating"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmitReview}>
                        Submit
                    </Button>
                    <Button onClick={() => setIsEditingModalOpen(false)}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

    return (
        <Flex flexDir={"column"} gap={5}>
            <Heading size={"lg"}>
                {
                    reviews.length === 0
                    ? "No ratings yet"
                    : `Average rating: ${reviews.map((review) => review.rating).reduce((a, b) => a + b) / reviews.length}/10`
                }    
            </Heading>
            <VStack align="stretch">
                {reviewCards}
            </VStack>
            {editReviewModal}
        </Flex>
    )
}

export default AlbumReviews
