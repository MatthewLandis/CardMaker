import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { routes } from './route.js';

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true })); //fixes "PayloadTooLargeError: request entity too large" error when sending large images

app.use(cors({ origin: ['http://localhost:4200'], credentials: true }));

app.use(express.json());

app.use('/api', routes);

app.listen(process.env['PORT']!, () => {
	console.log(`Server is running on port ${process.env['PORT']!}`);
});
