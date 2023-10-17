import RootLayout from "../components/root-layout";
import AlbumCard from "components/album-card";
import { getToken } from "utils/tokenManager";
import { getShelf } from "./api/get-shelf";
import React, {useState} from "react";
import {requestSearch} from "./api/request-search";
import { stringify } from "querystring";
import { constrainedMemory } from "process";
import { requestAlbum } from "./api/request-album";
//import reviewModal from "./review"; [DO NOT USE]
import { useRouter } from "next/router";
import { getUserId } from "utils/userIdManager";
import Button from "../components/button";

interface Album {
    id: number;
    title: string;
    image: string;
  }

export default function Feed() {
    const [formData, setFormData] = useState({
        albumId: '',
        content: '',
        rating: 0,
        authorId: 0,
    });
    const router = useRouter();
    const albums: any[] = [];
    const searchReturn = new Map<string, string>();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchDataInput : any = document.getElementById("search");
        const searchData = searchDataInput.value;
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
                requestAlbum(id).then((album)=>{
                    a.addEventListener('click', function() {reviewModule(album)});
                    //reviewModule in review.tsx deprecated ---
                })
                .catch ((error) => {
                    console.error('error: ', error);
                })
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

    const handleSubmitReview = async (e: any) => {
        e.preventDefault();

        const ratingInput : any = document.getElementById('score');
        const rating: number = parseInt(ratingInput.value);
        const reviewInput : any = document.getElementById('review');
        const review: string = reviewInput.value;
        const albumIdInput : any = document.getElementById('albumId');
        const albumId: string = albumIdInput.value;
        const authorId: number = getUserId();

        try {
            const response = await fetch('/api/submit-review', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({albumId: albumId, content: review, rating: rating, authorId: authorId}),
            });
            if (response.ok){
                console.log('Album Review Submitted');
            }
        } catch (error) {
            console.error('Error submitting review: ', error);
        }
    };

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    }

    function reviewModule(album: any){
        console.log(album);
        const reviewBlock: any = document.getElementById('reviewModal')
        reviewBlock.style.display = 'block';
        const nameP: any = document.getElementById('albumName');
        nameP.textContent = album.name;
        const img : any = document.getElementById('albumArt');
        img.src = album.images[0].url;
        let artistText = "";
        album.artists.forEach(function(artist: any) {
            artistText += artist.name + " ";
        })
        const artistP : any = document.getElementById('artistName');
        artistP.textContent = artistText;
        const albumId: any = document.getElementById('albumId');
        albumId.value = album.id;
    }   

    return (
        <RootLayout>
            <div className="bg min-h-screen text-white">
                <div className="flex flex-row overflow-x-auto">
                    <div>
                        <input
                        name="search"
                        id = "search"
                        onChange={handleChange}
                        type = "text"
                        placeholder="Search for an album..."
                        />
                        <ul id="results">
                            
                        </ul>
                    </div>
                    <div className="flex-shrink-0 w-64 p-4">
                        <div className="h-screen overflow-y-auto" id="reviewModal" style={{display: "none"}}>
                            <p id='albumName'></p>
                            <img id='albumArt'/>
                            <p id='artistName'></p>
                            <form id='reviewForm' onSubmit={handleSubmitReview}>
                                <input 
                                    type="hidden"
                                    id="albumId"
                                />
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="10" 
                                    id="score"
                                    // value={formData.rating}
                                    // onChange={handleReviewChange}
                                />
                                <textarea
                                    id="review"
                                    placeholder="Enter your review..."
                                    // value={formData.content}
                                    // onChange={handleReviewChange}
                                />
                                <Button type="submit"> Submit </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
        </RootLayout>
    )
}