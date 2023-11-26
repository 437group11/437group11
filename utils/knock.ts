/**
* The app should only create one instance of Knock.

* This file allows for the use of a singleton.
* https://github.com/prisma/prisma/discussions/10037
* 
* It should only be used server-side.
*/
import { Knock } from "@knocklabs/node"

let knock: Knock;

let globalWithKnock = global as typeof globalThis & {
    knock: Knock;
}
if (!globalWithKnock.knock) {
    globalWithKnock.knock = new Knock(process.env.KNOCK_SECRET_KEY!)
}
knock = globalWithKnock.knock

export default knock