# PRD / Infrastructure Handover: Thetan Next.js VPS Deployment

**Document type:** Project requirements + deployment/infrastructure handover  
**Project:** Thetan Next.js website  
**Primary live domain:** `thetan.in`  
**Secondary live domain:** `www.thetan.in`  
**VPS provider:** Hostinger KVM VPS  
**VPS public IPv4:** `31.97.11.211`  
**VPS hostname from Hostinger:** `srv1282540.hstgr.cloud`  
**Linux hostname:** `srv1282540`  
**Current deployment branch:** `main`  
**Document prepared:** 19 May 2026  

---

## 1. Purpose of this document

This document records everything important about the current Thetan deployment setup so that future work does not depend on memory or scattered chat history.

It explains:

- How the VPS is accessed.
- What is already hosted on the VPS.
- Where the new Next.js app is stored.
- How GitHub Actions CI/CD connects to the VPS.
- Which domain and DNS records point to the app.
- How Nginx and SSL are connected.
- How to verify, debug, and safely extend this setup later.

This is written for humans first. It should also be useful for AI-assisted future debugging, but it is not only an AI-readable file.

**Important security note:** this document intentionally does **not** contain the real private SSH key, root password, `.env` values, API keys, GitHub tokens, or any other secret.

---

## 2. Current project summary

The Thetan website is a private GitHub repository containing a Next.js app.

The project is deployed to a Hostinger KVM VPS using GitHub Actions. Every push to the `main` branch triggers a deployment workflow. The workflow connects to the VPS over SSH, uploads the latest code, installs dependencies, builds the app, and restarts the app with PM2.

The website is publicly available at:

```text
https://thetan.in
https://www.thetan.in
```

The app runs inside the VPS on:

```text
http://localhost:3000
```

Nginx receives public traffic on ports `80` and `443`, then proxies requests for `thetan.in` and `www.thetan.in` to the Next.js app running on port `3000`.

---

## 3. High-level architecture

```text
User browser
    ↓
https://thetan.in / https://www.thetan.in
    ↓
DNS A/CNAME records in Hostinger
    ↓
VPS public IP: 31.97.11.211
    ↓
Nginx on VPS ports 80/443
    ↓
Reverse proxy to http://127.0.0.1:3000
    ↓
PM2 process: next-app
    ↓
Next.js production server
```

CI/CD architecture:

```text
Developer pushes to GitHub main branch
    ↓
GitHub Actions workflow starts
    ↓
GitHub Actions reads repo code
    ↓
GitHub Actions uses VPS_SSH_KEY secret
    ↓
SSH connection to root@31.97.11.211
    ↓
Code synced to /var/www/next-app
    ↓
npm install / npm ci
    ↓
npm run build
    ↓
PM2 restarts next-app
    ↓
Live website updates
```

---

## 4. VPS access details

### 4.1 SSH route

Use this command from a local terminal:

```bash
ssh root@31.97.11.211
```

Alternative using the Hostinger VPS hostname:

```bash
ssh root@srv1282540.hstgr.cloud
```

If SSH asks:

```text
Are you sure you want to continue connecting?
```

Type:

```text
yes
```

If there is a saved-host-key issue, run:

```bash
ssh-keygen -R 31.97.11.211
ssh root@31.97.11.211
```

### 4.2 If the SSH route is forgotten again

On your local machine, try:

```bash
history | grep ssh
history | grep "ssh root@"
```

Also check:

```bash
cat ~/.ssh/config
```

If local SSH is not working, use Hostinger's VPS/KVM console from the Hostinger dashboard.

### 4.3 Credentials note

Do not store the root password in this repo. If the root password is forgotten, reset it from the Hostinger VPS panel.

---

## 5. VPS environment snapshot

Observed VPS details:

```text
Operating system: Ubuntu 22.04.5 LTS
Kernel: Linux 5.15.0-164-generic x86_64
Hostname: srv1282540
Primary IPv4: 31.97.11.211
IPv6: 2a02:4780:2d:3323::1
Logged-in user used for deployment: root
```

Installed runtime/tools observed:

```text
Node.js: v20.20.0
npm: 10.8.2
git: 2.34.1
Nginx: installed and active
PM2: installed and used for Node processes
Docker: no running containers observed during initial check
```

