const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config.env' });

const sendContactEmail = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log('Contact form received:', { name, email, subject, message }); 

    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email, subject, and message',
      });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid email address',
      });
    }

    console.log('Creating transporter...'); 

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false  
      }
    });

    console.log('Verifying transporter...'); 

    
    await transporter.verify();
    console.log('Transporter verified successfully'); 

    
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, 
      replyTo: email, 
      subject: `Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #fff; padding: 15px; border-radius: 5px; border-left: 3px solid #007bff;">
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This email was sent from the contact form on your website.
          </p>
        </div>
      `,
    };

    console.log('Sending email...'); 

    
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId); 

    
    res.status(200).json({
      status: 'success',
      message: 'Your message has been sent successfully. We will get back to you soon.',
      messageId: info.messageId,
    });
  } catch (err) {
    console.error('Error sending contact email:', err); 
    console.error('Error code:', err.code); 
    console.error('Error message:', err.message); 

    
    if (err.code === 'EAUTH') {
      return res.status(500).json({
        status: 'error',
        message: 'Authentication failed. Make sure you are using an App Password (not your regular Gmail password) and have enabled 2-factor authentication on your Google account.',
      });
    }

    if (err.code === 'ECONNREFUSED' || err.code === 'ENETUNREACH') {
      return res.status(500).json({
        status: 'error',
        message: 'Unable to connect to the email server. Please check your network connection.',
      });
    }

    if (err.code === 'EDNS') {
      return res.status(500).json({
        status: 'error',
        message: 'DNS lookup failed. Please check your network connection.',
      });
    }

    
    res.status(500).json({
      status: 'error',
      message: `There was an error sending your message: ${err.message}. Make sure you are using an App Password with 2-factor authentication enabled.`,
    });
  }
};

module.exports = {
  sendContactEmail,
};