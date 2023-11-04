import React from "react";

interface AlbumCardProps {
  author?: string;
  authorImage?: string;
  image: string;
  title: string;
  description: string;
  rating: number;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ author, authorImage, image, title, description, rating }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {author && <div className="flex p-2">
      {authorImage && <img src={authorImage} className="flex-1 rounded-full max-w-[18%]"/>}
      {author && <p className="text-center p-4 font-semibold">{author}</p>}
      </div>}
      <img src={image} alt={title} className="w-full" />
      <div className="p-4">
        <h2 className="text-lg text-center font-bold">{title}</h2>
        <p className="text-center">{description}</p>
        <p className=" mt-2 text-lg font-semibold text-center">Rating</p>
        <p className="text-lg font-semibold text-center">{(rating/10)}</p>
      </div>
    </div>
  );
};

export default AlbumCard;