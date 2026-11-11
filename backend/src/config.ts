import 'dotenv/config';

// Imported first by server.ts so a missing setting gives a clear message before anything else runs.
const requiredEnv = ['POSTGRES', 'JWT_TOKEN'];
const missingEnv = requiredEnv.filter(name => !process.env[name]);
if (missingEnv.length > 0) {
	console.error(`Missing required environment variables: ${missingEnv.join(', ')}. Copy backend/.env.example to backend/.env and fill it in.`);
	process.exit(1);
}