Nginx was active and running as a system service.

Useful checks:

```bash
node -v
npm -v
git --version
systemctl status nginx --no-pager
pm2 list
```

---

## 6. Existing apps already present on the VPS

Before deploying Thetan, the VPS already hosted an older frontend/backend setup.

Existing folders:

```text
/var/www/frontend
/var/www/backend
/var/www/html
```

Existing Git repositories found:

```text
/var/www/frontend
Branch: main
Origin: https://github.com/tanishq-ship-it/quiz_build_json.git

/var/www/backend
Branch: main
Origin: https://github.com/tanishq-ship-it/quiz_Build_backend.git
```

Existing PM2 app:

```text
PM2 app name: quiz-backend
Status: online
Backend port: 4000
```

Existing Nginx domain configuration:

```text
Domain: mindsnack.app and www.mindsnack.app
Nginx config: /etc/nginx/sites-available/mindsnack
Enabled symlink: /etc/nginx/sites-enabled/mindsnack
Frontend root: /var/www/frontend/dist
Backend proxy path: /api/ → http://localhost:4000
SSL: managed by Certbot
```

Important: the Thetan setup was created separately and does not replace the older frontend/backend setup.

---

## 7. New Thetan Next.js app setup

The new Next.js app is stored at:

```text
/var/www/next-app
```

The PM2 process name is:

```text
next-app
```

The app runs on port:

```text
3000
```

The app was verified from inside the VPS using:

```bash
curl -I http://localhost:3000
```

Expected result:

```text
HTTP/1.1 200 OK
X-Powered-By: Next.js
```

Final observed PM2 status after deployment included:

```text
next-app      online
quiz-backend  online
```

This confirms both the new Thetan app and the older backend can run side-by-side.

---

## 8. Domain and DNS setup

### 8.1 Domain

The selected domain is:

```text
thetan.in
```

The `www` version is also connected:

```text
www.thetan.in
```

### 8.2 DNS provider

DNS is managed in Hostinger.

Nameservers shown in Hostinger:

```text
ns1.dns-parking.com
ns2.dns-parking.com
```

These nameservers were kept unchanged.

### 8.3 DNS records

The DNS was changed from an old IP:

```text
2.57.91.91
```

to the VPS IP:

```text
31.97.11.211
```

Final DNS records:

```text
A      @      31.97.11.211
CNAME  www    thetan.in
```

### 8.4 DNS verification

These commands confirmed DNS was correct:

```bash
nslookup thetan.in
nslookup www.thetan.in
```

Observed result:

```text
thetan.in      → 31.97.11.211
www.thetan.in  → thetan.in → 31.97.11.211
```

---

## 9. Nginx setup for Thetan

Nginx is the public web server. It accepts traffic on ports `80` and `443` and sends Thetan traffic to the Next.js app on port `3000`.

The Thetan Nginx config was created at:

```text
/etc/nginx/sites-available/thetan
```

It was enabled through:

```text
/etc/nginx/sites-enabled/thetan
```

