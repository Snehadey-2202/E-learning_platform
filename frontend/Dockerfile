# Stage 1: Build React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app/
RUN npm run build

# Stage 2: Serve static assets with Nginx
FROM nginx:alpine

# Copy build static files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (handled by root docker compose)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
