import { Button, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Skeleton, Textarea, useToast } from "@chakra-ui/react"
import axios from "axios"
import React, { FormEvent } from "react"

export default function ReviewForm({spotifyId, onReviewSubmit }: { spotifyId: string | null; onReviewSubmit: () => void }) {
    const toast = useToast()

    async function handleSubmitReview(event: FormEvent<HTMLFormElement>) {
        console.log("submitting review")
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const rating = Number(formData.get("rating")!)
        const intRating: number = Math.round(rating * 10);
        const promise = axios.post(
            `/api/v2/albums/${spotifyId}/reviews`,
            {
                rating: intRating,
                content: formData.get("content")
            }
        ).then(onReviewSubmit)

        toast.promise(promise, {
            success: { title: 'Review submitted', description: 'Your review is visible on your profile.' },
            error: { title: 'Error', description: 'Failed to submit review. Please try again later.' },
            loading: { title: 'Submitting...', description: 'Please wait while your review is being submitted.' },
        })
    }

    return (
        <Skeleton isLoaded={!!spotifyId}>
            <form onSubmit={handleSubmitReview}>
                <FormControl>
                    <FormLabel>Rating 1-10</FormLabel>
                    <NumberInput max={10} min={0} step={0.1} name={"rating"}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>

                <FormControl>
                    <FormLabel>Review text</FormLabel>
                    <Textarea maxLength={191} name={"content"}></Textarea>
                </FormControl>

                <Button type="submit">Submit</Button>
            </form>
        </Skeleton>
    )
}