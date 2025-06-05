import { Request, Response } from "express";
import { MailgunService } from "@services/mailgun";
import { NPIService } from "@services/npi";
import User from "@models/User";

export class PublicController {
  contactUs = async (req: Request, res: Response) => {
    try {
      const { email, message, name } = req.body;

      const contactEmailContent = `
            <h1>New Contact Form Submission</h1>
            <p>Someone has submitted the contact form on the website.</p>
            <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
                <li>Message: ${message}</li>
            </ul>
        `;

      const mailgunService = new MailgunService();
      await mailgunService.sendEmail(
        process.env.ADMIN_EMAIL || "",
        "New Contact Form Submission",
        contactEmailContent
      );

      return res.status(200).json({
        status: true,
        message: "Contact form submitted successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  validateNPI = async (req: Request, res: Response) => {
    try {
      const { npi } = req.body;
      const npiService = new NPIService();
      const user: any = await User.findOne({ npi: npi });
      if (user) {
        return res.status(400).json({
          status: false,
          message: "NPI# is already taken.",
        });
      } else {
        const valid = await npiService.validateNPI(npi);

        return res.status(200).json({
          status: true,
          payload: {
            valid: valid,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  checkEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      return res.status(200).json({
        status: true,
        payload: {
          taken: !!user,
        },
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };
}
