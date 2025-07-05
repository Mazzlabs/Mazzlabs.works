# DigitalOcean Deployment Guide

## 🚀 Quick Start

1. **Go to DigitalOcean Apps**: https://cloud.digitalocean.com/apps
2. **Create New App** → Connect to GitHub → Select `Mazzlabs/Mazzlabs.works`
3. **Use App Spec**: The `.do/app.yaml` file will auto-configure everything
4. **Set Environment Variables**:
   - `SECRET_KEY`: Generate a secure key (use `python -c "import secrets; print(secrets.token_urlsafe())"`)
   - `EMAIL_USERNAME`: Your email (e.g., `joseph@mazzlabs.works`)
   - `EMAIL_PASSWORD`: Your email app password
   - `CONTACT_EMAIL`: `joseph@mazzlabs.works`

## 🌐 Custom Domain

1. **In DigitalOcean App Settings**:
   - Add domain: `mazzlabs.works`
   - Add domain: `www.mazzlabs.works`

2. **In Cloudflare DNS**:
   - Add CNAME: `mazzlabs.works` → `your-app-name.ondigitalocean.app`
   - Add CNAME: `www.mazzlabs.works` → `your-app-name.ondigitalocean.app`

## 📧 Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account Settings → Security → App passwords
   - Generate password for "Mail"
   - Use this password for `EMAIL_PASSWORD`

## 💰 Cost Estimate

- **Basic XXS**: ~$5/month
- **Includes**: 512MB RAM, 1 vCPU, Custom domains, SSL certificates

## 🔧 Features Included

- ✅ Full-stack Flask application
- ✅ Interactive Python games (Blackjack, Rock-Paper-Scissors)
- ✅ PDF resume generation
- ✅ Contact form with email notifications
- ✅ Responsive design (granite/turquoise theme)
- ✅ Auto-deploy from GitHub
- ✅ SSL certificates
- ✅ Custom domain support

## 📝 Post-Deployment Checklist

- [ ] Test contact form
- [ ] Test resume download
- [ ] Test both games
- [ ] Verify custom domain works
- [ ] Check SSL certificate
- [ ] Test mobile responsiveness

Your portfolio will be live at: `https://mazzlabs.works`
