# Yu Quan Ang — Personal Portfolio

Welcome to the repository for my personal portfolio website! This project is a modern, modular React web application built with Vite, designed to showcase my background in Computer Science, Business, and my technical project experiences.

It features a premium design system with complex bidirectional GSAP animations, a custom magnetic cursor, butter-smooth Lenis scrolling, and an AI-powered chatbot that answers questions about my background using Retrieval-Augmented Generation (RAG).

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Animations** | [GSAP](https://gsap.com/) + `@gsap/react` |
| **Scrolling** | [Lenis](https://lenis.studiofreight.com/) |
| **Styling** | Vanilla CSS (global scoped) |
| **AI Chatbot** | [Vercel AI SDK](https://sdk.vercel.ai/) + NVIDIA NIM (`openai/gpt-oss-120b`) |
| **Embeddings** | NVIDIA `nv-embedqa-e5-v5` (256-dim vectors via MRL truncation) |
| **Vector Search** | In-memory cosine similarity (static JSON — no database!) |
| **Deployment** | [Netlify](https://netlify.com/) (frontend + serverless function) |

## 🤖 AI Chatbot — How It Works

The site includes an AI chat widget that allows recruiters and visitors to ask natural language questions about my background. It uses a **Retrieval-Augmented Generation (RAG)** pipeline:

1. **Seeding (one-time, run locally):** `npm run seed` reads `resume.pdf` and a hardcoded `personalFacts[]` array in `seed.js`, generates NVIDIA vector embeddings for every chunk, and saves them to `netlify/functions/data/embeddings.json`.

2. **At query time (serverless):** When a user sends a message, the Netlify Function (`netlify/functions/chat.js`) embeds the query, runs an **in-memory cosine similarity search** against the pre-generated JSON file, retrieves the top 5 most relevant chunks, and streams a grounded response from the NVIDIA LLM.

> **No external database required.** The embeddings are bundled directly with the Netlify deployment as a static JSON file.

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/en) v18 or higher

### 1. Clone the repository
```bash
git clone https://github.com/YuQuanang/Personal-Resume.git
cd Personal-Resume
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example env file and fill in your credentials:
```bash
cp .env.example .env
```

The only variable required is:
```env
NVIDIA_API_KEY=your_nvidia_nim_api_key_here
```

### 4. Generate embeddings (required for the chatbot)
Place your resume PDF at the project root as `resume.pdf`, then run:
```bash
npm run seed
```
This generates `netlify/functions/data/embeddings.json`. **Commit this file** — it must be deployed alongside the function.

### 5. Run the development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## ♻️ Updating the Chatbot Knowledge Base

Whenever you update your resume or want the chatbot to know something new:

1. Replace `resume.pdf` at the project root with your new CV.
2. Edit the `personalFacts[]` array at the top of `seed.js` as needed.
3. Re-run `npm run seed`.
4. Commit `netlify/functions/data/embeddings.json` and `resume.pdf`.
5. Push to trigger a new Netlify deployment.

## ☁️ Deployment (Netlify)

The frontend and the `/api/chat` serverless function are both deployed automatically by Netlify on every push to `main`.

**Required environment variables in the Netlify dashboard:**
```
NVIDIA_API_KEY
```

## 📦 Building for Production

```bash
npm run build
```
This generates a `dist/` folder with all minified assets, ready for static hosting.

## 📁 Project Structure

```
├── netlify/
│   └── functions/
│       ├── chat.js              # Serverless RAG chat endpoint (/api/chat)
│       └── data/
│           └── embeddings.json  # Pre-generated resume embeddings (committed)
├── public/                      # Static assets (favicon, etc.)
├── src/
│   ├── components/
│   │   ├── sections/            # Page sections (Hero, About, Projects, etc.)
│   │   └── ui/                  # Reusable UI (CustomCursor, ChatWidget, etc.)
│   ├── hooks/                   # Custom React hooks
│   └── index.css                # Global stylesheet & design tokens
├── resume.pdf                   # Source resume for embedding generation
├── seed.js                      # One-time script to generate embeddings
└── .env.example                 # Environment variable template
```

---
*Designed & Built by Yu Quan Ang*
