# 🏢 Employee Management System

A full-stack **Employee Management System** built with:
- **Frontend**: React.js + Vite + Recharts + React Router + React Hook Form
- **Backend**: Spring Boot 3 (Java 17) + Spring Security + JWT
- **Database**: MySQL

---

## 📁 Project Structure

```
Employee_Management/
├── backend/          # Spring Boot application
├── frontend/         # Vite + React application
└── database/         # SQL scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

---

### 1. Database Setup

Open **MySQL Workbench** and run:
```sql
CREATE DATABASE IF NOT EXISTS employee_management_db;
```

Or run the provided script: `database/setup.sql`

---

### 2. Backend Setup

**Update database credentials in** `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**Start the backend:**
```bash
cd backend
mvn spring-boot:run
```

> The backend will auto-create all tables and seed default users:
> - **Admin**: `admin` / `admin123`
> - **User**: `user` / `user123`

Backend runs on: `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔑 Default Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| User  | user     | user123   |

---

## 📋 Features

### ✅ Authentication
- JWT-based secure login/logout
- Role-based access (Admin/User)
- Route protection

### ✅ Dashboard
- Total, Active, Inactive employee counts
- Average salary, New joinees this month
- Department-wise bar chart
- Employee status pie chart

### ✅ Employee Management
- Add / Edit / Delete employees
- Search by name, email, ID
- Filter by department and status
- Sort by multiple fields
- Pagination
- Status toggle (Active/Inactive)
- Export to Excel

### ✅ Department Management
- Add / Edit / Delete departments
- Employee count per department
- Card-based grid layout

---

## 🛠️ API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |

### Employees
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/employees` | Get all (paginated) |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/{id}` | Get by ID |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| PATCH | `/api/employees/{id}/status` | Update status |
| GET | `/api/employees/dashboard/stats` | Dashboard stats |

### Departments
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/departments` | Get all |
| POST | `/api/departments` | Create |
| PUT | `/api/departments/{id}` | Update |
| DELETE | `/api/departments/{id}` | Delete |

---

## 🎨 Tech Stack Details

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| State/Routing | React Router v6 |
| HTTP Client | Axios |
| Charts | Recharts |
| Forms | React Hook Form |
| Notifications | React Hot Toast |
| Excel Export | SheetJS (xlsx) |
| Backend | Spring Boot 3.2 |
| Security | Spring Security + JWT (jjwt 0.11) |
| ORM | JPA + Hibernate |
| Database | MySQL 8 |
| Build | Maven |
