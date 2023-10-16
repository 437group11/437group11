export {}

let userId: number = 0;

export function setUserId(id: number){
    userId = id;
}
export function getUserId() : number {
    return userId;
}