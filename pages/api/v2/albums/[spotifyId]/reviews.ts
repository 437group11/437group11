/**
 * This route allows accessing or adding reviews for a specific album.
 * Supported routes:
 * - GET: get the reviews for this album.
 *   Pass URL parameter authorId to get a user's review. Use like so: ?authorId=cloow33je000560aluav2m6ac
 *   Can be repeated to get reviews for multiple users: ?authorId=id1&authorId=id2&authorId=id3
 * 
 * - POST: post a review for this album.
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, Album } from "@prisma/client"
import prisma from "utils/db"
import axios, { HttpStatusCode } from 'axios'
import { ErrorWithStatusCode, SpotifyError, UnauthorizedError, jsendError, methodNotAllowedError } from 'utils/api'
import { Session, getServerSession } from "next-auth"
import { authOptions } from "pages/api/auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { spotifyId } = req.query

    function isString(s: string | string[] | undefined): s is string {
        return typeof s === "string";
    }
    if (!isString(spotifyId)) {
        res.status(HttpStatusCode.BadRequest).json({
            "status": "fail",
            "data": {
                "title": "Spotify ID must be a string"
            }
        })
        return
    }

    switch (req.method) {
        case "GET":
            try {
                let { authorId } = req.query
                if (isString(authorId)) {
                    authorId = [authorId]
                }
                const reviews = await get(spotifyId, authorId)
                return res.status(200).json({
                    "status": "success",
                    "data": {
                        "reviews": reviews
                    }
                })
            } catch {
                return res.status(HttpStatusCode.InternalServerError).end()
            }
        case "POST":
            try {
                post(spotifyId, req, res)
                return res.status(HttpStatusCode.Ok).json({
                    "status": "success"
                })
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    return res.status(error.statusCode).json({
                        "status": "fail",
                        "message": `Could not create post: ${error}`
                    })
                }
                return jsendError(res, HttpStatusCode.InternalServerError, `Could not create post: ${error}`)
            }
        default:
            return methodNotAllowedError(res, ["GET", "POST"])
    }
}

/**
 * Gets reviews for the requested Album.
 * @param spotifyId The Spotify ID of the album, e.g. 5Z9iiGl2FcIfa3BMiv6OIw.
 * @param authorIds The authorIds to filter on, or undefined to get all all reviews.
 */
async function get(spotifyId: string, authorIds: string[] | undefined) {
    return await prisma.review.findMany({
        where: {
            albumId: spotifyId,
            ...(authorIds && {
                authorId: {
                    in: authorIds
                }
            }),
        },
        include: {
            author: true
        }
    })
}

// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types#problem-using-variations-of-the-generated-model-type
const reviewWithAuthor = Prisma.validator<Prisma.ReviewDefaultArgs>()({
    include: {author: true}
})
export type ReviewWithAuthor = Prisma.ReviewGetPayload<typeof reviewWithAuthor>

/**
 * Adds a review for this album to the database. If the album hasn't been added yet, add it.
 * @param spotifyId The Spotify ID of the album, e.g. 5Z9iiGl2FcIfa3BMiv6OIw.
 */
async function post(spotifyId: string, req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        throw new UnauthorizedError()
    }

    let album = await prisma.album.findUnique({
        where: {
            spotifyId: spotifyId
        }
    })

    if (album === null) {
        // We have not added this album to the database.
        // Call spotify API to get info and add it.
        let url = `https://api.spotify.com/v1/albums/${spotifyId}`
        let token = await session.spotifyToken
        let response;
        try {
            response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
        } catch {
            throw new SpotifyError()
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

    // If the user already reviewed the album, update it instead of creating another review.
    const existingReview = await prisma.review.findFirst({
        where: {
            albumId: spotifyId,
            authorId: session!.user!.id,
        },
    })

    if (existingReview) {
        // Update the existing review
        await prisma.review.update({
            where: { id: existingReview.id },
            data: {
                content: req.body["content"],
                rating: req.body["rating"],
            },
        })
    } else {
        // Create a new review
        await prisma.review.create({
            data: {
                authorId: session.user.id,
                albumId: spotifyId,
                content: req.body["content"],
                rating: req.body["rating"],
            },
        })
    }
}