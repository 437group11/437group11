/**
 * Endpoints for a specific review comment.
 */

import { HttpStatusCode } from "axios"
import { NextApiRequest, NextApiResponse } from "next"
import { Session, getServerSession } from "next-auth"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { ForbiddenError, UnauthorizedError, handle, isNotFoundError, jsendError, jsendFailWithData, jsendFailWithMessage, jsendSuccess } from "utils/api"
import prisma from "utils/db"

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    handle(req, res, {DELETE: handleDelete})
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string }

    try {
        await deleteComment(id, await getServerSession(req, res, authOptions))
        return jsendSuccess(res, HttpStatusCode.Ok, {})
    } catch (error) {
        if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
            return jsendFailWithMessage(res, error.statusCode, error.message)
        }
        if (isNotFoundError(error)) {
            return jsendFailWithData(res, HttpStatusCode.NotFound, {
                id: "No review comment found for that ID"
            })
        }
        return jsendError(res, HttpStatusCode.InternalServerError, `Could not delete review comment: ${error}`)
    }
}

async function deleteComment(id: string, session: Session | null) {
    if (!session) {
        throw new UnauthorizedError()
    }

    const comment = await prisma.reviewComment.findUniqueOrThrow({
        where: {
            id: Number(id)
        }
    })

    if (comment.authorId !== session.user.id) {
        throw new ForbiddenError()
    }

    return prisma.reviewComment.delete({
        where: {
            id: Number(id)
        }
    })
}
