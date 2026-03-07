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

### Run development server (with mock API)

```bash
npm run dev:mock
```

Both servers run on [http://localhost:3000](http://localhost:3000).

## Scripts

| Script             | Description                     |
| ------------------ | ------------------------------- |
| `npm run dev`      | Start SSR dev server            |
| `npm run dev:mock` | Start mock JSON server          |
| `npm run build`    | Build client and server bundles |
| `npm run preview`  | Preview production build        |
| `npm test`         | Run unit tests                  |

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
