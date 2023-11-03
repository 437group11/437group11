import { Album } from "types/Album";
import { Artist } from "types/Artist";

export async function requestAlbum(albumId:string, token: string): Promise<Album> {
    const apiUrl = 'https://api.spotify.com/v1/albums/' + albumId;
    try {
        const data = new URLSearchParams();
        const accessToken = token;
        const url = `${apiUrl}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok){
            const data = await response.json();
            let artistArr : Artist[] = [];
            data.artists.forEach(function(art: any) {
                const curr : Artist = {
                    id: art.id,
                    name: art.name,
                };
                artistArr.push(curr);
            })
            const album : Album = {
                id: data.id,
                name: data.name,
                artists: artistArr,
                release_date: data.release_date,
                type: data.album_type,
                image: data.images[0].url,
            };
            console.log(album);
            return album;
        } else {
            console.error('Failed to fetch data:', response.statusText);
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}