import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    Heading,
    HStack,
    IconButton,
    Img,
    Input,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Progress,
    Select,
    SimpleGrid,
    Tag,
    TagCloseButton,
    TagLabel,
    TagRightIcon,
    Text,
    Textarea,
    UnorderedList,
    VStack
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function ProfileDetails({profileId}: {profileId: string[]}) {
    const {data: session, status} = useSession();
    const [favoriteArtists, setFavoriteArtists] = useState<string[]>([]);
    const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
    const [bio, setBio] = useState<string>("");
    const [addingBio, setAddingBio] = useState(false);
    const [newBio, setNewBio] = useState("");
    const [addingFavoriteArtist, setAddingFavoriteArtist] = useState(false);
    const [addingFavoriteGenre, setAddingFavoriteGenre] = useState(false);
    const [newArtist, setNewArtist] = useState("");
    const [newGenre, setNewGenre] = useState("");

    const isUser : boolean = session?.user?.id === profileId;

    const handleSubmitBio = () => {
        addBio(newBio);
        setAddingBio(false);
    };

    const getFavoriteArtists = async () => {
        const response = await axios.get(`/api/v2/users/${session?.user?.id}/favorite-artists`);
        console.log(response);
    }

    const addFavoriteArtist = async() => {
        try {
            const response = await axios.post(`/api/v2/users/${session?.user?.id}/favorite-artists`, {
                artist: newArtist
            });
            console.log(response);
        } catch (error) {
            console.error("Error adding new favorite artist: ", error);
        }
        setAddingFavoriteArtist(false);
    }
    const removeFavoriteArtist = async(artist: string) => {
        try { //waiting for backend to see how to do this
            const response = await axios.delete(`/api/v2/users/${session?.user?.id}/favorite-artists`);
            console.log(response);
        } catch (error) {
            console.error("Error adding new favorite artist: ", error);
        }
    }

    const getFavoriteGenres = async () => {
        const response = await axios.get(`/api/v2/users/${session?.user?.id}/favorite-genres`);
        console.log(response);
    }

    const addFavoriteGenre = async() => {
        try {
            const response = await axios.post(`/api/v2/users/${session?.user?.id}/favorite-genres`, {
                genre: newGenre
            });
            console.log(response);
        } catch (error) {
            console.error("Error adding new favorite genre: ", error);
        }
        setAddingFavoriteGenre(false);
    }

    const removeFavoriteGenre = async(artist: string) => {
        try { //waiting for backend to see how to do this
            const response = await axios.delete(`/api/v2/users/${session?.user?.id}/favorite-genres`);
            console.log(response);
        } catch (error) {
            console.error("Error adding new favorite artist: ", error);
        }
    }

    const getBio = async() => {
        const response = await axios.get(`/api/v2/users/${session?.user?.id}/bio`);
        console.log(response);
    }
    const addBio = async(bio : string) => {
        const response = await axios.post(`/api/v2/users/${session?.user?.id}/bio`, {
            bio: bio
        });
        console.log(response);
        setBio(bio);
    }

    return (
        <>
        <Box my={5}>
        {bio === "" && isUser ? (
            <Box>
                {addingBio ? (
                    <Box>
                        <VStack align={"left"}>
                            <Textarea 
                                value={newBio}
                                maxW={"50%"}
                                onChange={(e) => setNewBio(e.target.value)}
                                placeholder="Enter your bio..."
                            />
                            <Button w={100} onClick={handleSubmitBio}>Submit</Button>
                        </VStack>
                    </Box>
                ) : (
                    <Button onClick={() => setAddingBio(true)}>Add Bio &nbsp;+</Button>
                )}
            </Box>
        ) : (
            <Text>{bio}</Text>
        )}
        </Box>
        <HStack my={5} spacing={4}>
            {favoriteArtists.length === 0 && !addingFavoriteArtist && isUser ? (
                <Button onClick={() => setAddingFavoriteArtist(true)}>Add Favorite Artist</Button>
            ) : null}

            {favoriteArtists.map((artist) => (
                <Tag size={'lg'}>
                    <TagLabel>{artist}</TagLabel>
                    {isUser ? (
                        <TagCloseButton onClick={() => removeFavoriteArtist(artist)}/>
                    ) : null}
                </Tag>
            ))}
    
            {addingFavoriteArtist ? (
                <>
                    <Input
                        onChange={(e) => setNewArtist(e.target.value)}
                        w={200}
                    />
                    <Button onClick={() => addFavoriteArtist()}>Add</Button>
                </>
            ) : (
                <>
                {isUser ? (
                    <Button size={'sm'} onClick={() => setAddingFavoriteArtist(true)}><AddIcon/></Button>
                ) : null}
                </>
            )}
        </HStack>
        <HStack my={5} spacing={4}>
            {favoriteGenres.length === 0 && !addingFavoriteGenre && isUser ? (
                <Button onClick={() => setAddingFavoriteGenre(true)}>Add Favorite Genre</Button>
            ) : null}

            {favoriteGenres.map((genre) => (
                <Tag size={'lg'}>
                    <TagLabel>{genre}</TagLabel>
                    {isUser ? (
                        <TagCloseButton onClick={() => removeFavoriteGenre(genre)}/>
                    ) : null}
                </Tag>
            ))}

            {addingFavoriteGenre ? (
                <>
                    <Input
                        onChange={(e) => setNewGenre(e.target.value)}
                        w={200}
                    />
                    <Button onClick={() => addFavoriteGenre()}>Add</Button>
                </>
            ) : (
                <>
                {isUser ? (
                    <Button size={'sm'} onClick={() => setAddingFavoriteGenre(true)}><AddIcon/></Button>
                ) : null}
                </>
            )}
        </HStack>
        </>
    );
}