The initial HTTP reverse-proxy config used this structure:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name thetan.in www.thetan.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}
```

Nginx was tested and reloaded using:

```bash
nginx -t && systemctl reload nginx
```

Expected result:

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

HTTP was verified using:

```bash
curl -I http://thetan.in
curl -I http://www.thetan.in
```

Both returned:

```text
HTTP/1.1 200 OK
```

After SSL was added, Certbot modified the Nginx file to include HTTPS certificate settings and HTTP-to-HTTPS redirect behavior.

To view the current live config at any time:

```bash
sed -n '1,240p' /etc/nginx/sites-enabled/thetan
```

---

## 10. SSL / HTTPS setup

SSL was installed using Certbot with the Nginx plugin.

Command used:

```bash
certbot --nginx -d thetan.in -d www.thetan.in --redirect
```

Certbot successfully created and deployed the certificate.

Certificate files:

```text
Certificate: /etc/letsencrypt/live/thetan.in/fullchain.pem
Private key: /etc/letsencrypt/live/thetan.in/privkey.pem
```

Do not copy, print, commit, or share the certificate private key file.

Certificate expiry shown by Certbot:

```text
2026-08-17
```

Certbot also created an automatic renewal task.

Final HTTPS checks:

```bash
curl -I https://thetan.in
curl -I https://www.thetan.in
curl -I http://thetan.in
```

Observed correct result:

```text
https://thetan.in       → HTTP/1.1 200 OK
https://www.thetan.in   → HTTP/1.1 200 OK
http://thetan.in        → HTTP/1.1 301 Moved Permanently → https://thetan.in/
```

To test renewal later:

```bash
certbot renew --dry-run
```

---

## 11. GitHub Actions CI/CD setup

### 11.1 Requirement

The deployment must happen automatically whenever code is pushed to:

```text
main
```

The repository is private.

### 11.2 GitHub Actions repository secrets

The following GitHub Actions secrets were added:

```text
VPS_HOST      = 31.97.11.211
VPS_USER      = root
VPS_PORT      = 22
VPS_SSH_KEY   = private SSH key content
```

Important:

- `VPS_SSH_KEY` must include the full private key.
- It must include both the `BEGIN OPENSSH PRIVATE KEY` and `END OPENSSH PRIVATE KEY` lines.
- It must keep line breaks.
- It must never be committed to the repo.
- It must never be pasted into chat or shared publicly.

### 11.3 SSH key model

A dedicated SSH key pair was created for GitHub Actions deployment.

The public key was added to:

```text
/root/.ssh/authorized_keys
```

The private key was copied into GitHub secret:

```text
VPS_SSH_KEY
```

After saving the private key in GitHub Secrets, the private key file was removed from the VPS:

```bash
rm -f /root/.ssh/github_actions_next
```

Do not remove:

```text
/root/.ssh/authorized_keys
```

That file contains the public key that allows GitHub Actions to log into the VPS.

### 11.4 GitHub Actions settings

The repo settings were checked under:

```text
Settings → Actions → General
```

Actions were allowed for the repository.

### 11.5 Test workflow

A test workflow was created to confirm that GitHub Actions could connect to the VPS.

Test workflow file:

```text
.github/workflows/test-vps-connection.yml
```

The test successfully connected to the VPS and confirmed the secrets and SSH key were working.

This file is optional after deployment is complete. It can be deleted if desired.

### 11.6 Real deployment workflow

The real deployment workflow file is:

```text
.github/workflows/deploy-next.yml
```

It should be kept in the repo.

The deployment workflow:

- Runs on push to `main`.
- Can also be run manually using `workflow_dispatch`.
- Checks out the private GitHub repo.
- Creates a temporary SSH key in the GitHub Actions runner.
- Connects to the VPS.
- Ensures `/var/www/next-app` exists.
- Installs `rsync` if missing.
- Syncs repo files to the VPS.
- Excludes secrets and build folders.
- Installs dependencies.
- Builds the app.
- Starts or restarts PM2 app `next-app`.

Important deploy target:

```text
/var/www/next-app
```

Important PM2 app name:

```text
next-app
```

Important port:

```text
3000
```

---

## 12. Current deployment workflow reference

This is the deployment workflow structure used for Thetan:

```yaml
name: Deploy Next.js to VPS

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout private repo
        uses: actions/checkout@v4

      - name: Setup SSH
        env:
          VPS_SSH_KEY: ${{ secrets.VPS_SSH_KEY }}
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
          VPS_PORT: ${{ secrets.VPS_PORT }}
        run: |
          set -e

          if [ -z "$VPS_SSH_KEY" ]; then echo "VPS_SSH_KEY is missing"; exit 1; fi
          if [ -z "$VPS_HOST" ]; then echo "VPS_HOST is missing"; exit 1; fi
          if [ -z "$VPS_USER" ]; then echo "VPS_USER is missing"; exit 1; fi
          if [ -z "$VPS_PORT" ]; then VPS_PORT=22; fi

          VPS_HOST="$(echo "$VPS_HOST" | tr -d '[:space:]')"
          VPS_PORT="$(echo "$VPS_PORT" | tr -d '[:space:]')"

          mkdir -p ~/.ssh
          printf "%s\n" "$VPS_SSH_KEY" | tr -d '\r' > ~/.ssh/vps_key
          chmod 600 ~/.ssh/vps_key

          echo "Testing SSH connection..."
          ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new \
            -i ~/.ssh/vps_key \
            -p "$VPS_PORT" \
            "$VPS_USER@$VPS_HOST" \
            "echo SSH connection OK"

      - name: Prepare VPS folder
        env:
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
          VPS_PORT: ${{ secrets.VPS_PORT }}
        run: |
          set -e

          VPS_HOST="$(echo "$VPS_HOST" | tr -d '[:space:]')"
          VPS_PORT="$(echo "$VPS_PORT" | tr -d '[:space:]')"

          ssh -o StrictHostKeyChecking=accept-new \
            -i ~/.ssh/vps_key \
            -p "$VPS_PORT" \
            "$VPS_USER@$VPS_HOST" \
            "mkdir -p /var/www/next-app && (command -v rsync >/dev/null 2>&1 || (apt-get update && apt-get install -y rsync))"

      - name: Upload code to VPS
        env:
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
          VPS_PORT: ${{ secrets.VPS_PORT }}
        run: |
          set -e

          VPS_HOST="$(echo "$VPS_HOST" | tr -d '[:space:]')"
          VPS_PORT="$(echo "$VPS_PORT" | tr -d '[:space:]')"

          rsync -az --delete \
            --exclude ".git" \
            --exclude "node_modules" \
            --exclude ".next" \
            --exclude ".env" \
            --exclude ".env.local" \
            --exclude ".env.production" \
            -e "ssh -o StrictHostKeyChecking=accept-new -i ~/.ssh/vps_key -p $VPS_PORT" \
            ./ "$VPS_USER@$VPS_HOST:/var/www/next-app/"

      - name: Install, build, and restart app on VPS
        env:
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
          VPS_PORT: ${{ secrets.VPS_PORT }}
        run: |
          set -e

          VPS_HOST="$(echo "$VPS_HOST" | tr -d '[:space:]')"
          VPS_PORT="$(echo "$VPS_PORT" | tr -d '[:space:]')"

          ssh -o StrictHostKeyChecking=accept-new \
            -i ~/.ssh/vps_key \
            -p "$VPS_PORT" \
            "$VPS_USER@$VPS_HOST" << 'EOF'
              set -e

              cd /var/www/next-app

              echo "Installing dependencies..."
              if [ -f package-lock.json ]; then
                npm ci
              else
                npm install
              fi

              echo "Building Next.js app..."
              npm run build

              echo "Starting/restarting PM2 app..."
              if pm2 describe next-app > /dev/null 2>&1; then
                pm2 restart next-app --update-env
              else
                PORT=3000 pm2 start npm --name next-app -- start -- -p 3000
              fi

              pm2 save
              pm2 list
          EOF
