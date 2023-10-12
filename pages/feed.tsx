import AlbumCard from "components/album-card"
import { getToken } from "utils/tokenManager";
import { getShelf } from "./api/get-shelf";

interface Album {
    id: number;
    title: string;
    image: string;
  }

export default function Feed() {
    const albums: any[] = [];

    

    return (
        <>
            <div className="bg min-h-screen text-white">
                <div className="flex flex-row overflow-x-auto">
                    {albums.map((album) => (
                        <AlbumCard key="{album.id}" album={album}/>
                    ))}
                    <div className="flex-shrink-0 w-64 p-4">
                        <div className="h-screen overflow-y-auto">

                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}
