# Healthcare Operations Dashboard

A modern, enterprise-level analytics dashboard for tracking daily employee work, team performance, project progress, and completion vs pending tasks.

## Features

- 📊 **Comprehensive Dashboard** - Real-time KPIs and analytics
- 👥 **Team Management** - View and manage all teams and members
- 👤 **Employee Tracking** - Monitor employee performance and activity
- 📁 **Project Management** - Track project status, health, and completion
- 📝 **Daily Activity Log** - Advanced filtering, sorting, and pagination
- 📄 **Reports** - Generate and export reports (CSV/PDF)
- ⚙️ **Settings** - Customize preferences and notifications
- 🌓 **Dark Mode** - Light and dark theme support
- 📱 **Fully Responsive** - Works on all device sizes

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **RTK Query** - API layer with caching
- **React Router** - Client-side routing
- **Recharts** - Beautiful charts and graphs
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date formatting utilities

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, Header)
│   └── ui/             # Base UI components (Card, Button, Badge, etc.)
├── contexts/           # React contexts
├── data/               # Mock data
├── pages/              # Page components
├── store/              # Redux store
│   ├── api/           # RTK Query API slices
│   └── slices/        # Redux slices
└── types/              # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## API Architecture

The application uses RTK Query with mock data structured like real APIs:

- **teamsApi** - Team management endpoints
- **employeesApi** - Employee data endpoints
- **projectsApi** - Project information endpoints
- **activityApi** - Daily activity and dashboard stats
- **reportsApi** - Report generation endpoints

All API calls are mocked with realistic delays and structured responses.

## Key Features

### Dashboard
- Real-time KPI cards
- Multiple chart visualizations
- Project status overview
- Team performance metrics
- Daily activity trends

### Daily Activity
- Advanced filtering (Team, Project, Status, Date Range)
- Column sorting
- Pagination
- Search functionality
- Status badges with color coding

### Teams & Employees
- Team cards with member lists
- Employee performance scores
- Search and filter capabilities
- Role-based badges

### Projects
- Project health indicators
- Completion percentage
- Status tracking
- Color-coded health status

## Mock Data

The application includes comprehensive mock data:
- 13 Teams with leads and members
- 31 Employees across all teams
- 8 Healthcare projects
- Realistic daily activity logs
- Performance metrics

## Customization

### Theme
Toggle between light and dark mode using the theme toggle in the header. The preference is saved to localStorage.

### Sidebar
The sidebar can be collapsed/expanded using the toggle button. The layout automatically adjusts.

## License

This project is proprietary software for internal use.
