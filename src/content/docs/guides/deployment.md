---
title: Deployment Guide
description: Deployment guide for Paideia LMS
---

# Deployment Guide

This comprehensive guide covers deploying Paideia LMS in various environments, from development to production, including containerization, cloud platforms, and traditional server deployments.

## 🚀 Deployment Overview

Paideia LMS supports multiple deployment strategies:

- **Single Executable**: Deploy as a standalone binary
- **Docker Containers**: Containerized deployment
- **Cloud Platforms**: AWS, GCP, Azure, and others
- **Traditional Servers**: VPS, dedicated servers

## 📋 Prerequisites

Before deploying, ensure you have:

- **Domain Name**: For production deployments
- **SSL Certificate**: HTTPS is required in production
- **Environment Variables**: Properly configured
- **Backup Strategy**: Database and file backups

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env` file or configure environment variables:

```env
# Application
NODE_ENV=production
PORT=3001
FRONTEND_PORT=3000

# Database
DATABASE_URL=postgresql://paideia_prod:secure_password@db_host:5432/paideia_prod

# File Storage
S3_URL=https://your-s3-endpoint.com
S3_ACCESS_KEY=your_production_access_key
S3_SECRET_KEY=your_production_secret_key

# Security
PAYLOAD_SECRET=your-super-secure-production-secret-key-min-32-chars

# Optional: Redis for caching
REDIS_URL=redis://redis_host:6379

# Optional: Email service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Security Checklist

- [ ] Use strong, unique passwords for all services
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Implement backup procedures
- [ ] Configure rate limiting
- [ ] Enable security headers

## 🐳 Docker Deployment

### Single Container Deployment

#### Dockerfile
```dockerfile
# Multi-stage build
FROM oven/bun:latest AS builder

# Copy source code
COPY . /app
WORKDIR /app

# Install dependencies
RUN bun install --production

# Build application
RUN bun run build

# Production stage
FROM oven/bun:latest AS production

# Copy built application
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

# Set working directory
WORKDIR /app

# Expose ports
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["./dist/paideia"]
```

#### Docker Compose (Recommended)
```yaml
version: '3.8'

services:
  paideia:
    build: .
    container_name: paideia-lms
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://paideia_prod:password@postgres:5432/paideia_prod
      - S3_URL=https://minio:9000
      - S3_ACCESS_KEY=paideia_minio
      - S3_SECRET_KEY=paideia_minio_secret
      - PAYLOAD_SECRET=your-production-secret
    depends_on:
      - postgres
      - minio
    networks:
      - paideia_net
    volumes:
      - ./uploads:/app/uploads  # Persistent file storage

  postgres:
    image: postgres:15
    container_name: paideia-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: paideia_prod
      POSTGRES_PASSWORD: secure_database_password
      POSTGRES_DB: paideia_prod
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    networks:
      - paideia_net

  minio:
    image: minio/minio:latest
    container_name: paideia-minio
    restart: unless-stopped
    ports:
      - "9000:9000"  # API
      - "9001:9001"  # Console
    environment:
      MINIO_ROOT_USER: paideia_minio
      MINIO_ROOT_PASSWORD: secure_minio_password
    volumes:
      - minio_prod_data:/data
    command: server /data --console-address ":9001"
    networks:
      - paideia_net

volumes:
  postgres_prod_data:
  minio_prod_data:

networks:
  paideia_net:
    driver: bridge
```

### Deployment Commands
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f paideia

# Scale the application
docker-compose up -d --scale paideia=3

# Update deployment
docker-compose down
docker-compose pull
docker-compose up -d
```

## ☁️ Cloud Platform Deployment

### Amazon Web Services (AWS)

#### Infrastructure Setup
```bash
# Create VPC and subnets
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create RDS PostgreSQL database
aws rds create-db-instance \
  --db-instance-identifier paideia-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username paideia_prod \
  --master-user-password secure_password \
  --allocated-storage 20

# Create S3 bucket for file storage
aws s3api create-bucket \
  --bucket paideia-lms-storage \
  --region us-east-1
```

#### ECS Deployment
```yaml
# ecs-task-definition.json
{
  "family": "paideia-lms",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "paideia",
      "image": "your-registry/paideia:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "DATABASE_URL", "value": "postgresql://..."},
        {"name": "S3_URL", "value": "https://paideia-lms-storage.s3.amazonaws.com"},
        {"name": "NODE_ENV", "value": "production"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/paideia-lms",
          "awslogs-region": "us-east-1"
        }
      }
    }
  ]
}
```

#### Application Load Balancer
```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name paideia-lms-alb \
  --subnets subnet-1 subnet-2 \
  --security-groups sg-lms \
  --scheme internet-facing

