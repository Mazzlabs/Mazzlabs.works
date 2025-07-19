#!/usr/bin/env python3
"""
Enterprise Portfolio Backend Server
A Flask-based backend demonstrating enterprise project lifecycle management capabilities
"""

from flask import Flask, send_from_directory, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime, timedelta
import logging
import psutil
import random
import json
import time
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'enterprise-portfolio-key')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enterprise metrics simulation
class EnterpriseMetrics:
    def __init__(self):
        self.system_health = {
            'cpu_usage': 0,
            'memory_usage': 0,
            'disk_usage': 0,
            'network_io': 0,
            'active_connections': 0,
            'response_time': 0
        }
        self.business_metrics = {
            'revenue_today': 12450.75,
            'active_users': 1247,
            'conversion_rate': 3.2,
            'customer_satisfaction': 4.7,
            'support_tickets': 23,
            'ai_interactions': 0
        }
        self.security_metrics = {
            'threat_level': 'LOW',
            'blocked_attempts': 0,
            'compliance_score': 98.5,
            'cert_expiry_days': 45,
            'vulnerabilities': 2
        }
        self.cloud_metrics = {
            'monthly_cost': 2340.50,
            'cost_savings': 15.2,
            'uptime': 99.97,
            'auto_scaling_events': 5,
            'backup_status': 'HEALTHY'
        }

    def update_metrics(self):
        # Simulate real system metrics
        self.system_health.update({
            'cpu_usage': psutil.cpu_percent(),
            'memory_usage': psutil.virtual_memory().percent,
            'disk_usage': psutil.disk_usage('/').percent,
            'network_io': random.uniform(50, 200),
            'active_connections': random.randint(100, 500),
            'response_time': random.uniform(120, 300)
        })
        
        # Simulate business metrics fluctuations
        self.business_metrics.update({
            'revenue_today': self.business_metrics['revenue_today'] + random.uniform(-100, 200),
            'active_users': max(0, self.business_metrics['active_users'] + random.randint(-10, 25)),
            'conversion_rate': max(0, min(10, self.business_metrics['conversion_rate'] + random.uniform(-0.2, 0.3))),
            'ai_interactions': self.business_metrics['ai_interactions'] + random.randint(0, 5)
        })
        
        # Simulate security events
        if random.random() < 0.1:  # 10% chance of security event
            self.security_metrics['blocked_attempts'] += random.randint(1, 5)

metrics = EnterpriseMetrics()

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

# Enterprise API Endpoints
@app.route('/api/enterprise/dashboard')
def dashboard_data():
    """Get comprehensive dashboard data"""
    metrics.update_metrics()
    return jsonify({
        'system_health': metrics.system_health,
        'business_metrics': metrics.business_metrics,
        'security_metrics': metrics.security_metrics,
        'cloud_metrics': metrics.cloud_metrics,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/enterprise/ai-interaction', methods=['POST'])
def ai_interaction():
    """Simulate AI agent interaction"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Query required'}), 400
        
        # Simulate AI processing time
        time.sleep(random.uniform(0.5, 2.0))
        
        # Simulate different AI responses based on query type
        responses = {
            'revenue': f"Current revenue is ${metrics.business_metrics['revenue_today']:.2f} today, trending up 12% from yesterday.",
            'users': f"We have {metrics.business_metrics['active_users']} active users with a {metrics.business_metrics['conversion_rate']:.1f}% conversion rate.",
            'security': f"Security status: {metrics.security_metrics['threat_level']}. Compliance score: {metrics.security_metrics['compliance_score']}%.",
            'performance': f"System performing well with {metrics.system_health['cpu_usage']:.1f}% CPU usage and {metrics.system_health['response_time']:.0f}ms response time.",
            'default': "I'm an enterprise AI assistant. I can help with revenue analytics, user metrics, security monitoring, and system performance. What would you like to know?"
        }
        
        # Simple keyword matching for demo
        response_key = 'default'
        for key in responses.keys():
            if key in query.lower():
                response_key = key
                break
        
        # Update metrics
        metrics.business_metrics['ai_interactions'] += 1
        
        return jsonify({
            'response': responses[response_key],
            'query': query,
            'processing_time': random.uniform(0.5, 2.0),
            'confidence': random.uniform(0.85, 0.98),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"AI interaction error: {str(e)}")
        return jsonify({'error': 'AI processing failed'}), 500

@app.route('/api/enterprise/alerts')
def get_alerts():
    """Get recent system alerts"""
    alerts = [
        {
            'id': 1,
            'type': 'security',
            'severity': 'medium',
            'message': 'Unusual login pattern detected from IP 192.168.1.100',
            'timestamp': (datetime.now() - timedelta(minutes=15)).isoformat(),
            'status': 'investigating'
        },
        {
            'id': 2,
            'type': 'performance',
            'severity': 'low',
            'message': 'Database query performance degraded by 5%',
            'timestamp': (datetime.now() - timedelta(hours=2)).isoformat(),
            'status': 'resolved'
        },
        {
            'id': 3,
            'type': 'business',
            'severity': 'info',
            'message': 'Conversion rate increased by 8% in last hour',
            'timestamp': (datetime.now() - timedelta(minutes=30)).isoformat(),
            'status': 'acknowledged'
        }
    ]
    
    return jsonify({'alerts': alerts})

@app.route('/api/enterprise/cost-optimization')
def cost_optimization():
    """Get cloud cost optimization recommendations"""
    recommendations = [
        {
            'service': 'EC2 Instances',
            'current_cost': 1250.00,
            'potential_savings': 187.50,
            'recommendation': 'Switch 3 instances to spot pricing during off-peak hours',
            'impact': 'low'
        },
        {
            'service': 'RDS Database',
            'current_cost': 450.00,
            'potential_savings': 135.00,
            'recommendation': 'Enable automated backup retention optimization',
            'impact': 'medium'
        },
        {
            'service': 'S3 Storage',
            'current_cost': 125.00,
            'potential_savings': 37.50,
            'recommendation': 'Move infrequently accessed data to Glacier',
            'impact': 'low'
        }
    ]
    
    return jsonify({
        'recommendations': recommendations,
        'total_potential_savings': sum(r['potential_savings'] for r in recommendations),
        'current_monthly_cost': metrics.cloud_metrics['monthly_cost']
    })

# WebSocket events for real-time updates - disabled for compatibility
# @socketio.on('connect')
# def handle_connect():
#     logger.info('Client connected for real-time updates')
#     emit('status', {'message': 'Connected to enterprise dashboard'})

# @socketio.on('request_update')
# def handle_update_request():
#     metrics.update_metrics()
#     emit('dashboard_update', {
#         'system_health': metrics.system_health,
#         'business_metrics': metrics.business_metrics,
#         'security_metrics': metrics.security_metrics,
#         'cloud_metrics': metrics.cloud_metrics,
#         'timestamp': datetime.now().isoformat()
#     })

def background_metrics_update():
    """Background task to simulate real-time metrics"""
    while True:
        time.sleep(5)  # Update every 5 seconds
        metrics.update_metrics()

if __name__ == '__main__':
    # Start background metrics thread
    metrics_thread = threading.Thread(target=background_metrics_update, daemon=True)
    metrics_thread.start()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
