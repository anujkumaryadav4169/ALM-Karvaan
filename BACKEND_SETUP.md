# 🚀 Backend Server Setup Guide

## Overview

Your ALM-Karvaan application now has a **Node.js backend server** that stores user data in a real JSON file (`users-data.json`) that you can see and edit!

---

## 📋 Prerequisites

- ✅ Node.js installed (you have v22.18.0)
- ✅ npm (comes with Node.js)

---

## 🛠️ Installation Steps

### Step 1: Install Dependencies

Open terminal in the `ALM-Karvaan` folder and run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Allow frontend to connect to backend
- `body-parser` - Parse JSON requests

### Step 2: Start the Server

```bash
npm start
```

You should see:
```
🚀 ================================
✅ Server running on http://localhost:3000
📁 Users data file: /path/to/users-data.json
================================

📋 Available endpoints:
   POST   http://localhost:3000/api/register
   POST   http://localhost:3000/api/login
   GET    http://localhost:3000/api/users
   ...
```

### Step 3: Open Your Website

1. Keep the server running in terminal
2. Open `index.html` in your browser
3. Register and login as usual!

---

## 📁 Where is the Data Stored?

### File: `users-data.json`

Located in your `ALM-Karvaan` folder. You can open it with any text editor!

**Example content:**
```json
{
  "users": [
    {
      "id": "1738588800000",
      "username": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "registeredAt": "2026-02-03T12:00:00.000Z"
    },
    {
      "id": "1738589200000",
      "username": "Jane Smith",
      "email": "jane@example.com",
      "password": "securepass",
      "registeredAt": "2026-02-03T12:10:00.000Z"
    }
  ]
}
```

✅ **You can now:**
- Open and view the file anytime
- Edit user data manually
- Backup the file
- Share it between computers

---

## 🔄 How It Works

### Registration Flow:
```
1. User fills signup form
2. Frontend sends POST to /api/register
3. Backend validates data
4. Backend saves to users-data.json
5. Backend responds with success
6. Frontend shows success screen
```

### Login Flow:
```
1. User enters credentials
2. Frontend sends POST to /api/login
3. Backend reads users-data.json
4. Backend checks if email exists
5. Backend verifies password
6. Backend responds with user data or error
7. Frontend proceeds to OTP or shows error
```

---

## 🧪 Testing the Backend

### Test 1: View All Users

Open browser and go to:
```
http://localhost:3000/api/users
```

You'll see JSON response with all registered users!

### Test 2: Register via API

Use browser console or Postman:
```javascript
fetch('http://localhost:3000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'Test User',
    email: 'test@example.com',
    password: 'test123'
  })
})
.then(r => r.json())
.then(console.log)
```

### Test 3: Login via API

```javascript
fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
})
.then(r => r.json())
.then(console.log)
```

---

## 🎯 API Endpoints

### 1. Register User
```
POST http://localhost:3000/api/register

Body:
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "1738588800000",
    "username": "John Doe",
    "email": "john@example.com",
    "registeredAt": "2026-02-03T12:00:00.000Z"
  }
}

Response (Error):
{
  "success": false,
  "message": "Email already registered"
}
```

### 2. Login User
```
POST http://localhost:3000/api/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "1738588800000",
    "username": "John Doe",
    "email": "john@example.com",
    "registeredAt": "2026-02-03T12:00:00.000Z"
  }
}

Response (Error):
{
  "success": false,
  "message": "No account found with this email. Please register first."
}
```

### 3. Get All Users
```
GET http://localhost:3000/api/users

Response:
{
  "success": true,
  "users": [...],
  "count": 2
}
```

### 4. Check if Email Exists
```
POST http://localhost:3000/api/check-email

Body:
{
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "exists": true
}
```

### 5. Delete User (Testing)
```
DELETE http://localhost:3000/api/users/john@example.com

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 6. Clear All Users (Testing)
```
DELETE http://localhost:3000/api/users

Response:
{
  "success": true,
  "message": "All users cleared"
}
```

---

## 🐛 Troubleshooting

### Issue: "Error connecting to server"

**Solution:**
1. Make sure server is running: `npm start`
2. Check if port 3000 is available
3. Look for errors in terminal

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
npm install
```

### Issue: Can't see users-data.json file

**Solution:**
The file is created automatically when server starts. Check your `ALM-Karvaan` folder.

### Issue: Port 3000 already in use

**Solution:**
Change port in `server.js`:
```javascript
const PORT = 3001; // Change to any available port
```

Then update frontend URLs in `index.html`:
```javascript
fetch('http://localhost:3001/api/register', ...)
```

---

## 📊 Server Console Output

When server is running, you'll see logs:

```
✅ New user registered: john@example.com
✅ User logged in: john@example.com
🗑️  User deleted: test@example.com
```

---

## 🔒 Security Notes

⚠️ **Current Implementation:**
- Passwords stored in plain text
- No encryption
- No rate limiting
- Suitable for development/learning

✅ **For Production:**
- Hash passwords with bcrypt
- Add JWT tokens
- Implement HTTPS
- Add rate limiting
- Validate all inputs
- Add proper error handling

---

## 📝 File Structure

```
ALM-Karvaan/
├── server.js              # Backend server
├── package.json           # Dependencies
├── users-data.json        # User data (auto-created)
├── index.html             # Frontend (updated)
├── dashboard.html         # Dashboard
└── BACKEND_SETUP.md       # This file
```

---

## 🎉 Benefits of Backend Server

✅ **Real File Storage**
- Data saved in `users-data.json`
- Can view/edit anytime
- Easy to backup

✅ **Persistent Data**
- Survives browser refresh
- Survives browser close
- Survives computer restart

✅ **Shareable**
- Copy `users-data.json` to another computer
- Share with team members
- Version control friendly

✅ **Professional**
- Real API endpoints
- Proper validation
- Server-side logic

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (first time only)
npm install

# Start server
npm start

# Stop server
Ctrl + C

# View users file
cat users-data.json

# Clear all users (delete file)
rm users-data.json
```

---

## 💡 Next Steps

1. **Start the server**: `npm start`
2. **Open index.html** in browser
3. **Register a user** - Check `users-data.json` file!
4. **Login with credentials** - Data comes from file!
5. **View the file** - Open `users-data.json` in text editor

---

**Your data is now stored in a real file that you can see! 🎉**

---

**Last Updated**: February 3, 2026  
**Server Port**: 3000  
**Data File**: users-data.json
