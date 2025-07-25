#!/bin/bash

# MazzLabs Portfolio - Digital Ocean Deployment Script
# This script handles both development and production deployments

set -e  # Exit on any error

echo "🚀 MazzLabs Portfolio Deployment Script"
echo "========================================"

# Configuration
APP_ID="77272f8d-14a7-49b8-8552-6a0fd37793b3"
APP_NAME="mazzlabs-portfolio"
DOMAIN="whale-app-m552s.ondigitalocean.app"
PROJECT_NAME="mazzlabs-portfolio"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command_exists "doctl"; then
        log_error "Digital Ocean CLI (doctl) not found. Please install it first:"
        echo "https://docs.digitalocean.com/reference/doctl/how-to/install/"
        exit 1
    fi
    
    if ! command_exists "git"; then
        log_error "Git not found. Please install Git first."
        exit 1
    fi
    
    if ! command_exists "docker"; then
        log_warning "Docker not found. Some deployment features may not work."
    fi
    
    log_success "Prerequisites check completed"
}

# Function to build React frontend
build_frontend() {
    log_info "Building React frontend..."
    
    cd client
    
    if [ ! -d "node_modules" ]; then
        log_info "Installing npm dependencies..."
        npm install
    fi
    
    log_info "Building production React app..."
    npm run build
    
    log_success "Frontend build completed"
    cd ..
}

# Function to test Django backend
test_backend() {
    log_info "Testing Django backend..."
    
    cd server
    
    if [ ! -d "venv" ]; then
        log_info "Creating Python virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    log_info "Running Django tests..."
    python manage.py check
    
    log_success "Backend tests passed"
    cd ..
}

# Function to deploy to Digital Ocean
deploy_to_digitalocean() {
    log_info "Deploying to Digital Ocean App Platform..."
    
    # Check if logged in to doctl
    if ! doctl account get >/dev/null 2>&1; then
        log_error "Not logged in to Digital Ocean. Please run: doctl auth init"
        exit 1
    fi
    
    # Commit and push changes
    log_info "Committing and pushing changes..."
    git add .
    git commit -m "Deploy: Updated configuration for Digital Ocean deployment" || true
    git push origin main
    
    # Trigger deployment
    log_info "Triggering Digital Ocean deployment..."
    doctl apps create-deployment $APP_ID --context mazzlabs || {
        log_warning "Deployment trigger failed. You may need to manually trigger deployment in the DO dashboard."
    }
    
    log_success "Deployment initiated. Check status at: https://cloud.digitalocean.com/apps/$APP_ID"
    log_success "Your app will be available at: https://$DOMAIN"
}

# Function to setup environment
setup_environment() {
    log_info "Setting up environment configuration..."
    
    # Create environment files if they don't exist
    if [ ! -f "client/.env.production" ]; then
        log_info "Creating production environment file..."
        echo "REACT_APP_API_URL=https://$DOMAIN" > client/.env.production
    fi
    
    if [ ! -f "client/.env.development" ]; then
        log_info "Creating development environment file..."
        echo "REACT_APP_API_URL=http://localhost:8000" > client/.env.development
    fi
    
    log_success "Environment setup completed"
}

# Function to show deployment status
show_status() {
    log_info "Checking deployment status..."
    
    if command_exists "doctl"; then
        doctl apps list --context mazzlabs | grep $APP_NAME || log_warning "App not found in Digital Ocean"
    fi
    
    log_info "Deployment URLs:"
    echo "  Production: https://$DOMAIN"
    echo "  DO Dashboard: https://cloud.digitalocean.com/apps/$APP_ID"
}

# Main deployment function
main() {
    echo ""
    echo "Select deployment option:"
    echo "1) Full deployment (build + deploy)"
    echo "2) Development setup"
    echo "3) Check status"
    echo "4) Build only"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            log_info "Starting full deployment..."
            check_prerequisites
            setup_environment
            build_frontend
            test_backend
            deploy_to_digitalocean
            show_status
            ;;
        2)
            log_info "Setting up development environment..."
            setup_environment
            cd client && npm install && cd ..
            cd server && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ..
            log_success "Development environment ready!"
            log_info "To start development:"
            echo "  Backend: cd server && source venv/bin/activate && python manage.py runserver"
            echo "  Frontend: cd client && npm start"
            ;;
        3)
            show_status
            ;;
        4)
            setup_environment
            build_frontend
            test_backend
            log_success "Build completed successfully!"
            ;;
        *)
            log_error "Invalid choice. Please select 1-4."
            exit 1
            ;;
    esac
}

# Run main function
main

echo ""
log_success "Deployment script completed!"
echo "========================================="
