const nodemailer = require('nodemailer');

class Emailer {
  constructor() {
    this.transporter = null;
    this.setupTransporter();
  }

  setupTransporter() {
    // Configure with environment variables or default settings
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    };

    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransport(emailConfig);
    } else {
      console.warn('Email credentials not configured. Email sending will be simulated.');
    }
  }

  async sendReminders(insuranceData) {
    const today = new Date();
    const reminderDays = parseInt(process.env.REMINDER_DAYS) || 7;
    const results = [];

    for (const entry of insuranceData) {
      const expiryDate = new Date(entry.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      // Send reminder if expiring in exactly the specified number of days
      if (daysUntilExpiry === reminderDays) {
        const result = await this.sendReminderEmail(entry);
        results.push(result);
      }
    }

    return results;
  }

  async sendReminderEmail(entry) {
    const emailContent = this.generateEmailContent(entry);
    
    if (!this.transporter) {
      // Email credentials not configured - simulating email
      console.log(`[SIMULATED] Sending email to ${entry.email}`);
      console.log(`Subject: ${emailContent.subject}`);
      console.log(`Body: ${emailContent.text}`);
      
      return {
        email: entry.email,
        success: true,
        message: 'Email sent successfully (simulated)'
      };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: entry.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html
      };

      await this.transporter.sendMail(mailOptions);
      
      return {
        email: entry.email,
        success: true,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error(`Failed to send email to ${entry.email}:`, error.message);
      
      return {
        email: entry.email,
        success: false,
        message: 'Failed to send email',
        error: error.message
      };
    }
  }

  generateEmailContent(entry) {
    const expiryDate = new Date(entry.expiryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const vehicleInfo = entry.vehicleNo ? `${entry.vehicleNo} (${entry.vehicleType || 'Vehicle'})` : 'your vehicle';
    const subject = `🚗 Insurance Expiry Reminder - ${entry.vehicleNo || 'Vehicle'}`;
    
    const text = `Hi ${entry.name},

Your ${entry.vehicleType || 'vehicle'} insurance for ${vehicleInfo} is expiring on ${expiryDate}. Please renew it before the due date to avoid penalties.

Vehicle Details:
- Vehicle Number: ${entry.vehicleNo || 'N/A'}
- Vehicle Type: ${entry.vehicleType || 'N/A'}
- Owner: ${entry.name}
- Mobile: ${entry.mobileNo || 'N/A'}

Thanks,
InsureTrack Team`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">🚗 Insurance Expiry Reminder</h2>
        <p>Hi <strong>${entry.name}</strong>,</p>
        <p>Your <strong>${entry.vehicleType || 'vehicle'}</strong> insurance for <strong>${vehicleInfo}</strong> is expiring on <strong>${expiryDate}</strong>. Please renew it before the due date to avoid penalties.</p>
        
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Vehicle Details:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
            <li><strong>Vehicle Number:</strong> ${entry.vehicleNo || 'N/A'}</li>
            <li><strong>Vehicle Type:</strong> ${entry.vehicleType || 'N/A'}</li>
            <li><strong>Owner:</strong> ${entry.name}</li>
            <li><strong>Mobile:</strong> ${entry.mobileNo || 'N/A'}</li>
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> Don't let your insurance lapse. Renew today to stay protected!</p>
        </div>
        <p>Thanks,<br/>
        <strong>InsureTrack Team</strong></p>
      </div>
    `;

    return { subject, text, html };
  }
}

module.exports = new Emailer();