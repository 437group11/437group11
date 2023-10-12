import { getToken } from "utils/tokenManager";

const accessToken = getToken();


export async function requestAlbum(albumId:string): Promise<any> {
    const apiUrl = 'https://api.spotify.com/v1/albums/' + albumId;
    try {
        const data = new URLSearchParams();

        const url = `${apiUrl}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok){
            const album = await response.json();
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