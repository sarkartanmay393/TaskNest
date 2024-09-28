#!/bin/bash

if [ ! -d 'backend/node_modules' ]; then
    (cd backend && npm install)
fi

if [ ! -d 'frontend/node_modules' ]; then
    (cd frontend && npm install)
fi

if [ -d "backend/node_modules" ] && [ -d "frontend/node_modules" ]; then
    concurrently "npm run start-backend" "npm run start-frontend"
fi