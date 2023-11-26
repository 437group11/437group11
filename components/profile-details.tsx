import { AddIcon, CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    Container,
    Editable,
    EditableInput,
    EditablePreview,
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
    useEditableControls,
    VStack
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import EditableBio from "./editable-bio";

function EditableControls ({onSave}) {
    const [editing, setEditing] = useState(false);

    const handleSaveClick = () => {
        onSave(); // Call the function to save the bio
        setEditing(false);
    };

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleCancelClick = () => {
        setEditing(false);
    };

    return editing ? (
    <ButtonGroup justifyContent='center' size='sm'>
        <IconButton icon={<CheckIcon />} onClick={handleSaveClick} aria-label={""}/>
        <IconButton icon={<CloseIcon />} onClick={handleSaveClick} aria-label={""}/>
    </ButtonGroup>
    ) : (
    <Flex justifyContent='center'>
        <IconButton aria-label={""} size='sm' icon={<EditIcon />} onClick={handleEditClick} />
    </Flex>
    )
}

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

    useEffect(() => {
        getBio();
        getFavoriteArtists();
        getFavoriteGenres();
    }, []);

    const getFavoriteArtists = async () => {
        const response = await fetch(`/api/v2/users/${profileId}/favorite-artists`);
        if (response.ok){
            const data = await response.json();
            setFavoriteArtists(data.data.favoriteArtists);
        }
    }

    const addFavoriteArtist = async() => {
        try {
            const response = await fetch(`/api/v2/users/${session?.user?.id}/favorite-artists`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    "op" : "add",
                    "value": newArtist
                })
            });
            getFavoriteArtists();
            console.log(response);
        } catch (error) {
            console.error("Error adding new favorite artist: ", error);
        }
        setAddingFavoriteArtist(false);
    }

    const removeFavoriteArtist = async(artist: string) => {
        try {
            const response = await fetch(`/api/v2/users/${session?.user?.id}/favorite-artists`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    "op" : "remove",
                    "value": artist
                })
            });
            getFavoriteArtists();
        } catch (error) {
            console.error("Error adding new favorite artist: ", error);
        }
    }

    const getFavoriteGenres = async () => {
        const response = await fetch(`/api/v2/users/${profileId}/favorite-genres`);
        if (response.ok){
            const data = await response.json();
            setFavoriteGenres(data.data.favoriteGenres);
        }
    }

    const addFavoriteGenre = async() => {
        try {
            const response = await fetch(`/api/v2/users/${session?.user?.id}/favorite-genres`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    "op" : "add",
                    "value": newGenre
                })
            });
            console.log(newGenre);
            console.log(response);
            getFavoriteGenres();
        } catch (error) {
            console.error("Error adding new favorite genre: ", error);
        }
        setAddingFavoriteGenre(false);
    }

    const removeFavoriteGenre = async(genre: string) => {
        try {
            const response = await fetch(`/api/v2/users/${session?.user?.id}/favorite-genres`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    "op" : "remove",
                    "value": genre
                })
            });
            console.log(response);
            getFavoriteGenres();
        } catch (error) {
            console.error("Error adding new favorite genre: ", error);
        }
    }

    const getBio = async() => {
        const response = await fetch(`/api/v2/users/${profileId}/bio`);
        if (response.ok){
            const data = await response.json();
            console.log(data);
            setBio(data.data.bio);
        }
    }
    const addBio = async(bio : string) => {
        const response = await fetch(`/api/v2/users/${session?.user?.id}/bio`, {
            method: "PUT",
            body: newBio
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
                            <HStack>
                                <Button w={100} onClick={handleSubmitBio}>Submit</Button>
                                <Button w={100} colorScheme={"red"} onClick={() => {setAddingBio(false)}}>Cancel</Button>
                            </HStack>
                        </VStack>
                    </Box>
                ) : (
                    <Button onClick={() => setAddingBio(true)}>Add Bio &nbsp;+</Button>
                )}
            </Box>
        ) : (
            <Editable defaultValue={bio}>
                <EditablePreview />
                <Input onChange={(e) => setNewBio(e.target.value)} as={EditableInput}/>
                <EditableControls onSave={handleSubmitBio}/>
            </Editable>
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
                    <Button w={100} colorScheme={"red"} onClick={() => {setAddingFavoriteArtist(false)}}>Cancel</Button>
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
                    <Button w={100} colorScheme={"red"} onClick={() => {setAddingFavoriteGenre(false)}}>Cancel</Button>
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
