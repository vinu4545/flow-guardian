#!/bin/bash

# Create directories
mkdir -p routes schemas services

# Create root files
touch main.py config.py requirements.txt

# Create __init__.py where necessary
touch routes/__init__.py
touch schemas/__init__.py
touch services/__init__.py

# Create module files
touch routes/user_routes.py
touch schemas/user_schema.py
touch services/user_service.py

echo "✅ Backend structure created successfully!"