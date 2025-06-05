import { Request, Response } from "express";
import { MailgunService } from "@services/mailgun";
import { NPIService } from "@services/npi";
import User from "@models/User";

export class UserController {
  Activate = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user: any = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }

      if (user.activated) {
        return res.status(400).json({
          status: 400,
          message: "Account was already activated or couldn't be updated.",
        });
      } else {
        await User.findByIdAndUpdate(id, { activated: true });

        const activationEmailContent = `
                    <h1>Your Practice Finder Account Has Been Activated</h1>
                    <p>Dear ${user.firstName} ${user.lastName},</p>
                    <p>We're pleased to inform you that your Practice Finder account has been activated. You can now log in and start using our services.</p>
                    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                    <p>Thank you for choosing Practice Finder!</p>
                `;

        const mailgunService = new MailgunService();
        mailgunService.sendEmail(
          user.email,
          "Your Practice Finder account is activated!",
          activationEmailContent
        );

        return res.status(200).json({
          status: true,
          message: "Account activated successfully.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  UpdateUser = async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        npi,
        phone,
        specialty,
        needFinancing,
      } = req.body;
      const { id } = req.params;

      const user: any = await User.findById(id);

      let updatedFields: any = {};
      let changedFields: Array<any> = [];

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }

      if (firstName && firstName !== user.firstName) {
        updatedFields.firstName = firstName;
        changedFields.push("First Name");
      }

      if (lastName && lastName !== user.lastName) {
        updatedFields.lastName = lastName;
        changedFields.push("Last Name");
      }

      if (phone && phone !== user.phone) {
        updatedFields.phone = phone;
        changedFields.push("Phone");
      }

      if (specialty && specialty !== user.specialty) {
        updatedFields.specialty = specialty;
        changedFields.push("Specialty");
      }

      if (needFinancing && needFinancing !== user.needFinancing) {
        updatedFields.needFinancing = needFinancing;
        changedFields.push("Financing Option");
      }

      if (email && email !== user.email) {
        const existingUser: any = await User.findOne({ email: email });

        if (existingUser) {
          return res
            .status(400)
            .json({ status: true, message: "Email already in use." });
        }

        updatedFields.email = email;
        changedFields.push("Email");
      }

      if (npi && npi !== user.npi) {
        const npiService = new NPIService();
        const valid = await npiService.validateNPI(npi);
        if (!valid) {
          return res
            .status(400)
            .json({ status: false, message: "Invalid NPI." });
        }

        updatedFields.npi = npi;
        changedFields.push("NPI");
      }

      if (Object.keys(updatedFields).length === 0) {
        return res
          .status(200)
          .json({ status: true, message: "No changes were made." });
      }

      await User.findByIdAndUpdate(id, updatedFields);

      const updateEmailContent = `
            <h1>Your Practice Finder Account Has Been Updated</h1>
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Your account information has been updated. The following fields were changed:</p>
            <ul>
                ${changedFields.map((field) => `<li>${field}</li>`).join("")}
            </ul>
            <p>If you did not make these changes or if you have any questions, please contact our support team immediately.</p>
            <p>Thank you for using Practice Finder!</p>
        `;

      const mailgunService = new MailgunService();
      await mailgunService.sendEmail(
        user.email,
        "Account Information Updated",
        updateEmailContent
      );

      return res.status(200).json({
        status: true,
        message: "Account information updated successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GetUserList = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const users = await User.find({ _id: { $ne: userId } })
        .populate({
          path: "likes",
          select: {
            name: 1,
            id: 1,
          },
        })
        .select({ password: 0 });

      return res.status(200).json({
        status: true,
        payload: {
          users: users,
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
