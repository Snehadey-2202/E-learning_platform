# E-Learning Platform

A personalized, full-stack E-learning platform designed to deliver courses efficiently. The project is completely containerized using Docker, providing a seamless setup for local development.

## 🚀 Tech Stack

**Frontend:**
- React (built with Vite)
- Nginx (for serving static files and acting as a reverse proxy)

**Backend:**
- Python 3.12 & Django 5
- Django REST Framework (DRF)
- JWT Authentication (`djangorestframework-simplejwt`)
- Gunicorn

**Database & Infrastructure:**
- PostgreSQL 15
- Docker & Docker Compose
- Boto3 & Django Storages (for media handling)

## 📁 Project Structure

```
E-learning_platform/
├── backend/            # Django backend application & REST APIs
├── frontend/           # React / Vite frontend application
├── nginx/              # Nginx configuration for reverse proxy & static file serving
├── docker-compose.yml  # Multi-container orchestration
└── README.md
```

## 🛠 Prerequisites

Make sure you have the following installed on your machine:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running)

## 🏃 Getting Started (Local Development)

The application uses `docker-compose` to orchestrate the database, backend, and frontend containers automatically. The backend is configured to automatically run database migrations and seed initial data upon startup.

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd E-learning_platform
   ```

2. **Build and start the containers**:
   Run the following command to build the images and start the services in the background:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the Application**:
   Once the build completes and the containers are running, you can access the application at:
   - **Main Website (Frontend)**: [http://localhost](http://localhost)
   - **Backend API & Admin Panel**: [http://localhost:8000](http://localhost:8000)

## 🛑 Stopping the Application

To stop the running containers without removing their data volumes:
```bash
docker-compose stop
```

To fully shut down the containers and remove them (this preserves your database volume so data isn't lost):
```bash
docker-compose down
```

To shut down and wipe all data (including the database volume):
```bash
docker-compose down -v
```

## 📝 Notes
- **Database Seeding**: The backend `Dockerfile` runs a custom `seed_db` management command on startup, ensuring you have initial mock data to test the platform.
- **Troubleshooting**: If a service fails to start or load, you can check the logs using `docker-compose logs <service_name>` (e.g., `docker-compose logs backend`).

## ☁️ Deployment (Render PaaS)

The project includes a `render.yaml` Blueprint file, which allows you to deploy the entire stack to [Render.com](https://render.com) easily.

### Steps to Deploy:
1. Push this repository to a GitHub, GitLab, or Bitbucket account.
2. Sign in to Render and click **"New +" -> "Blueprint"**.
3. Connect your repository.
4. Render will automatically read the `render.yaml` file and provision:
   - A Managed PostgreSQL Database
   - A Web Service for the Django Backend
   - A Web Service for the React/Nginx Frontend
5. Click **"Apply"** and wait for the services to build and go live!

> **Note**: For production, ensure you manage your secrets properly and restrict the `DJANGO_ALLOWED_HOSTS` or CORS settings appropriately to your live frontend URL.