/**
 * Enterprise Dashboard Management
 * Real-time monitoring and business intelligence interface
 */

class EnterpriseDashboard {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.dashboardData = null;
        this.charts = {};
        this.init();
    }

    init() {
        this.initializeWebSocket();
        this.bindEvents();
        this.startDataRefresh();
    }

    initializeWebSocket() {
        // WebSocket disabled for compatibility - using polling instead
        this.isConnected = false;
        this.updateConnectionStatus(false);
    }

    bindEvents() {
        // AI Assistant
        const aiForm = document.getElementById('ai-assistant-form');
        if (aiForm) {
            aiForm.addEventListener('submit', (e) => this.handleAIQuery(e));
        }

        // Dashboard refresh button
        const refreshBtn = document.getElementById('dashboard-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }

        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeDashboardModal();
            }
        });
    }

    async startDataRefresh() {
        // Initial data load
        await this.refreshDashboard();
        
        // Set up periodic refresh every 10 seconds
        setInterval(() => {
            this.refreshDashboard();
        }, 10000);
    }

    async refreshDashboard() {
        try {
            // Simulate API call with mock data for now
            const mockData = {
                system_health: {
                    cpu_usage: Math.random() * 100,
                    memory_usage: Math.random() * 100,
                    disk_usage: Math.random() * 100,
                    response_time: 120 + Math.random() * 180,
                    active_connections: Math.floor(100 + Math.random() * 400),
                    network_io: 50 + Math.random() * 150
                },
                business_metrics: {
                    revenue_today: 12450.75 + (Math.random() - 0.5) * 1000,
                    active_users: Math.floor(1200 + Math.random() * 100),
                    conversion_rate: 3.2 + (Math.random() - 0.5) * 0.5,
                    customer_satisfaction: 4.7 + (Math.random() - 0.5) * 0.3,
                    support_tickets: Math.floor(20 + Math.random() * 10),
                    ai_interactions: Math.floor(Math.random() * 50)
                },
                security_metrics: {
                    threat_level: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
                    blocked_attempts: Math.floor(Math.random() * 20),
                    compliance_score: 98.5 + (Math.random() - 0.5) * 2,
                    cert_expiry_days: 45 + Math.floor(Math.random() * 10),
                    vulnerabilities: Math.floor(Math.random() * 5)
                },
                cloud_metrics: {
                    monthly_cost: 2340.50 + (Math.random() - 0.5) * 500,
                    cost_savings: 15.2 + (Math.random() - 0.5) * 5,
                    uptime: 99.97 + (Math.random() - 0.5) * 0.1,
                    auto_scaling_events: Math.floor(Math.random() * 10),
                    backup_status: ['HEALTHY', 'WARNING', 'CRITICAL'][Math.floor(Math.random() * 3)]
                },
                timestamp: new Date().toISOString()
            };
            
            this.updateDashboardData(mockData);
            
            // Uncomment when backend is working:
            // const response = await fetch('/api/enterprise/dashboard');
            // if (response.ok) {
            //     const data = await response.json();
            //     this.updateDashboardData(data);
            // }
        } catch (error) {
            console.error('Failed to refresh dashboard:', error);
        }
    }

    updateDashboardData(data) {
        this.dashboardData = data;
        this.updateSystemHealth(data.system_health);
        this.updateBusinessMetrics(data.business_metrics);
        this.updateSecurityMetrics(data.security_metrics);
        this.updateCloudMetrics(data.cloud_metrics);
        this.updateLastUpdate(data.timestamp);
    }

    updateSystemHealth(health) {
        this.updateMetric('cpu-usage', health.cpu_usage, '%');
        this.updateMetric('memory-usage', health.memory_usage, '%');
        this.updateMetric('disk-usage', health.disk_usage, '%');
        this.updateMetric('response-time', health.response_time, 'ms');
        this.updateMetric('active-connections', health.active_connections, '');
        
        // Update health status
        const avgHealth = (health.cpu_usage + health.memory_usage + health.disk_usage) / 3;
        const status = avgHealth < 50 ? 'OPTIMAL' : avgHealth < 80 ? 'GOOD' : 'WARNING';
        this.updateElement('system-status', status);
        this.updateStatusColor('system-status', status);
    }

    updateBusinessMetrics(business) {
        this.updateMetric('revenue-today', business.revenue_today.toLocaleString('en-US', {style: 'currency', currency: 'USD'}), '');
        this.updateMetric('active-users', business.active_users.toLocaleString(), '');
        this.updateMetric('conversion-rate', business.conversion_rate, '%');
        this.updateMetric('customer-satisfaction', business.customer_satisfaction, '/5');
        this.updateMetric('support-tickets', business.support_tickets, '');
        this.updateMetric('ai-interactions', business.ai_interactions, '');
    }

    updateSecurityMetrics(security) {
        this.updateElement('threat-level', security.threat_level);
        this.updateElement('blocked-attempts', security.blocked_attempts);
        this.updateElement('compliance-score', security.compliance_score + '%');
        this.updateElement('cert-expiry', security.cert_expiry_days + ' days');
        this.updateElement('vulnerabilities', security.vulnerabilities);
        
        this.updateStatusColor('threat-level', security.threat_level);
    }

    updateCloudMetrics(cloud) {
        this.updateMetric('monthly-cost', cloud.monthly_cost.toLocaleString('en-US', {style: 'currency', currency: 'USD'}), '');
        this.updateMetric('cost-savings', cloud.cost_savings, '%');
        this.updateMetric('uptime', cloud.uptime, '%');
        this.updateMetric('scaling-events', cloud.auto_scaling_events, '');
        this.updateElement('backup-status', cloud.backup_status);
        
        this.updateStatusColor('backup-status', cloud.backup_status);
    }

    updateMetric(elementId, value, suffix) {
        const element = document.getElementById(elementId);
        if (element) {
            const formattedValue = typeof value === 'number' ? 
                (suffix === '%' ? value.toFixed(1) : value.toFixed(0)) : value;
            element.textContent = formattedValue + suffix;
        }
    }

    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    updateStatusColor(elementId, status) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Remove existing status classes
        element.classList.remove('status-good', 'status-warning', 'status-critical');

        // Add appropriate status class
        if (['OPTIMAL', 'GOOD', 'HEALTHY', 'LOW'].includes(status)) {
            element.classList.add('status-good');
        } else if (['WARNING', 'MEDIUM'].includes(status)) {
            element.classList.add('status-warning');
        } else if (['CRITICAL', 'HIGH'].includes(status)) {
            element.classList.add('status-critical');
        }
    }

    updateConnectionStatus(connected) {
        const indicator = document.getElementById('connection-status');
        if (indicator) {
            indicator.textContent = connected ? 'LIVE' : 'POLLING';
            indicator.className = connected ? 'status-indicator live' : 'status-indicator polling';
        }
    }

    updateLastUpdate(timestamp) {
        const element = document.getElementById('last-update');
        if (element) {
            const date = new Date(timestamp);
            element.textContent = date.toLocaleTimeString();
        }
    }

    async handleAIQuery(event) {
        event.preventDefault();
        
        const form = event.target;
        const input = form.querySelector('input[name="query"]');
        const button = form.querySelector('button');
        const resultsDiv = document.getElementById('ai-results');
        
        const query = input.value.trim();
        if (!query) return;

        // Show loading state
        button.textContent = 'Processing...';
        button.disabled = true;
        resultsDiv.innerHTML = '<div class="ai-thinking">🤔 Processing your request...</div>';

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        try {
            // Mock AI response for now
            const responses = {
                'revenue': `Current revenue is $${this.dashboardData?.business_metrics?.revenue_today?.toFixed(2) || '12,450.75'} today, trending up 12% from yesterday.`,
                'users': `We have ${this.dashboardData?.business_metrics?.active_users?.toLocaleString() || '1,247'} active users with a ${this.dashboardData?.business_metrics?.conversion_rate?.toFixed(1) || '3.2'}% conversion rate.`,
                'security': `Security status: ${this.dashboardData?.security_metrics?.threat_level || 'LOW'}. Compliance score: ${this.dashboardData?.security_metrics?.compliance_score?.toFixed(1) || '98.5'}%.`,
                'performance': `System performing well with ${this.dashboardData?.system_health?.cpu_usage?.toFixed(1) || '45.2'}% CPU usage and ${this.dashboardData?.system_health?.response_time?.toFixed(0) || '180'}ms response time.`,
                'cost': `Monthly cloud cost is $${this.dashboardData?.cloud_metrics?.monthly_cost?.toFixed(2) || '2,340.50'} with ${this.dashboardData?.cloud_metrics?.cost_savings?.toFixed(1) || '15.2'}% savings this month.`,
                'default': "I'm an enterprise AI assistant. I can help with revenue analytics, user metrics, security monitoring, and system performance. What would you like to know?"
            };
            
            // Simple keyword matching for demo
            let response_key = 'default';
            for (const key of Object.keys(responses)) {
                if (query.toLowerCase().includes(key)) {
                    response_key = key;
                    break;
                }
            }
            
            const mockData = {
                response: responses[response_key],
                query: query,
                processing_time: 1.0 + Math.random() * 1.5,
                confidence: 0.85 + Math.random() * 0.13,
                timestamp: new Date().toISOString()
            };
            
            this.displayAIResponse(mockData, resultsDiv);
            
            // Uncomment when backend is working:
            // const response = await fetch('/api/enterprise/ai-interaction', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ query })
            // });

            // if (response.ok) {
            //     const data = await response.json();
            //     this.displayAIResponse(data, resultsDiv);
            // } else {
            //     throw new Error('AI processing failed');
            // }
        } catch (error) {
            resultsDiv.innerHTML = '<div class="ai-error">Sorry, I encountered an error processing your request. Please try again.</div>';
        } finally {
            button.textContent = 'Ask AI';
            button.disabled = false;
            input.value = '';
        }
    }

    displayAIResponse(data, container) {
        const responseHtml = `
            <div class="ai-response">
                <div class="ai-response-header">
                    <span class="ai-icon">🤖</span>
                    <span class="ai-metrics">
                        Confidence: ${(data.confidence * 100).toFixed(1)}% | 
                        Processing: ${data.processing_time.toFixed(2)}s
                    </span>
                </div>
                <div class="ai-response-content">
                    ${data.response}
                </div>
                <div class="ai-response-footer">
                    Query: "${data.query}" | ${new Date(data.timestamp).toLocaleTimeString()}
                </div>
            </div>
        `;
        container.innerHTML = responseHtml;
    }

    async loadAlerts() {
        // Mock alerts data for now
        const mockAlerts = [
            {
                id: 1,
                type: 'security',
                severity: 'medium',
                message: 'Unusual login pattern detected from IP 192.168.1.100',
                timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                status: 'investigating'
            },
            {
                id: 2,
                type: 'performance',
                severity: 'low',
                message: 'Database query performance degraded by 5%',
                timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                status: 'resolved'
            },
            {
                id: 3,
                type: 'business',
                severity: 'info',
                message: 'Conversion rate increased by 8% in last hour',
                timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                status: 'acknowledged'
            }
        ];
        
        this.displayAlerts(mockAlerts);
        
        // Uncomment when backend is working:
        // try {
        //     const response = await fetch('/api/enterprise/alerts');
        //     if (response.ok) {
        //         const data = await response.json();
        //         this.displayAlerts(data.alerts);
        //     }
        // } catch (error) {
        //     console.error('Failed to load alerts:', error);
        // }
    }

    displayAlerts(alerts) {
        const container = document.getElementById('alerts-container');
        if (!container) return;

        const alertsHtml = alerts.map(alert => `
            <div class="alert alert-${alert.severity}">
                <div class="alert-header">
                    <span class="alert-type">${alert.type.toUpperCase()}</span>
                    <span class="alert-time">${new Date(alert.timestamp).toLocaleString()}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-status status-${alert.status}">${alert.status.toUpperCase()}</div>
            </div>
        `).join('');

        container.innerHTML = alertsHtml;
    }

    async loadCostOptimization() {
        // Mock cost optimization data for now
        const mockData = {
            recommendations: [
                {
                    service: 'EC2 Instances',
                    current_cost: 1250.00,
                    potential_savings: 187.50,
                    recommendation: 'Switch 3 instances to spot pricing during off-peak hours',
                    impact: 'low'
                },
                {
                    service: 'RDS Database',
                    current_cost: 450.00,
                    potential_savings: 135.00,
                    recommendation: 'Enable automated backup retention optimization',
                    impact: 'medium'
                },
                {
                    service: 'S3 Storage',
                    current_cost: 125.00,
                    potential_savings: 37.50,
                    recommendation: 'Move infrequently accessed data to Glacier',
                    impact: 'low'
                }
            ],
            total_potential_savings: 360.00,
            current_monthly_cost: 2340.50
        };
        
        this.displayCostOptimization(mockData);
        
        // Uncomment when backend is working:
        // try {
        //     const response = await fetch('/api/enterprise/cost-optimization');
        //     if (response.ok) {
        //         const data = await response.json();
        //         this.displayCostOptimization(data);
        //     }
        // } catch (error) {
        //     console.error('Failed to load cost optimization:', error);
        // }
    }

    displayCostOptimization(data) {
        const container = document.getElementById('cost-optimization-container');
        if (!container) return;

        const recommendationsHtml = data.recommendations.map(rec => `
            <div class="cost-recommendation">
                <div class="cost-service">${rec.service}</div>
                <div class="cost-current">Current: ${rec.current_cost.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
                <div class="cost-savings">Potential Savings: ${rec.potential_savings.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
                <div class="cost-recommendation-text">${rec.recommendation}</div>
                <div class="cost-impact impact-${rec.impact}">${rec.impact.toUpperCase()} IMPACT</div>
            </div>
        `).join('');

        const totalSavingsHtml = `
            <div class="cost-summary">
                <div class="total-savings">
                    Total Potential Monthly Savings: 
                    <span class="savings-amount">${data.total_potential_savings.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span>
                </div>
                <div class="current-cost">
                    Current Monthly Cost: ${data.current_monthly_cost.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                </div>
            </div>
        `;

        container.innerHTML = totalSavingsHtml + recommendationsHtml;
    }

    openDashboardModal() {
        const modal = document.getElementById('dashboard-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            this.loadAlerts();
            this.loadCostOptimization();
        }
    }

    closeDashboardModal() {
        const modal = document.getElementById('dashboard-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enterpriseDashboard = new EnterpriseDashboard();
});

// Global functions for HTML onclick handlers
function openDashboardModal() {
    window.enterpriseDashboard.openDashboardModal();
}

function closeDashboardModal() {
    window.enterpriseDashboard.closeDashboardModal();
}