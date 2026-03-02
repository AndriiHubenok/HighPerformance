# HighPerformance

A full-stack application for managing salesmen, tracking social performance, and calculating bonuses. The backend integrates with **OrangeHRM** (employee data) and **OpenCRX** (sales order data) to automate the bonus approval workflow.

## Features

- 👥 **Salesmen Management** – Create and retrieve salesman records
- 📈 **Social Performance Tracking** – Record and evaluate supervisor/peer-group ratings with automatic bonus calculation
- 💰 **Bonus Cockpit** – Consolidated view of social and order-based bonuses per salesman per year
- 🔄 **OrangeHRM Integration** – Sync sales employees directly from OrangeHRM
- 📦 **OpenCRX Integration** – Fetch sales order data for bonus computation
- ✅ **Multi-step Approval Workflow** – HR → CEO → Salesman approval chain
- 🔐 **JWT Authentication** – Role-based access for HR, CEO, and Salesman roles
- 📄 **Swagger UI** – Interactive API documentation at `/api-docs`
- 🖥️ **Angular Frontend** – Modern UI in the `frontend/` directory

## Tech Stack

### Backend
- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **JWT** (`jsonwebtoken`) for authentication
- **bcryptjs** for password hashing
- **Swagger UI Express** for API documentation
- **Axios** for external HTTP calls (OrangeHRM, OpenCRX)
- **Mocha** + **Chai** + **Sinon** for testing

### Frontend
See [`frontend/README.md`](frontend/README.md) for the Angular application details.

## Prerequisites

- **Node.js** 18+
- **npm** 9+
- **MongoDB** running locally on port `27017`
- (Optional) **OrangeHRM** instance for employee sync
- (Optional) **OpenCRX** instance for sales order data

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend server

```bash
npm start
```

The server starts on **http://localhost:3001** by default.

### 3. Start the frontend (optional)

```bash
cd frontend
npm install
npm start
```

The Angular app starts on **http://localhost:4200** and proxies `/api` requests to the backend.

## API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3001/api-docs
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT token |
| `GET` | `/api/salesmen` | List salesmen (filter by `sid`, `year`) |
| `POST` | `/api/salesmen` | Create a new salesman |
| `POST` | `/api/social-performance` | Add a social performance record |
| `GET` | `/api/social-performance/:sid` | Get performance records for a salesman |
| `POST` | `/api/bonus/integration/orangehrm/sync-employees` | Sync employees from OrangeHRM |
| `POST` | `/api/bonus/orders/fetch/:sid/:year` | Fetch order performance from OpenCRX |
| `GET` | `/api/bonus/cockpit/:sid/:year` | View consolidated bonus summary |
| `POST` | `/api/bonus/approve/final/hr/:sid/:year` | HR approves bonus |
| `POST` | `/api/bonus/approve/final/ceo/:sid/:year` | CEO approves bonus |
| `POST` | `/api/bonus/approve/final/salesman/:sid/:year/:approval` | Salesman accepts/rejects bonus |

## Project Structure

```
HighPerformance/
├── app.js                          # Express app setup
├── bin/                            # Server entry point
├── routes/                         # Route handlers
│   ├── authRoutes.js               # Authentication (register/login)
│   ├── salesmanRouter.js           # Salesman CRUD
│   ├── socialPerformanceRouter.js  # Social performance records
│   └── bonusRouter.js              # Bonus workflow & approvals
├── models/                         # Mongoose schemas
│   ├── Salesman.js
│   ├── SocialPerformance.js
│   ├── OrderPerformance.js
│   ├── Qualification.js
│   ├── Notification.js
│   └── User.js
├── services/                       # External integrations
│   ├── openCrxService.js           # OpenCRX sales data
│   └── orangeHrmService.js         # OrangeHRM employee sync
├── middleware/                     # Express middleware (auth)
├── swagger.json                    # OpenAPI 3.0 specification
├── test/                           # Mocha/Chai unit tests
├── frontend/                       # Angular frontend application
└── package.json
```

## Running Tests

```bash
npm test
```

Tests use **Mocha**, **Chai**, and **Sinon** for unit testing service and route logic.

## Environment

The application uses the following defaults (configurable via environment variables):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Backend server port |
| MongoDB URI | `mongodb://localhost:27017/smarthoover_db` | Database connection |
