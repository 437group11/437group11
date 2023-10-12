import { requestAlbum } from "./api/request-album";


export default function reviewModal(id: string, name: string){


    requestAlbum(id)
    .then((album) => {
        console.log(album);
    })
    .catch ((error) => {
        console.error('error: ', error);
    })

    return (
        <>
            <div id='reviewModalOverlay'>
                <div>
                    <img id='albumArt'/>
                    <p id='albumName'></p>
                    <input type="range" min="0" max="10" id="score"/>
                    <input type="text" id="review"/>
                </div>
            </div>
        </>
    )
}