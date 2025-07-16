# StudySync – Student Resource Sharing Platform

**StudySync** is a responsive web application designed to help students find, explore, and share useful study resources such as PDFs, notes, videos, and helpful links. The platform aims to become a centralized space for peer-contributed learning materials.

---

## 💡 Features

### Core Features

- **Resource Sharing**: Upload and share PDFs, images, videos, and links
- **Post Creation**: Share thoughts, projects, and study updates with automatic link detection
- **Profile Management**: Editable profiles with skills, institution, and graduation year
- **Data Persistence**: All posts and resources are saved using JSON Server
- **Image Preview**: Automatic image preview for uploaded files and image URLs

### Interactive Features

- **Automatic Link Detection**: URLs and emails in text content become clickable links
- **File Upload**: Support for PDFs, images, and various file types
- **Real-time Updates**: Changes are saved immediately and persist across sessions
- **Error Handling**: Graceful error messages and retry functionality

---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Icons**: React Icons (Font Awesome, Tabler Icons)
- **Form Components**: React Select
- **Backend**: JSON Server for data persistence (For now)
- **API**: RESTful API with fetch-based utilities

---

## 🔗 API Endpoints

The JSON Server provides RESTful endpoints:


## ✨ Key Features Explained

### Data Persistence

- Posts and resources are saved to a JSON file
- Data persists across browser sessions and page reloads
- Real-time synchronization between UI and backend

### Automatic Link Detection

- URLs (https://, www., or plain domains) become clickable links
- Email addresses become mailto links
- Smart regex patterns detect various URL formats

### Image Handling

- File upload with drag-and-drop support
- Automatic image preview for uploaded files
- URL-based image preview for image links
- Proper memory management with object URL cleanup

### Error Handling

- Server status checking with user-friendly messages
- Retry functionality for failed operations
- Loading states for better user experience
- JavaScript

---

## 👨‍💻 Contributor

[Venkat-jaswanth](https://github.com/Venkat-jaswanth)
