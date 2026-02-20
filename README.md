# Smart Spend Trracking System 

A comprehensive financial tracking and management application with AI-powered support.

## 🚀 Features

- **User Authentication & Management**
- **Transaction Tracking** (Income & Expenses)
- **Financial Analytics & Dashboard**
- **AI-Powered Support Chat**
- **Admin Panel for User Management**
- **Secure Data Storage**

## 📁 Project Structure

```
Smart-Spend/
├── backend/                    # Django Backend
│   ├── admin_system/           # Main Django project
│   └── user_management/        # User management app
├── frontend/                   # Frontend Application
│   ├── home/
│   │   ├── login/             # Login & Signup
│   │   ├── user/              # User Dashboard & Features
│   │   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   ├── add-transaction/
│   │   │   ├── all-transactions/
│   │   │   ├── support/        # AI Support Chat
│   │   │   └── settings/
│   │   └── main/             # Landing Page
│   └── common/                # Shared Components
└── docs/                     # Documentation
```

## 🛠️ Technology Stack

### Backend

- **Django 6.0.2** - Web Framework
- **SQLite** - Database
- **Django REST Framework** - API
- **CORS Headers** - Frontend Integration

### Frontend

- **HTML5, CSS3, JavaScript**
- **Chart.js** - Data Visualization
- **Streamlit** - AI Support Interface

### AI/ML

- **Google Gemini API** - AI Support Chat

## 🔧 Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js (optional, for frontend tools)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Security Features

- **Environment Variables** - No hardcoded secrets
- **API Key Restrictions** - Limited access
- **User Authentication** - Secure login system
- **Data Encryption** - Sensitive data protection

## Team NG_CP_Team_5296
-> Team Leader - Dhruv Goyal [Core Backend Developer]
-> Team Member - Ankush Kumar Barnwal [Frontend Lead Developer]
-> Team Member - Deepanshu Sharma [Frontend Jr. Developer]
