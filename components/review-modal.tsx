// ReviewModal.tsx
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Select,
  useToast,
  Image,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import axios from "axios";
import { Album } from "@prisma/client";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmit: () => void;
  album: Album | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmit,
  album,
}) => {
  const toast = useToast();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  console.log(album);  
  async function handleSubmit() {

    try {
        console.log(`album: ${album?.id}`)
        console.log(`rating: ${rating}`)
        console.log(`rating: ${reviewText}`)
        const promise = axios.post(
            `/api/v2/albums/${album?.id}/reviews`,
            {
                rating: (rating ?? ""),
                content: reviewText
            }
        )

      toast({
        title: "Review submitted",
        description: "Your review is visible on your profile.",
        status: "success",
      });

      // Trigger the parent component to update reviews
      onReviewSubmit();

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);

      toast({
        title: "Error",
        description: "Failed to submit review. Please try again later.",
        status: "error",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Prevent form submission, handle it through custom function */}
          <ModalHeader>Leave a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box alignContent={"center"}>
                <Image
                    src={album?.image}
                    alt={album?.name}
                    boxSize="400px"
                    objectFit="cover"
                    boxShadow="lg"
                    rounded="md"
                    my={5}
                />
                <Textarea
                rounded="md"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                size="sm"
                />
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} my={5}>
                    {rating || "Select a rating (1-10)"}
                    </MenuButton>
                    <MenuList>
                    {[...Array(10).keys()].map((i) => (
                        <MenuItem
                        key={i + 1}
                        value={i + 1}
                        onClick={() => setRating(i + 1)}
                        >
                            {i + 1}
                        </MenuItem>
                    ))}
                    </MenuList>
                </Menu>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit Review
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
