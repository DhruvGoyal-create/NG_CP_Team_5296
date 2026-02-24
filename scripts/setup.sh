#!/bin/bash

# Smart Spend - Quick Setup Script
# This script sets up the development environment

echo "🚀 Setting up Smart Spend Financial Management System..."

# Check Python version
python_version=$(python3 --version 2>&1 | grep -Po '(?<=Python )\d+\.\d+')
if [[ $(echo "$python_version >= 3.8" | bc -l) -eq 0 ]]; then
    echo "❌ Python 3.8+ required. Current version: $python_version"
    exit 1
fi

echo "✅ Python version check passed: $python_version"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Run Django migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Create superuser (interactive)
echo "👤 Creating admin user..."
python manage.py createsuperuser

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

cd ..

# Setup frontend
echo "🌐 Setting up frontend..."
echo "Frontend is ready to run with: python -m http.server 3000"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔐 Creating .env file..."
    cat > .env << EOL
# Environment Variables for Smart Spend Application
GOOGLE_API_KEY=AIzaSyCuOCSuonAS1yA6TndA9du9f7sociogcBs
SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
EOL
    echo "✅ .env file created with your API key"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Start backend: cd backend && python manage.py runserver"
echo "3. Start frontend: cd frontend && python -m http.server 3000"
echo "4. Open browser: http://localhost:3000 (frontend) or http://localhost:8000/admin (admin)"
echo ""
echo "🔐 Important: Restrict your API key in Google Cloud Console!"
echo "📖 Read SECURITY_GUIDE.md for security instructions"
echo ""
