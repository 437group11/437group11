import { PrismaClient } from "@prisma/client";
import { requestAlbum } from "./request-album";
import { Album } from "types/Album";

export async function getShelf() {
    const albums: any[] = [];
    const sunnyBoyId:string = '5m2dVboM31qQtwPVch8pFv?si=jRDOOj-xTQCUHWxbt-CYnw';
    let albumIds:string[] = ['sunnyBoyId'];
    for (const id in albumIds){
        requestAlbum(id)
        .then((album) => {
            console.log('Album:', album);
            albums.push(album);
        })
        .catch((error) => {
            console.error('Error retrieving album: ', id, ' Error:', error);
        })
    }
    return albums;
}