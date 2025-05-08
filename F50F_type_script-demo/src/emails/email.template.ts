import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

interface EmailData {
  emailAddress: string;
  otp: string;
}

const sendOtpCode = async (data: EmailData): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_FROM_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const sendOtp: SendMailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: data.emailAddress,
    subject: "Flip Coin - Reset Pin",
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #cccccc; margin: 0; padding: 0;">
    <div style="width: 100%; padding: 20px; background-color: #211D07; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 50px auto;">
        <div style="text-align:center; padding-bottom: 20px;">
            <img src="${process.env.APP_LOGO}" alt="LOGO" style="width: 80px;">
        </div>
        <div style="background-color: #ffc5001f; padding: 5px 0; text-align: center; color: #ffffff; font-size: 12px;">
            <h1>Reset Pin Request</h1>
        </div>
        <div style="padding: 10px;">
            <p>Hello ${data.emailAddress},</p>
            <p>We received a request to reset your pin. Please use the One-Time Password (OTP) below to reset your pin:</p>
            <p style="font-size: 24px; font-weight: bold; color: #FFC500; margin: 20px 0;">Your OTP: ${data.otp}</p>
            <p>For your security, please do not share this OTP with anyone.</p>
            <p>If you have any questions or need further assistance, feel free to contact our support team at <a href="mailto:${process.env.MAIL_FROM_SUPPORT}" style="color: #FFC500; text-decoration: none;">${process.env.MAIL_FROM_SUPPORT}</a>.</p>
            <p>Thank you,<br>Flip Coin Support Team</p>
        </div>
    </div>
</body>
</html>`,
  };

  await transporter.sendMail(sendOtp);
};

const verifyEmail = async (data: EmailData): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_FROM_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const sendOtp: SendMailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: data.emailAddress,
    subject: "Flip Coin - Verify Email",
    html: `<!DOCTYPE html>
            <html>
            <head>
                <title>Verification Code</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #cccccc; margin: 0; padding: 0;">
                <div style="width: 100%; padding: 20px; background-color: #211D07; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 50px auto;">
                    <div style="text-align:center; padding-bottom: 20px;">
                        <img src="${process.env.APP_LOGO}" alt="LOGO" style="width: 80px;">
                    </div>
                    <div style="background-color: #ffc5001f; padding: 5px 0; text-align: center; color: #ffffff; font-size: 12px;">
                        <h1>Verification OTP Request</h1>
                    </div>
                    <div style="padding: 10px;">
                        <p>Hello ${data.emailAddress},</p>
                        <p>We received a request to verify your account. Please use the OTP below to complete your verification:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #FFC500; margin: 20px 0;">Your OTP: ${data.otp}</p>
                        <p>If you have any questions or need further assistance, feel free to contact our support team at <a href="mailto:${process.env.MAIL_FROM_SUPPORT}" style="color: #FFC500; text-decoration: none;">${process.env.MAIL_FROM_SUPPORT}</a>.</p>
                        <p>Thank you,<br>Flip Coin Support Team</p>
                    </div>
                </div>
            </body>
    </html>`,
  };

  await transporter.sendMail(sendOtp);
};

export {
  sendOtpCode,
  verifyEmail
};
