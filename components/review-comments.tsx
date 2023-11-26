import React, { useEffect } from "react";
import { Button, Textarea, VStack, CloseButton, Box, Text, Divider } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useSession} from "next-auth/react";
import { ReviewCommentWithAuthor } from "pages/api/v2/reviews/[id]/comments";

export default function ReviewComments({reviewId}: {reviewId: number}) {
    const { data: session, status} = useSession();
    const [commentBox, showCommentBox] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<any>([]);

    useEffect(() => {
        fetchComments();
    }, [reviewId]); 

    const handleCommentBox = () => {
        showCommentBox(true);
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/v2/reviews/${reviewId}/comments`);
            console.log(response.data);
            setComments(response.data.data.comments);
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    const handleDeleteComment = async (commentId: string) => {
        try {
            await axios.delete(`/api/v2/reviews/${reviewId}/comments/${commentId}`);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleSubmitComment = async() => {
        try{
            const response = await axios.post(`/api/v2/reviews/${reviewId}/comments`, {
                content: comment
            }).then((response) => {
                console.log(response.data);
            })
            .catch(() => {console.log("error")})
        } catch (error) {
            console.log("Error: ", error);
        }
        showCommentBox(false);
        setComment("");
        fetchComments();
    };

    const handleCancelComment = () => {
        showCommentBox(false);
        setComment("");
    };

    return (
        <details>
            <summary>Comments</summary>

            <Box my={4} overflowY="auto" maxHeight="200px">
                {comments.map((comment: ReviewCommentWithAuthor) => (
                    <Box key={comment.id} p={2} border="1px" rounded="md" borderColor="gray.200" m={5}>
                        <Text fontWeight="bold">{comment.author.name}</Text>
                        <Text>{comment.content}</Text>
                        <Text fontSize="sm" color="gray.500">
                        {new Date(comment.datePublished).toLocaleString()}
                        </Text>
                        <Divider my={2} />
                        {session?.user?.name == comment.author.name && (<Button size="sm" colorScheme="red" onClick={() => handleDeleteComment(String(comment.id))}>
                            Delete
                        </Button>)}
                    </Box>
                ))}
            </Box>
            {!commentBox ? (<Button onClick={handleCommentBox}>Leave a Comment...</Button>
            ) : (
                <VStack align="stretch" spacing={4}>
                    <CloseButton
                        position="absolute"
                        right={1}
                        top={1}
                        onClick={handleCancelComment}
                    />
                    <Textarea
                        placeholder="Type your comment here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleSubmitComment}>Submit</Button>
                </VStack>
            )}
        </details>
    )
}