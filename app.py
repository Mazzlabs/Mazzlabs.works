#!/usr/bin/env python3
"""
Portfolio Backend Server
A Flask-based backend for Joseph Mazzini's portfolio website
"""

from flask import Flask, send_from_directory, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Serve the main page
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Serve static files (CSS, JS, images)
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# Contact form endpoint
@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()
        
        if not all([name, email, message]):
            return jsonify({'status': 'error', 'message': 'All fields are required'}), 400
        
        # Log the contact attempt
        logger.info(f"Contact form submission from {name} ({email})")
        
        # Send email
        send_email(name, email, message)
        
        return jsonify({'status': 'success', 'message': 'Message sent successfully!'})
    
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to send message. Please try again.'}), 500

# Resume download with tracking
@app.route('/api/download-resume')
def download_resume():
    try:
        # Log download with timestamp and IP
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ip = request.remote_addr
        logger.info(f"Resume downloaded at {timestamp} from IP {ip}")
        
        # Check if resume file exists
        resume_path = os.path.join('assets', 'Joseph_Mazzini_Resume.pdf')
        if not os.path.exists(resume_path):
            return jsonify({'status': 'error', 'message': 'Resume file not found'}), 404
        
        return send_from_directory('assets', 'Joseph_Mazzini_Resume.pdf', as_attachment=True)
    
    except Exception as e:
        logger.error(f"Resume download error: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Download failed'}), 500

def send_email(name, email, message):
    """Send email using SMTP configuration from environment variables"""
    try:
        # Email configuration from environment variables
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        sender_email = os.getenv('SENDER_EMAIL')
        sender_password = os.getenv('SENDER_PASSWORD') 
        recipient_email = os.getenv('RECIPIENT_EMAIL')
        
        if not all([sender_email, sender_password, recipient_email]):
            raise ValueError("Email configuration missing from environment variables")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = f"Portfolio Contact: {name}"
        
        body = f"""
New message from your portfolio website:

Name: {name}
Email: {email}
Message: 
{message}

---
Sent via MazzLabs.works contact form
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully to {recipient_email}")
        
    except Exception as e:
        logger.error(f"Email sending failed: {str(e)}")
        raise

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# Health check endpoint for Digital Ocean
@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
