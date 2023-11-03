import RootLayout from "../../components/root-layout";
import React, { useEffect, useState } from "react";
import AlbumCard from "../../components/album-card";
import {UserReviews} from "../api/v2/users/[id]/reviews";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { Button, Heading } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

const ProfilePage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const { id } = router.query;
    
    //
    const [albums, setAlbums] = useState<UserReviews>([]);
    const [followsUser, setFollowsUser] = useState<boolean>(false);

    useEffect(() => {
        async function fetchAlbumData() {
          if(id)
          {
            try {
            const response = await fetch(`/api/v2/users/${id}/reviews`);
            if (response.ok){
              const data = await response.json();
              console.log(data);
              if (data.status === 'success') {
                console.log("here");
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
    }, [id]);

    const checkIfFollows = async () : Promise<boolean> => {
      if (!session) {
        return false
      }

      const checkData = JSON.stringify({where: {id: id}});
      try {
        const response = await fetch(`/api/v2/users/${session?.user?.id}/following`, {
          method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok){
          const data = await response.json()
          if (data.data.following.includes(id)){
            console.log(session?.user?.id + "Follows: " + id);
            return true;
          }
        }
      } catch (error) {
        console.error("Error: ", error);
      }
      return false;
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('handled that change babbyby');
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
        let results = document.getElementById("results");
        results!.innerHTML = "";
        const usersReturned: User[] = []
        for (let i = 0; i < data.data.users.length; i++)
        {
          usersReturned.push(data.data.users[i])
        }
        if(searchData == "")
        {
        usersReturned.length = 0;
        }
        usersReturned.forEach((user: User) => {
          const e = document.createElement("li");
          const a = document.createElement("a");
          a.textContent = user.name;
          a.href = `/profile/${user.id}`;
          e.appendChild(a);
          results?.appendChild(e);
        })
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

    const isUser = session?.user?.id === id;

    useEffect(() => {
      checkIfFollows()
        .then((follows) => {
          setFollowsUser(follows);
        })
        .catch();
    }, [id]);
      
    console.log(followsUser);
    
  return (
    <RootLayout>
    <div className="bg min-h-screen text-white">
    <div className="container mx-auto mt-8">
      <div>
        <Heading>{session?.user?.name}</Heading>
        {isUser ? (
            <>
              <input
                name="search"
                id="search"
                onChange={handleChange}
                type="text"
                placeholder="Search for a user..."
              />
              <ul id="results"></ul>
            </>
          ) : (
            <>
              <a href={`/profile/${session?.user?.id}`}>{session?.user?.id}</a>
              {followsUser ? (
                <form className="mt-8" onSubmit={handleUnfollow}>
                  <Button id="unfollow" type="submit">
                    Unfollow
                  </Button>
                </form>
              ) : (
                <form className="mt-8" onSubmit={handleFollow}>
                  <Button id="follow" type="submit">
                    Follow
                  </Button>
                </form>
              )}
            </>
          )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((review, index) => (
          <AlbumCard
            key={index}
            image={review.album.imageUrl}
            title={review.album.name}
            description={review.content}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
    </div>
            
    </RootLayout>
  );
};

export default ProfilePage;
