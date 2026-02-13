# Retail Demo Scenario Configurator

A professional web application that empowers non-technical retail associates to create and manage demo scenarios for supplier training. Built with React, TypeScript, Flask, and MongoDB, featuring smooth animations and real-time data visualization.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://retail-config.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000)](https://flask.palletsprojects.com/)

## Overview

This application solves a real business problem: enabling non-technical retail associates to configure demo data for supplier education sessions without needing to manually manipulate databases or write code.

### The Solution
A user-friendly web interface with:
- **Form-based scenario builder** with validation and real-time feedback
- **Visual configuration** using sliders, multi-select tags, and date pickers
- **Live preview** of generated demo data with interactive charts
- **Full CRUD operations** with optimistic updates for snappy UX
- **Responsive design** that works seamlessly on mobile, tablet, and desktop

## Features

### Scenario Builder
- **Intuitive Form Interface**: Create scenarios with name, date range, product categories, regions, and customer segments
- **Sales Multiplier**: Visual slider (0.5x - 3x) with live feedback showing impact on demo data
- **Multi-Select Tags**: tag selection for categories, regions, and customer segments
- **Validation**: Real-time form validation with helpful error messages
- **Edit Mode**: Load and modify existing scenarios with history preservation

### Scenario Management
- **List View**: Grid display of all scenarios with key metrics
- **CRUD Operations**: Create, Read, Update, Delete with confirmation dialogs
- **Optimistic Updates**: Instant UI feedback while API calls complete
- **Loading States**: Skeleton screens during data fetching
- **Empty States**: Helpful prompts when no scenarios exist

### Live Preview Panel
- **Expandable Interface**: Smooth slide-out panel with curve transitions
- **Sales Chart**: Interactive line chart showing projected sales over time
- **Real-time Updates**: Preview regenerates as form values change
- **Responsive Visualization**: Charts adapt to screen size

### Premium UX
- **Smooth Scrolling**: Lenis integration for buttery-smooth page transitions
- **Framer Motion Animations**: Staggered reveals, magnetic buttons, perspective text effects
- **Micro-interactions**: Hover states, loading spinners, success/error toasts
- **Accessibility**: Proper ARIA labels, keyboard navigation, screen reader support
- **Mobile Optimized**: Touch-friendly interactions, native scroll on mobile

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tooling and HMR
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Lenis** - Smooth scroll
- **Recharts** - Data visualization
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client
- **Sonner** - Toast notifications

### Backend
- **Flask 3.0** - Python web framework
- **MongoDB** - NoSQL database
- **PyMongo** - MongoDB driver
- **Marshmallow** - Validation and serialization
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - WSGI HTTP server

### DevOps
- **Vercel** - Frontend hosting
- **Render/Railway** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **Git** - Version control

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or Atlas)

### Installation

#### Clone Repository
```bash
git clone https://github.com/nityzt/retail-scenario-configurator.git
cd retail-scenario-configurator
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env and add your API URL
npm run dev
```

The frontend will run on `http://localhost:5173`

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your MongoDB URI
python main.py
```

The backend will run on `http://localhost:5001`

### Environment Variables

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

