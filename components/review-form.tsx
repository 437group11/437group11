import { Button, FormControl, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from "@chakra-ui/react"
import React from "react"

export default function ReviewForm() {
    return (
        <>
            <FormControl>
                <NumberInput max={10} min={0} step={0.1}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                
                <Textarea maxLength={191}></Textarea>
            </FormControl>

            <Button>Add a review</Button>
        </>
    )
}