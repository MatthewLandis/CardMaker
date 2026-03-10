import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { routes } from './routes/route.js';

const app = express();

const clientHost = process.env['ENV']! === 'production' ? 'https://cardmaker-frontend-production.up.railway.app' : 'http://localhost:4200';

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true })); //fixes "PayloadTooLargeError: request entity too large" error when sending large images

app.use(cors({ origin: [clientHost], credentials: true }));

app.use(express.json());

app.use('/api', routes);

app.listen(process.env['PORT']!, () => {
	console.log(`Server is running on port ${process.env['PORT']!}`);
});
