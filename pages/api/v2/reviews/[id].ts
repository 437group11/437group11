/**
 * Endpoints for a specific review.
 * 
 * GET: get a review at this ID.
 * 
 * DELETE: delete the review at this ID. The user must be signed in as the author of the review.
 */

import { Review } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { ForbiddenError, UnauthorizedError, isClientError, isNotFoundError, jsendError, jsendFailWithMessage, jsendSuccess, methodNotAllowedError } from "utils/api";
import prisma from "utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let { id } = req.query
    id = id as string
    
    switch (req.method) {
        case "GET":
            try {
                const review = await getReview(id)
                return jsendSuccess(res, HttpStatusCode.Ok, {
                    review: review
                })
            } catch (error) {
                if (isNotFoundError(error)) {
                    return jsendFailWithMessage(res, HttpStatusCode.NotFound, "Could not find that review")
                }
                return jsendError(res, HttpStatusCode.InternalServerError, "Could not get that review")
            }
        case "PUT":
            try {
                const review = await replaceReview(
                    id, 
                    {
                        content: req.body["content"],
                        rating: req.body["rating"]
                    }
                )
                return jsendSuccess(res, HttpStatusCode.Ok, {
                    review: review
                })
            } catch (error) {
                if (isNotFoundError(error)) {
                    return jsendFailWithMessage(res, HttpStatusCode.NotFound, "Could not find that review")
                }
                return jsendError(res, HttpStatusCode.InternalServerError, "Could not replace that review")
            }
        case "DELETE":
            try {
                let session = await getServerSession(req, res, authOptions)
                await deleteReview(id, session)
                return jsendSuccess(res, HttpStatusCode.Ok, null)
            } catch (error) {
                if (isNotFoundError(error)) {
                    return jsendFailWithMessage(res, HttpStatusCode.NotFound, "Could not find that review")
                }
                if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
                    return jsendFailWithMessage(res, error.statusCode, error.message)
                }
                return jsendError(res, HttpStatusCode.InternalServerError, "Could not delete that review")
            }
        default:
            return methodNotAllowedError(res, ["GET", "PUT", "DELETE"])
    }
}

async function getReview(id: string): Promise<Review> {
    return prisma.review.findUniqueOrThrow({
        where: {
            id: Number(id)
        }
    })
}

interface ReviewReplacementData {
    content: string,
    rating: number
}

async function replaceReview(id: string, review: ReviewReplacementData) {
    return prisma.review.update({
        where: {
            id: Number(id)
        },
        data: {
            content: review.content,
            rating: review.rating
        }
    })
}

async function deleteReview(id: string, session: Session | null) {
    if (!session) {
        throw new UnauthorizedError()
    }

    const review = await getReview(id)
    if (session?.user?.id !== review.authorId) {
        throw new ForbiddenError()
    }

    return prisma.review.delete({
        where: {
            id: Number(id)
        }
    })
}