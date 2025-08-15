# 📚 StudySync – Student Resource Sharing Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</div>

<div align="center">
  <h3>🎯 A centralized platform for students to share and discover study resources</h3>
  <p>StudySync is a responsive web application that enables students to find, explore, and share valuable study materials including PDFs, notes, videos, and helpful links.</p>
  
  <h3>🌐 Live Demo</h3>
  <a href="https://study-sync-student-resource-sharing.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <br>
  <a href="https://study-sync-student-resource-sharing.vercel.app" target="_blank">
    🚀 https://study-sync-student-resource-sharing.vercel.app
  </a>
</div>

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 📖 Core Features

- **📤 Resource Sharing**: Upload and share PDFs, images, videos, and links
- **📝 Post Creation**: Share thoughts, projects, and study updates
- **💾 Data Persistence**: All content saved with reliable backend storage
- **🖼️ Image Preview**: Automatic preview for uploaded files and image URLs
- **🔗 Smart Link Detection**: URLs and emails become clickable automatically

</td>
<td width="50%">

### ⚡ Interactive Features

- **📁 File Upload**: Support for multiple file types with drag-and-drop
- **🔄 Real-time Updates**: Instant synchronization across sessions
- **🛡️ Error Handling**: Graceful error messages and retry functionality
- **📱 Responsive Design**: Optimized for all device sizes
- **🔍 Search & Filter**: Advanced content discovery tools

</td>
</tr>
</table>

---

## 🔮 Features to be Added

<table>
<tr>
<td width="50%">

### 👥 Profile & Social Features

- **🎓 Education Info Collection**: Gather and display academic background, institution, and graduation details
- **🛠️ Skills Management**: Add, edit, and showcase personal skills with proficiency levels
- **👤 Profile Customization**: Edit profile picture, display name, and bio information
- **🔗 Clickable User Profiles**: Browse and view other users' complete profiles
- **📊 Profile Analytics**: Track profile views, engagement, and activity metrics

</td>
<td width="50%">

### 🚀 Advanced Features

- **💬 Direct Messaging**: Private communication between users
- **🔔 Notification System**: Real-time alerts for activities and updates
- **⭐ Rating & Reviews**: Rate and review shared resources
- **🏷️ Advanced Tagging**: Categorize content with custom tags
- **📈 Learning Analytics**: Track study progress and resource usage

</td>
</tr>
</table>

<div align="center">
  <small><em>💡 Contributors are welcome to help implement these features!</em></small>
</div>

---

## 🛠️ Technology Stack

<table>
<tr>
<td width="33%">

### Frontend

- **React.js** - UI Framework
- **React Icons** - Icon Library
- **React Select** - Form Components
- **CSS3** - Styling
- **Vite** - Build Tool

</td>
<td width="33%">

### Backend

- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File Upload

</td>
<td width="33%">

### Authentication

- **Passport.js** - Authentication
- **JWT** - Token Management
- **Session Management**

</td>
</tr>
</table>

---

## 🔗 API Endpoints

<table>
<tr>
<td width="50%">

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
```

### Posts

```
GET    /api/posts
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
```

</td>
<td width="50%">

### Resources

```
GET    /api/resources
POST   /api/resources
PUT    /api/resources/:id
DELETE /api/resources/:id
```

### File Upload

```
POST /api/upload
GET  /api/uploads/:filename
```

</td>
</tr>
</table>

---

## ✨ Key Features Explained

<table>
<tr>
<td width="50%">

### 💾 Data Persistence

- **Secure Storage**: All data stored in MongoDB
- **Session Management**: Persistent user sessions
- **Real-time Sync**: Live updates across all clients
- **Backup & Recovery**: Automated data backup

### 🔗 Smart Link Detection

- **URL Recognition**: Auto-detect and linkify URLs
- **Email Links**: Convert emails to mailto links
- **Social Media**: Detect and preview social links
- **Custom Patterns**: Support for various URL formats

</td>
<td width="50%">

### 🖼️ Advanced File Handling

- **Drag & Drop**: Intuitive file upload interface
- **Image Preview**: Instant preview for image files
- **File Validation**: Type and size checking
- **Cloud Storage**: Secure file storage solution

</td>
</tr>
</table>

---

## 🚀 Getting Started

<table>
<tr>
<td width="50%">

### Prerequisites

```bash
Node.js >= 16.x
npm >= 8.x
MongoDB >= 5.x
```

### Installation

```bash
# Clone repository
git clone https://github.com/Codeunia/StudySync-Student-Resource-Sharing-App.git

# Navigate to project
cd StudySync-Student-Resource-Sharing-App

# Install dependencies
npm install
```

</td>
<td width="50%">

### Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Configure your variables
MONGODB_URI=mongodb://localhost:27017/studysync
JWT_SECRET=your_secret_key
PORT=5000
```

### Running the Application

```bash
# Start backend server
npm run server

# Start frontend (new terminal)
npm run dev
```

</td>
</tr>
</table>

---

## 📂 Project Structure

```
StudySync-Student-Resource-Sharing-App/
├── 📁 backend/                 # Backend API server
│   ├── 📁 config/             # Configuration files
│   ├── 📁 middleware/         # Custom middleware
│   ├── 📁 models/            # Database models
│   ├── 📁 routes/            # API routes
│   └── 📄 server.js          # Entry point
├── 📁 src/                    # Frontend source code
│   ├── 📁 components/        # Reusable components
│   ├── 📁 pages/            # Page components
│   ├── 📁 styles/           # CSS stylesheets
│   ├── 📁 hooks/            # Custom React hooks
│   └── 📁 utils/            # Utility functions
├── 📁 public/               # Static assets
└── 📄 package.json         # Project dependencies
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Built By

<div align="center">
  <a href="https://github.com/Venkat-jaswanth">
    <img src="https://github.com/Venkat-jaswanth.png" width="60" height="60" style="border-radius: 50%;" alt="Venkat Jaswanth" />
  </a>
  <br>
  <strong><a href="https://github.com/Venkat-jaswanth">Venkat Jaswanth</a></strong>
  <br>
  <em>Lead Developer</em>
</div>

---

<div align="center">
  <h3>⭐ If you found this project helpful, please give it a star!</h3>
  <p>Made with ❤️ for the student community</p>
</div>
