/**
 * Manages the user id for the CLIENT. Do not use on the server.
 */
export {}

let userId: number = 0;

export function setUserId(id: number){
    userId = id;
}
export function getUserId() : number {
    return userId;
}