export {}

let userId: number | undefined = undefined;

export function setUserId(id: number){
    userId = id;
}
export function getUserId() : number | undefined{
    return userId;
}