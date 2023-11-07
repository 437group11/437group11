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