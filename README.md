# CardMaker

As a fan of Yu-Gi-Oh! I often found myself creating cards. However, the card makers out there are not optimized and are riddled with ads. So, I took on the challenge of creating my own card maker. My version is built with several quality-of-life improvements and uses high-quality assets to make any card created look identical to real life.

<a href='https://cardmaker-frontend-production-47eb.up.railway.app/' target='_blank'>
  <img width="846" height="775" alt="YuGiOh" src="https://github.com/user-attachments/assets/35c0b965-50c7-4aa7-a159-d51b315b03dc" />
</a>

## Running it locally

The project has two parts that run at the same time:

- `backend/`: Express + PostgreSQL API on http://localhost:4000
- `frontend/`: Angular app on http://localhost:4200

You need [Node.js](https://nodejs.org) 20+ and a PostgreSQL database.

### 1. Database and settings (first time only)

1. Create a PostgreSQL database (for example `cardmaker`).
2. Create the tables: `psql "<your connection string>" -f backend/schema.sql`
3. Copy `backend/.env.example` to `backend/.env` and fill in your connection string and a random `JWT_TOKEN`.

### 2. Start the backend

```bash
cd backend
npm install
npm run start:dev
```

### 3. Start the frontend (in a second terminal)

```bash
cd frontend
npm install
npm run start:dev
```

Then open http://localhost:4200.