# Create target group
aws elbv2 create-target-group \
  --name paideia-lms-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-id

# Register ECS service with ALB
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --ssl-policy ELBSecurityPolicy-TLS-1-2-2017-01 \
  --certificate-arn arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

### Google Cloud Platform (GCP)

#### Cloud Run Deployment
```bash
# Build and push container
gcloud builds submit --tag gcr.io/your-project/paideia-lms

# Deploy to Cloud Run
gcloud run deploy paideia-lms \
  --image gcr.io/your-project/paideia-lms \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars NODE_ENV=production,DATABASE_URL=...,S3_URL=...
```

#### Cloud SQL Setup
```bash
# Create Cloud SQL instance
gcloud sql instances create paideia-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create paideia_prod --instance=paideia-db

# Create user
gcloud sql users create paideia_prod \
  --instance=paideia-db \
  --password=secure_password
```

### Microsoft Azure

#### Container Instances Deployment
```bash
# Create resource group
az group create --name paideia-lms-rg --location eastus

# Create Azure Database for PostgreSQL
az postgres server create \
  --resource-group paideia-lms-rg \
  --name paideia-postgres \
  --location eastus \
  --admin-user paideia_admin \
  --admin-password secure_password \
  --sku-name B_Gen5_1

# Deploy to Container Instances
az container create \
  --resource-group paideia-lms-rg \
  --name paideia-lms \
  --image your-registry/paideia:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production DATABASE_URL=... \
  --dns-name-label paideia-lms
```

## 🖥️ Traditional Server Deployment

### Ubuntu/Debian Server

#### System Requirements
- Ubuntu 20.04+ or Debian 11+
- 2GB RAM minimum
- 10GB storage minimum
- Public IP address

#### Installation Script
```bash
#!/bin/bash
# Paideia LMS Installation Script

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y curl postgresql postgresql-contrib nginx certbot python3-certbot-nginx

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Create paideia user
useradd -m -s /bin/bash paideia
usermod -aG sudo paideia

# Configure PostgreSQL
sudo -u postgres createuser --createdb --no-superuser --no-createrole paideia
sudo -u postgres psql -c "ALTER USER paideia PASSWORD 'secure_password';"
sudo -u postgres createdb -O paideia paideia_prod

# Configure firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Setup application directory
mkdir -p /opt/paideia
chown paideia:paideia /opt/paideia

# Clone application (adjust this for your repository)
sudo -u paideia git clone https://github.com/your-repo/paideia.git /opt/paideia
cd /opt/paideia

# Install dependencies and build
sudo -u paideia bun install --production
sudo -u paideia bun run build

# Configure systemd service
cat > /etc/systemd/system/paideia.service << EOF
[Unit]
Description=Paideia LMS
After=network.target postgresql.service

[Service]
Type=simple
User=paideia
WorkingDirectory=/opt/paideia
ExecStart=/home/paideia/.bun/bin/bun start
Restart=always
EnvironmentFile=/opt/paideia/.env

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable paideia
systemctl start paideia

# Configure Nginx
cat > /etc/nginx/sites-available/paideia << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/paideia /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Setup SSL (optional)
# certbot --nginx -d your-domain.com
```

## 🔒 Security Hardening

### Firewall Configuration
```bash
# UFW (Ubuntu/Debian)
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 5432  # PostgreSQL (restrict to specific IPs)
ufw default deny incoming
ufw enable

# firewalld (CentOS/RHEL)
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=5432/tcp
firewall-cmd --reload
```

### SSL/TLS Configuration
```nginx
# Nginx SSL configuration
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    location / {
        proxy_pass http://localhost:3000;
        # ... other proxy settings
    }
}
```

### Database Security
```sql
-- PostgreSQL security
-- Create dedicated user
CREATE USER paideia_prod WITH PASSWORD 'secure_password';

-- Grant minimal permissions
GRANT CONNECT ON DATABASE paideia_prod TO paideia_prod;
GRANT USAGE ON SCHEMA public TO paideia_prod;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO paideia_prod;

-- Enable row-level security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY user_own_data ON users FOR ALL USING (auth.uid() = id);
```

## 📊 Monitoring and Logging

### Application Monitoring
```bash
# Nginx access logs
tail -f /var/log/nginx/paideia_access.log

# Application logs
journalctl -u paideia -f

# System resources
htop
df -h
```

### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# Database health
docker exec paideia-postgres pg_isready -U paideia_prod

