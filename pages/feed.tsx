import RootLayout from "../components/root-layout";
import AlbumCard from "components/album-card";
import React, {ChangeEvent, useEffect, useState} from "react";
import {requestSearch} from "./api/request-search";
import { stringify } from "querystring";
import { constrainedMemory } from "process";
import { requestAlbum } from "./api/request-album";
//import reviewModal from "./review"; [DO NOT USE]
import { useRouter } from "next/router";
//import Button from "../components/button";
import { Album } from "types/Album";
import { Artist } from "types/Artist";
import { UserReviews } from "./api/v2/users/[id]/reviews";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
    Input, Box, UnorderedList, ListItem, Link, Container, SimpleGrid,
    Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
    ModalFooter, Img, Text, Center, Slider, SliderTrack, SliderFilledTrack,
    SliderThumb, ModalHeader, Textarea, Button
} from "@chakra-ui/react";

const MIN_RATING = 0
const MAX_RATING = 10
const DEFAULT_RATING = (MIN_RATING + MAX_RATING) / 2

export default function Feed() {
    const { data: session, status } = useSession();

    console.log()
    const [formData, setFormData] = useState({
        albumId: '',
        content: '',
        rating: DEFAULT_RATING,
        authorId: 0,
    });

    const [followers, setFollowers] = useState<number[]>();
    const [reviews, setReviews] = useState<UserReviews>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [searchReturn, setSearchReturn] = useState(new Map<string, string>());
    const [searchImages, setSearchImages] = useState(new Map<string, string>());

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchData = e.target.value;
        console.log(searchData);
        requestSearch(searchData, session!.spotifyToken!)
        .then((data) => { //------
            const currSearchReturn = new Map<string, string>();
            const currSearchImages = new Map<string, string>();
            searchReturn.clear();
            for (let i = 0; i < 10; i++){
                let album = data.albums.items[i];
                searchReturn.set(album.id, album.name);
                console.log(searchReturn);
                currSearchReturn.set(album.id, album.name);
                currSearchImages.set(album.id, album.images[0].url);
                //console.log(currSearchImages.get(album.id));
            }
            setSearchReturn(currSearchReturn);
            setSearchImages(currSearchImages);
        }) //-------
        .catch((error) => {
            console.error('Error searching', error);
        }) 
        
    };

    const handleSubmitReview = async (e: any) => {
        e.preventDefault();
        const intRating : number = Math.round(formData.rating * 10);
        try {
            const response = await fetch(`/api/v2/albums/${formData.albumId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    content: formData.content, 
                    rating: intRating 
                }),
            });
            if (response.ok){
                alert("Your review has been saved.");
                setFormData({ ...formData, content: "", rating : DEFAULT_RATING});
            }
        } catch (error) {
            console.error('Error submitting review: ', error);
        }
        setIsModalOpen(false);
    };

    function reviewModule(id: string){
        setFormData({ ...formData, albumId: id});
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        // Close the modal when clicking away from the review
        setIsModalOpen(false);
    };

    const getFollowers = async () => {
        try {
            const response = await fetch(`/api/v2/users/${session?.user?.id}/following`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok){
                const data = await response.json();
                const followerIds = data.data.following.map((follower: { id: number }) => follower.id);
                setFollowers(followerIds);
                return followerIds;
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };
    
    const getFeed = async () => {
        const reviews: UserReviews = [];
    
        if (followers) {
            for (const follower of followers) {
                try {
                    const response = await fetch(`/api/v2/users/${follower}/reviews`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === 'success') {
                            reviews.push(...data.data.reviews);
                        }
                    } else {
                        console.log("Data retrieval failed");
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }
        return reviews;
    };
   
    useEffect(() => {
        getFeed()
            .then((reviews) => {
                setReviews(reviews);
            })
            .catch();
    }, [followers]);

    useEffect(() => {
        getFollowers()
        .then((followers) => {
            console.log("get followers");
            console.log(followers);
        })
        .catch();
    }, []);
    
    return (
        <RootLayout>
            <Container color={"white"} centerContent>
                <Input
                    name="search"
                    id = "search"
                    onChange={handleChange}
                    type = "text"
                    width="full"
                    color={"white"}
                    placeholder="Search for an album..."
                    size="lg"
                    p={4}
                    textAlign = "center"
                />
                <UnorderedList
                    id="results" 
                    width="full"
                    listStyleType={"none"}
                    ml={0}
                    alignItems="center"
                    textAlign="center"
                    borderRadius="10px"
                    zIndex="99">
                    {Array.from(searchReturn).map(([id, name]) => (
                        <ListItem key={id} cursor="pointer" textDecoration="none">
                            <Button _hover={{bg: "blue", color: "white"}} borderRadius="0" bgColor={"white"} width="full" onClick={() => reviewModule(id)}>
                                {name}
                            </Button>
                        </ListItem>
                    ))}
                </UnorderedList>
            </Container>
            <Modal isOpen={isModalOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text id="albumName" fontWeight="bold" fontSize="xl" mb={2} />
            <Center>
              <Img id="albumArt" borderRadius="10px" maxW="95%" mb={2} src={searchImages.get(formData.albumId)}/>
            </Center>
            <Text id="artistName" fontSize="lg" mb={4} />
            <form id="reviewForm" onSubmit={handleSubmitReview}>
              <input type="hidden" id="albumId" />
              <Slider
                id="score"
                aria-label="Rating"
                defaultValue={DEFAULT_RATING}
                min={MIN_RATING}
                max={MAX_RATING}
                onChange={(value) => setFormData({ ...formData, rating: value })}
                step={0.1}
                mb={4}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize="sm" boxSize={6}>
                  {formData.rating}
                </SliderThumb>
              </Slider>
              <Textarea
                id="review"
                placeholder="Enter your review..."
                mb={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <Center>
                <Button type="submit">
                    Submit
                </Button>
              </Center>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
            <SimpleGrid minChildWidth='120px' spacing='40px'>
                    {reviews.map((review, index) => (
                        <AlbumCard
                            key={index}
                            image={review.album.imageUrl}
                            title={review.album.name}
                            description={review.content}
                            rating={review.rating}
                        />
                    ))}
            </SimpleGrid>
        </RootLayout>
    )
}
