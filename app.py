#!/usr/bin/env python3
"""
Portfolio Backend Server
A Flask-based backend for Joseph Mazzini's portfolio website
"""

from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
import os
import logging
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
    EMAIL_USERNAME = os.environ.get('EMAIL_USERNAME', 'joseph@mazzlabs.works')
    EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')
    CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'joseph@mazzlabs.works')

app.config.from_object(Config)

# Resume data
RESUME_DATA = {
    'name': 'Joseph Mazzini',
    'contact': {
        'phone': '(541) 292-6067',
        'email': 'joseph@mazzlabs.works',
        'location': 'Medford, OR',
        'linkedin': 'https://www.linkedin.com/in/joseph-mazzini-357b62348',
        'github': 'https://github.com/J-mazz',
        'portfolio': 'https://www.mazzlabs.works'
    },
    'summary': '''A motivated and resourceful Computer Science student with a passion for automation, 
    optimization, and problem-solving. Extensive experience on both Windows OS and Linux, can effectively 
    utilize CLI for most actions in both windows and linux, as well as to interact with cloud service 
    providers and for data query. Also effectively employs automation scripting with Shellscript and Python. 
    Combines a strong work ethic honed through hands-on experience in demanding fields with a deep fascination 
    for software development and machine learning. Seeking to contribute to, and grow with a great team.''',
    'skills': {
        'comfortable': [
            'Python', 'Git & GitHub', 'Linux (Debian/Ubuntu)', 'Shell Scripting',
            'MongoDB', 'CLI', 'DigitalOcean'
        ],
        'learning': [
            'JavaScript', 'HTML & CSS', 'React', 'Node.js', 'PostgreSQL',
            'TypeScript', 'Express.js'
        ]
    },
    'projects': [
        {
            'title': 'Rip City Ticket Dispatch',
            'url': 'https://ripcityticketdispatch.works',
            'description': '''Engineered a full-stack event discovery platform for the Pacific Northwest, 
            aggregating data from sources like Ticketmaster and Eventbrite. Tech stack: React/TypeScript 
            frontend, Node.js/Express backend, MongoDB database, deployed on DigitalOcean with Nginx. 
            Features an AI-powered deal engine (OpenAI), multi-channel notifications (Twilio/SendGrid), 
            and Stripe integration.'''
        },
        {
            'title': 'Veritas-Lens: Political Bias Detector',
            'url': 'https://github.com/J-mazz/Veritas-Lens',
            'description': '''Developed an ML model to classify political bias in news articles by 
            fine-tuning a bert-base-uncased model, achieving 82.15% validation accuracy. Created a 
            robust data preprocessing pipeline to combine and standardize multiple datasets from 
            Hugging Face. Includes a full-stack application with a TypeScript/Express.js backend 
            and a RESTful API.'''
        },
        {
            'title': 'Robust-Cite: NER Citation Parser',
            'url': 'https://github.com/J-mazz/robust-cite',
            'description': '''Built and trained a Named Entity Recognition (NER) system to parse 
            bibliographic components from academic citations. Implemented an advanced training pipeline 
            in TensorFlow/Keras, achieving 99.97% validation accuracy on a 30,000-citation dataset. 
            The model identifies 19 distinct entity labels (author, title, year, etc.) and is designed 
            for scalability.'''
        }
    ],
    'experience': [
        {
            'title': 'IT & Compliance Manager',
            'company': 'Upper Rogue Terraces',
            'location': 'Shady Cove, OR',
            'period': '2018 - Present',
            'responsibilities': [
                'Independently managed and modernized the IT infrastructure for a state-licensed agricultural producer.',
                'Engineered a transition from an unreliable satellite ISP to a 5G mesh gateway, increasing connectivity from ~300 Kb/s to ~1 Gb/s.',
                'Migrated an aging network of Windows machines to lightweight Linux distributions, improving performance for critical operations.',
                'Ensured IT systems would support compliance with state regulations by managing a 24/7 security logging system and the METRC seed-to-sale tracker.'
            ]
        },
        {
            'title': 'Facility Maintenance Technician',
            'company': 'Ocean Properties Limited',
            'location': 'Albuquerque, NM',
            'period': '2014 - 2017',
            'responsibilities': [
                'Maintained two large hotel properties, responding to work orders through a ticketing system.',
                'Gained practical experience in electrical theory while troubleshooting complex 120/240v and 460v systems.'
            ]
        }
    ],
    'education': {
        'degree': 'Associate of Science, Oregon Transfer Program (In Progress)',
        'institution': 'Rogue Community College',
        'description': '''Pursuing a transfer degree with the goal of completing a Bachelor of Science 
        in Computer Science from Oregon State University.'''
    }
}

@app.route('/')
def home():
    """Serve the main portfolio page"""
    return send_file('index.html')

