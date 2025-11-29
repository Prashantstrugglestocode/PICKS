# Visually

**Visually** is a cutting-edge, interactive educational simulator designed to demystify the complex operations of CPU cache memory hierarchies. Built with React and modern web technologies, it provides a real-time, visual representation of how data traverses between the CPU, L1 Cache, L2 Cache, and Main Memory (RAM).

Whether you are a computer architecture student or an enthusiast, Visually helps you "see" the invisible processes of computing.

## 🚀 Key Features

### 1. Interactive System Architecture
The heart of Visually is the **System Diagram**, a clickable, animated map of the computer's memory hierarchy.
- **Visual Data Flow**: Watch requests move across buses between components.
- **Component Inspection**: Click on any component (CPU, L1, L2, RAM) to dive into its specific state and operations.
- **Real-time Metrics**: Monitor Program Counter (PC) and Hit Rates directly from the overview.

### 2. AI-Powered Assistant 🤖
Integrated with **Google's Gemini API**, the built-in Chatbot acts as your personal tutor.
- **Context-Aware**: Understands questions about cache theory, RISC-V assembly, and simulator usage.
- **Heuristic Fallback**: Works even without an API key for common questions (hits/misses, associativity).
- **Customizable**: Users can bring their own API key for a full AI experience.

### 3. Deep Performance Analysis
Go beyond simple hits and misses with advanced visualization tools:
- **Power Mix Chart**: A stacked area chart visualizing energy consumption over time, breaking it down into:
    - **Static Power**: Baseline energy usage.
    - **Dynamic Power**: Energy used during active operations.
    - **Miss Penalty**: The energy cost of fetching data from lower memory levels.
- **Access Timeline**: (Coming Soon) A chronological view of memory access patterns.

### 4. Detailed Component Views
Dedicated pages for each level of the hierarchy:
- **CPU Core**: Execute RISC-V instructions and generate memory requests.
- **L1 & L2 Caches**: Inspect sets, ways, tags, and valid bits. Visualize eviction policies in action.
- **Main Memory (RAM)**: View the raw data storage and address mapping.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (with custom glassmorphism design)
- **Visualization**: [Chart.js](https://www.chartjs.org/) & [React Chartjs 2](https://react-chartjs-2.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: Google Gemini API

## 📂 Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components (LoginOverlay)
│   ├── Chatbot/        # AI Assistant implementation
│   ├── Layout/         # Header, Navigation, and Layout wrappers
│   ├── Pages/          # Main views (CPUPage, L1Page, RAMPage, etc.)
│   └── Visualization/  # Core visual components (SystemDiagram, PowerMixChart)
├── context/            # Global state management (SimulatorContext)
├── hooks/              # Custom hooks (useSimulator)
└── App.jsx             # Main routing and app composition
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd visually
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or similar).

## 🚀 Deployment

### Database Setup (Neon)
1.  Create a project on [Neon](https://neon.tech).
2.  Copy the **Connection String** (Postgres URL).
3.  Run the SQL commands from `schema.sql` in the Neon SQL Editor to create the tables.

### Vercel Deployment
1.  Push your code to GitHub.
2.  Import the project into [Vercel](https://vercel.com).
3.  Add the following **Environment Variables** in Vercel:
    *   `DATABASE_URL`: Your Neon connection string.
    *   `JWT_SECRET`: A random string for securing tokens.
4.  Deploy! Vercel will automatically detect the `api` folder and deploy serverless functions.

## 🤖 AI Configuration

To unlock the full potential of the Chatbot:
1. Click the **Settings** (gear icon) in the Chatbot window.
2. Enter your **Gemini API Key**.
3. Click **Save Configuration**.
*Note: The key is stored locally in your browser for privacy.*

## 🎨 Customization

Visually features a **Dark/Light mode** toggle and uses CSS variables for easy theming. Check `index.css` to modify the color palette.
