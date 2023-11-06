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
    SliderThumb, ModalHeader, Textarea, Button, GridItem, Heading, useToast
} from "@chakra-ui/react";
import { getServerSession } from "next-auth"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { authOptions } from "./api/auth/[...nextauth]"

const MIN_RATING = 0
const MAX_RATING = 10
const DEFAULT_RATING = (MIN_RATING + MAX_RATING) / 2


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    )

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }
    
    // Must reassign to a different variable!!
    // https://stackoverflow.com/a/75793417
    // https://stackoverflow.com/questions/70092844/
    const sessionProp = session
    return {
        props: {
            sessionProp,
        },
    }
}

export default function Feed({sessionProp}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    console.log(sessionProp)
    const [formData, setFormData] = useState({
        albumId: '',
        content: '',
        rating: DEFAULT_RATING,
        authorId: 0,
    });

    const [followers, setFollowers] = useState<string[]>();
    const [reviews, setReviews] = useState<UserReviews>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usernames, setUsernames] = useState(new Map<string, string>());
    const [followerImages, setFollowerImages] = useState(new Map<string, string>());

    const [searchReturn, setSearchReturn] = useState(new Map<string, string>());
    const [searchImages, setSearchImages] = useState(new Map<string, string>());

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchData = e.target.value;
        console.log(searchData);
        requestSearch(searchData, sessionProp!.spotifyToken!)
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

    // const handleSubmitReview = async (e: any) => {
    //     e.preventDefault();
    //     const intRating : number = Math.round(formData.rating * 10);
    //     try {
    //         const response = await fetch(`/api/v2/albums/${formData.albumId}/reviews`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type' : 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 content: formData.content, 
    //                 rating: intRating 
    //             }),
    //         });
    //         if (response.ok){
    //             setFormData({ ...formData, content: "", rating : DEFAULT_RATING});
    //         }
    //     } catch (error) {
    //         console.error('Error submitting review: ', error);
    //     }
    //     setIsModalOpen(false);
    // };

    const handleSubmitReview = async (e: any) : Promise<any> => {
        e.preventDefault();
        const intRating: number = Math.round(formData.rating * 10);
      
        return new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(`/api/v2/albums/${formData.albumId}/reviews`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                content: formData.content,
                rating: intRating,
              }),
            });
      
            if (response.ok) {
              setFormData({ ...formData, content: '', rating: DEFAULT_RATING });
              resolve(undefined);
            } else {
              reject(new Error('Failed to submit review')); 
            }
          } catch (error) {
            console.error('Error submitting review: ', error);
            reject(error);
          } finally {
            setIsModalOpen(false);
          }
        });
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
            const response = await fetch(`/api/v2/users/${sessionProp?.user?.id}/following`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok){
                const currUsernames = new Map<string, string>();
                const currImages = new Map<string, string>();
                const data = await response.json();
                const followerIds = data.data.following.map((follower: { id: number }) => follower.id);
                const followerUsernames = data.data.following.map((follower: { name: string}) => follower.name);
                const followerImages = data.data.following.map((follower: {image: string}) => follower.image);
                console.log("next")
                console.log(data.data.following)
                for (let i=0; i < followerIds.length; i++){
                    currUsernames.set(followerIds[i], followerUsernames[i]);
                    currImages.set(followerIds[i],followerImages[i]);
                }
                console.log(currUsernames);
                setFollowers(followerIds);
                setUsernames(currUsernames);
                setFollowerImages(currImages);
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
   
    const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
          await toast.promise(handleSubmitReview(e), {
            success: { title: 'Review Submitted', description: 'You can view your review on your profile!' },
            error: { title: 'Error', description: 'Failed to submit review. Please try again later.' },
            loading: { title: 'Submitting...', description: 'Please wait while your review is being submitted.' },
          });
        } catch (error) {
          console.error('Error submitting review: ', error);
        }
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

    let feedContent = reviews.length == 0
        ? (
            <Text p={5} fontSize={"lg"}>
                Your feed is looking a little empty...
                Follow some users, and their reviews will show up here.
            </Text>
        )
        : (
            <SimpleGrid spacing='20px' columns = {4} p={5}>
                {reviews.map((review, index) => (
                <Box key={index}>
                    <AlbumCard
                        key={index}
                        authorImage={followerImages.get(review.authorId)}
                        author={usernames.get(review.authorId)}
                        image={review.album.imageUrl}
                        title={review.album.name}
                        description={review.content}
                        rating={review.rating}
                    />
                </Box>
                ))}
            </SimpleGrid>
        )
    const toast = useToast()
    return (
        <RootLayout>
            <Container color={"white"} centerContent mt={0} p={5}>
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
                    borderRadius="10px"
                    zIndex="99">
                    {Array.from(searchReturn).map(([id, name]) => (
                        <ListItem 
                        bgColor={"whiteAlpha.300"}
                        _hover={{bg: "blue", color: "white"}} 
                        display="flex" 
                        key={id} 
                        p={2}
                        alignItems="center"
                        cursor="pointer" 
                        textDecoration="none"
                        onClick={() => reviewModule(id)}>
                            <Img id="albumArt" flex="1" borderRadius="5px" maxW="60px" src={searchImages.get(id)}/>
                            <Text fontSize="l" fontWeight="bold" flex="2" borderRadius="0" ml={5} justifyContent="center">
                                {name}
                            </Text>
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
                  <SliderFilledTrack/>
                </SliderTrack>
                <SliderThumb fontSize="sm" boxSize={6} color={"black"}>
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
                <Button type="submit"
                onClick={handleButtonClick}/*() =>
                    toast({
                      title: 'Review Submitted.',
                      description: "Your reviews are stored in your profile.",
                      status: 'success',
                      duration: 900,
                      isClosable: true,
                    })
                  }*/>
                    Submit
                </Button>
              </Center>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
        <Box className="container mx-auto" bg="#2A2525" borderRadius="10px">
            <Heading p={5} color="white">Feed</Heading>
            {feedContent}
        </Box>
     
    </RootLayout>
    )
}
