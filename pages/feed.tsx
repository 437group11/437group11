import AlbumCard from "components/album-card";
import { getToken } from "utils/tokenManager";
import { getShelf } from "./api/get-shelf";
import {useState} from "react";
import {requestSearch} from "./api/request-search";


interface Album {
    id: number;
    title: string;
    image: string;
  }

    export default function Feed() {
        const albums: any[] = [];
        let albumCheck = '';
        let searchReturn: { [albumId: string]: string } = {};
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const searchData = document.getElementById("search").value;
            requestSearch(searchData)
            .then((data) => {
                console.log(data);
                // for(const album in data.items)
                // {
                //     //let name = album.name;
                //     //let id = album.id;
                //     albumCheck = album;
                //     //searchReturn[id] = [name];
                // }
            })
            .catch((error) => {
                console.error('Error searching', error);
            })
            console.log(albumCheck);
    }

    return (
        <>
            <div className="bg min-h-screen text-white">
                <div className="flex flex-row overflow-x-auto">
                    <div>
                        <input
                        name="search"
                        id = "search"
                        onChange={handleChange}
                        type = "text"
                        />
                    </div>
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
