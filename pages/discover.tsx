import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, SimpleGrid } from '@chakra-ui/react';
import AlbumCard from '../components/album-card';
import { Album } from '@prisma/client';

const Discover: React.FC = () => {
  const [newAlbums, setNewAlbums] = useState<Album[]>([]);
  const [trendingAlbums, setTrendingAlbums] = useState<Album[]>([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState<Album[]>([]);


  const getNewAlbums = async (): Promise<Album[]> => {
    // Fetch and return new albums
    return [];
  };

  const getTrendingAlbums = async (): Promise<Album[]> => {
    // Fetch and return trending albums
    return [];
  };

  const getRecommendedAlbums = async (): Promise<Album[]> => {
    // Fetch and return recommended albums
    return [];
  };

  useEffect(() => {
    // Fetch and set the albums when the component mounts
    getNewAlbums().then((albums) => setNewAlbums(albums));
    getTrendingAlbums().then((albums) => setTrendingAlbums(albums));
    getRecommendedAlbums().then((albums) => setRecommendedAlbums(albums));
  }, []);

  return (
    <Box p={4}>
      {/* New Albums Feed */}
      <Flex direction="column" mb={4}>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          New Albums
        </Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} overflowX="auto" css={{ 'scroll-snap-type': 'x mandatory' }}>
          {newAlbums.map((album) => (
            <Box key={album.id} _hover={{ boxShadow: 'dark-lg' }}>
              <DiscoverAlbumCard 
              image = {album.imageUrl} 
              title = {album.name}
              artist = {(album.artists as any).map((artist: { name: string }) => artist.name).join(", ")}
              genres = {(album.genres as any).map((artist: { name: string }) => artist.name).join(", ")}
              onClick={() => console.log(`Clicked on ${album.name}`)} />
            </Box>
          ))}
        </SimpleGrid>
      </Flex>

      {/* Trending Albums Feed */}
      <Flex direction="column" mb={4}>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Trending Albums
        </Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} overflowX="auto" css={{ 'scroll-snap-type': 'x mandatory' }}>
          {trendingAlbums.map((album) => (
            <Box key={album.id} _hover={{ boxShadow: 'dark-lg' }}>
              <DiscoverAlbumCard 
              image = {album.imageUrl} 
              title = {album.name}
              artist = {(album.artists as any).map((artist: { name: string }) => artist.name).join(", ")}
              genres = {(album.genres as any).map((artist: { name: string }) => artist.name).join(", ")}
              onClick={() => console.log(`Clicked on ${album.name}`)} />
            </Box>
          ))}
        </SimpleGrid>
      </Flex>

      {/* Recommended Albums Feed */}
      <Flex direction="column">
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Recommended Albums
        </Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} overflowX="auto" css={{ 'scroll-snap-type': 'x mandatory' }}>
          {recommendedAlbums.map((album) => (
            <Box key={album.id} _hover={{ boxShadow: 'dark-lg' }}>
              <DiscoverAlbumCard 
              image = {album.imageUrl} 
              title = {album.name}
              artist = {(album.artists as any).map((artist: { name: string }) => artist.name).join(", ")}
              genres = {(album.genres as any).map((artist: { name: string }) => artist.name).join(", ")}
              onClick={() => console.log(`Clicked on ${album.name}`)} />
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
};

export default Discover;
