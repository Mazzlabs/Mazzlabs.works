# Joseph Mazzini's Portfolio Website

A modern, responsive portfolio website built with HTML5, CSS3, JavaScript (ES6), and a Python Flask backend.

## Features

- **Responsive Design**: Granite and turquoise color scheme with modern UI/UX
- **Interactive Games**: Browser-based Python games (Blackjack and Adaptive Rock-Paper-Scissors)
- **Dynamic Resume**: PDF generation and download functionality
- **Contact Form**: Backend-powered contact form with email notifications
- **Project Showcase**: Detailed project presentations with live links
- **Professional Experience**: Comprehensive work history and skills

## Tech Stack

### Frontend
- HTML5 with semantic structure
- CSS3 with custom properties and modern layouts
- JavaScript ES6 with classes and modules
- Font Awesome icons
- Google Fonts (Inter)

### Backend
- Python 3.8+
- Flask web framework
- Flask-CORS for cross-origin requests
- ReportLab for PDF generation
- SMTP email integration

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/J-mazz/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```
   SECRET_KEY=your-secret-key-here
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   CONTACT_EMAIL=joseph@mazzlabs.works
   ```

4. **Run the development server**
   ```bash
   python app.py
   ```

5. **Open in browser**
   Navigate to `http://localhost:5000`

## Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript file
├── app.py              # Flask backend server
├── requirements.txt    # Python dependencies
├── README.md          # This file
└── .env               # Environment variables (create this)
```

## Features Breakdown

### Interactive Games
- **Blackjack**: Full-featured casino-style game with betting, proper odds, and dealer AI
- **Adaptive Rock-Paper-Scissors**: AI opponent that learns from player patterns

### Resume System
- Dynamic PDF generation using ReportLab
- Professional formatting with company branding
- Download functionality integrated into the UI

### Contact System
- Server-side form processing
- Email notifications via SMTP
- Form validation and error handling

### Responsive Design
- Mobile-first approach
- Granite (#2c2c2c) and turquoise (#20a0a0) color scheme
- Smooth animations and transitions
- Modern typography and spacing

## Deployment

### DigitalOcean App Platform

This portfolio is designed to be deployed on DigitalOcean App Platform with automatic deployments from GitHub.

#### Quick Deploy

1. **Push to GitHub**
   ```bash
   ./deploy.sh
   ```

2. **Create DigitalOcean App**
   - Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository: `Mazzlabs/Mazzlabs.works`
   - Use the included `.do/app.yaml` configuration

3. **Set Environment Variables**
   - `SECRET_KEY`: A secure secret key for Flask sessions
   - `EMAIL_USERNAME`: Your email address for contact form
   - `EMAIL_PASSWORD`: Your email app password
   - `CONTACT_EMAIL`: Email to receive contact submissions

#### Manual Deploy Steps

1. **Clone and setup**
   ```bash
   git clone https://github.com/Mazzlabs/Mazzlabs.works.git
   cd Mazzlabs.works
   pip install -r requirements.txt
   ```

2. **Set environment variables**
   ```bash
   export SECRET_KEY="your-secret-key"
   export EMAIL_USERNAME="your-email@domain.com"
   export EMAIL_PASSWORD="your-app-password"
   export CONTACT_EMAIL="joseph@mazzlabs.works"
   ```

3. **Run locally**
   ```bash
   python app.py
   ```

#### Production Configuration

- Uses Gunicorn WSGI server
- Configured for 2 workers
- Health checks enabled
- Static files served by Flask
- Environment variables for configuration

### Custom Domain Setup

1. **Add domain in DigitalOcean**
   - Go to your app settings
   - Add custom domain: `mazzlabs.works`
   - Add CNAME record in Cloudflare: `CNAME mazzlabs.works your-app-url.ondigitalocean.app`

2. **SSL Certificate**
   - DigitalOcean automatically provides SSL certificates
   - Certificate will be issued once DNS propagates

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is private and proprietary to Joseph Mazzini.

## Contact

- **Email**: joseph@mazzlabs.works
- **LinkedIn**: [Joseph Mazzini](https://www.linkedin.com/in/joseph-mazzini-357b62348)
- **GitHub**: [J-mazz](https://github.com/J-mazz)
- **Portfolio**: [mazzlabs.works](https://www.mazzlabs.works)
