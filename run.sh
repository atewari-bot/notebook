#!/bin/bash

# Software Engineering Notebooks - Development Helper Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Software Engineering Notebooks${NC}"
echo -e "${BLUE}====================================${NC}"

# Function to display help
show_help() {
    echo -e "\n${YELLOW}Available commands:${NC}"
    echo -e "  ${GREEN}dev${NC}          - Start development server (npm run dev)"
    echo -e "  ${GREEN}docker-dev${NC}   - Start with Docker (development mode)"
    echo -e "  ${GREEN}docker-prod${NC}  - Start with Docker (production mode)"
    echo -e "  ${GREEN}build${NC}        - Build for production"
    echo -e "  ${GREEN}install${NC}      - Install dependencies"
    echo -e "  ${GREEN}clean${NC}        - Clean Docker containers and images"
    echo -e "  ${GREEN}help${NC}         - Show this help message"
    echo
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
}

# Function to start development server
start_dev() {
    echo -e "${YELLOW}🔥 Starting development server...${NC}"
    echo -e "${BLUE}Opening http://localhost:5173${NC}"
    npm run dev
}

# Function to start Docker development
start_docker_dev() {
    echo -e "${YELLOW}🐳 Starting Docker development environment...${NC}"
    echo -e "${BLUE}Opening http://localhost:5173${NC}"
    docker-compose --profile dev up --build
}

# Function to start Docker production
start_docker_prod() {
    echo -e "${YELLOW}🐳 Starting Docker production environment...${NC}"
    echo -e "${BLUE}Opening http://localhost:80${NC}"
    docker-compose --profile prod up --build
}

# Function to build for production
build_prod() {
    echo -e "${YELLOW}🏗️  Building for production...${NC}"
    npm run build
    echo -e "${GREEN}✅ Production build completed!${NC}"
}

# Function to clean Docker
clean_docker() {
    echo -e "${YELLOW}🧹 Cleaning Docker containers and images...${NC}"
    docker-compose --profile dev down --rmi all --volumes --remove-orphans 2>/dev/null || true
    docker-compose --profile prod down --rmi all --volumes --remove-orphans 2>/dev/null || true
    echo -e "${GREEN}✅ Docker cleanup completed!${NC}"
}

# Main command handling
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "docker-dev")
        start_docker_dev
        ;;
    "docker-prod")
        start_docker_prod
        ;;
    "build")
        build_prod
        ;;
    "install")
        install_deps
        ;;
    "clean")
        clean_docker
        ;;
    "help"|*)
        show_help
        ;;
esac
