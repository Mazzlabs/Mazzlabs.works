#!/bin/bash
# Deploy script for DigitalOcean App Platform

echo "🚀 Deploying Mazzlabs Portfolio to DigitalOcean..."

# Add all files
git add .

# Commit changes
git commit -m "Deploy portfolio to DigitalOcean App Platform - $(date)"

# Push to GitHub
git push origin main

echo "✅ Deployment pushed to GitHub!"
echo "🌐 Your app will be available at your DigitalOcean App Platform URL"
echo "🔧 Don't forget to set up your environment variables in the DigitalOcean dashboard:"
echo "   - SECRET_KEY"
echo "   - EMAIL_USERNAME"
echo "   - EMAIL_PASSWORD"
echo "   - CONTACT_EMAIL"
