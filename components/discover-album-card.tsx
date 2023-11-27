import { Box } from "@chakra-ui/react";
import React from "react";

interface DiscoverAlbumCardProps {
  image: string;
  title: string;
  artist: string;
  genres: string;
}

const DiscoverAlbumCard: React.FC<ProfileAlbumCardProps> = ({image, title, artist, genres }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-xl hover:cursor-pointer">
      <img src={image} alt={title} className="w-full" />
      <div className="p-4">
        <h2 className="text-lg text-center font-bold">{title}</h2>
        <h2 className="text-lg text-center">{artist}</h2>
        <p className="text-lg font-semibold text-center">{rating}</p>
      </div>
    </div>
  );
};

export default DiscoverAlbumCard;