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
            const response = await fetch('/api/enterprise/dashboard');
            if (response.ok) {
                const data = await response.json();
                this.updateDashboardData(data);
            }
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

        try {
            const response = await fetch('/api/enterprise/ai-interaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            });

            if (response.ok) {
                const data = await response.json();
                this.displayAIResponse(data, resultsDiv);
            } else {
                throw new Error('AI processing failed');
            }
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
        try {
            const response = await fetch('/api/enterprise/alerts');
            if (response.ok) {
                const data = await response.json();
                this.displayAlerts(data.alerts);
            }
        } catch (error) {
            console.error('Failed to load alerts:', error);
        }
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
        try {
            const response = await fetch('/api/enterprise/cost-optimization');
            if (response.ok) {
                const data = await response.json();
                this.displayCostOptimization(data);
            }
        } catch (error) {
            console.error('Failed to load cost optimization:', error);
        }
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