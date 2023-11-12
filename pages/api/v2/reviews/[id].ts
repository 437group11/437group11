/**
 * Endpoints for a specific review.
 * 
 * GET: get a review at this ID.
 * 
 * DELETE: delete the review at this ID.
 */

import { Review } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { isRecordNotFoundError, jsendError, jsendFailWithMessage, jsendSuccess, methodNotAllowedError } from "utils/api";
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
                if (isRecordNotFoundError(error)) {
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
                if (isRecordNotFoundError(error)) {
                    return jsendFailWithMessage(res, HttpStatusCode.NotFound, "Could not find that review")
                }
                return jsendError(res, HttpStatusCode.InternalServerError, "Could not replace that review")
            }
        case "DELETE":
            try {
                await deleteReview(id)
                return jsendSuccess(res, HttpStatusCode.Ok, null)
            } catch (error) {
                if (isRecordNotFoundError(error)) {
                    return jsendFailWithMessage(res, HttpStatusCode.NotFound, "Could not find that review")
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

async function deleteReview(id: string) {
    return prisma.review.delete({
        where: {
            id: Number(id)
        }
    })
}