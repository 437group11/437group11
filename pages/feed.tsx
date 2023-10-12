import AlbumCard from "components/album-card";
import { getToken } from "utils/tokenManager";
import { getShelf } from "./api/get-shelf";
import {useState} from "react";
import {requestSearch} from "./api/request-search";
import { stringify } from "querystring";
import { constrainedMemory } from "process";
import { requestAlbum } from "./api/request-album";
import reviewModal from "./review";


interface Album {
    id: number;
    title: string;
    image: string;
  }

export default function Feed() {
    const albums: any[] = [];
    const searchReturn = new Map<string, string>();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const exampleId = '5m2dVboM31qQtwPVch8pFv';
        requestAlbum(exampleId)
        .then((album) => {
            console.log(album);
            const ex = document.getElementById('exampleImgs');
            const i = document.createElement("img");
            i?.setAttribute('src', album.images[1].url);
            ex?.appendChild(i);
        })
        .catch ((error) => {
            console.error('error: ', error);
        })

        const searchData = document.getElementById("search").value;
        requestSearch(searchData)
        .then((data) => { //------
            console.log(data);
            searchReturn.clear();
            for (let i = 0; i < 10; i++){
                let album = data.albums.items[i];
                searchReturn.set(album.id, album.name);

            }
            let results = document.getElementById("results");
    
            results!.innerHTML = "";
        
            searchReturn.forEach((name: string, id: string) => {
                console.log(id, name);
                const e = document.createElement("li");
                const a = document.createElement("a");
                a.textContent = name;
                a.className = "albumSuggestion";
                
                e.appendChild(a);
                results?.appendChild(e);
            })
        }) //-------
        .catch((error) => {
            console.error('Error searching', error);
        })


    }

    function suggestionClick(id: string, name: string): any{
        reviewModal(id, name);
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
                        <ul id="results">
                            
                        </ul>
                    </div>
                    <div className="flex-shrink-0 w-64 p-4">
                        <div className="h-screen overflow-y-auto">
    
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}
