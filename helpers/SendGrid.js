import sgMail from '@sendgrid/mail';
import 'dotenv/config.js';

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const baseRegistrationMsg = {
  from: 'niko.khe@gmail.com',
  subject: 'Welcome to Phonebook',
  text: 'Please verify your email to get started',
};

const sendMail = async (receiverEmail, verificationToken) => {
  const html = `
   <div style="font-family: Arial, sans-serif;">
      <h1 style="color: #444;">Welcome to Phonebook!</h1>
      <p>Dear user,</p>
      <p>Thank you for registering on our Phonebook application.</p>
      <p>Please click the link below to verify your email:</p>
      <p><a href="http://localhost:3000/api/users/verify/${verificationToken}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Verify Email</a></p>
      <p>Best regards,</p>
      <p>Phonebook Team</p>
    </div>`;

  const msg = { ...baseRegistrationMsg, to: receiverEmail, html };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log(error.message);
  }
};

export default sendMail;
