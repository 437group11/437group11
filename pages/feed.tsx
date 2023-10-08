import AlbumCard from "components/album-card"

interface Album {
    id: number;
    title: string;
    image: string;
  }

export default function Feed() {
    const albums: Album[] = [
        {id: 1, title: 'Album 1', image: 'app/assets/example.png'},
        { id: 2, title: 'Album 2', image: 'app/assets/example.png'},
        { id: 3, title: 'Album 3', image: 'app/assets/example.png'},
    ]
    return (
        <>
            <div className="bg min-h-screen text-white">
                <div className="flex flex-row overflow-x-auto">
                    {albums.map((album) => (
                        <AlbumCard key="{album.id}" album={album}/>
                    ))}
                    <div className="flex-shrink-0 w-64 p-4">
                        <div className="h-screen overflow-y-auto">

                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}
