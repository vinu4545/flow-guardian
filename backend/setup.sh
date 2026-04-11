#!/bin/bash

# Create directories
mkdir -p routes controllers

# Create root files
touch server.js db.js .env

# Create module files
touch routes/auth.js
touch controllers/authController.js

echo "✅ Backend structure created successfully!"