const nodemailer = require('nodemailer');
const database = require('../config/database');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Check if required email environment variables are set
    if (!process.env.SMTP_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  Email environment variables not configured. Email sending will be disabled.');
      this.transporter = null;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Test the connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email transporter verification failed:', error.message);
        } else {
          console.log('✅ Email transporter configured successfully');
        }
      });
    } catch (error) {
      console.error('❌ Error initializing email transporter:', error.message);
      this.transporter = null;
    }
  }

  async sendEmail(to, subject, message, html = null) {
    try {
      // Check if email is enabled
      if (process.env.ENABLE_EMAIL !== 'true') {
        // Log the email as "sent" but actually just simulated
        await this.logEmail({
          recipient: to,
          subject,
          status: 'simulated',
          messageId: 'simulated-' + Date.now(),
          response: 'Email sending is disabled'
        });

        return {
          success: true,
          messageId: 'simulated-' + Date.now(),
          response: 'Email sending is disabled - email was simulated',
          simulated: true
        };
      }

      // Check if transporter is available
      if (!this.transporter) {
        throw new Error('Email transporter not configured. Please check your email settings.');
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message,
        html: html || message
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Log the email
      await this.logEmail({
        recipient: to,
        subject,
        status: 'success',
        messageId: result.messageId,
        response: result.response
      });

      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
    } catch (error) {
      console.error('Email sending error:', error);
      
      // Log the failed email
      await this.logEmail({
        recipient: to,
        subject,
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }

  async logEmail(logEntry) {
    try {
      const fullLogEntry = {
        ...logEntry,
        timestamp: new Date().toISOString()
      };

      if (database.isConnected) {
        await database.addEmailLog(fullLogEntry);
      }
    } catch (error) {
      console.error('Error logging email:', error);
    }
  }

  async sendReminderEmails() {
    try {
      if (!database.isConnected) {
        throw new Error('Database not connected');
      }

      const insuranceData = await database.getInsuranceData();
      const reminderDays = parseInt(process.env.REMINDER_DAYS) || 7;
      
      // Calculate the date threshold for reminders
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + reminderDays);

      // Find policies expiring within the reminder period
      const expiringPolicies = insuranceData.filter(entry => {
        const expiryDate = new Date(entry.expiryDate);
        return expiryDate <= reminderDate && expiryDate >= new Date();
      });

      if (expiringPolicies.length === 0) {
        return {
          success: true,
          message: 'No policies expiring soon',
          sent: 0,
          failed: 0,
          total: 0
        };
      }

      const results = [];

      for (const policy of expiringPolicies) {
        try {
          const daysUntilExpiry = Math.ceil((new Date(policy.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          
          const subject = `Insurance Expiry Reminder - ${policy.policyNumber || policy.name}`;
          const { text, html } = this.generateReminderMessage(policy, daysUntilExpiry);

          const result = await this.sendEmail(policy.email, subject, text, html);
          
          results.push({
            success: true,
            email: policy.email,
            policyId: policy._id,
            policyName: policy.name,
            messageId: result.messageId
          });

        } catch (error) {
          console.error(`Error sending reminder to ${policy.email}:`, error);
          
          results.push({
            success: false,
            email: policy.email,
            policyId: policy._id,
            policyName: policy.name,
            error: error.message
          });
        }
      }

      const sent = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return {
        success: true,
        message: `Reminder emails sent: ${sent} successful, ${failed} failed`,
        sent,
        failed,
        total: results.length,
        results
      };

    } catch (error) {
      console.error('Error sending reminder emails:', error);
      throw error;
    }
  }

  generateReminderMessage(policy, daysUntilExpiry) {
    const vehicleNumber = policy.policyNumber || 'N/A';
    const vehicleType = policy.policyType || 'N/A';
    const ownerName = policy.name || 'N/A';
    const mobile = policy.phone || 'N/A';
    const expiryDate = new Date(policy.expiryDate).toLocaleDateString();
    
    const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insurance Expiry Reminder</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }
        .header {
            text-align: center;
            margin-bottom: 35px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 25px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        .car-icon {
            font-size: 24px;
            color: #dc2626;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 25px;
            color: #374151;
        }
        .main-message {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 5px solid #2563eb;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }
        .main-message p {
            margin: 0;
            font-size: 16px;
            line-height: 1.7;
        }
        .vehicle-details {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        .vehicle-details h3 {
            margin: 0 0 20px 0;
            color: #1e293b;
            font-size: 18px;
            font-weight: 600;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 10px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #64748b;
            font-size: 14px;
        }
        .detail-value {
            font-weight: 700;
            color: #1e293b;
            font-size: 14px;
        }
        .warning-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
        }
        .warning-icon {
            color: #d97706;
            font-size: 24px;
            flex-shrink: 0;
        }
        .warning-text {
            color: #92400e;
            font-weight: 700;
            margin: 0;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            margin-top: 35px;
            padding-top: 25px;
            border-top: 2px solid #e2e8f0;
        }
        .footer p {
            margin: 5px 0;
        }
        .team-name {
            font-weight: 700;
            color: #2563eb;
            font-size: 18px;
        }
        .footer-note {
            font-size: 12px;
            color: #64748b;
            margin-top: 20px;
            font-style: italic;
        }
        .highlight {
            color: #2563eb;
            font-weight: 700;
        }
        .days-remaining {
            background: #dc2626;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-left: 8px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>
                <span class="car-icon">🚗</span>
                Insurance Expiry Reminder
            </h1>
        </div>
        
        <div class="greeting">
            Hi <span class="highlight">${ownerName}</span>,
        </div>
        
        <div class="main-message">
            <p>
                Your <span class="highlight">${vehicleType}</span> insurance for <span class="highlight">${vehicleNumber}</span> 
                is expiring on <span class="highlight">${expiryDate}</span>
                <span class="days-remaining">${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} remaining</span>.
            </p>
            <p style="margin-top: 15px;">
                Please renew it before the due date to avoid penalties and ensure continuous coverage.
            </p>
        </div>
        
        <div class="vehicle-details">
            <h3>Vehicle Details:</h3>
            <div class="detail-row">
                <span class="detail-label">Vehicle Number:</span>
                <span class="detail-value">${vehicleNumber}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Vehicle Type:</span>
                <span class="detail-value">${vehicleType}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Owner:</span>
                <span class="detail-value">${ownerName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Mobile:</span>
                <span class="detail-value">${mobile}</span>
            </div>
        </div>
        
        <div class="warning-box">
            <span class="warning-icon">⚠️</span>
            <p class="warning-text">Important: Don't let your insurance lapse. Renew today to stay protected!</p>
        </div>
        
        <div class="footer">
            <p>Thanks,</p>
            <p class="team-name">Mavrix Insurance Team</p>
            <p class="footer-note">This is an automated reminder. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `;

    const textMessage = `
Dear ${policy.name},

This is a reminder that your ${policy.policyType} insurance policy (Policy #: ${policy.policyNumber}) will expire on ${new Date(policy.expiryDate).toLocaleDateString()}.

You have ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} remaining to renew your policy.

Policy Details:
- Policy Type: ${policy.policyType}
- Policy Number: ${policy.policyNumber}
- Expiry Date: ${new Date(policy.expiryDate).toLocaleDateString()}
- Premium: $${policy.premium || 'N/A'}
- Coverage Amount: $${policy.coverageAmount || 'N/A'}

Please contact your insurance provider to renew your policy before it expires.

Best regards,
        Mavrix Insurance Team
    `;

    return { text: textMessage, html: htmlMessage };
  }

  async sendTestEmail(to) {
    try {
      const subject = 'Mavrix Insurance System - Test Email';
      const message = `
This is a test email from the Mavrix Insurance System.

If you received this email, the email configuration is working correctly.

Best regards,
        Mavrix Insurance System
      `;

      return await this.sendEmail(to, subject, message);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EmailService();
