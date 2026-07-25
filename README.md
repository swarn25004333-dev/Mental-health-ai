# 💚 Mental Health AI — AI Wellness Companion & Mood Tracker

Mental Health AI is a full-stack, production-ready web application designed to support personal emotional well-being. It provides an empathetic **AI Companion** powered by **Google Gemini 1.5 Flash**, daily **Mood Tracking**, visual **Chart.js Mood Analytics**, **PHQ-2 Depression Screening**, and immediate **24/7 Crisis Resource Guidance**.

---

## 🌟 Key Features

- **🤖 AI Companion ("Aria")**: Empathic, non-judgmental conversational AI with context memory and crisis detection.
- **🚨 Emergency Crisis Detection**: Automatically detects self-harm or crisis language and triggers an emergency modal redirecting to 24/7 helplines (988, Crisis Text Line).
- **😊 Daily Mood Tracker**: Select from primary mood states (*Happy*, *Sad*, *Stressed*, *Calm*) and save custom journal notes.
- **📊 Chart.js Trend Analytics**: Visualize emotional trajectory line charts filtered by **7 Days**, **30 Days**, or **All Time**.
- **📋 PHQ-2 Screening**: Standardized clinical screening assessment with instant score calculation and recommendations.
- **🔒 Supabase Auth & Security**: User authentication (Signup/Login/Session persistence) with Row Level Security (RLS) policies.
- **🎨 Glassmorphism UI & Dark Mode**: Responsive design with Tailwind CSS, custom color palettes, and light/dark theme toggle.

---

## 🏗️ Technology Stack

### **Frontend**
- **Core**: React 18 (Vite 6)
- **Styling**: Tailwind CSS (with `@tailwindcss/typography`)
- **Routing**: React Router v7
- **HTTP Client**: Axios (with JWT interceptors)
- **Charts**: Chart.js & `react-chartjs-2`
- **Markdown**: `react-markdown` & `remark-gfm`
- **Icons**: React Icons (`react-icons/fi`)

### **Backend**
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Validation**: Pydantic v2 & Pydantic Settings
- **AI SDK**: Google GenAI SDK (`google-generativeai`)
- **Database Client**: Supabase Python SDK
- **Security**: Python-jose (JWT decoding), Passlib (Bcrypt)

### **Database & Auth**
- **Supabase**: PostgreSQL database with Row Level Security & Supabase Auth.

---

## 📁 Repository Structure

```text
METAL HEALTH/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routes (auth, chatbot, mood, questionnaire, dashboard)
│   │   ├── core/         # Settings, logging, security
│   │   ├── database/     # Supabase client & database helpers
│   │   ├── models/       # Database ORM models
│   │   ├── prompts/      # System prompt & crisis instructions for Gemini
│   │   ├── schemas/      # Pydantic validation schemas
│   │   └── services/     # Gemini AI, chat orchestration, mood, phq2 services
│   ├── main.py           # FastAPI application entry point
│   └── requirements.txt  # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Modular React components (auth, chat, mood, common)
│   │   ├── context/      # AuthContext & ThemeContext
│   │   ├── hooks/        # Custom hooks (useAuth, useChat)
│   │   ├── layouts/      # MainLayout, Navbar, Sidebar, Footer
│   │   ├── lib/          # Supabase client setup
│   │   ├── pages/        # Route pages (Dashboard, Chatbot, MoodTracker, MoodHistory, PHQ-2, Profile)
│   │   ├── routes/       # ProtectedRoute & AppRoutes
│   │   └── services/     # Axios API services (chatService, moodService, authService)
│   └── package.json      # Node.js frontend dependencies
├── supabase_schema.sql   # Complete database creation & RLS script
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `3.10` or higher
- **Supabase Account**: [Create free project](https://supabase.com)
- **Google Gemini API Key**: [Get free key at Google AI Studio](https://aistudio.google.com/app/apikey)

---

### 1️⃣ Database Setup (Supabase)

1. Open your **Supabase Dashboard** → **SQL Editor**.
2. Copy the contents of [`supabase_schema.sql`](./supabase_schema.sql).
3. Run the script to create tables (`profiles`, `chat_history`, `mood_history`, `phq2_results`) and enable Row Level Security (RLS).

---

### 2️⃣ Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside `backend/`:
   ```env
   PROJECT_NAME="Mental Health AI"
   API_V1_STR="/api/v1"
   DEBUG=True

   SUPABASE_URL="https://your-supabase-project.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

   GEMINI_API_KEY="your-google-gemini-api-key"
   ```
5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   API Docs available at: `http://localhost:8000/docs`

---

### 3️⃣ Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `frontend/`:
   ```env
   VITE_API_BASE_URL="http://localhost:8000/api/v1"
   VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Access application at: `http://localhost:5173`

---

## 🔑 Environment Variables Reference

| Variable | Scope | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | Backend Only | Google Gemini AI API Key (never exposed to frontend) |
| `SUPABASE_URL` | Backend & Frontend | Your Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend Only | Supabase Service Role Key for backend queries |
| `VITE_SUPABASE_ANON_KEY` | Frontend Only | Supabase Anon Key for browser client authentication |
| `VITE_API_BASE_URL` | Frontend Only | Base URL pointing to the FastAPI backend (`http://localhost:8000/api/v1`) |

---

## 🚀 API Endpoint Reference

### **AI Companion**
- `POST /api/v1/chatbot/chat`: Send message to Gemini AI companion (returns response & crisis flag).
- `GET /api/v1/chatbot/history`: Get user's conversation history.
- `DELETE /api/v1/chatbot/history`: Clear all chat history.

### **Mood Tracking**
- `POST /api/v1/mood/log`: Log daily mood entry with optional note.
- `GET /api/v1/mood/today`: Get today's logged mood.
- `GET /api/v1/mood/history?days=7`: Fetch history filtered by days (`7`, `30`, `all`).

### **Screening & Assessments**
- `POST /api/v1/questionnaire/phq-2`: Submit PHQ-2 depression screening questions.
- `GET /api/v1/questionnaire/phq-2/history`: Get user's past screening results.

---

## 🛡️ Medical Disclaimer

> **Mental Health AI is an informational and supportive tool, not a licensed therapist or medical professional.**
> It does not provide medical diagnoses or treatment. If you are experiencing a mental health emergency, please call **988** or go to the nearest emergency room.

---

## 📄 License

This project is open source and available under the **MIT License**.
