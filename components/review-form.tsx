import { Button, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from "@chakra-ui/react"
import React from "react"

export default function ReviewForm() {
    return (
        <form>
            <FormControl>
                <FormLabel>Rating 1-10</FormLabel>
                <NumberInput max={10} min={0} step={0.1}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl>
                <FormLabel>Review text</FormLabel>
                <Textarea maxLength={191}></Textarea>
            </FormControl>

            <Button>Add a review</Button>
        </form>
    )
}