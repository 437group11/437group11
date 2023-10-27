/**
 * This route allows accessing or adding reviews for a specific album.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, Album } from "@prisma/client"
import prisma from "utils/db"
import axios, { HttpStatusCode } from 'axios'
import { getToken } from "utils/tokenManager"
import { jsendError } from 'utils/jsend'
import {requestAccessToken} from "../../../request-token";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { spotifyId } = req.query

    function isString(s: string | string[] | undefined): s is string {
        return typeof s === "string";
    }
    if (!isString(spotifyId)) {
        res.status(400).json({
            "status": "fail",
            "data": {
                "title": "Spotify ID must be a string"
            }
        })
        return
    }

    switch (req.method) {
        case "GET":
            get(spotifyId, req, res)
            return
        case "POST":
            post(spotifyId, req, res)
            return
        default:
            res.status(405).json({
                "status": "fail",
                "data": {
                    "title": "This route only supports GET and POST"
                }
            })
            return
    }
}

/**
 * Gets reviews for the requested Album.
 * @param spotifyId The Spotify ID of the album, e.g. 5Z9iiGl2FcIfa3BMiv6OIw.
 */
async function get(spotifyId: string, req: NextApiRequest, res: NextApiResponse) {
    let reviews = await prisma.review.findMany({
        where: {
            albumId: spotifyId
        }
    })

    res.status(200).json({
        "status": "success",
        "data": {
            "reviews": reviews
        }
    })
    return
}

/**
 * Adds a review for this album to the database. If the album hasn't been added yet, add it.
 * @param spotifyId The Spotify ID of the album, e.g. 5Z9iiGl2FcIfa3BMiv6OIw.
 */
async function post(spotifyId: string, req: NextApiRequest, res: NextApiResponse) {
    let album = await prisma.album.findUnique({
        where: {
            spotifyId: spotifyId
        }
    })

    if (album === null) {
        // We have not added this album to the database.
        // Call spotify API to get info and add it.
        let url = `https://api.spotify.com/v1/albums/${spotifyId}`
        let token = await requestAccessToken()
        let response;
        try {
            response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
        } catch {
            jsendError(res, HttpStatusCode.InternalServerError, "Could not query Spotify API")
            return
        }

        let data = await response.data
        await prisma.album.create({
            data: {
                spotifyId: spotifyId,
                name: data["name"],
                genres: data["genres"],
                artists: data["artists"],
                imageUrl: data.images[0].url
            }
        })
    }

    await prisma.review.create({
        data: {
            albumId: spotifyId,
            content: req.body["content"],
            rating: req.body["rating"],
            authorUsername: req.body["authorUsername"]
        }
    })

    res.status(HttpStatusCode.Created).json({
        "status": "success"
    })
}