// src/lib/utils/securityMonitor.ts

interface SecurityEvent {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    ip?: string;
    userAgent?: string;
    timestamp: Date;
}

class SecurityMonitor {
    private events: SecurityEvent[] = [];

    logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
        const securityEvent: SecurityEvent = {
            ...event,
            timestamp: new Date()
        };

        this.events.push(securityEvent);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[SECURITY] [${event.severity.toUpperCase()}] ${event.message}`);
        }

        // In production, you would send to monitoring service
        this.sendToMonitoringService(securityEvent);
    }

    detectSuspiciousActivity(request: { ip?: string; userAgent?: string; body?: string }) {
        const { ip, userAgent, body } = request;

        // Check for common attack patterns
        if (body && typeof body === 'string') {
            if (body.includes('<script>') || body.includes('javascript:')) {
                this.logSecurityEvent({
                    type: 'xss_attempt',
                    severity: 'high',
                    message: 'Potential XSS attack detected',
                    ip,
                    userAgent
                });
            }

            if (body.includes('UNION SELECT') || body.includes('1=1')) {
                this.logSecurityEvent({
                    type: 'sql_injection_attempt',
                    severity: 'critical',
                    message: 'Potential SQL injection detected',
                    ip,
                    userAgent
                });
            }
        }

        // Rate limiting detection would go here
    }

    private sendToMonitoringService() {
        // Implement actual monitoring service integration
        // For now, just keep in memory (last 1000 events)
        if (this.events.length > 1000) {
            this.events.shift();
        }
    }

    getSecurityEvents(): SecurityEvent[] {
        return this.events;
    }

    getEventsBySeverity(severity: string): SecurityEvent[] {
        return this.events.filter(event => event.severity === severity);
    }
}

export const securityMonitor = new SecurityMonitor();
export default securityMonitor;