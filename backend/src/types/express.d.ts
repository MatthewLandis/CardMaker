import 'express';

declare global {
	namespace Express {
		interface Request {
			username: string;
		}
	}
}
