# 🌱 Plant Planet (PostgreSQL Edition)

This is a modified version of our school group project, **Plant Planet**, originally built with a MySQL backend. The project is a full-stack web application developed using **Spring Boot** for the backend and **Vite + React** for the frontend.

This version switches the database from **MySQL to PostgreSQL** to allow for easier deployment on **Render.com**.

---

## 🛠 Technologies Used

### Frontend
- Vite
- React
- EmailJS

### Backend
- Spring Boot
- PostgreSQL (originally MySQL)
- JPA/Hibernate
- Liquibase
- Docker

---

## 📁 About This Repository

The original project used **MySQL**. Since Render supports **PostgreSQL** more easily, this repository was created by me separately for deployment purposes. The logic and frontend remain unchanged — only the database configuration and a few deployment-related properties were updated.

This version includes:
- PostgreSQL integration instead of MySQL
- Updated `application.properties` and `api.js` for Render deployment
- Prepared `Dockerfile` for containerized deployment

---

## 🚀 Getting Started

### Prerequisites
- Java 21
- Node.js & npm
- PostgreSQL (locally or hosted)
- Docker (optional, for containerized setup)

---

### 🧪 Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DobraiDavid/HostedPlantPlanet
   cd plant-planet-postgresql
