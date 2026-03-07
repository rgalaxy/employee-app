# Employee App

A React + Vite SSR application for managing employee data with a multi-step wizard form.

## Tech Stack

- **Frontend:** React 19, React Router, React Hook Form, Zod
- **Rendering:** Server-Side Rendering (SSR) with Vite + Express
- **Testing:** Jest, React Testing Library

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Run development server

```bash
npm run dev:api
```

The app will be available at `http://localhost:5173` and the mock API at `http://localhost:4001` and `http://localhost:4002`.

## Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start SSR dev server     |
| `npm run dev:api` | Start mock JSON server   |
| `npm run build`   | Build client App         |
| `npm run preview` | Preview production build |
| `npm test`        | Run unit tests           |

## Project Structure

```
src/
├── components/     # Reusable UI components (Autocomplete, Button, FormField, etc.)
├── context/        # React context (RoleContext)
├── hooks/          # Custom hooks (useWizardForm, useDraftPersistence, etc.)
├── pages/          # Page components (EmployeeListPage, WizardPage)
├── services/       # API service layer
└── utils/          # Utility functions
```

## Features

- Employee list with role-based access
- Employee creation wizard
- Autocomplete with async search
- Draft persistence across steps
- Form validation with RHF + Zod
- Mock API using json-server for development

## URL to Access the App

https://amartha-test.netlify.app/
