/**
 * Endpoints for comments on a review.
 * 
 * GET: Get the comments for the review.
 * 
 * POST
 */

import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { UnauthorizedError, isNotFoundError, jsendError, jsendFailWithMessage, jsendSuccess, methodNotAllowedError } from "utils/api";
import prisma from "utils/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    switch (req.method) {
        case "GET":
            try {
                const comments = await getComments(id)
                return jsendSuccess(res, HttpStatusCode.Ok, {
                    comments: comments
                })
            } catch (error) {
                if (isNotFoundError(error)) {
                    return jsendFailWithMessage(res, HttpStatusCode.NotFound, "Review not found for that ID")
                }
                return jsendError(res, HttpStatusCode.InternalServerError, `Could not get comments: ${error}`)
            }
        case "POST":
            try {
                const content = req.body["content"]
                const session = await getServerSession(req, res, authOptions)
                const comment = await postComment(id, content, session)
                return jsendSuccess(res, HttpStatusCode.Ok, {
                    comment: comment
                })
            } catch (error) {
                if (isNotFoundError(error)) {
                    return jsendFailWithMessage(res, HttpStatusCode.NotFound, "Review not found for that ID")
                }
                if (error instanceof UnauthorizedError) {
                    return jsendFailWithMessage(res, error.statusCode, error.message)
                }
                return jsendError(res, HttpStatusCode.InternalServerError, `Could not post comment: ${error}`)
            }
        default:
            methodNotAllowedError(res, ["GET", "POST"])
    }
}

const commentWithAuthor = Prisma.validator<Prisma.ReviewCommentDefaultArgs>()({
    include: {
        author: true
    }
})
export type CommentWithAuthor = Prisma.ReviewCommentGetPayload<typeof commentWithAuthor>

async function getComments(reviewId: string): Promise<CommentWithAuthor[]> {
    return prisma.reviewComment.findMany({
        where: {
            reviewId: Number(reviewId)
        },
        include: {
            author: true
        }
    }) 
}

async function postComment(reviewId: string, content: string, session: Session | null) {
    if (!session) {
        throw new UnauthorizedError
    }

    return prisma.reviewComment.create({
        data: {
            content: content,
            authorId: session.user.id,
            reviewId: Number(reviewId)
        }
    })
}