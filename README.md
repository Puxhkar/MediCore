🏥 Real-Time Hospital Resource Management System

A backend-focused full-stack application designed to efficiently manage hospital resources such as beds, doctors, and emergency patients in real time.

This project emphasizes software engineering principles, system design practices, and clean architecture, with backend being the primary focus.

📌 Project Objective

Hospitals often face challenges in:

Real-time bed tracking

Emergency patient prioritization

Doctor scheduling conflicts

Resource allocation delays

Manual and inconsistent record management

This system provides a structured solution with intelligent allocation logic and proper state management.

🎯 Current Progress

So far, the following have been completed:

✅ Project Idea Definition

✅ Use Case Diagram

✅ Sequence Diagrams (Multiple flows)

✅ Class Diagram

✅ ER Diagram (Extended version)

The project is currently in the system design and architecture phase before backend implementation begins.

🧠 Key System Features
1️⃣ Patient Management

Register patients

Track severity levels

Manage patient lifecycle states:

Registered

Waiting

Admitted

Under Treatment

Discharged

2️⃣ Emergency Priority Queue

Severity-based prioritization

Highest severity handled first

3️⃣ Bed Management

ICU / General bed tracking

Automatic allocation logic

Bed history tracking

4️⃣ Doctor Scheduling

Shift management

Appointment conflict detection

Doctor specialization mapping

5️⃣ Resource Allocation

Intelligent bed allocation strategy

Fallback mechanisms

Historical allocation tracking

6️⃣ Audit Logging

Log every major system action

Track resource assignments

Maintain system transparency

🏗 Architecture Overview

The backend follows Layered Architecture:

Controller → Service → Repository → Database

Proposed structure:

src/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── models/
 ├── strategies/
 ├── states/
 ├── middlewares/
 ├── utils/

🎨 Design Principles Followed
✅ OOP Principles

Encapsulation

Abstraction

Inheritance

Polymorphism

✅ Design Patterns

Strategy Pattern → Bed allocation logic

State Pattern → Patient lifecycle management

Repository Pattern → Data abstraction

Singleton Pattern → Database connection

Factory Pattern (where applicable)

🗄 Database Design

The ER diagram includes:

Users

Doctors

Patients

Beds

Wards

Specializations

Shifts

Appointments

Emergency Queue

Treatments

Resource Allocations

Audit Logs

Bed History

The schema is normalized and designed for scalability.

🔐 Planned Tech Stack
Backend

Node.js

Express

PostgreSQL

Drizzle ORM

JWT Authentication

Frontend

React (lightweight, backend-focused project)

📊 Why This Project Is Backend-Focused

Priority queue logic

Resource allocation strategy

Conflict detection algorithms

State transitions

Clean layered architecture

System design implementation

Backend logic accounts for 75% of the project weightage.

🚀 Upcoming Implementation Phase

Next steps:

Backend project setup

Database schema creation

Strategy & State pattern implementation

API development

Authentication & authorization

Integration testing

📚 Diagrams Included

idea.md

useCaseDiagram.md

sequenceDiagram.md

classDiagram.md

ErDiagram.md

👨‍💻 Author

Pushkar Gupta
Backend-focused Full Stack Developer
