import { Box } from "@chakra-ui/react";
import React from "react";
import { Album } from "types/Album";

interface DiscoverAlbumCardProps {
  album: Album
}

const DiscoverAlbumCard: React.FC<DiscoverAlbumCardProps> = ({ album }) => {
  return (
    <div className="border w-300px border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-xl hover:cursor-pointer">
      <img src={album.image} alt={album.name} className="w-full" />
      <div className="p-4">
        <h2 className="text-lg text-center font-bold">{album.name}</h2>
        <h2 className="text-lg text-center">{album.artists[0].name}</h2>
      </div>
    </div>
  );
};

export default DiscoverAlbumCard;