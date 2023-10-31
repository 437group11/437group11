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
        const followData = `{"op":"add", "value":${username}}`;

        try {
            const response = await fetch(`/api/v1/users/${sessionUser}/following`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(followData),
            });
            if (response.ok){
                console.log("" + sessionUser + " follows: " + username);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
      
  return (
    <RootLayout>
    <div className="bg min-h-screen text-white">
    <div className="container mx-auto mt-8">
      <div>
        <p>{username}</p>
        <form className="mt-8" onSubmit={handleFollow}>
            <Button type="submit">
                Follow
            </Button>
        </form>
        <input
          name="search"
          id = "search"
          onChange={handleChange}
          type = "text"
          placeholder="Search for a user..."
          />
          <ul id="results">
                            
          </ul>
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
