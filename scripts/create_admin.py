#!/usr/bin/env python
"""
Script to create Django superuser for admin access
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admin_system.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin_user():
    """Create admin user if it doesn't exist"""
    try:
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_superuser': True,
                'is_staff': True,
                'is_active': True,
                'first_name': 'Admin',
                'last_name': 'User'
            }
        )
        
        if created:
            user.set_password('Admin@123')
            user.save()
            print("✅ Admin user created successfully!")
            print("   Username: admin@example.com")
            print("   Password: Admin@123")
        else:
            print("✅ Admin user already exists!")
            
        return True
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        return False

if __name__ == '__main__':
    create_admin_user()
