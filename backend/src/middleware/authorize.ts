import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from './errorHandler.js';

export const authorize = (req: Request, _res: Response, next: NextFunction) => {
    try {
        // Expects a header of the form "Authorization: Bearer <token>"
        const [scheme, token] = (req.headers.authorization ?? '').split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw new Error('Missing token');
        }

        // Verifies the jwt against the secret defined in the env file
        const decoded = jwt.verify(token, process.env['JWT_TOKEN']!);

        // Adds the username to the request object if a username exists in the jwt token
        if (typeof decoded === 'object' && typeof decoded['username'] === 'string') {
            req.username = decoded['username'];
            return next();
        }

        throw new Error('Token has no username');
    } catch {
        next(new HttpError(401, 'Please log in again'));
    }
};