**Backend** (`.env`):
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
FLASK_ENV=development
```

## 📁 Project Structure

```
retail-scenario-configurator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/
│   │   │   │   ├── HeroSection.tsx      # Landing page
│   │   │   │   ├── ScenariosSection.tsx # List view
│   │   │   │   ├── SectionTitle.tsx
│   │   │   │   └── CreateSection.tsx    # Form builder
│   │   │   ├── scenarios/
│   │   │   │   ├── PreviewPanel.tsx     # Data preview
│   │   │   │   ├── ScenarioCard.tsx     # List item
│   │   │   │   ├── SalesMultiplier.tsx
│   │   │   │   ├── FormSection.tsx
│   │   │   │   └── EmptyState.tsx       # No scenarios
│   │   │   ├── transitions/
│   │   │   │   └── CurveTransition.tsx
│   │   │   ├── ui/
│   │   │   │   ├── magnetic-button.tsx  # Magnetic hover effect
│   │   │   │   ├── PerspectiveText.tsx  # 3D text animation
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── split-text.tsx
│   │   │   │   └── CurveTransition.tsx  # Page transitions
│   │   │   ├── AnimatedPage.tsx
│   │   │   └── ErrorBoundary.tsx 
│   │   ├── contexts/
│   │   │   └── ScenarioContext.tsx      # Global state
│   │   ├── hooks/
│   │   │   ├── useScenarios.ts          # Data fetching
│   │   │   └── useLenis.ts              # Smooth scroll
│   │   ├── lib/
│   │   │   ├── api.ts                   # API client
│   │   │   ├── animations.ts
│   │   │   ├── validation.tsx
│   │   │   └── utils.ts                 # Utilities
│   │   ├── types/
│   │   │   └── scenario.ts              # TypeScript types
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── App.tsx                      # Root component
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── __init__.py                  # Flask app factory
│   │   ├── routes.py                    # API endpoints
│   │   ├── models.py                    # Marshmallow schemas
│   │   └── config.py                    # Configuration
│   ├── main.py                          # Entry point
│   └── requirements.txt
│
└── README.md
```

## API Documentation

### Base URL
```
Production: https://retail-config-api.onrender.com/api
Development: http://localhost:5001/api
```

### Endpoints

#### Get All Scenarios
```http
GET /scenarios
```
**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Q4 Holiday Rush",
    "salesMultiplier": 2.5,
    "productCategories": ["Electronics", "Home"],
    "regions": ["Northeast", "West"],
    "customerSegments": ["New", "Returning"],
    "dateRange": {
      "start": "2024-11-01",
      "end": "2024-12-31"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Create Scenario
```http
POST /scenarios
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Summer Clearance",
  "salesMultiplier": 1.8,
  "productCategories": ["Tools", "Paint"],
  "regions": ["Midwest"],
  "customerSegments": ["VIP"],
  "dateRange": {
    "start": "2024-07-01",
    "end": "2024-08-31"
  }
}
```
**Response:** `201 Created`

#### Update Scenario
```http
PUT /scenarios/{id}
Content-Type: application/json
```
**Request Body:** Same as create
**Response:** `200 OK`

#### Delete Scenario
```http
DELETE /scenarios/{id}
```
**Response:** `200 OK`

#### Get Preview Data
```http
GET /scenarios/{id}/preview
```
**Response:** `200 OK`
```json
{
  "salesData": [
    {"date": "2024-01-01", "sales": 2500},
    {"date": "2024-01-02", "sales": 2800}
  ],
  "topProducts": ["Electronics", "Home"],
  "regionBreakdown": {
    "Northeast": 100,
    "West": 100
  }
}
```

### Error Responses
```json
{
  "error": "Scenario not found"
}
```

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `VITE_API_BASE_URL`: Your backend URL
3. Deploy automatically on push to main

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn main:app`
5. Set environment variables:
   - `MONGO_URI`: MongoDB Atlas connection string
6. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Set up database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string
5. Add to backend environment variables

## Design Philosophy

### Animation Strategy
- **Timing**: Subtle (200ms) for hover, Standard (300ms) for dropdowns, Emphasized (500ms) for page transitions
- **Purpose**: Animations guide attention, provide feedback, and make the interface feel responsive
- **Performance**: Framer Motion with GPU-accelerated transforms, 60fps target

### UX Principles
- **Progressive Disclosure**: Don't overwhelm users with all options at once
- **Immediate Feedback**: Every action shows instant visual response (optimistic updates)
- **Error Recovery**: Clear error messages with suggestions for fixes
- **Consistency**: Same patterns for similar actions throughout the app

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible
- Color contrast meets WCAG AA standards
- Focus indicators on all focusable elements

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Nityam Goyal**
- LinkedIn: [@nityzt](https://linkedin.com/in/nityzt)
- GitHub: [@nityzt](https://github.com/nityzt)
- Email: nityum@my.yorku.ca

## Acknowledgments

- Inspired by enterprise retail demo configuration tools
- Built to demonstrate full-stack development skills for The Home Depot/Askuity internship
- UI/UX patterns influenced by modern SaaS applications

---
