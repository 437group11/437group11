/**
 * Endpoints for comments on a review.
 * 
 * GET: get the comments for the review.
 * You can use an array of the exported type ReviewCommentWithAuthor to store the data returned.
 * 
 * POST: post a comment to the review. Must be signed in.
 * Expects a `content` field in the JSON request body that contains the contents of the review.
 */

import { Prisma } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { UnauthorizedError, isNotFoundError, jsendError, jsendFailWithMessage, jsendSuccess, methodNotAllowedError } from "utils/api";
import prisma from "utils/db";
import knock from "utils/knock";

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
                
                // We don't need the result of this, so don't await it.
                notifyReviewAuthor(id, session as Session).then(() => {})

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

const reviewCommentWithAuthor = Prisma.validator<Prisma.ReviewCommentDefaultArgs>()({
    include: {
        author: true
    }
})
export type ReviewCommentWithAuthor = Prisma.ReviewCommentGetPayload<typeof reviewCommentWithAuthor>

async function getComments(reviewId: string): Promise<ReviewCommentWithAuthor[]> {
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

async function notifyReviewAuthor(reviewId: string, session: Session) {
    let review = await prisma.review.findUniqueOrThrow({
        where: {
            id: Number(reviewId)
        },
        select: {
            album: {
                select: {
                    name: true,
                    spotifyId: true
                }
            },
            authorId: true
        }
    })

    if (session.user.id === review.authorId) {
        // Don't notify if it's user's own review
        return
    }

    knock.notify("new-comment-on-review", {
        actor: session.user.id,
        recipients: [review.authorId],
        data: {
            "albumName": review.album.name,
            "albumId": review.album.spotifyId,
            "reviewId": reviewId
        }
    })
}