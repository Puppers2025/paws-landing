#!/usr/bin/env node

/**
 * Continuous Security Monitoring
 * Monitors security status and alerts on changes
 * 
 * Usage: node scripts/security-monitor.js [options]
 * Options:
 *   --watch     Watch for file changes
 *   --interval  Check interval in minutes (default: 5)
 *   --alert     Send alerts on security issues
 *   --log       Log security events to file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityMonitor {
  constructor(options = {}) {
    this.options = {
      watch: options.watch || false,
      interval: options.interval || 5,
      alert: options.alert || false,
      log: options.log || false,
      ...options
    };
    
    this.lastCheck = null;
    this.securityStatus = {
      score: 0,
      issues: [],
      lastUpdate: null
    };
    
    this.projectRoot = process.cwd();
    this.logFile = path.join(this.projectRoot, 'logs', 'security-monitor.log');
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '🔍',
      pass: '✅',
      fail: '❌',
      warn: '⚠️',
      alert: '🚨'
    }[type] || '🔍';
    
    const logMessage = `${prefix} [${timestamp}] ${message}`;
    console.log(logMessage);
    
    if (this.options.log) {
      fs.appendFileSync(this.logFile, logMessage + '\n');
    }
  }

  async start() {
    this.log('Starting Security Monitor...', 'info');
    this.log(`Interval: ${this.options.interval} minutes`, 'info');
    
    if (this.options.watch) {
      this.log('Watching for file changes...', 'info');
      this.watchFiles();
    } else {
      this.log('Running periodic checks...', 'info');
      this.runPeriodicChecks();
    }
  }

  async runPeriodicChecks() {
    const intervalMs = this.options.interval * 60 * 1000;
    
    const check = async () => {
      try {
        await this.performSecurityCheck();
      } catch (error) {
        this.log(`Security check failed: ${error.message}`, 'fail');
      }
      
      setTimeout(check, intervalMs);
    };
    
    // Run initial check
    await check();
  }

  watchFiles() {
    const watchPaths = [
      'lib/security.js',
      'lib/env.js',
      'lib/api-handler.js',
      'lib/middleware.js',
      'app/auth/signup/page.jsx',
      'app/dashboard/admin/page.jsx',
      'next.config.mjs',
      'vercel.json',
      'package.json'
    ];
    
    watchPaths.forEach(filePath => {
      const fullPath = path.join(this.projectRoot, filePath);
      if (fs.existsSync(fullPath)) {
        fs.watchFile(fullPath, { interval: 1000 }, (curr, prev) => {
          if (curr.mtime > prev.mtime) {
            this.log(`File changed: ${filePath}`, 'warn');
            this.performSecurityCheck();
          }
        });
      }
    });
  }

  async performSecurityCheck() {
    this.log('Performing security check...', 'info');
    
    try {
      // Run security audit
      const auditResult = await this.runSecurityAudit();
      
      // Check for changes
      const hasChanges = this.detectChanges(auditResult);
      
      if (hasChanges) {
        this.log('Security status changed', 'warn');
        this.handleSecurityChange(auditResult);
      }
      
      // Update status
      this.securityStatus = {
        score: auditResult.score,
        issues: auditResult.issues,
        lastUpdate: new Date()
      };
      
      this.lastCheck = new Date();
      
    } catch (error) {
      this.log(`Security check error: ${error.message}`, 'fail');
    }
  }

  async runSecurityAudit() {
    try {
      // Run the security audit script
      const result = execSync('node scripts/security-audit.js --quick', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      });
      
      // Parse the result (simplified)
      const score = this.extractScore(result);
      const issues = this.extractIssues(result);
      
      return { score, issues, result };
      
    } catch (error) {
      // If audit fails, return low score
      return { score: 0, issues: ['Security audit failed'], result: error.message };
    }
  }

  extractScore(result) {
    const scoreMatch = result.match(/Security Score: (\d+)%/);
    return scoreMatch ? parseInt(scoreMatch[1]) : 0;
  }

  extractIssues(result) {
    const issues = [];
    const lines = result.split('\n');
    
    for (const line of lines) {
      if (line.includes('❌') || line.includes('⚠️')) {
        issues.push(line.trim());
      }
    }
    
    return issues;
  }

  detectChanges(newResult) {
    if (!this.lastCheck) return true;
    
    const scoreChange = Math.abs(newResult.score - this.securityStatus.score);
    const issuesChange = newResult.issues.length !== this.securityStatus.issues.length;
    
    return scoreChange > 5 || issuesChange;
  }

  handleSecurityChange(newResult) {
    const scoreChange = newResult.score - this.securityStatus.score;
    
    if (scoreChange < -10) {
      this.log(`Security score dropped significantly: ${scoreChange} points`, 'alert');
      this.sendAlert('Security Score Drop', `Security score dropped by ${Math.abs(scoreChange)} points`);
    } else if (scoreChange > 10) {
      this.log(`Security score improved: +${scoreChange} points`, 'pass');
    }
    
    if (newResult.issues.length > this.securityStatus.issues.length) {
      const newIssues = newResult.issues.length - this.securityStatus.issues.length;
      this.log(`${newIssues} new security issues detected`, 'alert');
      this.sendAlert('New Security Issues', `${newIssues} new security issues detected`);
    }
  }

  sendAlert(title, message) {
    if (!this.options.alert) return;
    
    // In a real implementation, you would send alerts via:
    // - Email
    // - Slack webhook
    // - Discord webhook
    // - SMS
    // - Push notification
    
    this.log(`ALERT: ${title} - ${message}`, 'alert');
    
    // Example: Log to alert file
    const alertFile = path.join(this.projectRoot, 'logs', 'security-alerts.log');
    const alertMessage = `[${new Date().toISOString()}] ${title}: ${message}\n`;
    fs.appendFileSync(alertFile, alertMessage);
  }

  async checkDependencies() {
    this.log('Checking dependencies for vulnerabilities...', 'info');
    
    try {
      const result = execSync('npm audit --audit-level=moderate', { 
        encoding: 'utf8',
        cwd: this.projectRoot 
      });
      
      if (result.includes('found 0 vulnerabilities')) {
        this.log('No vulnerabilities found in dependencies', 'pass');
      } else {
        this.log('Vulnerabilities found in dependencies', 'warn');
        this.sendAlert('Dependency Vulnerabilities', 'Vulnerabilities found in npm packages');
      }
      
    } catch (error) {
      this.log('Dependency check failed', 'fail');
    }
  }

  async checkFileIntegrity() {
    this.log('Checking file integrity...', 'info');
    
    const criticalFiles = [
      'lib/security.js',
      'lib/env.js',
      'next.config.mjs',
      'vercel.json'
    ];
    
    for (const file of criticalFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check file size (basic integrity check)
        if (stats.size < 100) {
          this.log(`Suspicious file size: ${file}`, 'warn');
        }
        
        // Check for suspicious content
        if (content.includes('eval(') || content.includes('Function(')) {
          this.log(`Suspicious content detected: ${file}`, 'alert');
          this.sendAlert('Suspicious Content', `Suspicious content detected in ${file}`);
        }
      } else {
        this.log(`Critical file missing: ${file}`, 'alert');
        this.sendAlert('Missing File', `Critical security file missing: ${file}`);
      }
    }
  }

  async checkEnvironmentSecurity() {
    this.log('Checking environment security...', 'info');
    
    // Check for exposed secrets
    const envExamplePath = path.join(this.projectRoot, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      const content = fs.readFileSync(envExamplePath, 'utf8');
      
      if (content.includes('your_') || content.includes('example')) {
        this.log('Environment example file properly configured', 'pass');
      } else {
        this.log('Environment example file may contain real secrets', 'warn');
      }
    }
    
    // Check .env is gitignored
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, 'utf8');
      if (content.includes('.env')) {
        this.log('.env files properly gitignored', 'pass');
      } else {
        this.log('.env files not gitignored', 'alert');
        this.sendAlert('Gitignore Issue', '.env files not properly gitignored');
      }
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      securityScore: this.securityStatus.score,
      issues: this.securityStatus.issues,
      lastCheck: this.lastCheck,
      uptime: process.uptime()
    };
    
    const reportFile = path.join(this.projectRoot, 'logs', 'security-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    this.log(`Security report generated: ${reportFile}`, 'info');
  }

  async stop() {
    this.log('Stopping Security Monitor...', 'info');
    this.generateReport();
    process.exit(0);
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    watch: args.includes('--watch'),
    interval: parseInt(args.find(arg => arg.startsWith('--interval='))?.split('=')[1]) || 5,
    alert: args.includes('--alert'),
    log: args.includes('--log')
  };
  
  const monitor = new SecurityMonitor(options);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => monitor.stop());
  process.on('SIGTERM', () => monitor.stop());
  
  monitor.start().catch(error => {
    console.error('❌ Security monitor failed:', error.message);
    process.exit(1);
  });
}

module.exports = SecurityMonitor;
