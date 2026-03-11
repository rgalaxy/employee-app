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

### Run api development server

```bash
npm run dev:api
```

### Run backend for production

```bash
npm run backend:details
npm run backend:basicinfo
```

The app will be available at `http://localhost:5173` and the mock API at `http://localhost:4001` and `http://localhost:4002`.

## How to Use the App on Local

1. Clone the repository and navigate to the project directory. (make sure to move inside `employee-app` folder)
2. Install dependencies using `npm install`.
3. Start the mock API server using `npm run dev:api`.
4. In another terminal, start the development server using `npm run dev`.
5. Open your browser and navigate to `http://localhost:5173` to access the app.

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

## URL to Access the Mock API

- Basic Info Service: https://employee-app-f1p7.onrender.com
- Details Service: https://your-details-service.up.railway.app

## Production Infrastructure

- Frontend hosted on Netlify
- Mock API hosted on Render (details and basic info services)

## NOTES - Works done after the time limit of project

- The implementation of Ops/Admin role-based access control (11/10/2026 11:36 WIB)
- Refactoring the Wizard Page (11/10/2026 11:40 WIB)
- Adding and implementing Toast component for better user feedback (11/10/2026 12:25 WIB)
- Add more data for pagiantion examples and fix form disabled field when submitting (11/10/2026 12:33 WIB)
