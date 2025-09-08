# Multi-stage build for KubeEasy Vue 3 Application
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for native builds
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY turbo.json ./

# Install dependencies with clean npm cache
RUN npm ci --only=production=false --no-audit --no-fund

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy custom nginx configuration
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Security headers for API calls
    location /api/ {
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
        # Proxy to your backend API when needed
        # proxy_pass http://backend:8080/api/;
    }
}
EOF

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S kubeasy && \
    adduser -S kubeasy -u 1001 -G kubeasy

# Change ownership of nginx directories
RUN chown -R kubeasy:kubeasy /var/cache/nginx && \
    chown -R kubeasy:kubeasy /var/log/nginx && \
    chown -R kubeasy:kubeasy /etc/nginx/conf.d && \
    chown -R kubeasy:kubeasy /usr/share/nginx/html

# Update nginx.conf to run as non-root user
RUN sed -i 's/user nginx;/user kubeasy;/' /etc/nginx/nginx.conf

# Switch to non-root user
USER kubeasy

# Expose port 80
EXPOSE 80

# Add labels for better Docker image management
LABEL org.opencontainers.image.title="KubeEasy Vue3 Dashboard" \
      org.opencontainers.image.description="Modern Vue 3 Kubernetes dashboard application" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="KubeEasy" \
      org.opencontainers.image.licenses="MIT"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Use dumb-init for proper signal handling and start nginx
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]