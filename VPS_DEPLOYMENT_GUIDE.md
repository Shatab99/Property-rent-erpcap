# VPS Deployment Guide for Next.js Frontend

## Issue: Static Chunks Failing to Load (400 Bad Request)

This issue occurs when Next.js static files aren't properly served on the VPS. Follow these steps to fix it.

---

## Solution Steps

### 1. **Rebuild the Project**
```bash
npm run build
```

This generates the standalone build in `.next/standalone` directory.

### 2. **On VPS - Create Application Directory**
```bash
mkdir -p /app/frontend
cd /app/frontend
```

### 3. **Upload Files to VPS**
Copy these files to your VPS:
- `.next/` directory (entire folder)
- `public/` directory
- `node_modules/` directory (or run `npm install` on VPS)
- `package.json`
- `package-lock.json`
- `.env` (with production variables)

### 4. **Set Environment Variables on VPS**
Create or update `.env.production` on VPS:
```env
NEXT_PUBLIC_API_URL=http://138.197.19.114:7008
NODE_ENV=production
```

### 5. **Install Dependencies on VPS**
```bash
cd /app/frontend
npm install --production
```

### 6. **Start the Application**
Using npm:
```bash
npm start
```

Or using Node directly:
```bash
node /app/frontend/.next/standalone/server.js
```

### 7. **Use Process Manager (Recommended)**
Install PM2:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'frontend',
    script: '/app/frontend/.next/standalone/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_URL: 'http://138.197.19.114:7008',
      PORT: 3000
    }
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 8. **Configure Web Server (Nginx) - Recommended**

Create `/etc/nginx/sites-available/frontend`:
```nginx
upstream nextjs_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name skregp.com www.skregp.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name skregp.com www.skregp.com;

    # SSL certificates
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Cache static files
    location /_next/static/ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        proxy_pass http://nextjs_backend;
    }

    # Public folder
    location /public/ {
        expires 30d;
        add_header Cache-Control "public";
        root /app/frontend;
    }

    # Proxy everything else to Next.js
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Troubleshooting

### Issue: Still Getting 400 Errors on VPS

1. **Check file permissions:**
   ```bash
   chmod -R 755 /app/frontend/.next
   chmod -R 755 /app/frontend/public
   ```

2. **Verify Next.js is running:**
   ```bash
   curl http://localhost:3000
   ```

3. **Check logs:**
   ```bash
   pm2 logs frontend
   ```

4. **Verify .env variables:**
   ```bash
   cat /app/frontend/.env.production
   ```

5. **Clear browser cache:**
   - Hard refresh: `Ctrl + Shift + R`
   - Clear all cache for the domain

### Issue: API Calls Failing

1. Verify backend API is accessible:
   ```bash
   curl http://138.197.19.114:7008/api/v1/admin/stats
   ```

2. Check CORS headers if needed:
   - Update backend to allow VPS frontend origin

3. Check firewall rules:
   ```bash
   sudo ufw allow 3000
   sudo ufw allow 80
   sudo ufw allow 443
   ```

---

## Performance Optimization

### 1. Enable Gzip Compression in Nginx
Add to nginx server block:
```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json application/javascript;
gzip_min_length 1000;
```

### 2. Monitor Application
```bash
pm2 monit
```

### 3. Enable CDN (Optional)
Consider using Cloudflare for:
- SSL/TLS
- Caching
- DDoS protection
- Automatic gzip compression

---

## Deployment Checklist

- [ ] Run `npm run build` locally
- [ ] Verify build succeeds (exit code 0)
- [ ] Upload `.next`, `public`, and `node_modules`
- [ ] Set production `.env` variables
- [ ] Install dependencies on VPS
- [ ] Start with PM2 or Node
- [ ] Configure Nginx
- [ ] Test in browser (clear cache)
- [ ] Check browser console for errors
- [ ] Verify API calls work
- [ ] Test all admin panel features

---

## Quick Deployment Command

Run this script on VPS to deploy:
```bash
#!/bin/bash
cd /app/frontend
git pull origin main
npm install --production
npm run build
pm2 restart frontend
```

