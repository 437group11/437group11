import React from "react"
import { Box, Text, Image, VStack, Center, Skeleton } from "@chakra-ui/react"
import { Album } from "../types/Album"

interface AlbumDetailsProps {
    album: Album | null
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ album }) => {
    return (
        <Box>
            { /* When album is null, show skeleton */ }
            { /* !! converts to boolean: https://stackoverflow.com/questions/20093613 */ }
            <Skeleton isLoaded={!!album}>
                <Image
                    src={album?.image}
                    alt={album?.name}
                    boxSize="200px"
                    objectFit="cover"
                    boxShadow="lg"
                />

                <Text fontSize="xl" fontWeight="bold">
                    {album?.name}
                </Text>
                <Text fontSize="lg">
                    Artists: {album?.artists.map((artist) => artist.name).join(", ")}
                </Text>
                <Text>Release Date: {album?.release_date}</Text>
                <Text>Type: {album?.type}</Text>
            </Skeleton>
        </Box>
    )
}

export default AlbumDetails
