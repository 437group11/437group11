import { getToken } from "utils/tokenManager";

const accessToken = getToken();


export async function requestSearch(searchTerm:string): Promise<any> {
    const apiUrl = 'https://api.spotify.com/v1/search';
    try {
        const limit = 10;
        const url = `${apiUrl}?q=${encodeURIComponent(searchTerm)}&type=album&limit=${limit}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Response data: ', data);
        } else {
            console.error('Failed to fetch data: ', error);
        }
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
};