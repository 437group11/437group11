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
import { isString, jsendFailWithData, jsendSuccess, methodNotAllowedError } from "utils/api";
import prisma from "utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    if (req.method !== "GET") {
        return methodNotAllowedError(res, ["GET"])
    }

    const { sort } = req.query
    let orderBy: Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[]
    if (Array.isArray(sort)) {
        return jsendFailWithData(res, HttpStatusCode.BadRequest, {
            sort: "sort must be passed only once"
        })
    } else if (sort === undefined) {
        // Default orderby
        orderBy = [
            {
                datePublished: 'desc',
            },
        ]
    } else {
        const sortSplit = sort.split(":")
        const sortVariable = sortSplit[0]
        const sortDirection = sortSplit[1]
        if (sortDirection !== "asc" && sortDirection !== "desc") {
            return jsendFailWithData(res, HttpStatusCode.BadRequest, {
                sort: "sort direction must be `asc` or `desc`"
            })
        }

        switch (sortVariable) {
            case "datePublished": 
                orderBy = [
                    {
                        datePublished: sortDirection
                    }
                ]
                break
            case "rating":
                orderBy = [
                    {
                        rating: sortDirection
                    }
                ]
                break
            default:
                return jsendFailWithData(res, HttpStatusCode.BadRequest, {
                    sort: `sort variable "${sortVariable} is not supported"`
                })
        }
    }

    const reviews = await getReviews(id, orderBy)
    return jsendSuccess(res, HttpStatusCode.Ok, {
        reviews: reviews
    })
}

async function getReviews(id: string, orderBy: Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[]) {
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
