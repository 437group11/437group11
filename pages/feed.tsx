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
    SliderThumb, ModalHeader, Textarea, Button, GridItem, Heading, useToast, border
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

    const router = useRouter();

    const [followers, setFollowers] = useState<string[]>();
    const [reviews, setReviews] = useState<UserReviews>([]);
    const [usernames, setUsernames] = useState(new Map<string, string>());
    const [followerImages, setFollowerImages] = useState(new Map<string, string>());

    const [searchReturn, setSearchReturn] = useState(new Map<string, string>());
    const [searchImages, setSearchImages] = useState(new Map<string, string>());

    const [isSearchFocused, setSearchFocused] = useState(false);

    const handleSearchMouseDown = () => {
      setSearchFocused(true);
    };

    const handleSearchBlur = () => {
      setTimeout(() => {
        setSearchFocused(false);
      }, 300);
    };

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
        reviews.sort((a, b) => {
            const dateA = new Date(a.datePublished);
            const dateB = new Date(b.datePublished);

            if (dateA.toISOString() > dateB.toISOString()) {
                return -1;
            } else if (dateA.toISOString() < dateB.toISOString()) {
                return 1;
            }

            return dateA.getTime() - dateB.getTime();
        });
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

    let feedContent = reviews.length == 0
        ? (
            <Text p={5} fontSize={"lg"}>
                Your feed is looking a little empty...
                Follow some users, and their reviews will show up here.
            </Text>
        )
        : (
            <SimpleGrid spacing='20px' columns = {[1, 2, 3, 4]} p={5} mx={5}>
                {reviews.map((review, index) => (
                    <Box key={index} 
                        onClick={() => {router.push(`/album/${review.album.spotifyId}`)}}>
                            <Box key={index} _hover={{ boxShadow: 'dark-lg'}}>
                                <AlbumCard
                                key={index}
                                authorImage={followerImages.get(review.authorId)}
                                author={usernames.get(review.authorId)}
                                image={review.album.imageUrl}
                                title={review.album.name}
                                artist={(review.album?.artists as any).map((artist: { name: string }) => artist.name).join(", ")}
                                description={review.content}
                                rating={review.rating}
                                />
                            </Box>
                    </Box>
                ))}
            </SimpleGrid>
        )
    const toast = useToast()
    return (
        <RootLayout>
            <Container centerContent my={5} p={5} position="relative">
              <Box 
                width="full"
                zIndex="20"
                position="absolute"
                top={0}
                mx={5}
                borderRadius="10px"
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)"
                onMouseDown={handleSearchMouseDown}
                onBlur={handleSearchBlur}>
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
                    bgColor={"#555050"}
                    style={{
                      display: isSearchFocused ? "block" : "none"
                    }}>
                    {Array.from(searchReturn).map(([id, name]) => (
                        <ListItem 
                        _hover={{bg: "blue", color: "white"}} 
                        display="flex" 
                        key={id} 
                        p={2}
                        borderRadius="10px"
                        alignItems="center"
                        cursor="pointer" 
                        textDecoration="none"
                        onClick={() => {router.push(`/album/${id}`)}}>
                            <Img id="albumArt" flex="1" borderRadius="5px" maxW="60px" src={searchImages.get(id)}/>
                            <Text fontSize="l" fontWeight="bold" flex="2" borderRadius="0" ml={5} justifyContent="center">
                                {name}
                            </Text>
                        </ListItem>
                    ))}
                </UnorderedList>
              </Box>
            </Container>
        <Box className="container mx-auto" bgColor={"whiteAlpha.100"} mt={"50px"} borderRadius="15px">
            <Heading p={5} color="white">Feed</Heading>
            {feedContent}
        </Box>
     
    </RootLayout>
    )
}
