import './config.js'; // must stay first: checks the .env settings
import express from 'express';
import cors from 'cors';
import { routes } from './routes/route.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const port = process.env['PORT'] || 4000;

const clientHost = process.env['ENV'] === 'production' ? 'https://cardmaker-frontend-production.up.railway.app' : 'http://localhost:4200';

// Large limits because cards are sent as base64 images; fixes "PayloadTooLargeError: request entity too large"
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.use(cors({ origin: [clientHost] }));

app.use('/api', routes);

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
