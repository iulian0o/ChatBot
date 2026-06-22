# ChatBot - Code Reviewer

## Collaborators

| Student | Primary role |
|---------|-------------|
| Costi-Iulian Asanache| Frontend + Server Bootstrap + Docker setupt |
| Jaimie Mathangi | Middleware layer |
| Maxim Beridze | LLM integration layer |
| Nam Khan LE | API routes layer |

Users paste code snippets into the chat. The bot reviews the code, identifies bugs, suggests improvements, flags security issues, and explains its reasoning. Supports multiple languages (JS, Python, Java, etc.). 
Conversation history lets users ask follow-up questions on the same snippet.

```
                User browser
                     │  HTTP
                     V
┌────────────────────────────────────────────┐
│              docker-compose.yml            │
│                                            │
│           ┌─────────────────────┐          │
│           │  Frontend container │          │
│           │  React · port 3000  │          │
│           └──────────┬──────────┘          │
│                      │ REST API            │
│                      V                     │
│  ┌──────────────────────────────────────┐  │
│  │   Backend container · Node.js · 4000 │  │
│  │                                      │  │
│  │  [A] server.js   [B] middleware/     │  │
│  │  [C] llm/        [D] routes/         │  │
│  └──────────────────┬───────────────────┘  │
└─────────────────────┼──────────────────────┘
                      │ HTTPS
                      ▼
                    LLM API 
```

*...Still Processing...*