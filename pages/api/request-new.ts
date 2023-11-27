import { Album } from "types/Album";
import { Artist } from "types/Artist";

export async function requestNew(token: string): Promise<Album[]> {
  const url = `https://api.spotify.com/v1/browse/new-releases`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    console.log(data);

    const albumData = data.albums.items;

    const albums: Album[] = albumData.map((album: any) => {
        let artistArr : string[] = [];
        album.artists.map((art: any) => {
            const curr = art.name;
            artistArr.push(curr);
        })
      return {
        id: album.id,
        name: album.name,
        artists: artistArr,
        release_date: album.release_date,
        type: album.album_type,
        image: album.images[0].url,
      };
    });
    console.log(albums);
    return albums;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
}
