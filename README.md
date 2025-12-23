# JobPilot 🚀

> AI-Powered Candidate Search Platform

JobPilot is an intelligent recruitment platform that leverages AI agents to help you find the perfect candidates for your job openings. Using natural language processing and advanced SQL query generation, it makes candidate search as simple as describing what you're looking for.

## 🌟 Features

- **Natural Language Search**: Describe your ideal candidate in plain English
- **AI-Powered Query Generation**: Intelligent SQL query generation using CrewAI agents
- **Real-Time Progress Updates**: Server-Sent Events (SSE) for live search status
- **Modern UI**: Beautiful, responsive interface built with React and Shadcn UI
- **Semantic Understanding**: Understands skills, experience levels, and job requirements
- **Database Integration**: Direct integration with Supabase for candidate data

## 🏗️ Architecture

JobPilot consists of three main components:

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn UI + Radix UI components
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)

### Backend API
- **Framework**: FastAPI (Python)
- **API Type**: RESTful with SSE support
- **CORS**: Enabled for cross-origin requests
- **Endpoints**: 
  - `/complete` - Submit search queries
  - `/events` - SSE stream for real-time updates
  - `/emit` - Broadcast events to connected clients

### AI Agent System
- **Framework**: CrewAI
- **Database**: Supabase (PostgreSQL)
- **LLM Provider**: OpenAI / Groq / Ollama (configurable)
- **Agent**: SQL Expert specialized in candidate search
- **Workflow**: Multi-step semantic query construction

## 🛠️ Tech Stack

### Frontend Dependencies
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- Shadcn UI components
- Tailwind CSS 3.4.17
- React Router DOM 6.30.1
- TanStack Query 5.83.0
- Lucide React (icons)

### Backend Dependencies
- FastAPI
- CrewAI 1.6.1
- Supabase 2.27.0
- LiteLLM 1.80.10
- Pydantic 2.12.5

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 18.x (with npm or bun)
- **Python**: >= 3.10, < 3.14
- **uv**: Python package manager (recommended)
- **CrewAI**: AI agent framework
- **Supabase Account**: For database access

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/VijeshVS/JobPilot.git
cd JobPilot
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Backend Setup

#### Install Python Dependencies

```bash
cd backend

# Install uv (if not already installed)
pip install uv

# Install FastAPI dependencies
pip install fastapi uvicorn pydantic
```

#### Setup AI Agent

```bash
cd backend/agents/sql_pilot

# Install CrewAI dependencies
crewai install
# or
uv sync
```

### 4. Environment Configuration

Create a `.env` file in `backend/agents/sql_pilot/`:

```bash
# OpenAI Setup (Primary)
MODEL=gpt-4o-mini
OPENAI_API_KEY=your_openai_api_key_here

# Alternative: Groq Setup
# MODEL=groq/llama-3.3-70b-versatile
# GROQ_API_KEY=your_groq_api_key_here

# Alternative: Local Ollama Setup
# MODEL=ollama/llama2
# API_BASE=http://localhost:11434

# Supabase Configuration
PROJECT_REF=your_project_ref
SUPABASE_AUTH_TOKEN=your_auth_token
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# CrewAI Settings
CREWAI_TRACING_ENABLED=true
```

## 🎯 Usage

### Starting the Application

#### 1. Start the Backend API

```bash
cd backend
python main.py
```

The backend API will run on `http://localhost:8000`

#### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

### Using JobPilot

1. **Enter Your Search Query**: Describe the candidate you're looking for in natural language
   - Example: "Find me backend developers with 3+ years of experience in Python"
   - Example: "Show me frontend developers who know React and TypeScript"
   - Example: "Find freshers with good CGPA interested in full-stack development"

2. **Watch the AI Work**: The system will show real-time progress as the AI agent:
   - Analyzes your query
   - Identifies relevant database fields
   - Constructs semantic SQL queries
   - Executes the search
   - Returns matched candidates

3. **Review Results**: View candidate profiles with details including:
   - Name and contact information
   - Education and CGPA
   - Years of experience
   - Field of study
   - Skills and technologies

## 📁 Project Structure

