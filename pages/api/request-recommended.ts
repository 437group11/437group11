import { Album } from "types/Album";
import { Artist } from "types/Artist";

export async function requestRecommended(artistsIds: string, token: string): Promise<Album[]> {
  const url = `https://api.spotify.com/v1/recommendations?seed_artists=${artistsIds}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.headers);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const recommendedTracks = data.tracks;
    
    console.log(data);

    const albums: Album[] = recommendedTracks.map((track: any) => {
        let artistArr : string[] = [];
        track.artists.map((art: any) => {
            const curr = art.name;
            artistArr.push(curr);
        })
      return {
        id: track.album.id,
        name: track.album.name,
        artists: artistArr,
        release_date: track.album.release_date,
        type: track.album.album_type,
        image: track.album.images[0].url,
      };
    });
    console.log(albums);
    return albums;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
}
