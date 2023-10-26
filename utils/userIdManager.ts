/**
 * Manages the username for the CLIENT. Do not use on the server.
 */
export {}

let username: string = "";

export function setUsername(u: string) {
    username = u;
}
export function getUsername(): string {
    return username;
}