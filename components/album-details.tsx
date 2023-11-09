import React from "react"
import { Box, Text, Image, VStack, Center } from "@chakra-ui/react"
import { Album } from "../types/Album"

interface AlbumDetailsProps {
    album: Album
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ album }) => {
    return (
        <Box>
            <Image
                src={album.image}
                alt={album.name}
                boxSize="200px"
                objectFit="cover"
                boxShadow="lg"
            />
            <Text fontSize="xl" fontWeight="bold">
                {album.name}
            </Text>
            <Text fontSize="lg">
                Artists: {album.artists.map((artist) => artist.name).join(", ")}
            </Text>
            <Text>Release Date: {album.release_date}</Text>
            <Text>Type: {album.type}</Text>
        </Box>
    )
}

export default AlbumDetails
