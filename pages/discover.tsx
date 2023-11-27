import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, SimpleGrid, Heading, HStack } from '@chakra-ui/react';
import DiscoverAlbumCard from '../components/discover-album-card';
import { Album } from 'types/Album';
import { useSession } from 'next-auth/react';
import { UserReviews } from './api/v2/users/[id]/reviews';
import { requestRecommended } from './api/request-recommended';
import { requestNew } from './api/request-new';
import RootLayout from 'components/root-layout';
import { useRouter } from 'next/router';


const Discover: React.FC = () => {
  const {data: session, status} = useSession();
  const [newAlbums, setNewAlbums] = useState<Album[]>([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState<Album[]>([]);
  const router = useRouter();

  const getNewAlbums = async () => {
    try {
      const albums = await requestNew(session?.spotifyToken);
      setNewAlbums(albums);
      console.log(newAlbums);
    } catch (error) {
      console.error("Error: ", error);
    }
  };


  const getRecommendedAlbums = async () => {
    try {
      const response = await fetch(`/api/v2/users/${session?.user.id}/reviews?sort=${'rating:desc'}`);
      if (response.ok) {
        const data = await response.json();
        const artistsIds = "";
        console.log(session?.user.id);
  
        if (data.status === 'success') {
          const reviews: UserReviews = data.data.reviews;
          const currAlbums: Album[] = []
          reviews.forEach((review) => {
            currAlbums.push(review.album);
          });
          console.log(currAlbums);
  
          const artistIdsList = currAlbums
            .slice(0, 5)
            .map((album) => {
              const artists = album.artists;
  
              if (artists && artists.length > 0) {
                const firstArtistId = artists[0].id;
                return firstArtistId;
              }
              return null;
            })
            .filter((id) => id !== null)
            .join(',');
  
          console.log(artistIdsList);

          const albums = await requestRecommended(artistIdsList, session?.spotifyToken);
          setRecommendedAlbums(albums); // Set the state with the fetched albums
          console.log(recommendedAlbums);
        }

      } else {
        console.log("data retrieval failed");
      }
    } catch (error) {
      console.error('Error fetching recommended albums:', error);
    }
  };

  useEffect(() => {
    getNewAlbums();
    getRecommendedAlbums();
  }, []);

  return (
    <RootLayout>
      <Box p={4}>
        {/* New Albums Feed */}
        <Flex direction="column" mb={4}>
        <Box className="container mx-auto" bgColor={"whiteAlpha.100"} mt={"50px"} borderRadius="15px">
          <Heading p={5} color="white">New Albums</Heading>
          <HStack
              overflowX="auto"     
              whiteSpace="nowrap"
              p={5} mx={5}>
            {newAlbums.map((album) => (
              <Box _hover={{ boxShadow: 'dark-lg' }} minW={300} onClick={() => router.push(`/album/${album.id}`)}>
                <DiscoverAlbumCard 
                image = {album.image} 
                title = {album.name}
                artist = {album.artists[0]}/>
              </Box>
            ))}
          </HStack>
          </Box>
        </Flex>
        {/* Recommended Albums Feed */}
        <Flex direction="column" overflowX="auto">
          <Box className="container mx-auto" bgColor={"whiteAlpha.100"} mt={"50px"} borderRadius="15px">
          <Heading p={5} color="white">Recommended Albums</Heading>
            <HStack spacing="4"
              overflowX="auto"     
              whiteSpace="nowrap"
              p={5} mx={5}>
              {recommendedAlbums && Array.isArray(recommendedAlbums) && recommendedAlbums.length !== 0 ? (
                recommendedAlbums.map((album) => (
                  <Box _hover={{ boxShadow: 'dark-lg' }} minW={300} onClick={() => router.push(`/album/${album.id}`)}>
                    <DiscoverAlbumCard 
                      image={album.image} 
                      title={album.name}
                      artist={album.artists[0]}
                    />
                  </Box>
                ))
              ) : (
                <Text p={5} fontSize={"lg"}>
                  Nothing to recommended yet...
                  Leave some reviews and we'll try to recommend you something.
              </Text>
              )}
            </HStack>
          </Box>
        </Flex>
      </Box>
    </RootLayout>
  );
};

export default Discover;