```
JobPilot/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── SearchPrompt.tsx
│   │   │   ├── CandidateCard.tsx
│   │   │   └── AILoadingOverlay.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Index.tsx
│   │   │   └── NotFound.tsx
│   │   ├── types/           # TypeScript type definitions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── data/            # Mock data and constants
│   │   └── lib/             # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # FastAPI backend
│   ├── main.py              # FastAPI application entry point
│   └── agents/
│       └── sql_pilot/       # CrewAI agent system
│           ├── src/
│           │   └── sql_pilot/
│           │       ├── config/
│           │       │   ├── agents.yaml    # Agent definitions
│           │       │   └── tasks.yaml     # Task definitions
│           │       ├── tools/
│           │       │   ├── supabase_tools.py
│           │       │   └── custom_tool.py
│           │       ├── crew.py            # Crew orchestration
│           │       └── main.py            # Agent entry point
│           ├── knowledge/   # Knowledge base for AI
│           │   ├── technology.json
│           │   └── tech.txt
│           ├── pyproject.toml
│           └── .env.example
│
└── README.md                # This file
```

## 🔌 API Endpoints

### POST `/complete`
Submit a candidate search query.

**Request:**
```json
{
  "input": "Find backend developers with Python experience"
}
```

**Response:**
```json
{
  "result": "{\"candidates\": [...]}"
}
```

### GET `/events`
Server-Sent Events stream for real-time progress updates.

**Response:** Stream of events with agent progress information

### POST `/emit`
Broadcast an event to all connected SSE clients.

**Request:**
```json
{
  "type": "progress",
  "message": "Processing query..."
}
```

## 🤖 AI Agent Workflow

The SQL Expert agent follows a strict 4-step workflow:

### Step 1: Schema Identification
- Identifies relevant database tables and columns
- Maps user query to database schema

### Step 2: Data Discovery
- Queries DISTINCT values from relevant columns
- Retrieves actual data without filtering

### Step 3: Semantic Validation
- Matches user concepts to actual database values
- Uses only retrieved values (no guessing)

### Step 4: Query Construction
- Builds precise SQL queries
- Combines filters logically
- Executes and returns results

## 🎨 Frontend Components

### Key Components

- **SearchPrompt**: Natural language search input with submit button
- **CandidateCard**: Individual candidate profile display
- **CandidateGrid**: Grid layout for candidate results
- **AILoadingOverlay**: Real-time agent progress visualization
- **NavLink**: Navigation component for routing

### Hooks

- **useSSEEvents**: Manages Server-Sent Events connection
- **useToast**: Toast notifications for user feedback

## 🔧 Configuration

### Frontend Configuration

Edit `vite.config.ts` to customize build settings:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

### Backend Configuration

The backend API URL is configured in the frontend code:
- Development: `http://localhost:8000`
- Update in `src/pages/Index.tsx` for production

### Agent Configuration

Customize the AI agent behavior:

- **agents.yaml**: Define agent roles, goals, and backstory
- **tasks.yaml**: Configure agent tasks and expected outputs
- **knowledge/**: Add domain knowledge for better semantic understanding

## 🧪 Development

### Frontend Development

```bash
cd frontend

# Development server with hot reload
npm run dev

# Type checking
npm run build

# Linting
npm run lint
```

### Backend Development

```bash
cd backend

# Run with auto-reload
uvicorn main:app --reload

# Test agent directly
cd agents/sql_pilot
crewai run
```

### Testing the Agent

```bash
cd backend/agents/sql_pilot
python test.py
```

## 📊 Database Schema

JobPilot expects a candidates table with the following structure:

```sql
candidates (
  candidate_id: integer,
  name: string,
  email: string,
  usn: string,
  phone: string,
  gender: string,
  cgpa: float,
  field_of_study: string,
  years_of_experience: integer,
  created_at: timestamp,
  updated_at: timestamp
)
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation for new features
- Test your changes thoroughly
- Ensure all linters pass

## 🐛 Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
- Ensure backend is running on port 8000
- Check CORS configuration in `backend/main.py`

**Agent execution timeout:**
- Increase timeout in `backend/main.py` (default: 120s)
- Check your LLM API key and quotas

**Database connection errors:**
- Verify Supabase credentials in `.env`
- Ensure database schema matches expected structure

**SSE events not received:**
- Check browser console for connection errors
- Verify `/events` endpoint is accessible

## 📝 License

This project is available under the MIT License.

## 👥 Authors

- **VijeshVS** - Initial work - [GitHub](https://github.com/VijeshVS)

## 🙏 Acknowledgments

- [CrewAI](https://crewai.com) - Multi-agent AI framework
- [Shadcn UI](https://ui.shadcn.com) - Beautiful UI components
- [FastAPI](https://fastapi.tiangolo.com) - Modern Python web framework
- [Supabase](https://supabase.com) - Open source Firebase alternative

## 📞 Support

For support, questions, or feedback:
- Open an issue on [GitHub](https://github.com/VijeshVS/JobPilot/issues)
- Contact the maintainers

---

**Built with ❤️ by developers, for recruiters**
