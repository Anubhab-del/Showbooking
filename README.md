# 🎬 BookMyShow Clone - Movie Ticket Booking System

A full-stack movie ticket booking application built with React, Node.js, Express, and MongoDB.

![BookMyShow Clone](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)

---

## 📸 Screenshots

### Home Page (Light Mode)
![Home Page Light Mode - Movie Selection, Time Slots, Seat Selection]

### Dark Mode
![Dark Mode - Beautiful dark theme with all features]

### Visual Seat Map
![Interactive seat selection map with pricing]

### Booking Confirmation
![Success modal with confetti animation]

### Digital Ticket
![Downloadable ticket with QR code]

---

## ✨ Features

### Core Features (Assignment Requirements)
- ✅ **Movie Selection** - Choose from 4 available movies
- ✅ **Time Slot Selection** - Select from 4 different show times
- ✅ **Seat Booking** - Book seats by type (A1, A2, A3, A4, D1, D2)
- ✅ **Real-time Validation** - Ensures movie, slot, and seats are selected
- ✅ **Database Storage** - All bookings saved to MongoDB
- ✅ **Last Booking Display** - Shows previous booking details
- ✅ **localStorage Persistence** - Selections survive page refresh
- ✅ **Responsive Design** - Works on all screen sizes

### Bonus Features (Beyond Requirements)
- 🌓 **Dark/Light Mode Toggle** - Smooth theme switching
- 🎊 **Confetti Animation** - Celebration on successful booking
- 🎬 **Movie Info Modals** - View details and watch trailers
- 💺 **Visual Seat Map** - Interactive theater seat layout with smart pricing
- 🍿 **Food & Beverages** - Add snacks to your booking
- 📊 **Live Price Calculator** - Real-time booking summary
- 🎟️ **Digital Ticket** - Downloadable ticket with QR code
- 🔔 **Toast Notifications** - Beautiful alerts instead of popups
- ⭐ **Movie Ratings** - Star ratings for each movie
- 📱 **Fully Responsive** - Mobile, tablet, desktop optimized

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **Axios** - HTTP client
- **Canvas Confetti** - Celebration animations
- **CSS3** - Custom styling with themes

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database

---

## 📋 Prerequisites

Before running this project, make sure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

### Check Installation
```bash
node --version    # Should show v14+
npm --version     # Should show v6+
mongod --version  # Should show v6.0+
```

---

## 🚀 Local Setup Instructions

### Step 1: Clone or Download the Project

**Option A: Using Git**
```bash
git clone https://github.com/YOUR-USERNAME/bookmyshow-clone.git
cd bookmyshow-clone
```

**Option B: Manual Download**
- Download the ZIP file
- Extract to a folder
- Open terminal in that folder

### Step 2: Start MongoDB

**Windows:**
```bash
# Open Command Prompt as Administrator
mongod
```

**Mac/Linux:**
```bash
sudo mongod
```

**Keep this terminal window open!**

### Step 3: Setup & Start Backend

Open a **NEW terminal window**:
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start backend server
npm start
```

You should see:
```
✅ Connected to MongoDB successfully!
🚀 Backend server running on http://localhost:8080
```

**Keep this terminal window open!**

### Step 4: Setup & Start Frontend

Open a **THIRD terminal window**:
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Browser will automatically open at `http://localhost:3000`

**Keep this terminal window open!**

---

## 🎮 How to Use

### Making a Booking

1. **Select a Movie** - Click on any movie card
2. **Choose Time Slot** - Click on your preferred show time
3. **Select Seats** - Either:
   - Click seats on the visual map, OR
   - Enter quantity in seat type inputs
4. **Add Food (Optional)** - Use +/- buttons to add snacks
5. **Review Summary** - Check the booking summary with total price
6. **Click "Book Now"** - Submit your booking
7. **Enjoy Confetti!** 🎊 - Watch the celebration
8. **View Ticket** - See your digital ticket with QR code

### Additional Features

- **Dark Mode** - Click the 🌙/☀️ button (top-right corner)
- **Movie Info** - Click "ℹ️ More Info" to watch trailer
- **Persistence** - Refresh page - your selections stay!
- **Last Booking** - Scroll down to see previous booking

---

## 📁 Project Structure
```
bookmyshow-clone/
├── backend/
│   ├── connection.js       # MongoDB connection
│   ├── Schema.js           # Booking data model
│   ├── server.js           # Express server with API endpoints
│   └── package.json        # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling with themes
│   │   ├── data.js         # Movies, slots, seats data
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Frontend dependencies
│
└── README.md               # This file
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8080`

### 1. Create Booking
```
POST /api/booking
```

**Request Body:**
```json
{
  "movie": "Tenet",
  "slot": "10:00 AM",
  "seats": {
    "A1": 2,
    "A2": 0,
    "A3": 1,
    "A4": 0,
    "D1": 0,
    "D2": 0
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Booking successful!",
  "booking": { ... }
}
```

### 2. Get Last Booking
```
GET /api/booking
```

