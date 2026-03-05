import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retreive the authheader from the req object
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('An authentication error occured');
        }

        // Separates Bearer from the token and only selected the token
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('An authentication error occured');
        }

        // Decodes the jwt agains the secret defined in the env file
        const decoded = jwt.verify(token, process.env['JWT_TOKEN']!);

        // Adds the username to the request object if a username exists in the jwt token
        if (typeof decoded === 'object' && 'username' in decoded) {
            req.username = decoded['username'];
            return next();
        }

    } catch (error) {
        next(error);
    }
};
