# Software Engineering Notebooks

A React-based interactive documentation system for software engineering concepts, featuring visual diagrams and step-by-step explanations.

## 🎯 Purpose

This repository contains interactive React-based diagrams for common software engineering concepts organized by categories:

- **Security** - SSL/TLS handshakes, authentication, encryption protocols
- **Caching** - Caching strategies, CDN, Redis, Memcached (coming soon)
- **Cloud** - AWS, Azure, GCP, microservices, containers (coming soon)
- **Streaming** - Kafka, WebSockets, real-time data processing (coming soon)

Each concept is presented as an interactive diagram with detailed explanations for quick review and learning.

## 🚀 Quick Start

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd notebook
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5173
   ```

### Docker Development

1. **Run with Docker Compose (Development mode):**
   ```bash
   docker-compose --profile dev up --build
   ```

2. **Access the application:**
   ```
   http://localhost:5173
   ```

### Docker Production

1. **Run production build:**
   ```bash
   docker-compose --profile prod up --build
   ```

2. **Access the application:**
   ```
   http://localhost:80
   ```

## 📁 Project Structure

```
notebook/
├── src/
│   ├── security/           # Security concept diagrams
│   │   └── ssl_handshake.tsx
│   ├── cache/             # Caching concepts (coming soon)
│   ├── cloud/             # Cloud architecture (coming soon)
│   ├── streaming/         # Streaming concepts (coming soon)
│   ├── App.tsx            # Main navigation component
│   ├── App.css            # Component styles
│   ├── main.tsx           # React app entry point
│   └── index.css          # Global styles with Tailwind
├── public/                # Static assets
├── docker-compose.yml     # Docker services configuration
├── Dockerfile             # Multi-stage Docker build
├── nginx.conf             # Nginx configuration for production
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.ts         # Vite bundler configuration
```

## 🛠️ Development

### Adding New Concepts

1. **Create a new concept component:**
   ```bash
   # For security concepts
   src/security/new_concept.tsx
   
   # For other categories
   src/cache/new_concept.tsx
   src/cloud/new_concept.tsx
   src/streaming/new_concept.tsx
   ```

2. **Update the main App.tsx:**
   - Add the new concept to the appropriate category's `concepts` array
   - Import the component

3. **Component Structure:**
   Each concept should be a self-contained React component that exports a default function.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Docker** - Containerization

## 🐳 Docker Commands

### Development
```bash
# Build and run development container
docker-compose --profile dev up --build

# Run in background
docker-compose --profile dev up -d --build

# Stop services
docker-compose --profile dev down
```

### Production
```bash
# Build and run production container
docker-compose --profile prod up --build

# Run in background
docker-compose --profile prod up -d --build

# Stop services
docker-compose --profile prod down
```

### Direct Docker Commands
```bash
# Build development image
docker build --target development -t notebook:dev .

# Run development container
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules notebook:dev

# Build production image
docker build --target production -t notebook:prod .

# Run production container
docker run -p 80:80 notebook:prod
```

## 🚀 Future Deployment (AWS)

The application is designed to be easily deployable to AWS using:

- **ECS/Fargate** - For containerized deployment
- **CloudFront** - For CDN and global distribution
- **S3** - For static asset hosting
- **Application Load Balancer** - For traffic distribution
- **Route 53** - For domain management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-concept`
3. Add your concept component following the existing patterns
4. Update the main navigation in `App.tsx`
5. Test locally with Docker
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Current Concepts

### Security
- **SSL/TLS Handshake** - Interactive step-by-step visualization of the SSL/TLS handshake process

### Coming Soon
- **Caching Strategies** - Different caching patterns and their use cases
- **Cloud Architecture** - AWS/Azure/GCP service diagrams
- **Streaming Systems** - Kafka, WebSockets, and real-time processing
