/**
 * Manages the username for the CLIENT. Do not use on the server.
 */

let username: string;

export function setUsername(u: string) {
    console.log("Username set to " + u);
    username = u;
}
export function getUsername(): string {
    console.log("get called");
    return username;
}