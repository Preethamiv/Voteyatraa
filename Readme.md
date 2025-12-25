# 🗳️ VoteYatra

VoteYatra is a secure and structured online voting platform built to simulate real-world election workflows with a strong focus on authentication, authorization, and backend correctness.

---

## 🚀 Aim
The aim of VoteYatra is to design and implement a **secure online voting system** that demonstrates real-world backend concepts such as user verification, role-based access control, and one-vote-per-user enforcement.

This project is built with an interview-oriented mindset, focusing more on **system design and security** rather than just UI.

---

## 📝 Introduction
VoteYatra provides a step-by-step voting flow where users can register, verify their email using OTP, book a voting slot, and cast their vote securely.  

The platform enforces strict rules to ensure fairness, such as allowing only verified users to vote and preventing duplicate votes.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email-based OTP verification
- Secure password hashing using bcrypt
- JWT-based authentication for protected routes
- Role-based access control (User / Admin)

### ⏱️ Slot Booking System
- Users must book a time slot before voting
- Prevents multiple slot bookings by the same user
- Ensures an organized and fair voting process

### 🗳️ Vote Casting
- Only authenticated and verified users can vote
- Each user can vote only once
- Backend validations prevent duplicate or invalid votes

### 🛠️ Admin Panel
- Admin-only protected routes
- View all registered users
- View all votes and voting summaries
- Ability to remove invalid users

### 🧑‍💻 User Experience
- Clean and simple UI flow
- Responsive design for different screen sizes
- Clear success and error messages

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- Nodemailer (OTP emails)
- bcryptjs
- dotenv

### Frontend
- React
- React Router
- Axios
- CSS

---

## 🔐 User Roles
- **User**: Can register, verify email, book slots, and cast votes
- **Admin**: Can manage users and view voting data
- **(Planned)** Super Admin: Can assign admin roles and manage the system

---

## 📂 Project Structure
```text
VoteYatra/
 ├─ voting-backend/
 │   ├─ routes/
 │   ├─ models/
 │   ├─ middleware/
 │   └─ server.js
 ├─ voting-frontend/
 │   └─ src/
 └─ README.md
