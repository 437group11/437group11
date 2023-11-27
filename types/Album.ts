import internal from "stream";

export interface Album {
    id: string;
    name: string;
    artists: string[];
    release_date?: string;
    type?: string;
    image : string;
}