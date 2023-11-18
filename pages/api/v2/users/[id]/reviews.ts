/**
 * This endpoint allows getting all a user's ratings sorted in the order desired.
 * 
 * Supported endpoints: GET
 * sort parameter should be <sortVariable>:<desc|asc>
 * e.g. sort=datePublished:asc
 * Supports only `datePublished`, `rating` for now
 */

import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Result, isString, jsendFailWithData, jsendSuccess, methodNotAllowedError } from "utils/api";
import prisma from "utils/db";

type OrderBy =
    | Prisma.ReviewOrderByWithRelationInput
    | Prisma.ReviewOrderByWithRelationInput[]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    if (req.method !== "GET") {
        return methodNotAllowedError(res, ["GET"])
    }

    const { sort } = req.query
    const orderByResult = convertToOrderBy(sort)
    if (!orderByResult.ok) {
        return jsendFailWithData(res, HttpStatusCode.BadRequest, {
            sort: orderByResult.error.message
        })
    }

    const reviews = await getReviews(id, orderByResult.value)
    return jsendSuccess(res, HttpStatusCode.Ok, {
        reviews: reviews
    })
}

function convertToOrderBy(query: string | string[] | undefined): Result<OrderBy> {
    if (Array.isArray(query)) {
        return {
            ok: false,
            error: new Error("`sort` must be passed only once")
        }
    } else if (query === undefined) {
        // Default orderby
        return {
            ok: true,
            value: [
                {
                    datePublished: 'desc',
                },
            ]
        }
    } else {
        const sortSplit = query.split(":")
        const sortVariable = sortSplit[0]
        const sortDirection = sortSplit[1]
        if (sortDirection === undefined) {
            return {
                ok: false,
                error: new Error("Expected `:direction` after sort variable, where direction is `asc` or `desc`")
            }
        }
        if (sortDirection !== "asc" && sortDirection !== "desc") {
            return {
                ok: false,
                error: new Error("Sort direction must be `asc` or `desc`")
            }
        }

        switch (sortVariable) {
            case "datePublished":
                return {
                    ok: true,
                    value: [
                        {
                            datePublished: sortDirection
                        }
                    ]
                }
            case "rating":
                return {
                    ok: true,
                    value: [
                        {
                            rating: sortDirection
                        }
                    ]
                }
            default:
                return {
                    ok: false,
                    error: new Error(`Sort variable "${sortVariable}" is not supported`)
                }
        }
    }
} 

async function getReviews(id: string, orderBy: OrderBy) {
    return prisma.review.findMany({
        where: {
            authorId: id
        },
        orderBy: orderBy,
        include: {
            album: true
        }
    })
}

/**
 * The return type of the reviews.
 */
export type UserReviews = Prisma.PromiseReturnType<typeof getReviews>
