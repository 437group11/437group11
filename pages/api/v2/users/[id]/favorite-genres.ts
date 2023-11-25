/**
 * Get or update a user's favorite genres.
 * Supported routes:
 * GET
 * POST
 * - Expects in the body "op", which must be "add" or "remove",
 *   and "value", which is the genre to add or remove.
 */
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { ErrorWithStatusCode, ForbiddenError, Result, UnauthorizedError, handle, isNotFoundError, jsendFailWithData, jsendFailWithMessage, jsendSuccess } from "utils/api";
import prisma from "utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return await handle(req, res, {
        GET: get,
        PATCH: patch
    })
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }
    try {
        const favoriteGenres = await getFavoriteGenres(id)
        return jsendSuccess(res, HttpStatusCode.Ok, {
            favoriteGenres: favoriteGenres
        })
    } catch (error) {
        if (isNotFoundError(error)) {
            return jsendFailWithMessage(res, HttpStatusCode.NotFound, 
                "User not found with that ID"
            )
        }
        return jsendFailWithMessage(res, HttpStatusCode.InternalServerError,
            "Could not get favorite genres from database"
        )
    }
}

async function getFavoriteGenres(userId: string): Promise<[string]> {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })
    return user.favoriteGenres as [string] ?? []
}

async function patch(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        const error = new UnauthorizedError()
        return jsendFailWithData(res, error.statusCode, error.message)
    }
    if (session.user.id !== id) {
        const error = new UnauthorizedError()
        return jsendFailWithData(res, error.statusCode, error.message)
    }

    const { op, value } = req.body
    switch (op) {
        case "add":
            let genresAfterAdd = await addFavoriteGenre(id, value)
            return jsendSuccess(res, HttpStatusCode.Ok, {
                favoriteGenres: genresAfterAdd
            })
        case "remove":
            let genresAfterRemove = await removeFavoriteGenre(id, value)
            return jsendSuccess(res, HttpStatusCode.Ok, {
                favoriteGenres: genresAfterRemove
            })
        default:
            return jsendFailWithData(res, HttpStatusCode.BadRequest, {
                op: "op must be `add` or `remove"
            }) 
    }
}

async function addFavoriteGenre(userId: string, genreToAdd: string) {
    const genres = await getFavoriteGenres(userId)

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            favoriteGenres: [...genres, genreToAdd]
        }
    })
    return user.favoriteGenres
}

async function removeFavoriteGenre(userId: string, genreToRemove: string) {
    const genres = await getFavoriteGenres(userId)
    
    const updatedGenres = genres.filter((genre) => genre !== genreToRemove)

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            favoriteGenres: updatedGenres
        }
    })
    return user.favoriteGenres
}
