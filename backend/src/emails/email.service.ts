import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface ISendMail {
    to: string;
    subject: string;
    message: string;
}

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.GOOGLE_MAIL_APP_EMAIL,
                pass: process.env.GOOGLE_MAIL_APP_PASSWORD,
            },
        });
    }


    async send({ to, subject, message }: ISendMail): Promise<boolean> {
        const mailOptions = {
            from: process.env.GOOGLE_MAIL_APP_EMAIL,
            to,
            subject,
            html: message,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Error sending email", error);
            return false;
        }
    }
}
