import RootLayout from "../../components/root-layout";
import React, { useEffect, useState } from "react";
import AlbumCard from "../../components/album-card";
import {UserReviews} from ".././api/v1/users/[username]/reviews";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";

const sessionUser = "example";

const ProfilePage: React.FC = () => {
    
    const router = useRouter();
    
    const { username } = router.query;
    console.log(username);
    
    //
    const [albums, setAlbums] = useState<UserReviews>([]);
    const [followsUser, setFollowsUser] = useState<boolean>(false);

    useEffect(() => {
        async function fetchAlbumData() {
          if(username)
          {
            try {
            console.log(username + "a")
            const response = await fetch(`/api/v1/users/${username}/reviews`);
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
    }, [username]);

    const checkIfFollows = async () : Promise<boolean> => {
      const checkData = JSON.stringify({where: {username: username}});
      try {
        const response = await fetch(`/api/v1/users/${sessionUser}/following?username=${username}`, {
          method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok){
          const data = await response.json()
          if (data.data.following[0].username == username){
            console.log(sessionUser + "Follows: " + username);
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
      const response = await fetch(`/api/v1/users?username=${searchData}`, {
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
          a.textContent = user.username;
          const userSelected = user.username;
          a.href = `/profile/${userSelected}`;
          e.appendChild(a);
          results?.appendChild(e);
        })
      }
    }

    const handleFollow = async(e: React.FormEvent) => { 
        e.preventDefault();
        const followData = JSON.stringify({op: "add", value: username});
        try {
            const response = await fetch(`/api/v1/users/${sessionUser}/following`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: followData,
            });
            if (response.ok){
                console.log("" + sessionUser + " follows: " + username);
                setFollowsUser(true);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    const handleUnfollow = async(e: React.FormEvent) => { 
      e.preventDefault();
        const followData = JSON.stringify({op: "remove", value: username});
        try {
            const response = await fetch(`/api/v1/users/${sessionUser}/following`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: followData,
            });
            if (response.ok){
                console.log("" + sessionUser + " unfollowed: " + username);
                setFollowsUser(false);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const isUser = sessionUser === username;

    useEffect(() => {
      checkIfFollows()
        .then((follows) => {
          setFollowsUser(follows);
        })
        .catch();
    }, [username]);
      
    console.log(followsUser);
    
  return (
    <RootLayout>
    <div className="bg min-h-screen text-white">
    <div className="container mx-auto mt-8">
      <div>
        <p>{username}</p>
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
              <a href={`/profile/${sessionUser}`}>{sessionUser}</a>
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