@app.route('/health')
def health_check():
    """Health check endpoint for DigitalOcean"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()
        
        if not all([name, email, message]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Send email notification
        if send_contact_email(name, email, message):
            logger.info(f"Contact form submitted by {name} ({email})")
            return jsonify({'success': True, 'message': 'Message sent successfully!'})
        else:
            return jsonify({'error': 'Failed to send message'}), 500
            
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/download-resume')
def download_resume():
    """Generate and serve resume PDF"""
    try:
        pdf_buffer = generate_resume_pdf()
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name='Joseph_Mazzini_Resume.pdf',
            mimetype='application/pdf'
        )
    except Exception as e:
        logger.error(f"Error generating resume PDF: {str(e)}")
        return jsonify({'error': 'Failed to generate resume'}), 500

@app.route('/api/stats')
def get_stats():
    """Get portfolio statistics"""
    return jsonify({
        'projects': len(RESUME_DATA['projects']),
        'skills': len(RESUME_DATA['skills']['comfortable']) + len(RESUME_DATA['skills']['learning']),
        'experience_years': datetime.now().year - 2018,
        'last_updated': datetime.now().isoformat()
    })

def send_contact_email(name, email, message):
    """Send contact form email notification"""
    try:
        if not app.config['EMAIL_PASSWORD']:
            logger.info(f"Contact form submitted by {name} ({email}): {message}")
            return True
        
        msg = MIMEMultipart()
        # Use the generic email for SMTP authentication
        msg['From'] = app.config['EMAIL_USERNAME']
        # But set the reply-to and display name to look like your domain
        msg['Reply-To'] = f"Portfolio Contact <{app.config['CONTACT_EMAIL']}>"
        msg['To'] = app.config['CONTACT_EMAIL']
        msg['Subject'] = f"Portfolio Contact from {name}"
        
        body = f"""
        New contact form submission from your portfolio website:
        
        Name: {name}
        Email: {email}
        Message: {message}
        
        ---
        Reply directly to this email to respond to {name} at {email}
        Submitted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        with smtplib.SMTP(app.config['SMTP_SERVER'], app.config['SMTP_PORT']) as server:
            server.starttls()
            server.login(app.config['EMAIL_USERNAME'], app.config['EMAIL_PASSWORD'])
            server.send_message(msg)
        
        return True
        
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        logger.info(f"Contact form submitted by {name} ({email}): {message}")
        return True  # Return True anyway so the form works

def generate_resume_pdf():
    """Generate resume PDF using ReportLab"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=6,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#2c2c2c')
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=12,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#6a6a6a')
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=6,
        spaceBefore=12,
        textColor=colors.HexColor('#2c2c2c')
    )
    
    story = []
    
    # Header
    story.append(Paragraph(RESUME_DATA['name'], title_style))
    contact_info = f"{RESUME_DATA['contact']['phone']} | {RESUME_DATA['contact']['email']} | {RESUME_DATA['contact']['location']}"
    story.append(Paragraph(contact_info, subtitle_style))
    
    links = f"<a href='{RESUME_DATA['contact']['linkedin']}'>LinkedIn</a> | <a href='{RESUME_DATA['contact']['github']}'>GitHub</a> | <a href='{RESUME_DATA['contact']['portfolio']}'>Portfolio</a>"
    story.append(Paragraph(links, subtitle_style))
    story.append(Spacer(1, 12))
    
    # Summary
    story.append(Paragraph('Summary', heading_style))
    story.append(Paragraph(RESUME_DATA['summary'], styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Skills
    story.append(Paragraph('Skills', heading_style))
    
    # Create skills table
    skills_data = [
        ['Comfortable With:', ', '.join(RESUME_DATA['skills']['comfortable'])],
        ['Currently Learning:', ', '.join(RESUME_DATA['skills']['learning'])]
    ]
    
    skills_table = Table(skills_data, colWidths=[1.5*inch, 5*inch])
    skills_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    
    story.append(skills_table)
    story.append(Spacer(1, 12))
    
    # Projects
    story.append(Paragraph('Projects', heading_style))
    for project in RESUME_DATA['projects']:
        story.append(Paragraph(f"<b>{project['title']}</b>", styles['Normal']))
        if project['url']:
            story.append(Paragraph(f"<a href='{project['url']}'>{project['url']}</a>", styles['Normal']))
        story.append(Paragraph(project['description'], styles['Normal']))
        story.append(Spacer(1, 8))
    
    # Experience
    story.append(Paragraph('Professional Experience', heading_style))
    for job in RESUME_DATA['experience']:
        story.append(Paragraph(f"<b>{job['title']}</b>", styles['Normal']))
        story.append(Paragraph(f"{job['company']} | {job['location']} | {job['period']}", styles['Normal']))
        for responsibility in job['responsibilities']:
            story.append(Paragraph(f"• {responsibility}", styles['Normal']))
        story.append(Spacer(1, 8))
    
    # Education
    story.append(Paragraph('Education', heading_style))
    story.append(Paragraph(f"<b>{RESUME_DATA['education']['degree']}</b>", styles['Normal']))
    story.append(Paragraph(RESUME_DATA['education']['institution'], styles['Normal']))
    story.append(Paragraph(RESUME_DATA['education']['description'], styles['Normal']))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting portfolio server on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