```

---

## 13. What happens after every push to main

When code is pushed to the `main` branch:

1. GitHub Actions starts the deploy workflow.
2. It checks out the private repository code.
3. It creates a temporary SSH key file from the GitHub secret `VPS_SSH_KEY`.
4. It SSHs into the VPS as `root`.
5. It syncs code into `/var/www/next-app`.
6. It does not upload `.env`, `.env.local`, `.env.production`, `.git`, `node_modules`, or `.next`.
7. It runs dependency installation.
8. It runs `npm run build`.
9. It restarts the PM2 process `next-app`.
10. Nginx continues serving `https://thetan.in` through port `3000`.

---

## 14. Environment variables

The workflow intentionally excludes environment files:

```text
.env
.env.local
.env.production
```

This means secrets should be stored directly on the VPS, not committed to GitHub.

If the Next.js app needs production environment variables, create or edit:

```bash
nano /var/www/next-app/.env.production
```

Then restart and rebuild if required:

```bash
cd /var/www/next-app
npm run build
pm2 restart next-app --update-env
```

Do not paste `.env` values into GitHub Actions logs, chat, screenshots, or this PRD.

---

## 15. Production verification checklist

Use these commands after any major change.

### Check PM2 apps

```bash
pm2 list
```

Expected:

```text
next-app      online
quiz-backend  online
```

### Check Next.js locally on VPS

```bash
curl -I http://localhost:3000
```

Expected:

```text
HTTP/1.1 200 OK
```

### Check public HTTPS domain

```bash
curl -I https://thetan.in
curl -I https://www.thetan.in
```

Expected:

```text
HTTP/1.1 200 OK
```

### Check HTTP redirects to HTTPS

```bash
curl -I http://thetan.in
```

