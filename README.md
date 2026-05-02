# LPU Talk

LPU Talk is an intelligent, domain-specific AI chatbot designed exclusively for Lovely Professional University (LPU). It provides students, faculty, and visitors with instant, accurate information regarding admissions, campus life, academic policies, and administrative details.

## Project Overview

The application is built using a modern full-stack architecture, leveraging Gemini AI for natural language processing and Supabase for secure authentication and persistent chat history. The system is engineered with strict guardrails to ensure that interactions remain focused on university-related topics while maintaining high ethical and professional standards.

## Key Features

- Domain-Specific Intelligence: The AI is strictly restricted to answering questions related to LPU campus, academics, and administration.
- Advanced Guardrails: Implements robust filters for ethical conduct, political discourse, and leadership-related inquiries.
- Real-time Streaming: Responses are delivered with a smooth typewriter-style animation for an enhanced user experience.
- Session Management: Users can create, save, and delete chat sessions, with all data securely persisted.
- Secure Authentication: Integrated with Google OAuth via Supabase for a seamless and secure login experience.
- Responsive Design: A premium, mobile-first UI designed with a clean aesthetic and LPU-themed branding.

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Lucide React (Icons)
- React Router (Navigation)

### Backend
- Node.js
- Express
- Google Gemini AI (Generative AI)
- Supabase (Database & Auth)

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase Project
- Google Gemini API Key

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/sharmavanshhh/LPU-Talk.git
   ```

2. Install dependencies for both Backend and Frontend:
   ```bash
   # Install Backend dependencies
   cd backend
   npm install

   # Install Frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure Environment Variables:

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   REACT_APP_API_URL=http://localhost:5000
   ```

## Running the Project

1. Start the Backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the Frontend application:
   ```bash
   cd frontend
   npm start
   ```

## AI Guardrails and Policy

LPU Talk operates under a strict set of operational policies:

- Academic Focus: The AI will prioritize information regarding LPU's academic programs, fees, and admissions.
- Ethical Conduct: Any requests involving unethical behavior, hacking, or inappropriate social conduct are automatically rejected.
- Political Neutrality: The AI is programmed to avoid personal or political discourse regarding university leadership while still providing factual administrative information.
- Professionalism: All responses are crafted to be helpful, polite, and representative of the university's values.

## Credits

Made By: Vansh Sharma
Powered by Gemini AI and Supabase
