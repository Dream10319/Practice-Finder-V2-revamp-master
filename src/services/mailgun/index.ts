import FormData from "form-data";
import Mailgun from "mailgun.js";

export class MailgunService {
  #mg: any;

  constructor() {
    const mailgun: any = new Mailgun(FormData);
    this.#mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "",
    });
  }

  sendEmail = async (to: string, subject: string, htmlContent: string) => {
    try {
      const mailOptions = {
        from: process.env.SERVICE_EMAIL,
        to,
        subject,
        html: htmlContent,
      };
      await this.#mg.messages.create(process.env.MAILGUN_DOMAIN, mailOptions);
    } catch (error) {
      throw error;
    }
  };
}
