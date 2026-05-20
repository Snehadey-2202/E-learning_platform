# Use standard python image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python requirements
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Port exposure
EXPOSE 8000

# Executing migrate and gunicorn (and seed database in dev mode)
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py seed_db && gunicorn elearning.wsgi:application --bind 0.0.0.0:8000"]