Expected:

```text
HTTP/1.1 301 Moved Permanently
Location: https://thetan.in/
```

### Check Nginx config

```bash
nginx -t
```

Expected:

```text
syntax is ok
test is successful
```

### Reload Nginx after config changes

```bash
systemctl reload nginx
```

### View app logs

```bash
pm2 logs next-app
```

### Restart app manually

```bash
pm2 restart next-app
```

---

## 16. Troubleshooting guide

### 16.1 GitHub Actions fails at “Setup SSH”

Likely causes:

- `VPS_SSH_KEY` is missing.
- The private key was pasted without line breaks.
- The private key does not include the `BEGIN` and `END` lines.
- `VPS_HOST`, `VPS_USER`, or `VPS_PORT` is wrong.
- The matching public key is missing from `/root/.ssh/authorized_keys`.

Check GitHub secrets:

```text
Settings → Secrets and variables → Actions
```

Required secrets:

```text
VPS_HOST
VPS_USER
VPS_PORT
VPS_SSH_KEY
```

### 16.2 GitHub Actions fails at “Upload code to VPS”

Likely causes:

- `rsync` is not installed.
- SSH connection is unstable.
- VPS folder permission issue.

Check folder:

```bash
ls -ld /var/www/next-app
```

Install rsync if needed:

```bash
apt-get update
apt-get install -y rsync
```

### 16.3 GitHub Actions fails at “npm run build”

Likely causes:

- Missing environment variables.
- Build script missing in `package.json`.
- TypeScript or lint build errors.
- Dependency issue.

Check locally in VPS:

```bash
cd /var/www/next-app
npm run build
```

Check package scripts:

```bash
npm pkg get scripts
```

### 16.4 Website does not open, but PM2 says online

Check local app:

```bash
curl -I http://localhost:3000
```

If local app works, check Nginx:

```bash
nginx -t
systemctl status nginx --no-pager
sed -n '1,240p' /etc/nginx/sites-enabled/thetan
```

### 16.5 Domain does not resolve to VPS

Check DNS:

```bash
nslookup thetan.in
nslookup www.thetan.in
```

Expected:

```text
31.97.11.211
```

If not, check Hostinger DNS records.

### 16.6 HTTPS certificate issue

Check certificate renewal:

```bash
certbot renew --dry-run
```

Check certificate files:

```bash
ls -la /etc/letsencrypt/live/thetan.in/
```

Do not print the private key file.

---

## 17. How to add another website later on the same VPS

This VPS can host multiple websites, but each website should have separate names for safety.

For another app, use a new folder, PM2 name, port, domain, and optionally a new SSH deploy key.

Example:

```text
Website 1: Thetan
Folder: /var/www/next-app
PM2 name: next-app
Port: 3000
Domain: thetan.in

Website 2: Future app
Folder: /var/www/future-app
PM2 name: future-app
Port: 3001
Domain: future-domain.com
```

Recommended future pattern:

```text
/var/www/<project-name>
PM2 app name: <project-name>
Port: unique port, for example 3001, 3002, 3003
Nginx site file: /etc/nginx/sites-available/<project-name>
GitHub workflow: .github/workflows/deploy.yml
SSH key: one deploy key per project if possible
```

Avoid these mistakes:

- Do not deploy another app into `/var/www/next-app` unless it is replacing Thetan.
- Do not reuse PM2 name `next-app` for another project.
- Do not reuse port `3000` for another Node app.
- Do not edit `/etc/nginx/sites-available/mindsnack` unless intentionally changing `mindsnack.app`.
- Do not delete `/root/.ssh/authorized_keys`.
- Do not commit `.env` files.

---

## 18. Current ports and responsibilities

```text
Port 80:
Nginx HTTP. Redirects to HTTPS after Certbot setup.

Port 443:
Nginx HTTPS. Public secure website traffic.

Port 3000:
Thetan Next.js app through PM2 process next-app.

Port 4000:
Existing backend app through PM2 process quiz-backend.
```

The public visitor should use only:

```text
https://thetan.in
https://www.thetan.in
```

Nginx handles the internal connection to port `3000`.

---

## 19. Files and paths summary