# Service status
systemctl status paideia
systemctl status postgresql
systemctl status nginx
```

### Log Rotation
```bash
# Logrotate configuration
cat /etc/logrotate.d/paideia << EOF
/var/log/paideia/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 paideia paideia
}
EOF
```

## 🔄 Backup and Recovery

### Automated Backup Script
```bash
#!/bin/bash
# Daily backup script

BACKUP_DIR="/var/backups/paideia"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U paideia_prod -d paideia_prod > $BACKUP_DIR/db_backup_$DATE.sql

# File storage backup (if using local storage)
# rsync -a /var/lib/paideia/uploads $BACKUP_DIR/files_backup_$DATE/

# Upload to cloud storage
aws s3 sync $BACKUP_DIR s3://paideia-backups/$(date +%Y/%m/)

# Keep only last 7 days locally
find $BACKUP_DIR -type f -mtime +7 -delete

# Log completion
echo "$(date): Backup completed successfully" >> /var/log/paideia/backup.log
```

### Recovery Procedures
```bash
# Stop the application
systemctl stop paideia

# Restore database
psql -h localhost -U paideia_prod -d paideia_prod < backup.sql

# Restore files (if applicable)
# cp -r backup_files/* /var/lib/paideia/uploads/

# Start the application
systemctl start paideia

# Verify functionality
curl http://localhost:3000/api/health
```

## 📈 Scaling Strategies

### Vertical Scaling
```bash
# Increase server resources
# Upgrade to larger instance type
# Add more RAM
# Use faster CPU
# Increase storage capacity
```

### Horizontal Scaling
```bash
# Load balancer configuration
upstream paideia_backend {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://paideia_backend;
        # ... other settings
    }
}
```

### Database Scaling
```bash
# Read replicas
aws rds create-db-instance-read-replica \
  --db-instance-identifier paideia-replica \
  --source-db-instance-identifier paideia-db

# Connection pooling
# Use PgBouncer or similar
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000
lsof -i :3000

# Kill conflicting processes
kill -9 $(lsof -t -i:3000)
```

#### Permission Issues
```bash
# Fix file permissions
chown -R paideia:paideia /opt/paideia
chmod +x /opt/paideia/dist/paideia

# Check systemd service logs
journalctl -u paideia --no-pager
```

#### Database Connection Issues
```bash
# Test database connectivity
pg_isready -h localhost -p 5432 -U paideia_prod

# Check database logs
tail -f /var/log/postgresql/postgresql-15-main.log

# Verify connection string
echo $DATABASE_URL
```

#### SSL Certificate Issues
```bash
# Test SSL configuration
curl -I https://your-domain.com

# Renew certificates
certbot renew

# Check certificate validity
certbot certificates
```

### Performance Optimization

#### Nginx Optimization
```nginx
# Optimized configuration
server {
    # ... basic config

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Caching
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=paideia_cache:10m max_size=1g;
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_cache paideia_cache;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### System Optimization
```bash
# Kernel tuning
echo 'net.core.somaxconn = 65536' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog = 65536' >> /etc/sysctl.conf
sysctl -p

# Increase file limits
echo 'paideia soft nofile 65536' >> /etc/security/limits.conf
echo 'paideia hard nofile 65536' >> /etc/security/limits.conf
```

### Emergency Procedures

#### Application Crash
```bash
# Check application logs
journalctl -u paideia --since "1 hour ago"

# Restart service
systemctl restart paideia

# Check resource usage
top -p $(pgrep -f paideia)
```

#### Database Failure
```bash
# Check database status
systemctl status postgresql

# View database logs
tail -f /var/log/postgresql/postgresql-15-main.log

# Emergency restore
pg_ctlcluster 15 main stop
cp /var/lib/postgresql/15/main /var/lib/postgresql/15/main.backup
pg_ctlcluster 15 main start
```

## 📞 Support and Maintenance

### Regular Maintenance Tasks
- [ ] Monitor system resources and logs
- [ ] Update SSL certificates
- [ ] Apply security patches
- [ ] Review and rotate backup files
- [ ] Optimize database performance
- [ ] Clean up old log files
- [ ] Monitor user activity and system usage

### Emergency Contacts
- **Technical Contact**: admin@your-domain.com
- **Infrastructure Provider**: AWS/GCP/Azure support
- **Database Administrator**: db-admin@your-domain.com

### Documentation Updates
Keep this deployment guide updated with:
- New deployment platforms
- Security improvements
- Performance optimizations
- Troubleshooting solutions

---

This deployment guide provides comprehensive instructions for deploying Paideia LMS in various environments while ensuring security, performance, and maintainability.
