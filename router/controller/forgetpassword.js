import express from 'express';
import crypto from 'crypto';
import { transport } from '../../mail.util.js';
import { Usermodel } from '../../db.utils/model.js';

const ForgetPassword = express.Router();

ForgetPassword.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    if (typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    await transport.sendMail(mailOptions);

    return res.json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Error in password reset:', error);
    return res.status(500).json({ message: 'Error sending reset email' });
  }
});

export default ForgetPassword;
