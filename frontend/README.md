# HighPerformance Frontend

A modern Angular 17+ application for managing salesmen, social performance, and bonus calculations.

## Features

- 📊 **Dashboard** - Analytics and charts overview
- 👥 **Salesmen Management** - CRUD operations for salesmen
- 📈 **Social Performance** - Track and manage performance evaluations
- 💰 **Bonus Management** - Review and approve bonus calculations
- 🌓 **Dark/Light Theme** - Toggle between themes
- 🎨 **Modern UI** - Material Design with smooth animations
- 📱 **Responsive** - Mobile-first approach

## Tech Stack

- Angular 17+ (Standalone Components)
- Angular Material
- Angular Animations
- NgxCharts for data visualization
- RxJS for reactive programming
- Angular Signals for state management

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm start
```

The app will be available at `http://localhost:4200`

### Build

```bash
npm run build
```

## Project Structure

```
src/app/
├── core/                    # Core module
│   ├── interceptors/        # HTTP interceptors
│   ├── models/              # TypeScript interfaces
│   └── services/            # API services
├── features/                # Feature modules
│   ├── dashboard/           # Dashboard component
│   ├── salesmen/            # Salesmen management
│   ├── social-performance/  # Performance tracking
│   └── bonus/               # Bonus management
├── layout/                  # Layout component
└── shared/                  # Shared resources
    ├── animations/          # Animation definitions
    └── components/          # Shared components
```

## API Integration

The application connects to the backend API at `http://localhost:3001`. 
A proxy is configured for development to forward `/api` requests.

### Available Endpoints

- `GET/POST /api/salesmen` - Salesmen CRUD
- `GET/POST /api/social-performance` - Social performance records
- `POST /api/bonus/integration/orangehrm/sync-employees` - Sync from OrangeHRM
- `GET /api/bonus/cockpit/:sid/:year` - Bonus cockpit view
- `POST /api/bonus/approve/:sid/:year` - Approve bonuses

## Animations

The app includes smooth animations:
- Page transitions (fade, slide)
- List stagger effects
- Modal/dialog animations
- Hover micro-interactions
- Skeleton loaders

## Theme Support

Toggle between light and dark themes using the button in the sidebar.
Theme preference is persisted in localStorage.

# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
