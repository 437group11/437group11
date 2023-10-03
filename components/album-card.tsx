import React from 'react';

interface AlbumCardInterface {
    album: {
      id: number;
      title: string;
      image: string;
    };
  }

const AlbumCard: React.FC<AlbumCardInterface> = ({ album }) => {
  return (
    <div className="flex-shrink-0 w-64">
      <div className="bg-gray-800 p-4 rounded-lg">
        <img
          src={album.image}
          alt={album.title}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h2 className="text-xl mt-4">{album.title}</h2>
      </div>
    </div>
  );
};

export default AlbumCard;