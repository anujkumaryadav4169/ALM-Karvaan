# Authentication System Guide

## Overview

The ALM-Karvaan application now has a complete client-side authentication system using **localStorage** to store user registration data. This system handles user registration, login validation, and session management entirely in JavaScript.

## How It Works

### 1. User Registration (Sign Up)

When a user fills out the signup form on the homepage:

1. **Validation**: The system validates:
   - Username is not empty
   - Email is valid (contains @ and .)
   - Password is at least 6 characters
   - Email is not already registered

2. **Storage**: User data is stored in localStorage:
   ```javascript
   {
     username: "John Doe",
     email: "john@example.com",
     password: "password123",
     registeredAt: "2026-02-03T10:30:00.000Z"
   }
   ```

3. **Success**: Shows success screen and redirects to login

### 2. User Login

When a user attempts to login:

1. **Validation**: Checks email and password fields
2. **CAPTCHA**: Verifies CAPTCHA is solved correctly
3. **User Lookup**: Searches localStorage for matching email
4. **Password Check**: Verifies password matches stored password
5. **Error Handling**:
   - If email not found → Prompts user to register
   - If password incorrect → Shows error and clears password field
6. **Success**: Proceeds to OTP verification, then redirects to dashboard

### 3. Session Management

- **Current User**: Stored in `localStorage.currentUser` with login timestamp
- **User Data**: `localStorage.userName` and `localStorage.userEmail`
- **Dashboard Access**: Dashboard checks for valid session on load
- **Logout**: Clears session data but preserves registered users

## Data Storage Structure

### localStorage Keys:

1. **registeredUsers** (Array)
   ```json
   [
     {
       "username": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "registeredAt": "2026-02-03T10:30:00.000Z"
     },
     {
       "username": "Jane Smith",
       "email": "jane@example.com",
       "password": "securepass",
       "registeredAt": "2026-02-03T11:15:00.000Z"
     }
   ]
   ```

2. **currentUser** (Object)
   ```json
   {
     "email": "john@example.com",
     "username": "John Doe",
     "loginTime": "2026-02-03T12:00:00.000Z"
   }
   ```

3. **userName** (String): Current user's name
4. **userEmail** (String): Current user's email

## Features

### ✅ Registration
- Validates all input fields
- Checks for duplicate emails
- Stores user data securely in localStorage
- Shows success screen after registration

### ✅ Login
- Validates credentials against stored data
- Prompts unregistered users to sign up
- Shows specific error messages for wrong password
- Maintains user session after login

### ✅ Dashboard Protection
- Automatically redirects to homepage if not logged in
- Displays user-specific information
- Maintains session across page refreshes

### ✅ Logout
- Clears current session
- Preserves registered user data
- Redirects to homepage

## Using the Auth Utilities

A helper file `auth-utils.js` is included with useful functions:

### In Browser Console:

```javascript
// View all registered users
authUtils.displayAllUsers()

// Check if user is logged in
authUtils.isUserLoggedIn()

// Get current user
authUtils.getCurrentUser()

// Check if email is registered
authUtils.isEmailRegistered('john@example.com')

// Clear all users (for testing)
authUtils.clearAllUsers()
```

## Testing the System

### Test Scenario 1: New User Registration
1. Go to homepage
2. Fill out signup form with:
   - Username: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Sign Up Now!"
4. Success screen should appear
5. Click "Login to Continue"

### Test Scenario 2: Login with Registered User
1. Click "Login" button
2. Enter registered email and password
3. Solve CAPTCHA
4. Enter OTP (any 6 digits for demo)
5. Should redirect to dashboard

### Test Scenario 3: Login with Unregistered Email
1. Click "Login" button
2. Enter unregistered email
3. System should prompt to register first

### Test Scenario 4: Wrong Password
1. Click "Login" button
2. Enter registered email but wrong password
3. System should show "Incorrect password" error

### Test Scenario 5: Dashboard Protection
1. Open dashboard.html directly in browser
2. If not logged in, should redirect to homepage
3. If logged in, should show user's name and data

### Test Scenario 6: Logout
1. Login and go to dashboard
2. Click profile dropdown
3. Click "Sign Out"
4. Should redirect to homepage
5. Trying to access dashboard should redirect back

## Security Notes

⚠️ **Important**: This is a client-side only authentication system suitable for:
- Demos and prototypes
- Learning purposes
- Local applications

**NOT suitable for production** because:
- Passwords are stored in plain text
- Data is stored in browser localStorage (not encrypted)
- No server-side validation
- Can be manipulated via browser console

### For Production Use:
- Implement server-side authentication
- Hash passwords (bcrypt, argon2)
- Use secure tokens (JWT)
- Implement HTTPS
- Add rate limiting
- Use secure session management

## File Structure

```
ALM-Karvaan/
├── index.html              # Homepage with signup/login
├── dashboard.html          # Protected dashboard page
├── auth-utils.js          # Authentication helper functions
└── AUTH_SYSTEM_GUIDE.md   # This documentation
```

## Troubleshooting

### Issue: Can't login after registration
**Solution**: Check browser console for errors. Verify email was stored correctly:
```javascript
authUtils.displayAllUsers()
```

### Issue: Dashboard redirects to homepage
**Solution**: Ensure you're logged in:
```javascript
authUtils.isUserLoggedIn()
```

### Issue: Want to reset all data
**Solution**: Clear localStorage:
```javascript
authUtils.clearAllUsers()
// or
localStorage.clear()
```

### Issue: Multiple users with same email
**Solution**: The system prevents this, but if it happens:
```javascript
authUtils.clearAllUsers()
```

## Future Enhancements

Potential improvements for this system:

1. **Password Strength Indicator**: Visual feedback on password strength
2. **Email Verification**: Send actual verification emails
3. **Password Recovery**: "Forgot Password" functionality
4. **Profile Updates**: Allow users to update their information
5. **Remember Me**: Persistent login option
6. **Two-Factor Authentication**: Enhanced security
7. **Social Login**: Google, Facebook, etc.
8. **Backend Integration**: Connect to real API server

## Support

For issues or questions:
1. Check browser console for errors
2. Use `authUtils.displayAllUsers()` to debug
3. Clear localStorage and try again
4. Check this documentation

---

**Last Updated**: February 3, 2026
**Version**: 1.0.0