```text
Thetan app folder:
/var/www/next-app

Thetan Nginx available config:
/etc/nginx/sites-available/thetan

Thetan Nginx enabled symlink:
/etc/nginx/sites-enabled/thetan

Thetan SSL certificate:
/etc/letsencrypt/live/thetan.in/fullchain.pem

Thetan SSL private key:
/etc/letsencrypt/live/thetan.in/privkey.pem

Authorized SSH keys for root:
/root/.ssh/authorized_keys

Existing old frontend:
/var/www/frontend

Existing old backend:
/var/www/backend

Existing mindsnack Nginx config:
/etc/nginx/sites-available/mindsnack
/etc/nginx/sites-enabled/mindsnack
```

---

## 20. Commands to keep handy

### SSH into VPS

```bash
ssh root@31.97.11.211
```

### Check running processes

```bash
pm2 list
```

### View Thetan logs

```bash
pm2 logs next-app
```

### Restart Thetan manually

```bash
pm2 restart next-app
```

### Check Thetan local app response

```bash
curl -I http://localhost:3000
```

### Check public website

```bash
curl -I https://thetan.in
curl -I https://www.thetan.in
```

### Check Nginx

```bash
nginx -t
systemctl status nginx --no-pager
```

### Reload Nginx

```bash
systemctl reload nginx
```

### Check SSL renewal

```bash
certbot renew --dry-run
```

### View Thetan Nginx config

```bash
sed -n '1,240p' /etc/nginx/sites-enabled/thetan
```

### View GitHub Actions deployment logs

GitHub repo:

```text
Actions → Deploy Next.js to VPS → latest run → open failed step if red
```

---

## 21. Security notes

1. Never commit private keys.
2. Never commit `.env` files.
3. Never paste the real `VPS_SSH_KEY` into chat or screenshots.
4. Never print `/etc/letsencrypt/live/thetan.in/privkey.pem`.
5. GitHub Secrets should be the only place where the deploy private key is stored for the workflow.
6. The public key belongs in `/root/.ssh/authorized_keys`.
7. If a deploy key is compromised, remove its public key from `/root/.ssh/authorized_keys` and create a new key pair.
8. For future production hardening, create a non-root `deploy` user instead of deploying as `root`.

---

## 22. Known limitations / future improvements

Current setup is working, but these improvements can be considered later:

- Create a non-root deploy user with limited permissions.
- Add a staging domain such as `staging.thetan.in`.
- Add uptime monitoring.
- Add error monitoring/log aggregation.
- Add automated rollback strategy.
- Add health-check endpoint.
- Add database migration handling if the project later uses a database.
- Add branch-based deployment rules, for example `main` for production and `develop` for staging.
- Add firewall review using `ufw` if needed.
- Remove unused Nginx default site if it is not needed.
- Create separate deploy SSH keys for every future project on the VPS.

---

## 23. Acceptance status

The project is considered successfully deployed because all these checks passed:

```text
GitHub Actions can connect to VPS: yes
Next.js app deployed to /var/www/next-app: yes
PM2 process next-app online: yes
localhost:3000 returns 200 OK: yes
DNS points thetan.in to 31.97.11.211: yes
Nginx proxies thetan.in to localhost:3000: yes
HTTPS works for thetan.in: yes
HTTPS works for www.thetan.in: yes
HTTP redirects to HTTPS: yes
Existing quiz-backend remains online: yes
```

Final public URLs:

```text
https://thetan.in
https://www.thetan.in
```

---

## 24. What to do when changing the website in the future

For normal website updates:

1. Make code changes in the Next.js repo.
2. Commit and push to `main`.
3. GitHub Actions will deploy automatically.
4. Watch the GitHub Actions run.
5. After it turns green, open `https://thetan.in`.

If the deployment fails:

1. Open the failed GitHub Actions run.
2. Click the failed job.
3. Click the failed step.
4. Read the last 20–40 lines of logs.
5. Do not share secrets.
6. Use this PRD to identify whether the problem is SSH, upload, build, PM2, Nginx, DNS, or SSL.

---

## 25. One-line mental model

Thetan is a private Next.js GitHub repo that auto-deploys from `main` to `/var/www/next-app` on the Hostinger VPS `31.97.11.211`, runs with PM2 as `next-app` on port `3000`, and is served publicly through Nginx + Certbot SSL at `https://thetan.in` and `https://www.thetan.in`.
