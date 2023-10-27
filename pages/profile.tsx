import React, { useEffect, useState } from "react";
import AlbumCard from "../components/album-card";

interface AlbumReview {
    id: number;
    albumId: string;
    image: string;
    content: string;
    rating: number;
}

const ProfilePage: React.FC = () => {

    const [albums, setAlbums] = useState<AlbumReview[]>([]);
    useEffect(() => {
        async function fetchAlbumData() {
          try {
            const response = await fetch('/api/get-shelf');
            if (response.ok){
              const data = await response.json();
              console.log(data);
              if (data.message === 'Success') {
                console.log("here");
                setAlbums(data.reviews);
              }
            } else {
              console.log("data retrieval failed");
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
    
        fetchAlbumData();
      }, []);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('handled that change babbyby');
      const searchDataInput : any = document.getElementById("search");
      const searchData = searchDataInput.value;
      const response = await fetch('/api/request-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      if (response.ok){
        const data = await response.json();
        console.log(data);
      }

    }
      
  return (
    <div className="container mx-auto mt-8">
      <div>
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
        {albums.map((album, index) => (
          <AlbumCard
            key={index}
            image={album.image}
            title={album.albumId}
            description={album.content}
            rating={album.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
