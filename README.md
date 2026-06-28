# Code Reviewer Chatbot

A web-based AI chatbot that reviews code snippets for bugs, security issues, performance, and style. Supports multi-turn conversation, persistent chat history per user, and account-based session isolation.

---

## Team

| Student | Name | Responsibility |
|---|---|---|
| A | Iulian | Frontend (React), Express server bootstrap, CORS, Docker |
| B | Jaimie | Middleware — validation, rate limiting, error handling, logging |
| C | Maxim | LLM integration — Groq API, prompt engineering, conversation history |
| D | Nam Khan | API routes, SQLite database, authentication, session persistence |

---

## What each student built

**Iulian** built the full React frontend: a ChatGPT-style interface with a session sidebar, chat bubbles, markdown rendering, login and register pages, and protected routes. He also wrote the Express server entry point, CORS configuration, both Dockerfiles, and the docker-compose setup.

**Jaimie** wrote the middleware layer: input validation, a global error handler, rate limiting at 5 requests per second per IP, and a request logger.

**Maxim** built the LLM integration: the Groq API client, the system prompt defining the code reviewer persona, conversation history formatting, and per-language prompt hints.

**Nam Khan** implemented the API routes, SQLite database schema, and full authentication system. He added user registration and login with bcrypt password hashing, 7-day persistent tokens stored as cookies, and per-user session and message storage. Each user's chat history is isolated — no account can see another account's sessions.

---

## Running the project

### 1. Clone the repository

```bash
git clone https://github.com/<your-org>/code-reviewer.git
cd code-reviewer
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in your values:

```
LLM_PROVIDER=groq
LLM_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=your_groq_api_key_here
PORT=4000
```

Get a free Groq API key at https://console.groq.com

### 3. Build and start

```bash
docker-compose up --build -d
```

### 4. Open the app

Go to http://localhost:3000

### 5. Useful commands

```bash
docker-compose ps          # check running containers
docker-compose logs backend  # view backend logs
docker-compose down        # stop containers
docker-compose up --build -d  # rebuild after changes
```

---

## Authentication

### Register

Go to http://localhost:3000/register

- Username must be at least 3 characters
- Password must be at least 6 characters
- Confirm password must match exactly — the form blocks submission if the two fields do not match
- If the username is already taken, the backend returns an error and registration is blocked

### Login

Go to http://localhost:3000/login

- Enter your username and password
- On success, a 7-day session cookie is set automatically
- You stay logged in across page refreshes and browser restarts for 7 days

### Session isolation

Each account has its own chat history. Sessions and messages are stored in SQLite and tied to the user who created them. Logging into a different account shows only that account's sessions — no chat history is shared or inherited between accounts.

### Sign out

Click "Sign out" in the navbar. The session token is deleted from the database and the cookie is cleared immediately.

---

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Login and receive session cookie |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/auth/me` | Check current session |
| GET | `/api/sessions` | Get all sessions for logged-in user |
| POST | `/api/sessions` | Create a new session |
| PATCH | `/api/sessions/:id` | Update session title |
| DELETE | `/api/sessions/:id` | Delete session and messages |
| GET | `/api/sessions/:id/messages` | Get messages for a session |
| POST | `/api/sessions/:id/messages` | Append a message |
| POST | `/api/review` | Submit code for AI review |
| GET | `/api/health` | Check server and model status |

---
