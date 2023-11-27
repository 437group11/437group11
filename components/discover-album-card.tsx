import { Box } from "@chakra-ui/react";
import React from "react";

interface DiscoverAlbumCardProps {
  image: string;
  title: string;
  artist: string;
}

const DiscoverAlbumCard: React.FC<DiscoverAlbumCardProps> = ({image, title, artist }) => {
  return (
    <div className="border w-300px border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-xl hover:cursor-pointer">
      <img src={image} alt={title} className="w-full" />
      <div className="p-4">
        <h2 className="text-lg text-center font-bold">{title}</h2>
        <h2 className="text-lg text-center">{artist}</h2>
      </div>
    </div>
  );
};

export default DiscoverAlbumCard;