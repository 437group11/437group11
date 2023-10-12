import { PrismaClient } from "@prisma/client";

const clientId:string = 'e9958b663f6d4e00ad901f43105a18a7';
const clientSecret:string = '330b0fa1d1b948b48b3c8714452f360a';

export async function requestAccessToken(): Promise<string | undefined> {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    
    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
        },
    });
    if (response.ok) {
        const json = await response.json();
        const token = json.access_token;
        if (token){
            return token;
        } else {
            console.error('token not recieved');
        }
    } else {
        console.error('request invalid');
    }
    return undefined;
}