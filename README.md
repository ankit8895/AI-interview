# Intervuedot.AI

An AI-powered mock interview platform that parses a candidate’s resume, generates tailored interview questions, evaluates answers, and returns a scored report. The repository is split into a React frontend and an Express/MongoDB backend with OpenRouter-based AI evaluation logic.






## Table of Contents

- [Overview](#overview)
- [Why It Is Useful](#why-it-is-useful)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Flow](#usage-flow)
- [API Surface](#api-surface)
- [Help and Resources](#help-and-resources)
- [Maintainers and Contributions](#maintainers-and-contributions)

## Overview

AI Interview lets users upload a PDF resume, extract structured candidate details, choose an interview mode, generate five interview questions, submit answers, and receive a final performance summary with confidence, communication, and correctness scores.

The backend exposes auth, user, and interview APIs from `backend/src/server.js`, while the frontend currently defines routes for `HomePage`, `AuthPage`, and `InterviewPage` in `frontend/src/App.jsx`.

## Why It Is Useful

The project helps developers and job seekers simulate realistic interviews with role-aware questions generated from resume content rather than generic prompts.

Key benefits:

- Resume-aware interview setup using server-side PDF parsing with `pdfjs-dist`.
- Personalized question generation through OpenRouter with the `openai/gpt-4o-mini` model.
- Per-answer evaluation across confidence, communication, and correctness, plus short actionable feedback.
- Persistent interview history stored in MongoDB using the `Interview` model and nested question documents.
- Protected routes with JWT-based auth middleware and cookie handling for authenticated interview sessions.

## Project Structure

```text
AI-interview/
├── backend/
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── server.js
└── frontend/
    ├── package.json
    └── src/
        ├── components/
        ├── lib/
        ├── pages/
        ├── redux/
        ├── utils/
        ├── App.jsx
        └── main.jsx
```

Important backend files:

- `backend/src/controllers/interview.controller.js` handles resume parsing, question generation, answer submission, and final scoring.
- `backend/src/services/openRouter.service.js` sends chat-completion requests to OpenRouter.
- `backend/src/models/interview.model.js` stores role, mode, resume text, question data, and final status.

Important frontend files:

- `frontend/src/App.jsx` wires the main routes.
- `frontend/src/pages/InterviewPage.jsx` is the interview flow entry screen.
- `frontend/src/pages/InterviewReportPage.jsx` exists in the codebase for the reporting experience.

## Getting Started

### Prerequisites

- Node.js 18 or newer.
- npm.
- A MongoDB database URI.
- An OpenRouter API key and endpoint URL.

### Installation

```bash
git clone https://github.com/ankit8895/AI-interview.git
cd AI-interview

cd backend
npm install

cd ../frontend
npm install
```

The backend depends on Express, Mongoose, Axios, Multer, `pdfjs-dist`, `jsonwebtoken`, and `cookie-parser`, while the frontend is a Vite React app with pages and Redux-based state organization.

### Environment Setup

Create `backend/.env` with the variables used in `backend/src/config/env.js`:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API=https://openrouter.ai/api/v1/chat/completions
```

### Run Locally

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The backend dev server runs from `src/server.js` with Nodemon, and the frontend uses Vite for local development.

## Usage Flow

A typical interview session follows this sequence:

1. Upload a resume to `POST /api/interview/resume`.
2. Extract role, experience, projects, skills, and raw resume text from the PDF.
3. Send interview setup data to `POST /api/interview/generate-questions`.
4. Receive five generated questions with difficulty and time limits.
5. Submit answers through `POST /api/interview/submit-answer`.
6. Finish the session through `POST /api/interview/finish` to compute the final score.

Example question-generation request:

```json
{
  "role": "Frontend Developer",
  "experience": "2 years",
  "mode": "Technical",
  "resumeText": "Built React dashboards and Node.js APIs.",
  "projects": ["Admin Dashboard", "Chat App"],
  "skills": ["React", "Node.js", "MongoDB"]
}
```

Example answer-submission request:

```json
{
  "interviewId": "664f1d4b4a2a4f0012345678",
  "questionIndex": 0,
  "answer": "I usually begin by profiling renders and memoizing heavy components.",
  "timeTaken": 42
}
```

## API Surface

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/*` | Authentication routes mounted from `auth.route.js`. |
| GET/POST | `/api/user/*` | User routes mounted from `user.route.js`. |
| POST | `/api/interview/resume` | Upload and analyze resume PDF. |
| POST | `/api/interview/generate-questions` | Create interview and generate questions. |
| POST | `/api/interview/submit-answer` | Evaluate a single answer. |
| POST | `/api/interview/finish` | Calculate and return final report summary. |

## Help and Resources

For project help, start with these files and services:

- `backend/src/controllers/interview.controller.js` for interview lifecycle logic.
- `backend/src/services/openRouter.service.js` for AI integration behavior.
- `backend/src/config/env.js` for required backend configuration keys.
- [OpenRouter documentation](https://openrouter.ai/docs) for model and API details.
- [Mongoose documentation](https://mongoosejs.com/docs/) for schema and query behavior.
- [Vite documentation](https://vite.dev/guide/) for frontend development workflow.

## Maintainers and Contributions

The repository owner is `ankit8895`, and the codebase is organized as an open source project on GitHub.

Suggested contribution workflow:

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes in either `frontend/` or `backend/`.
4. Test the updated flow locally.
5. Open a pull request with a concise description of the change.

For larger changes, keep interview prompts, API contracts, and Mongoose schema updates aligned across both frontend and backend to avoid breaking the interview flow.
