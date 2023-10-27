import type { NextApiResponse } from 'next'

export function jsendError(res: NextApiResponse, status: number, message: string) {
    res.status(status).json({
        "status": "error",
        "message": message
    })
}