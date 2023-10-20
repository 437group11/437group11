import internal from "stream";
import { Artist } from "./Artist";

export interface Album {
    id: string;
    name: string;
    artists: Artist[];
    release_date?: string;
    type?: string;
    image : string;
}