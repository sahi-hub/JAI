# JAi Deployment Guide

This guide provides instructions for deploying the JAi journaling application, including the backend server, Ollama LLM, and frontend PWA.

## Prerequisites

- A cloud VPS (e.g., Hetzner, DigitalOcean) with at least 2GB RAM and 2 vCPUs
- A domain name for your application
- Node.js 16+ and npm installed on your local machine
- Git installed on your local machine

## Backend Deployment

### 1. Set Up the VPS

1. Create a new VPS instance with Ubuntu 22.04 LTS
2. SSH into your server:
   ```bash
   ssh root@your_server_ip
   ```
3. Update the system:
   ```bash
   apt update && apt upgrade -y
   ```
4. Create a non-root user:
   ```bash
   adduser jai
   usermod -aG sudo jai
   ```
5. Set up SSH keys for the new user (optional but recommended)
6. Install required packages:
   ```bash
   apt install -y nodejs npm nginx certbot python3-certbot-nginx ufw
   ```

### 2. Install and Configure Ollama

1. Install Ollama:
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```
2. Pull the TinyLlama model (or your preferred model):
   ```bash
   ollama pull tinyllama
   ```
3. Create a systemd service for Ollama:
   ```bash
   sudo nano /etc/systemd/system/ollama.service
   ```
4. Add the following content:
   ```
   [Unit]
   Description=Ollama Service
   After=network.target

   [Service]
   Type=simple
   User=jai
   WorkingDirectory=/home/jai
   ExecStart=/usr/local/bin/ollama serve
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```
5. Enable and start the service:
   ```bash
   sudo systemctl enable ollama
   sudo systemctl start ollama
   ```

### 3. Deploy the Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jai.git
   cd jai/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```bash
   nano .env
   ```
4. Add the following content (replace with your values):
   ```
   PORT=3001
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_jwt_secret_key
   OLLAMA_API_URL=http://localhost:11434/api
   OLLAMA_MODEL=tinyllama
   ```
5. Create a systemd service for the backend:
   ```bash
   sudo nano /etc/systemd/system/jai-backend.service
   ```
6. Add the following content:
   ```
   [Unit]
   Description=JAi Backend Service
   After=network.target

   [Service]
   Type=simple
   User=jai
   WorkingDirectory=/home/jai/jai/backend
   ExecStart=/usr/bin/npm start
   Restart=on-failure
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```
7. Enable and start the service:
   ```bash
   sudo systemctl enable jai-backend
   sudo systemctl start jai-backend
   ```

### 4. Set Up Nginx and SSL

1. Create an Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/jai
   ```
2. Add the following content (replace with your domain):
   ```
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/jai /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Set up SSL with Certbot:
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

### 5. Configure Firewall

1. Set up UFW:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

## Frontend Deployment

### 1. Prepare the Frontend for Deployment

1. Update the API URL in `frontend/next.config.js`:
   ```javascript
   env: {
     NEXT_PUBLIC_API_URL: 'https://api.yourdomain.com/api',
   },
   ```
2. Build the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

### 2. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy to Vercel:
   ```bash
   vercel
   ```
3. Follow the prompts to deploy your application
4. Set up your custom domain in the Vercel dashboard

### Alternative: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Deploy to Netlify:
   ```bash
   netlify deploy
   ```
3. Follow the prompts to deploy your application
4. Set up your custom domain in the Netlify dashboard

## Setting Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL schema from `backend/src/utils/schema.sql` in the Supabase SQL editor
3. Configure authentication in the Supabase dashboard
4. Update the `.env` file with your Supabase URL and key

## Monitoring and Maintenance

1. Set up log rotation:
   ```bash
   sudo nano /etc/logrotate.d/jai
   ```
2. Add the following content:
   ```
   /home/jai/jai/backend/logs/*.log {
       daily
       missingok
       rotate 14
       compress
       delaycompress
       notifempty
       create 0640 jai jai
   }
   ```
3. Monitor the services:
   ```bash
   sudo systemctl status ollama
   sudo systemctl status jai-backend
   sudo journalctl -u ollama
   sudo journalctl -u jai-backend
   ```

## Updating the Application

1. Pull the latest changes:
   ```bash
   cd /home/jai/jai
   git pull
   ```
2. Update dependencies and restart services:
   ```bash
   cd backend
   npm install
   sudo systemctl restart jai-backend
   ```
3. For frontend updates, redeploy using Vercel or Netlify CLI

## Troubleshooting

- If the backend service fails to start, check the logs:
  ```bash
  sudo journalctl -u jai-backend
  ```
- If Ollama fails to start, check the logs:
  ```bash
  sudo journalctl -u ollama
  ```
- If Nginx returns errors, check the configuration:
  ```bash
  sudo nginx -t
  ```
- If SSL certificates expire, renew them:
  ```bash
  sudo certbot renew
  ```

## Security Considerations

- Keep your server updated with security patches
- Use strong passwords and SSH keys
- Regularly backup your Supabase database
- Monitor server logs for suspicious activity
- Consider setting up fail2ban to prevent brute force attacks