**Response (200 OK):**
```json
{
  "movie": "Tenet",
  "slot": "10:00 AM",
  "seats": {
    "A1": 2,
    "A2": 0,
    "A3": 1,
    "A4": 0,
    "D1": 0,
    "D2": 0
  }
}
```

**If no bookings:**
```json
{
  "message": "No previous booking found"
}
```

---

## 🎨 Seat Pricing

| Seat Type | Location | Price |
|-----------|----------|-------|
| **A1** | Row A (Sides) | ₹150 |
| **A2** | Row A (Middle) | ₹150 |
| **A3** | Row B-C (Sides) | ₹200 |
| **A4** | Row B-C (Middle) | ₹200 |
| **D1** | Row D (Sides) | ₹250 |
| **D2** | Row D (Middle - VIP) | ₹250 |

**Visual Map Logic:**
- Seats 1-3 and 8-10 = Side seats
- Seats 4-7 = Premium middle seats

---

## 🍿 Food Menu

| Item | Price |
|------|-------|
| Popcorn (Small) | ₹100 |
| Popcorn (Large) | ₹180 |
| Coca Cola | ₹80 |
| Pepsi | ₹80 |
| Nachos | ₹120 |
| Combo Deal | ₹250 |

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Problem:** `MongoDB connection error`

**Solution:**
1. Make sure MongoDB is running (`mongod` command)
2. Check if port 27017 is free
3. Try restarting MongoDB

### Port Already in Use
**Problem:** `Port 8080 is already in use`

**Solution:**
```bash
# Windows - Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

### Frontend Won't Start
**Problem:** `npm start` fails

**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Run `npm start`

### Data Not Persisting
**Problem:** Bookings disappear after restart

**Solution:**
- Make sure MongoDB is running continuously
- Check backend console for connection errors

---

## 💾 Database Schema
```javascript
{
  movie: String,        // Required
  slot: String,         // Required
  seats: {
    A1: Number,        // Default: 0
    A2: Number,
    A3: Number,
    A4: Number,
    D1: Number,
    D2: Number
  },
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

---

## 🧪 Testing Checklist

- [ ] Select a movie
- [ ] Select a time slot
- [ ] Add seats using visual map
- [ ] Add seats using input boxes
- [ ] Add food items
- [ ] Check booking summary updates
- [ ] Submit booking
- [ ] Verify confetti animation
- [ ] View digital ticket
- [ ] Check last booking section
- [ ] Refresh page - selections persist
- [ ] Make another booking
- [ ] Toggle dark/light mode
- [ ] Watch movie trailer
- [ ] Test on mobile view

---

## 🎯 Assignment Requirements Met

| Requirement | Status |
|-------------|--------|
| Three servers (Frontend, Backend, Database) | ✅ |
| Backend on port 8080 | ✅ |
| Frontend on port 3000 | ✅ |
| POST /api/booking endpoint | ✅ |
| GET /api/booking endpoint | ✅ |
| Display movies, slots, seats | ✅ |
| Click selection for movies/slots | ✅ |
| Input selection for seats | ✅ |
| className updates on selection | ✅ |
| Validation before booking | ✅ |
| Clear selections after booking | ✅ |
| Display last booking | ✅ |
| localStorage persistence | ✅ |
| Separate storage (movie, slot, seats) | ✅ |
| Database storage | ✅ |

**Bonus Features:** 10+ additional features beyond requirements!

---

## 🚀 Future Enhancements

Potential improvements for v2.0:

- [ ] User authentication (login/signup)
- [ ] Multiple theaters/locations
- [ ] Real movie posters from API
- [ ] Payment gateway integration
- [ ] Email confirmation
- [ ] Booking history
- [ ] Admin dashboard
- [ ] Seat availability status
- [ ] Multi-language support
- [ ] PWA (Progressive Web App)

---

## 📚 Learning Resources

Technologies used in this project:

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://www.mongodb.com/docs/)
- [Mongoose ODM](https://mongoosejs.com/)
- [Axios Documentation](https://axios-http.com/)

---

## 👨‍💻 Developer

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 📝 License

This project is created for educational purposes as part of a fullstack development assignment.

---

## 🙏 Acknowledgments

- Assignment guidelines provided by [Institution/Course Name]
- BookMyShow for inspiration
- MongoDB, React, and Express communities

---

## 📞 Support

If you encounter any issues:

1. Check the **Troubleshooting** section above
2. Verify all prerequisites are installed
3. Ensure all three servers are running
4. Check browser console for errors (F12)

---

**Made with ❤️ using React, Node.js, Express & MongoDB**

---

## 🎬 Demo Video

[Optional: Add link to screen recording of your app in action]

---

**Last Updated:** February 2025
```

---

# 📤 HOW TO PUSH TO GITHUB

## Step 1: Create .gitignore

Create `SHOWBOOKING/.gitignore`:
```
# Dependencies
node_modules/
*/node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
build/
dist/
*/build/
*/dist/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# MongoDB
data/
