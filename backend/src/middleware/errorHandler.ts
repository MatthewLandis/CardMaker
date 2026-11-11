import { Request, Response, NextFunction } from 'express';

// An error that carries the HTTP status code and a message that is safe to show to the user.
export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

// Catches every error passed to next(error) and turns it into a JSON response,
// instead of Express's default HTML page with a stack trace.
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof HttpError) {
        res.status(error.status).json({ message: error.message });
        return;
    }

    // Postgres unique violation, e.g. registering a username that already exists
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
        res.status(409).json({ message: 'That username is already taken' });
        return;
    }

    console.error(error);
    res.status(500).json({ message: 'Something went wrong on the server' });
}
