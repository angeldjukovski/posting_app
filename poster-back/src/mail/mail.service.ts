import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bookcraftstore@gmail.com',
        pass: 'mwoe xbzk eyhe bvmk',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'bookcraftstore@gmail.com',
      to,
      subject,
      text,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error, 'Error sending mail');
      throw new InternalServerErrorException('Error sending mail');
    }
  }
}
