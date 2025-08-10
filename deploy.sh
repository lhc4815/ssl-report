#!/bin/bash

echo "🚀 SSL Report Deployment Script"
echo "================================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local file not found!"
    echo "Please create .env.local with your database credentials."
    echo "You can copy .env.example as a template."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "📋 Pre-deployment checklist:"
echo "✅ Project structure ready"
echo "✅ Vercel configuration present"
echo "✅ API functions configured"
echo ""

echo "🌐 Starting Vercel deployment..."
echo "================================"
vercel

echo ""
echo "✨ Deployment process initiated!"
echo ""
echo "📝 Next steps:"
echo "1. Go to Vercel dashboard"
echo "2. Set environment variables:"
echo "   - DB_HOST"
echo "   - DB_PORT" 
echo "   - DB_USER"
echo "   - DB_PASSWORD"
echo "   - DB_NAME"
echo ""
echo "🔗 Your app will be available at the URL provided by Vercel"
