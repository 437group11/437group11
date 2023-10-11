export {}

let accessToken: string | undefined = undefined;

export function setToken(token: string){
    accessToken = token;
}
export function getToken() : string | undefined{
    return accessToken;
}