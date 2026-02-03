/**
 * Authentication Utilities for ALM-Karvaan
 * This file provides helper functions for managing user authentication
 */

// Get all registered users
function getAllUsers() {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
}

// Get current logged-in user
function getCurrentUser() {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
}

// Check if user is logged in
function isUserLoggedIn() {
  return getCurrentUser() !== null;
}

// Check if email is already registered
function isEmailRegistered(email) {
  const users = getAllUsers();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Get user by email
function getUserByEmail(email) {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Validate user credentials
function validateCredentials(email, password) {
  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  if (user.password !== password) {
    return { success: false, message: 'Incorrect password' };
  }
  return { success: true, user: user };
}

// Register new user
function registerUser(username, email, password) {
  if (isEmailRegistered(email)) {
    return { success: false, message: 'Email already registered' };
  }

  const users = getAllUsers();
  const newUser = {
    username: username,
    email: email,
    password: password,
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(users));
  
  return { success: true, user: newUser };
}

// Login user
function loginUser(email, username) {
  const sessionData = {
    email: email,
    username: username,
    loginTime: new Date().toISOString()
  };
  
  localStorage.setItem('currentUser', JSON.stringify(sessionData));
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', username);
  
  return { success: true };
}

// Logout user
function logoutUser() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
}

// Clear all users (for testing/admin purposes)
function clearAllUsers() {
  if (confirm('Are you sure you want to delete all registered users? This cannot be undone.')) {
    localStorage.removeItem('registeredUsers');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    console.log('All users cleared successfully');
    return true;
  }
  return false;
}

// Display all registered users (for debugging)
function displayAllUsers() {
  const users = getAllUsers();
  console.log('=== Registered Users ===');
  console.log(`Total Users: ${users.length}`);
  users.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Registered: ${new Date(user.registeredAt).toLocaleString()}`);
  });
  console.log('\n========================');
  return users;
}

// Export functions for use in console
if (typeof window !== 'undefined') {
  window.authUtils = {
    getAllUsers,
    getCurrentUser,
    isUserLoggedIn,
    isEmailRegistered,
    getUserByEmail,
    validateCredentials,
    registerUser,
    loginUser,
    logoutUser,
    clearAllUsers,
    displayAllUsers
  };
  
  console.log('Auth Utils loaded! Use window.authUtils to access functions.');
  console.log('Example: authUtils.displayAllUsers()');
}
