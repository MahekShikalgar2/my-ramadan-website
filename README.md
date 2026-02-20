# 🌙 Ramadan Kareem Website

A complete Islamic web application to help Muslims manage their worship during Ramadan.

---

## ✨ Features

- 🕌 **Prayer times** with location & countdown  
- 📖 **Quran reading** with 30-day plan  
- 🤲 **Categorized duas** with AI suggestions  
- 📿 **Digital tasbeeh counter**  
- 📅 **30-day Ramadan planner**  
- 🎯 **Personal goals tracker**  
- 💫 **Daily hadith reminders**  
- 🧭 **Qibla direction finder**  
- 👤 **User authentication**  
- 🌓 **Dark / Light mode toggle**  
- 📱 **Fully responsive design**

---

## 🛠️ Tech Stack

**Frontend**
- React
- Tailwind CSS

**Backend**
- Node.js
- Express

**Database**
- MongoDB

**Authentication**
- JWT (JSON Web Token)

---

## 🚀 Quick Start

### Prerequisites

- Node.js v14+
- MongoDB

---

## 📥 Installation

### Clone & Install

```bash
git clone <your-repo-url>
cd ramadan-website
```

### Backend Setup

```bash
cd server
npm install
```

### Frontend Setup

```bash
cd ../client
npm install
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ramadan-website
JWT_SECRET=your-secret-key-here
```

### Client (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Run the Application

### Terminal 1 – Start MongoDB

```bash
mongod
```

### Terminal 2 – Backend

```bash
cd server
npm run dev
```

### Terminal 3 – Frontend

```bash
cd client
npm start
```

🌐 Visit: **http://localhost:3000**

---

## 📁 Folder Structure

```text
ramadan-website/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── hooks/
├── server/              # Node.js backend
│   ├── models/
│   ├── routes/
│   └── middleware/
```

---

## 🔑 Key Features Explained

| Feature        | Description                                   |
|---------------|-----------------------------------------------|
| Prayer Times  | Auto-location, next prayer countdown          |
| Quran         | All 114 surahs, Arabic + translation          |
| Duas          | Categorized, AI suggestions by feeling        |
| Tasbeeh       | Multiple dhikr, save counts                   |
| Planner       | 30-day checklist with progress                |
| Goals         | Track prayers, Quran, charity                 |
| Qibla         | Compass-based direction                       |

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd client
vercel
```

### Backend (Heroku)

```bash
cd server
heroku create your-app
git push heroku main
```

---

## 📝 License

MIT License

---

**Made with ❤️ for Ramadan 🌙 by Suhana & Mahek!**
