/**
 * Helper methods and types that should only be used by the backend.
 */
import { Prisma } from "@prisma/client"
import { HttpStatusCode } from "axios"
import type { NextApiRequest, NextApiResponse } from "next"

export function isString(s: string | string[] | undefined): s is string {
    return typeof s === "string"
}

export function jsendSuccess(res: NextApiResponse, status: number, data: any) {
    return res.status(status).json({
        status: "success",
        data: data,
    })
}

export function jsendError(
    res: NextApiResponse,
    status: number,
    message: string
) {
    return res.status(status).json({
        status: "error",
        message: message,
    })
}

export function jsendFailWithMessage(res: NextApiResponse, status: number, message: string) {
    return res.status(status).json({
        status: "fail",
        message: message
    })
}

export function jsendFailWithData(res: NextApiResponse, status: number, data: any) {
    return res.status(status).json({
        status: "fail",
        data: data
    })
}

export function methodNotAllowedError(res: NextApiResponse, allow: String[]) {
    let allowString = allow.join(", ")

    return res
        .status(HttpStatusCode.MethodNotAllowed)
        .setHeader("Allow", allowString)
        .json({
            status: "fail",
            data: {
                title: `This route supports the following methods: ${allowString}`,
            },
        })
}

// handle() and its associated types form an abstraction
// to avoid writing boilerplate switch statements for every API route.
type HandlerFunction = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
export function handle(req: NextApiRequest, res: NextApiResponse, handlerFunctions: {
    GET?: HandlerFunction
    POST?: HandlerFunction
    DELETE?: HandlerFunction
    PUT?: HandlerFunction
    PATCH?: HandlerFunction
}) {
    if (!req.method || !(req.method in handlerFunctions)) {
        return methodNotAllowedError(res, Object.keys(handlerFunctions))
    }
    let handlerFunction = handlerFunctions[req.method as keyof typeof handlerFunctions]!
    return handlerFunction(req, res)
}

// A Rust-like result type.
// https://imhoff.blog/posts/using-results-in-typescript
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

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

export class SpotifyError extends ErrorWithStatusCode {
    constructor() {
        super("There was an error fetching the Spotify API")
        Object.setPrototypeOf(this, SpotifyError.prototype)
    }

    statusCode: HttpStatusCode = HttpStatusCode.BadGateway
}

export function isNotFoundError(error: any): boolean {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code === "P2025") {
            return true
        }
    }
    return false
}

export function isClientError(error: any): boolean {
    return error instanceof ErrorWithStatusCode && Math.floor(error.statusCode / 100) === 4
}