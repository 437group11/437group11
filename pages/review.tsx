export default function reviewModal(album: any){

    let img: string = "";
    try {
        img = album.images[0].url;
    }
    catch (error) {
        console.error('Error: ', error);
    }
    console.log(img);

    return (
        <>
            <div id='reviewModalOverlay'>
                <div>
                    <img id='albumArt' src={img}/>
                    <p id='albumName'></p>
                    <input type="range" min="0" max="10" id="score"/>
                    <input type="text" id="review"/>
                </div>
            </div>
        </>
    )
}