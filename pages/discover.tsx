import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, SimpleGrid, Heading, HStack, useToast } from '@chakra-ui/react';
import DiscoverAlbumCard from '../components/discover-album-card';
import { Album } from 'types/Album';
import { useSession } from 'next-auth/react';
import { UserReviews } from './api/v2/users/[id]/reviews';
import { requestRecommended } from './api/request-recommended';
import { requestNew } from './api/request-new';
import RootLayout from 'components/root-layout';
import { useRouter } from 'next/router';
import { JsonArray } from "@prisma/client/runtime/library";
import { JsonObject } from "next-auth/adapters";


const Discover: React.FC = () => {
  const {data: session, status} = useSession();
  const [newAlbums, setNewAlbums] = useState<Album[]>([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState<Album[]>([]);
  const router = useRouter();
  const toast = useToast(); 
  const getNewAlbums = async () => {
    try {
      const response = await fetch(`/api/v2/users/${session?.user.id}/reviews?sort=${'rating:desc'}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const reviews: UserReviews = data.data.reviews;
          console.log(reviews);
        try {
          const albums = await requestNew(session?.spotifyToken!);
          const isAlbumReviewed = (albumId: string) => {
            return reviews.some(review => review.albumId === albumId);
          };
          const albumsNotReviewed = albums.filter(album => !isAlbumReviewed(album.id));
          setNewAlbums(albumsNotReviewed);
        } catch (error) {
          console.error("Error: ", error);
        }
      }
     } else {
        console.log("data retrieval failed");
    }
    } catch (error) {
      console.error('Error fetching recommended albums:', error);
    }
  };


  const getRecommendedAlbums = async () => {
    try {
      const response = await fetch(`/api/v2/users/${session?.user.id}/reviews?sort=${'rating:desc'}`);
      if (response.ok) {
        const data = await response.json();
        console.log(session?.user.id);
  
        if (data.status === 'success') {
          const reviews: UserReviews = data.data.reviews;
          
          const artistIdsList = reviews.slice(0, 5)
          .map((review) => {
            const artists = review.album.artists as JsonArray;

            if (artists[0]) {
              const firstArtistId = (artists[0] as JsonObject).id;
              return firstArtistId;
            }
            return null;
          })
          .filter((id) => id !== null)
          .join(',');
  
          console.log(artistIdsList);
          try{  
            const albums = await requestRecommended(artistIdsList, session?.spotifyToken!);
          console.log(albums);
          const isAlbumReviewed = (albumId: string) => {
            return reviews.some(review => review.albumId === albumId);
          };
          const albumsNotReviewed = albums.filter(album => !isAlbumReviewed(album.id));
          setRecommendedAlbums(albumsNotReviewed);
          }
          catch{
            toast({
              title: 'Error Fetching Recommendations',
              status: "error",
              description: 'Too many recommendation requests at the moment, please check discover again later',
            });
          }
          
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
  }, [session?.spotifyToken]);


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
              <Box key={album.id} _hover={{ boxShadow: 'dark-lg' }} minW={300} onClick={() => router.push(`/album/${album.id}`)}>
                <DiscoverAlbumCard 
                album={album}/>
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
                  <Box key={album.id} _hover={{ boxShadow: 'dark-lg' }} minW={300} onClick={() => router.push(`/album/${album.id}`)}>
                    <DiscoverAlbumCard 
                      album={album}
                    />
                  </Box>
                ))
              ) : (
                <Text p={5} fontSize={"lg"}>
                  Nothing to recommended yet...
                  Leave some reviews and we&apos;ll give you suggestions
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
