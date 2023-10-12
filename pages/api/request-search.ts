import { getToken } from "utils/tokenManager";
import { requestAlbum } from "./request-album";

export async function requestSearch(searchTerm:string): Promise<any> {
    const accessToken = getToken();
    const apiUrl = 'https://api.spotify.com/v1/search?';
    const limit = '10';
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const searchData = new URLSearchParams();
    searchData.append('q', searchTerm);
    searchData.append('type', 'album');
    searchData.append('limit', limit);
    const url = apiUrl + searchData;
    

    try {
        const exampleId = '5m2dVboM31qQtwPVch8pFv';
        requestAlbum(exampleId)
        .then((album) => {
            console.log(album);
        })
        .catch ((error) => {
            console.error('error: ', error);
        })
        //const url = `${apiUrl}q=${encodedSearchTerm}&type=album&limit=${limit}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
};