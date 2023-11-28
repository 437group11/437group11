import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
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
import { ChevronDownIcon } from "@chakra-ui/icons"

function AlbumReviews({reviews : initialReviews}: {reviews: ReviewWithAuthor[]}) {

    const [reviews, setReviews] = useState(initialReviews);
    const { data: session, status} = useSession();
    const [editingReview, setEditingReview] = useState<ReviewWithAuthor | null>(null);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [followingUsers, setFollowingUsers] = useState<string[]>([]);


    const sessionFollowing = async () => {
        if (!session) {
            return;
        }
    
        try {
            const response = await fetch(`/api/v2/users/${session?.user?.id}/following`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.data && data.data.following) {
                    const currUsers: string[] = data.data.following.map((item: any) => item.id);
                    console.log(currUsers);
                    setFollowingUsers(currUsers);
                } else {
                    console.error('Empty or unexpected response data');
                }
            } else {
                console.error('Response not OK');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        sessionFollowing();
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

    const reviewCards = (
        <>
            {reviews
                .sort((a, b) => {
                    const aIsSessionUser = a.author.name === session?.user?.name;
                    const bIsSessionUser = b.author.name === session?.user?.name;
                    const aIsFollowed = followingUsers.includes(a.author.id);
                    const bIsFollowed = followingUsers.includes(b.author.id);
    
                    if (aIsSessionUser && !bIsSessionUser) return -1;
                    if (!aIsSessionUser && bIsSessionUser) return 1;
                    if (aIsSessionUser && bIsSessionUser) return 0;
                    if (aIsFollowed && !bIsFollowed) return -1;
                    if (!aIsFollowed && bIsFollowed) return 1;
                    return 0;
                })
                .map((review) => (
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
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} mt={3}>
                        {editingReview?.rating || "Select a rating (1-10)"}
                        </MenuButton>
                        <MenuList>
                        {[...Array(10).keys()].map((i) => (
                            <MenuItem
                            key={i + 1}
                            value={i + 1}
                            onClick={() => setEditingReview((prevReview) => ({
                                ...prevReview!,
                                rating: (i + 1),
                            }))}
                            >
                                {i + 1}
                            </MenuItem>
                        ))}
                        </MenuList>
                    </Menu>
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
                    ? "No reviews yet"
                    : `Average rating: ${(reviews.map((review) => review.rating).reduce((a, b) => a + b) / reviews.length).toFixed(2).replace(/\.?0+$/, '')}/10`
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
