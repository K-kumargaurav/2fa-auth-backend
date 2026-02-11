# 🔐 2FA Authentication Backend

A secure Node.js/Express backend API implementing user authentication with Two-Factor Authentication (2FA) using Time-based One-Time Passwords (TOTP). Built with Passport.js for session management and MongoDB for data persistence.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

- 🔒 **Secure Authentication** - Password hashing with bcrypt
- 🎫 **Session Management** - Express sessions with Passport.js
- 📱 **Two-Factor Authentication** - TOTP-based 2FA with QR code generation
- 🔑 **JWT Token Support** - JWT tokens for authenticated sessions
- 🛡️ **Security Best Practices** - CORS configuration, secure cookies
- 📊 **MongoDB Integration** - User data persistence with Mongoose
- 🔄 **2FA Reset Functionality** - Allow users to reset their 2FA settings
- ✅ **Authentication Status Checking** - Verify user login status

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Passport.js (Local Strategy)
- **Password Hashing:** bcryptjs
- **2FA:** Speakeasy (TOTP)
- **QR Code Generation:** qrcode
- **JWT:** jsonwebtoken
- **Session Store:** express-session
- **CORS:** cors

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.x or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/K-kumargaurav/2fa-auth-backend.git
   cd 2fa-auth-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   CONNECTION_STRING=mongodb://localhost:27017/auth_db
   
   # Server
   PORT=7001
   NODE_ENV=development
   
   # Session
   SESSION_SECRET=your-super-secret-session-key-change-this
   
   # JWT
   JWT_SECRET=your-jwt-secret-key-change-this
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

5. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:7001`

## 📚 API Documentation

### Base URL
```
http://localhost:7001/api/auth
```

### Authentication Endpoints

#### 1. Register User
```http
POST /register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully :)"
}
```

---

#### 2. Login
```http
POST /login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "User logged in successfully",
  "username": "johndoe",
  "isMfaActive": false
}
```

---

#### 3. Check Auth Status
```http
GET /status
```

**Response (200):**
```json
{
  "message": "User logged in successfully",
  "username": "johndoe",
  "isMfaActive": true
}
```

---

#### 4. Logout
```http
POST /logout
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### Two-Factor Authentication Endpoints

#### 5. Setup 2FA
```http
POST /2fa/setup
```

**Response (200):**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**Usage:**
- Scan the QR code with Google Authenticator, Authy, or similar apps
- Or manually enter the secret key

---

#### 6. Verify 2FA
```http
POST /2fa/verify
Content-Type: application/json

{
  "token": "123456"
}
```

**Response (200):**
```json
{
  "message": "2FA successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (400):**
```json
{
  "message": "Invalid 2FA token"
}
```

---

#### 7. Reset 2FA
```http
POST /2fa/reset
```

**Response (200):**
```json
{
  "message": "2FA reset successful"
}
```

**Note:** This allows users to disable 2FA and set it up again from scratch.

---

## 📁 Project Structure

```
2fa-auth-backend/
├── config/
│   ├── dbConnect.js          # MongoDB connection setup
│   └── passportConfig.js     # Passport.js configuration
├── controllers/
│   └── authController.js     # Authentication logic
├── models/
│   └── user.js              # User schema and model
├── routes/
│   └── authRoutes.js        # API route definitions
├── .env                     # Environment variables (create this)
├── .gitignore              # Git ignore file
├── index.js                # Application entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🔒 Security Features

### Password Security
- **Bcrypt Hashing:** Passwords hashed with salt rounds (default: 10)
- **No Plain Text Storage:** Passwords never stored in readable format

### Session Security
- **Express Sessions:** Secure session management
- **HTTP-Only Cookies:** Session cookies inaccessible via JavaScript
- **Session Expiry:** 24-hour session timeout
- **CSRF Protection:** Same-site cookie settings

### 2FA Implementation
- **TOTP Algorithm:** Time-based one-time passwords (30-second window)
- **Speakeasy Library:** Industry-standard 2FA implementation
- **QR Code Generation:** Easy setup with authenticator apps
- **Secret Storage:** Encrypted storage in MongoDB

### CORS Configuration
```javascript
const corsOptions = {
  origin: ["http://localhost:3001"],
  credentials: true,
};
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isMfaActive: {
    type: Boolean,
    required: false
  },
  twoFactorSecret: {
    type: String
  },
  timestamps: true  // createdAt, updatedAt
}
```

## 🔄 Authentication Flow

### Registration Flow
1. User submits username and password
2. Password is hashed with bcrypt
3. User document created in MongoDB
4. Success response sent to client

### Login Flow
1. User submits credentials
2. Passport.js validates against database
3. Password compared using bcrypt
4. Session created on success
5. User info returned (excluding password)

### 2FA Setup Flow
1. User requests 2FA setup
2. Secret key generated using Speakeasy
3. QR code created from secret
4. Secret saved to user document
5. QR code and secret returned to client

### 2FA Verification Flow
1. User submits 6-digit TOTP code
2. Code verified against stored secret
3. JWT token generated on success
4. Token returned to client

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:7001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}' \
  -c cookies.txt
```

**Setup 2FA:**
```bash
curl -X POST http://localhost:7001/api/auth/2fa/setup \
  -b cookies.txt
```

### Using Postman

1. Import the API endpoints
2. Set `Content-Type: application/json` header
3. Enable cookie management for session persistence
4. Test each endpoint in sequence

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CONNECTION_STRING` | MongoDB connection URI | `mongodb://localhost:27017/auth_db` |
| `PORT` | Server port number | `7001` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `SESSION_SECRET` | Secret for session encryption | `random-secret-string` |
| `JWT_SECRET` | Secret for JWT signing | `jwt-secret-string` |

## 🚦 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:** Ensure MongoDB is running and CONNECTION_STRING is correct

### Issue: "CORS error"
**Solution:** Add your frontend URL to the CORS origins array in `index.js`

### Issue: "Session not persisting"
**Solution:** Ensure `withCredentials: true` is set in frontend API calls

### Issue: "2FA reset returns 404"
**Solution:** Check that route has leading slash: `/2fa/reset` not `2fa/reset`

## 🔮 Future Enhancements

- [ ] Email verification for registration
- [ ] Password reset via email
- [ ] Rate limiting for brute force protection
- [ ] Redis session store for scalability
- [ ] OAuth integration (Google, GitHub)
- [ ] Role-based access control (RBAC)
- [ ] API rate limiting
- [ ] Request logging and monitoring
- [ ] Unit and integration tests
- [ ] Docker containerization

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ES6+ syntax
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@K-kumargaurav](https://github.com/K-kumargaurav)
- LinkedIn: [Kumar Gaurav](www.linkedin.com/in/k-kumargaurav)
- Email: kumargaurav74930@gmai.com

## 🙏 Acknowledgments

- [Passport.js](http://www.passportjs.org/) - Authentication middleware
- [Speakeasy](https://github.com/speakeasyjs/speakeasy) - 2FA implementation
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

---

⭐ If you find this project helpful, please give it a star on GitHub!

**Made with ❤️ by Kumar Gaurav**
