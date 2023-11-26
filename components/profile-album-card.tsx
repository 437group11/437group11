import { Box } from "@chakra-ui/react";
import React from "react";

interface ProfileAlbumCardProps {
  author?: string;
  authorImage?: string;
  image: string;
  title: string;
  artist: string;
  rating: number;
}

const ProfileAlbumCard: React.FC<ProfileAlbumCardProps> = ({ author, authorImage, image, title, artist, rating }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-xl hover:cursor-pointer">
      {author && <div className="flex items-center p-2 h-[90px]">
      {authorImage && <img src={authorImage} className="flex-initial w-[70px] h-[70px] rounded-full"/>}
      <p className="text-center p-4 flex-1 font-semibold">{author}</p>
      </div>}
      <img src={image} alt={title} className="w-full" />
      <div className="p-4">
        <h2 className="text-lg text-center font-bold">{title}</h2>
        <h2 className="text-lg text-center">{artist}</h2>
        <p className=" mt-2 text-lg font-semibold text-center">Rating</p>
        <p className="text-lg font-semibold text-center">{rating}/10</p>
      </div>
    </div>
  );
};

export default ProfileAlbumCard;