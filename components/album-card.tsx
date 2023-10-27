import React from "react";

interface AlbumCardProps {
  image: string;
  title: string;
  description: string;
  rating: number;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, title, description, rating }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <img src={image} alt={title} className="w-full" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p>{description}</p>
        <p className="text-sm text-gray-600">Rating: {rating}</p>
      </div>
    </div>
  );
};

export default AlbumCard;