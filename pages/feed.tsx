import RootLayout from "../components/root-layout";
import AlbumCard from "components/album-card";
import { getToken } from "utils/tokenManager";
import React, {useEffect, useState} from "react";
import {requestSearch} from "./api/request-search";
import { stringify } from "querystring";
import { constrainedMemory } from "process";
import { requestAlbum } from "./api/request-album";
//import reviewModal from "./review"; [DO NOT USE]
import { useRouter } from "next/router";
import { getUsername } from "utils/userManager";
import Button from "../components/button";
import { Album } from "types/Album";
import { Artist } from "types/Artist";
import { UserReviews } from "./api/v1/users/[username]/reviews";

const sessionUser = "example"
const MIN_RATING = 0
const MAX_RATING = 10
const DEFAULT_RATING = (MIN_RATING + MAX_RATING) / 2

export default function Feed() {
    console.log()
    const [formData, setFormData] = useState({
        albumId: '',
        content: '',
        rating: 0,
        authorId: 0,
    });
    const [followers, setFollowers] = useState<string[]>();
    const [reviews, setReviews] = useState<UserReviews>([]);

    const router = useRouter();
    
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
                    console.log(album.name);
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
        const authorUsername: string = getUsername();

        try {
            const response = await fetch(`/api/v1/albums/${albumId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({content: review, rating: rating, authorUsername: authorUsername}),
            });
            if (response.ok){
                alert("Your review has been saved.");
                reviewInput.value = "";
                ratingInput.value = DEFAULT_RATING;
            }
        } catch (error) {
            console.error('Error submitting review: ', error);
        }
    };

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    }

    function reviewModule(album: Album){
        console.log(album);
        const reviewBlock: any = document.getElementById('reviewModal')
        reviewBlock.style.display = 'block';
        const nameP: any = document.getElementById('albumName');
        nameP.textContent = album.name;
        const img : any = document.getElementById('albumArt');
        img.src = album.image;
        let artistText = "";
        album.artists.forEach(function(artist: Artist) {
            artistText += artist.name + " ";
        })
        const artistP : any = document.getElementById('artistName');
        artistP.textContent = artistText;
        const albumId: any = document.getElementById('albumId');
        albumId.value = album.id;
    }

    const getFollowers = async () => {
        const followers : string[] = [];
        try {
        const response = await fetch(`/api/v1/users/${sessionUser}/following`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok){
            const data = await response.json()
            data.data.following.forEach((follower: { username: string; }) => {
                followers.push(follower.username);
            })
            setFollowers(followers);
            return followers;
        }
        } catch (error) {
        console.error("Error: ", error);
        }
        setFollowers(followers);
        return followers;
    }
    
    const getFeed = async () => {
        const reviews: UserReviews = [];
    
        if (followers) {
            for (const follower of followers) {
                try {
                    const response = await fetch(`/api/v1/users/${follower}/reviews`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === 'success') {
                            reviews.push(...data.data.reviews);
                        }
                    } else {
                        console.log("Data retrieval failed");
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }
    
        return reviews;
    };
   
    useEffect(() => {
        getFeed()
            .then((reviews) => {
                setReviews(reviews);
            })
            .catch();
    }, [followers]);

    useEffect(() => {
        getFollowers()
        .then((followers) => {
            console.log("get followers");
            console.log(followers);
        })
        .catch();
    }, []);

    

    return (
        <RootLayout>
            <div className="bg min-h-screen text-white">
                <div className="flex flex-col overflow-x-auto lg:flex-row">
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
                                    min={MIN_RATING}
                                    max={MAX_RATING}
                                    // Use defaultValue instead of value
                                    // https://stackoverflow.com/a/36123370
                                    defaultValue={DEFAULT_RATING}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, index) => (
                            <AlbumCard
                                key={index}
                                image={review.album.imageUrl}
                                title={review.album.name}
                                description={review.content}
                                rating={review.rating}
                            />
                        ))}
                </div>
            </div>
            
        </RootLayout>
    )
}
