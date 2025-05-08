import nodemailer from "nodemailer";

interface transporterBody {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
}

interface verifyEmailBody {
    email_address: string;
    user_name: string;
}

class mailTemplates {

    private async transporter(): Promise<nodemailer.Transporter | undefined> {
        try {
            const transporterConfig: transporterBody = {
                host: process.env.MAIL_HOST!,
                port: parseInt(process.env.MAIL_PORT!),
                auth: {
                    user: process.env.MAIL_FROM_ADDRESS!,
                    pass: process.env.MAIL_PASSWORD!,
                },
            };

            return nodemailer.createTransport(transporterConfig);
        } catch (error) {
            console.log("Error in creating transporter: ", error);
        }
    }

    public async verifyEmail(data: verifyEmailBody): Promise<void> {
        try {
            const sendLink: object = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: data.email_address,
                subject: "Verify Email",
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification</title>
                    <style>
                        body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f7fc;
                        margin: 0;
                        padding: 0;
                        text-align: center;
                        }
                        .email-container {
                        background-color: #ffffff;
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .logo {
                        margin-bottom: 20px;
                        }
                        .email-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10px;
                        }
                        .email-message {
                        font-size: 16px;
                        color: #555;
                        margin-bottom: 20px;
                        }
                        .btn {
                        display: inline-block;
                        background-color: #00aaff;
                        color: #fff;
                        padding: 15px 30px;
                        font-size: 16px;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: bold;
                        text-transform: uppercase;
                        transition: background-color 0.3s ease;
                        }
                        .btn:hover {
                        background-color: #0088cc;
                        }
                        .footer {
                        font-size: 14px;
                        color: #aaa;
                        margin-top: 20px;
                        }
                        .footer a {
                        color: #00aaff;
                        text-decoration: none;
                        }
                    </style>
                    </head>
                    <body>
                    <div class="email-container">
                        <div class="logo">
                        <img src="https://img.freepik.com/free-vector/detailed-travel-logo_23-2148627268.jpg?t=st=1733905527~exp=1733909127~hmac=3c60aa3d8bc8902a2a54397bf8a643cb35a2cfb3d7530a2d4b1006035f98be9b&w=826" alt="Your App Logo" height="70px" width="70px"/>
                        </div>

                        <div class="email-title">
                        Welcome to Travel App!
                        </div>
                        <div class="email-message">
                        Hello ${data.user_name}<br><br>
                        Thanks for signing up! To complete your registration, please verify your email address by clicking the button below:
                        </div>
                        <a href="https://stageadmin.f50f.today/games" class="btn">Verify Your Email</a>

                        <div class="footer">
                        <p>If you did not create an account with Travel App, please ignore this email.</p>
                        <p>For any questions, feel free to <a href="mailto:support@yourapp.com">contact us</a>.</p>
                        </div>
                    </div>
                    </body>
                    </html>
                `,
            };

            const transporter = await this.transporter();
            if (transporter) {
                return await transporter.sendMail(sendLink);
            } else {
                console.log("Failed to create transporter.");
            }
        } catch (error) {
            console.log("Error in verifyEmail: ", error);
        }
    }
}

export default mailTemplates;
