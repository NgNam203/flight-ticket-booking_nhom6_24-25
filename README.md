````markdown
# ✈️ Flight Ticket Booking Website

A full-stack flight ticket booking system with admin and user functionality. This project is designed to demonstrate end-to-end modern web development, secure authentication, and deployment using Docker and Render.

## 🔧 Tech Stack

### Frontend

- React (create-react-app)
- TailwindCSS
- Axios
- Google reCAPTCHA v2

### Backend

- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- Helmet, XSS-Clean, Express-Rate-Limit
- Express Validator

### DevOps & Deployment

- Docker (multi-stage build)
- Render (Docker-based deployment)
- `.env` configuration for multiple environments

---

## 👨‍💼 User Features

- 🔐 Register and login with Google reCAPTCHA v2
- ✈️ Search flights by date, route, passengers
- 📃 View personal booking history
- 🧾 Book flights with dynamic seat class options
- 🔐 Secure routes with JWT-based auth

---

## 🛠️ Admin Features

- ✈️ Manage all flights (Create, Edit, Delete)
- 🧳 Define and manage seat classes per flight
- 🏢 Manage airlines (with logo URLs)
- 🛬 Manage airports (name, code, location)
- 👥 View and manage users and bookings
- 📊 Admin dashboard interface

---

## 🐳 Docker Usage

### 🏗️ Build image:

```bash
docker build -t flight-app .
```
````

### 🚀 Run container:

```bash
docker run -p 8080:3001 flight-app
```

The frontend React app is statically served from the backend at the same port (`8080`).

---

## 📁 Folder Structure

```
├── backend/
│   ├── src/
│   ├── Dockerfile
├── frontend/
│   ├── src/
│   ├── Dockerfile
├── Dockerfile              # Root: Multi-stage for both FE + BE
└── README.md
```

---

## 🌐 Live Demo

> Will be deployed on [Render](https://render.com/) > _URL coming soon..._

---

## 🙋 About the Developer

This project was created by **Nguyen Hai Nam** as part of a final course project and portfolio to demonstrate full-stack development capabilities.

Feel free to explore, fork, or contact for collaboration.
