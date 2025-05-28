# JAi - AI-Powered Private Journal

JAi is a cross-platform Progressive Web App (PWA) that lets you capture daily thoughts, analyze them with AI, and keep everything fully private. It's designed to be a personal journaling companion with built-in AI insights.

![JAi Logo](https://via.placeholder.com/200x200?text=JAi)

## Features

- **Daily Journal Entries**: Clean, distraction-free text input with mood tracking and optional tags
- **AI Summarizer & Insights**: After each journal entry, the system generates a concise summary or reflection
- **Cross-Platform**: Accessible via a Progressive Web App on Android, iOS, Windows, and Linux
- **Search & Retrieve**: Fast search to find past entries by keywords, mood, tags, or date
- **Privacy-First**: All data encrypted and stored securely in Supabase

## Technology Stack

### Frontend
- Next.js (React)
- TailwindCSS
- Progressive Web App (PWA) capabilities
- Zustand for state management

### Backend
- Node.js with Express
- Supabase for database and authentication
- Ollama for running local LLMs (TinyLlama, Phi-3-mini)

### Deployment
- Backend: Cloud VPS (Hetzner, DigitalOcean)
- Frontend: Vercel/Netlify
- HTTPS with Nginx + Let's Encrypt

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git
- Supabase account (free tier works for personal use)
- For local development of AI features: Ollama installed locally

### Installation

#### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jai.git
   cd jai
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   PORT=3001
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_jwt_secret_key
   OLLAMA_API_URL=http://localhost:11434/api
   OLLAMA_MODEL=tinyllama
   ```

4. Set up the database:
   - Create a new project in Supabase
   - Run the SQL from `backend/src/utils/schema.sql` in the Supabase SQL editor

5. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Ollama Setup (for AI features)

1. Install Ollama from [ollama.com](https://ollama.com)
2. Pull the TinyLlama model:
   ```bash
   ollama pull tinyllama
   ```
3. Start Ollama:
   ```bash
   ollama serve
   ```

## Usage

### Creating a Journal Entry

1. Log in to your account
2. Click on "New Entry" in the navigation
3. Write your thoughts in the journal editor
4. Select your mood and add optional tags
5. Click "Generate Summary" to get AI insights about your entry
6. Save your entry

### Searching Journal Entries

1. Click on "Search" in the navigation
2. Enter keywords in the search box
3. Use filters to narrow down by mood, tags, or date range
4. Click on an entry to view it in full

### Viewing and Editing Entries

1. From the home page or search results, click on an entry to view it
2. Click "Edit Entry" to make changes
3. Update the content, mood, or tags
4. Save your changes

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Privacy and Security

JAi is designed with privacy as a core principle:

- All data is stored in your own Supabase instance
- The AI runs on your own server, not a third-party API
- No data is shared with external services
- All communication is encrypted with HTTPS
- Authentication is handled securely with JWT

## Contributing

This project is currently maintained by Sahir as a personal tool. If you'd like to contribute or suggest improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ollama](https://ollama.com) for making local LLMs accessible
- [Supabase](https://supabase.com) for the open source Firebase alternative
- [Next.js](https://nextjs.org) for the React framework
- [TailwindCSS](https://tailwindcss.com) for the utility-first CSS framework
