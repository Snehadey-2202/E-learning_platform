# E-Learning Platform

A personalized, full-stack E-learning platform designed to deliver courses efficiently. The project is completely containerized using Docker, providing a seamless setup for local development and straightforward deployment.

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

Ensure the following dependencies are installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running in the background)

## 🏃 Getting Started (Local Development)

The application uses `docker-compose` to orchestrate the database, backend, and frontend containers automatically. The backend is configured to automatically run database migrations and seed initial data upon startup.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Snehadey-2202/E-learning_platform.git
   cd E-learning_platform
   ```

2. **Build and start the containers**:
   Run the following command to build the images and start the services in the background:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the Application**:
   Once the build completes and the containers are running, the application can be accessed at:
   - **Main Website (Frontend)**: [http://localhost](http://localhost)
   - **Backend API & Admin Panel**: [http://localhost:8000](http://localhost:8000)

## 🛑 Stopping the Application

To stop the running containers without removing their data volumes:
```bash
docker-compose stop
```

To fully shut down the containers and remove them (this preserves the database volume so data isn't lost):
```bash
docker-compose down
```

To shut down and wipe all data (including the database volume):
```bash
docker-compose down -v
```

## 📝 Notes
- **Database Seeding**: The backend `Dockerfile` runs a custom `seed_db` management command on startup, ensuring there is initial mock data to test the platform.
- **Troubleshooting**: If a service fails to start or load, check the logs using `docker-compose logs <service_name>` (e.g., `docker-compose logs backend`).

## ☁️ Deployment (Vercel)

The application is configured to be deployed as a **Serverless Monorepo** on [Vercel](https://vercel.com). The `vercel.json` configuration handles routing between the React frontend and the Django backend serverless functions.

### Steps to Deploy:
1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New" -> "Project"**.
3. Import this repository.
4. Open the **"Environment Variables"** tab in Vercel and add your production database credentials (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`), as well as `DJANGO_SECRET_KEY` and `DJANGO_DEBUG=False`.
5. Set `DJANGO_ALLOWED_HOSTS` to `.vercel.app` (or `*`).
6. Open the **"Build & Development Settings"** tab and override the **Build Command** to:
   ```bash
   cd backend && sh build_files.sh && cd ../frontend && npm install && npm run build
   ```
7. Override the **Output Directory** to `frontend/dist`.
8. Click **Deploy**! Vercel will automatically build the frontend, install the backend dependencies, and map the routes.

> **Note**: Serverless environments do not maintain persistent file systems. Database migrations (`python manage.py migrate`) must be run locally pointing to your production database, and Media file uploads require an external storage bucket like AWS S3 to be configured.
