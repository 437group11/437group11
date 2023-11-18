import RootLayout from "../../components/root-layout";
import React, { useEffect, useState } from "react";
import ProfileAlbumCard from "../../components/profile-album-card";
import {UserReviews} from "../api/v2/users/[id]/reviews";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { Box, Button, Card, Container, GridItem, Heading, Input, Progress, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
  ModalFooter, Img, Text, Center, Select, Slider, SliderTrack, SliderFilledTrack,
  SliderThumb, ModalHeader, Flex, Textarea, UnorderedList, ListItem} from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserPublicData } from "../api/v2/users/[id]";
import ProfilePicture from "../../components/profile-picture";

const ProfilePage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const { id } = router.query;
    console.log("ID: " + id);


    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserPublicData>(null);
    const [albums, setAlbums] = useState<UserReviews>([]);
    const [followsUser, setFollowsUser] = useState<boolean>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usersReturned, setUsersReturned] = useState<User[]>([]);
    const [followingUsernames, setFollowingUsernames] = useState(new Map<string, string>());
    const [followingImages, setFollowingImages] = useState(new Map<string, string>());

    const [isSearchFocused, setSearchFocused] = useState(false);
    let [followedUsersCount, setFollowedUsersCount] = useState(0);
    let [selectedSortOption, setSelectedSortOption] = useState('0'); 


    const handleSearchMouseDown = () => {
      setSearchFocused(true);
    };


   const handleSearchBlur = () => {
     setTimeout(() => {
       setSearchFocused(false);
     }, 300);
   };


    useEffect(() => {
      if (id) {
          fetch(`/api/v2/users/${id}`)
              .then((response) => {
                  if (!response.ok) {
                      return Promise.reject();
                  }
                  return response.json();
              })
              .then((json) => {
                  let data = json.data;
                  const userData = data.user;
                  setUser(userData);
              })
              .catch((error) => {
                  console.error('Error fetching user data:', error);
              })
              .finally(() => {
                  setIsLoading(false);
              });
      }
  }, [id]);

    useEffect(() => {
        async function fetchAlbumData() {
          if(id)
          {
            try {
              let sortParam = 'rating:desc';
              if (selectedSortOption === '0') {
                sortParam = 'rating:desc';
              } else if (selectedSortOption === '1') {
                sortParam = 'rating:asc';
              } else if (selectedSortOption === '2') {
                sortParam = 'datePublished:desc';
              } else if (selectedSortOption === '3') {
                sortParam = 'datePublished:asc';
              }
              const response = await fetch(`/api/v2/users/${id}/reviews?sort=${sortParam}`);      
            if (response.ok){
              const data = await response.json();
              console.log(data);
              if (data.status === 'success') {
                setAlbums(data.data.reviews);
              }
            } else {
              console.log("data retrieval failed");
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      }
      fetchAlbumData();
    }, [id, selectedSortOption]);

  const sessionFollowing = async () => {
    if (!session) {
      return;
    }

    try {
      const response = await fetch(`/api/v2/users/${session?.user?.id}/following`, {
        method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (response.ok){
        const data = await response.json()
        console.log(data.data.following);
        for (let i = 0; i < data.data.following.length; i++){
          console.log(id);
          if(data.data.following[i].id===id){
            setFollowsUser(true);
            console.log("set true");
            return true;
          }
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
    setFollowsUser(false);
    return false;
  };


  const getFollowing = async () => {
    if (!session) {
      return;
    }
    try {
      const response = await fetch(`/api/v2/users/${id}/following`, {
        method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (response.ok){
        const currUsernames = new Map<string, string>();
        const currImages = new Map<string, string>();
        const data = await response.json();
        console.log("a");
        console.log(data.data.following);
        setFollowedUsersCount(data.data.following.length);
        for (let i = 0; i < data.data.following.length; i++){
          currUsernames.set(data.data.following[i].id, data.data.following[i].name);
          currImages.set(data.data.following[i].id, data.data.following[i].image);
        }
        setFollowingUsernames(currUsernames);
        setFollowingImages(currImages);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleModalClose = () => {
    // Close the modal when clicking away from the review
    setIsModalOpen(false);
  };

  function followingModal(){
    setIsModalOpen(true);
  }


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchDataInput : any = document.getElementById("search");
    const searchData = searchDataInput.value;
    const response = await fetch(`/api/v2/users?name=${searchData}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok){
      const data = await response.json();
      console.log(data.data);
      setUsersReturned([]);
      if (searchData) {
        const currResults: User[] = [];
        for (let i = 0; i < data.data.users.length; i++) {
          if(data.data.users[i].id!=session.user?.id)
          {
          currResults.push(data.data.users[i]);
          }
        }
        setUsersReturned(currResults);
      }
  }
}

  const handleFollow = async(e: React.FormEvent) => { 
      e.preventDefault();
      const followData = JSON.stringify({op: "add", value: id});
      try {
          const response = await fetch(`/api/v2/users/${session?.user?.id}/following`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: followData,
          });
          if (response.ok){
              console.log("" + session?.user?.id + " follows: " + id);
              setFollowsUser(true);
          }
      } catch (error) {
          console.log("Error: ", error);
      }
  }
  const handleUnfollow = async(e: React.FormEvent) => { 
    e.preventDefault();
      const followData = JSON.stringify({op: "remove", value: id});
      try {
          const response = await fetch(`/api/v2/users/${session?.user?.id}/following`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: followData,
          });
          if (response.ok){
              console.log("" + session?.user?.id + " unfollowed: " + id);
              setFollowsUser(false);
          }
      } catch (error) {
          console.log("Error: ", error);
      }
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedSortOption(selectedValue);
  };

  const isUser = session?.user?.id === id;

  useEffect(() => {
    switch (selectedSortOption) {
      case '0':
        break;
      case '1':
        // Logic for case 1
        break;
      case '2':
        // Logic for case 2
        break;
      case '3':
        // Logic for case 3
        break;
      default:
        break;
    }
  }, [selectedSortOption]);

  useEffect(() => { //after save works but doesnt update properly
    sessionFollowing();
  }, [id]); //probably down here

  useEffect((id) => {
    getFollowing();
  }, [id]);

  console.log(followsUser);
  
  if (isLoading) {
    return <RootLayout><Progress size='lg' isIndeterminate /></RootLayout>
  }

  if (!user) {
    return <RootLayout>User not found</RootLayout>;
  }

  let followButton: JSX.Element 
  if (!session || isUser) {
    // Don't add follow button when the user isn't signed in,
    // or is the user whose page we're looking at
    followButton = <></>
  } else {
    if (followsUser) {
      followButton = (
        <Button my={5} id="unfollow" onClick={handleUnfollow}>
          Unfollow
        </Button>
      )
    } else {
      followButton = (
        <Button my={5} id="follow" onClick={handleFollow}>
          Follow
        </Button>
      )
    }
  }

  let shelfContent = albums.length == 0
        ? (
            <Text p={5} fontSize={"lg"}>
                This shelf is looking a little empty...
                Review some albums, and those reviews will show up here.
            </Text>
        ) : (
        <SimpleGrid color={"white"} spacing='20px' columns = {[1, 2, 3, 4]} p={5}>
        {albums.map((review, index) => (
          <Box key={index} onClick={() => {router.push(`/album/${review.album.spotifyId}`)}}>
            <Box _hover={{ boxShadow: 'dark-lg'}}>
              <ProfileAlbumCard
              key={index}
              image={review.album.imageUrl}
              title={review.album.name}
              artist={review.album?.artists.map((artist) => artist.name).join(", ")}
              rating={review.rating}
              />
            </Box>
          </Box>
        ))}
        </SimpleGrid>
      )

  return (
    <RootLayout>
    <Box color={"white"}>
    <Box className="container mx-auto">
    <Container p={5}>
          <Container centerContent mt={0} p={5} position="relative">
            <Box 
              width="full"
              zIndex="20"
              position="absolute"
              top={0}
              left={0}
              pt={0}
              borderRadius="10px"
              onMouseDown={handleSearchMouseDown}
              onBlur={handleSearchBlur}
              boxShadow="0px 0px 10px rgba(0, 0, 0, 0.5)">
                <Input
                p={5}
                name="search"
                id="search"
                onChange={handleChange}
                type="text"
                placeholder="Search for a user..."
                />
                {/* <ul id="results"></ul> */}
                <UnorderedList
                    id="results" 
                    width="full"
                    listStyleType={"none"}
                    ml={0}
                    borderRadius="10px"
                    style={{
                      display: isSearchFocused ? "block" : "none"
                    }}
                    bgColor={"#555050"}>
                    {usersReturned.map((user: User) => (
                        <ListItem 
                        _hover={{bg: "blue", color: "white"}} 
                        display="flex" 
                        key={user.id} 
                        p={2}
                        alignItems="center"
                        cursor="pointer" 
                        textDecoration="none"
                        onClick={() => {router.push(`/profile/${user.id}`); handleModalClose()}}>
                            <Img id="userImage" flex="1" maxW="60px" borderRadius="full" src={user.image ?? "default-user-icon.png"}/>
                            <Text fontSize="l" fontWeight="bold" flex="2" borderRadius="0" ml={5} justifyContent="center">
                                {user.name}
                            </Text>
                        </ListItem>
                    ))}
                </UnorderedList>  
            </Box>
            </Container>
      </Container>
      <Box display="flex" flexDirection={{base: "column", sm: "column", md: "row", lg: "row"}} top={0}>
        <Box display="flex" alignItems="center" flex={{base: "3", md: "3", sm: "1"}}>
          <ProfilePicture user={user} size={"lg"}/>
          <Heading flexWrap={"wrap"} m={4}>{user.name}</Heading>
        </Box>
        <Button minHeight={38} my={5} onClick={() => followingModal()} alignSelf={"flex-start"}>{`Following: ${followedUsersCount}`}</Button>
      </Box>
      {followButton}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{}</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
          <UnorderedList
                    id="results"
                    width="full"
                    listStyleType={"none"}
                    ml={0}
                    borderRadius="10px"
                    zIndex="50">
                    {Array.from(followingUsernames).map(([id, name]) => (
                        <ListItem 
                        _hover={{bg: "blue", color: "white"}} 
                        display="flex" 
                        key={id} 
                        p={2}
                        alignItems="center"
                        cursor="pointer" 
                        textDecoration="none"
                        onClick={() => {router.push(`/profile/${id}`); handleModalClose()}}>
                            <Img id="userImage" flex="1" maxW="60px" borderRadius="full" src={followingImages.get(id)}/>
                            <Text fontSize="l" fontWeight="bold" flex="2" borderRadius="0" ml={5} justifyContent="center">
                                {name}
                            </Text>
                        </ListItem>
                    ))}
                </UnorderedList>  
              </ModalBody>
        </ModalContent>
      </Modal>
      <Box bg="#2A2525" borderRadius="10px">
      <Flex justify="space-between" align="center">
      <Heading p={5} color="white">Shelf</Heading>
      <Select value={selectedSortOption} m={5} onChange={handleSortChange} maxW="fit-content">
        <option value='0'>Sort By Highest Rating</option>
        <option value='1'>Sort By Lowest Rating</option>
        <option value='2'>Sort By Newest Review</option>
        <option value='3'>Sort By Oldest Review</option>
      </Select>
      </Flex>
      {shelfContent}
    </Box>
    </Box>
    </Box>
            
    </RootLayout>
  );
};


export default ProfilePage;