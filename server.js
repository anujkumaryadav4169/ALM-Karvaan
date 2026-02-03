const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Path to users data file
const USERS_FILE = path.join(__dirname, 'users-data.json');

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
  console.log('✅ Created users-data.json file');
}

// Helper function to read users from file
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return { users: [] };
  }
}

// Helper function to write users to file
function writeUsers(data) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
}

// API Routes

// Get all users (for debugging)
app.get('/api/users', (req, res) => {
  const data = readUsers();
  res.json({
    success: true,
    users: data.users,
    count: data.users.length
  });
});

// Register new user
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  // Read existing users
  const data = readUsers();

  // Check if email already exists
  const existingUser = data.users.find(
    user => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password, // In production, hash this with bcrypt!
    registeredAt: new Date().toISOString()
  };

  // Add user and save
  data.users.push(newUser);
  
  if (writeUsers(data)) {
    console.log(`✅ New user registered: ${email}`);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        registeredAt: newUser.registeredAt
      }
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to save user data'
    });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Read users
  const data = readUsers();

  // Find user
  const user = data.users.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No account found with this email. Please register first.'
    });
  }

  // Verify password
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password'
    });
  }

  // Login successful
  console.log(`✅ User logged in: ${email}`);
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      registeredAt: user.registeredAt
    }
  });
});

// Check if email exists
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const data = readUsers();
  const exists = data.users.some(
    user => user.email.toLowerCase() === email.toLowerCase()
  );

  res.json({
    success: true,
    exists
  });
});

// Delete user (for testing)
app.delete('/api/users/:email', (req, res) => {
  const { email } = req.params;
  const data = readUsers();

  const initialLength = data.users.length;
  data.users = data.users.filter(
    user => user.email.toLowerCase() !== email.toLowerCase()
  );

  if (data.users.length < initialLength) {
    writeUsers(data);
    console.log(`🗑️  User deleted: ${email}`);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

// Clear all users (for testing)
app.delete('/api/users', (req, res) => {
  writeUsers({ users: [] });
  console.log('🗑️  All users cleared');
  res.json({
    success: true,
    message: 'All users cleared'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Users data file: ${USERS_FILE}`);
  console.log('================================\n');
  console.log('📋 Available endpoints:');
  console.log(`   POST   http://localhost:${PORT}/api/register`);
  console.log(`   POST   http://localhost:${PORT}/api/login`);
  console.log(`   GET    http://localhost:${PORT}/api/users`);
  console.log(`   POST   http://localhost:${PORT}/api/check-email`);
  console.log(`   DELETE http://localhost:${PORT}/api/users/:email`);
  console.log(`   DELETE http://localhost:${PORT}/api/users`);
  console.log('\n💡 Open your HTML files in browser to test!\n');
});
