import { HttpStatusCode } from "axios"
import type { NextApiResponse } from 'next'

export function jsendError(res: NextApiResponse, status: number, message: string) {
    return res.status(status).json({
        "status": "error",
        "message": message
    })
}

export function methodNotAllowedError(res: NextApiResponse, allow: String[]) {
    let allowString = allow.join(", ")

    return res.status(HttpStatusCode.MethodNotAllowed)
        .setHeader("Allow", allowString)
        .json({
            "status": "fail",
            "data": {
                "title": `This route supports the following methods: ${allowString}`
            }
        })
}

/**
 * An error with a corresponding HTTP status code.
 */
export abstract class ErrorWithStatusCode extends Error {
    abstract statusCode: HttpStatusCode
}

/**
 * An error that corresponds to HTTP Forbidden.
 */
export class ForbiddenError extends ErrorWithStatusCode {
    // https://stackoverflow.com/a/41429145
    constructor() {
        super("You don't have permission to perform that action")
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }

    statusCode = HttpStatusCode.Forbidden
}

/**
 * An error that corresponds to HTTP Unauthorized.
 */
export class UnauthorizedError extends ErrorWithStatusCode {
    // https://stackoverflow.com/a/41429145
    constructor() {
        super("You must be signed in")
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }

    statusCode = HttpStatusCode.Unauthorized
}