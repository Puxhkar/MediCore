# 🏥 MediCore: Intelligent Hospital Resource Management System

![MediCore Header](https://raw.githubusercontent.com/Puxhkar/MediCore/main/frontend/public/favicon.png)

**MediCore** is a professional-grade, full-stack healthcare platform designed to optimize hospital resource allocation, emergency prioritization, and patient lifecycle management. Built with a focus on **Software Engineering Principles** and **Clean Architecture**, it provides a robust solution for real-time healthcare challenges.

---

## 🚀 Live Demo & Visuals

MediCore features a premium, responsive UI build with **Vite + React** and a high-performance **Express + Prisma** backend.

### Key Features:
*   **Intelligent Emergency Queue**: Uses a **Max-Heap** data structure for O(1) retrieval of the highest-severity patients.
*   **Cross-City discovery**: Search doctors and hospitals across **Pune, Mumbai, and Delhi**.
*   **Dual-Role Dashboard**: Seamlessly switch between **Patient** (bookings, spending, history) and **Admin** (queue management, approvals, bed tracking) views.
*   **Safe Enqueue System**: Automatically registers unknown patients during emergencies to ensure zero delay in critical care.

---

## 🛠 Tech Stack

### Backend (The Core Engine)
*   **Runtime**: Node.js with TypeScript
*   **Framework**: Express.js
*   **ORM**: Prisma (Type-safe database access)
*   **Database**: MySQL
*   **Architecture**: Layered (Controller → Service → Repository Pattern)

### Frontend (Premium UI/UX)
*   **Library**: React.js (Vite)
*   **Styling**: Vanilla CSS with Modern Glassmorphism
*   **Icons**: Lucide React
*   **Charts**: Recharts (Data visualization for patient spend/admin metrics)

---

## 🏗 System Architecture

The project follows strict **SOLID** principles and uses enterprise-level design patterns:

*   **Repository Pattern**: Full abstraction of data access logic.
*   **Singleton Pattern**: Guaranteed single database connection instance.
*   **Strategy Pattern**: Implementation of various bed allocation algorithms.
*   **State Pattern**: Tracking patient status from *Registered* to *Discharged*.

---

## 📂 Project Structure

```text
MediCore/
├── backend/
│   ├── src/
│   │   ├── controllers/  # Request handling
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Database abstraction
│   │   ├── utils/        # MaxHeap, Seed scripts
│   │   └── server.ts     # Entry point
│   └── prisma/           # Schema & Migrations
├── frontend/
│   ├── src/
│   │   ├── pages/        # Dashboard, Emergency, Search
│   │   ├── components/   # UI Layout & Navbar
│   │   └── App.jsx       # Routing
└── Docs/                 # UML Diagrams & Design Specs
```

---

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MySQL Instance

### 1. Backend Setup
```bash
cd backend
npm install
# Configure your .env (DATABASE_URL)
npx prisma db push
npx prisma generate
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Database Seeding
To populate the system with realistic data for Pune, Mumbai, and Delhi:
```bash
cd backend
npx tsx src/utils/seed.ts
```

---

## 👨‍💻 Author

**Pushkar Gupta**  
*Backend-focused Full Stack Developer*  
[GitHub Profile](https://github.com/Puxhkar)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
