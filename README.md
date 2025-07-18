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

This portfolio is deployed on DigitalOcean App Platform with automatic deployments from GitHub. With Cloudflare DNS management.

#### Production Configuration

- Uses Gunicorn WSGI server
- Configured for 2 workers
- Health checks enabled
- Static files served by Flask
- Environment variables for configuration

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is the unlicensed, publicly available portfolio of Joseph Mazzini.

## Contact

- **Email**: joseph@mazzlabs.works
- **LinkedIn**: [Joseph Mazzini](https://www.linkedin.com/in/joseph-mazzini-357b62348)
- **GitHub**: [J-mazz](https://github.com/J-mazz)
- **Portfolio**: [mazzlabs.works](https://www.mazzlabs.works)
