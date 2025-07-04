import { Request, Response } from "express";
import { MailgunService } from "@services/mailgun";
import { NPIService } from "@services/npi";
import User from "@models/User";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

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
          status: false, // Changed from 400 to false for consistency with other responses
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
      console.error("Error activating user:", error); // Log the error for debugging
      return res.status(500).json({
        status: false, // Changed from statu to status
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
        role, // Added role for possible update through admin panel
      } = req.body;
      const { id } = req.params;

      const user: any = await User.findById(id);

      let updatedFields: any = {};
      let changedFields: Array<string> = []; // Changed to string array for better type inference

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

      // Ensure needFinancing is correctly handled as a boolean
      if (typeof needFinancing === "boolean" && needFinancing !== user.needFinancing) {
        updatedFields.needFinancing = needFinancing;
        changedFields.push("Financing Option");
      }

      if (email && email !== user.email) {
        const existingUser: any = await User.findOne({ email: email });

        if (existingUser && String(existingUser._id) !== id) { // Ensure it's not the current user
          return res
            .status(400)
            .json({ status: false, message: "Email already in use." }); // Changed status to false
        }

        updatedFields.email = email.toLowerCase(); // Store email in lowercase
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

      updatedFields.role = "USER";
      changedFields.push("Role");

      if (Object.keys(updatedFields).length === 0) {
        return res
          .status(200)
          .json({ status: true, message: "No changes were made." });
      }

      await User.findByIdAndUpdate(id, updatedFields);

      // Only send email if there were actual changes to user-facing fields
      if (changedFields.length > 0) {
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
      }

      return res.status(200).json({
        status: true,
        message: "Account information updated successfully.",
      });
    } catch (err) {
      console.error("Error updating user:", err); // Log the error for debugging
      return res.status(500).json({
        status: false, // Changed from statu to status
        message: "Server error, please try again later.",
      });
    }
  };

  GetUserList = async (req: Request, res: Response) => {
    try {
      // Assuming userId is coming from authentication middleware and added to req.body
      // If userId is from auth middleware, it might be req.user.id or similar.
      // For now, keeping as req.body.userId based on your current code.
      const { userId } = req.body;
      const users = await User.find({ _id: { $ne: userId } }) // Exclude the current user if userId is provided
        .populate({
          path: "likes",
          select: {
            name: 1,
            id: 1,
          },
        })
        .select({ password: 0 }); // Exclude password from the returned users

      return res.status(200).json({
        status: true,
        payload: {
          users: users,
        },
      });
    } catch (err) {
      console.error("Error fetching user list:", err); // Log the error for debugging
      return res.status(500).json({
        status: false, // Changed from statu to status
        message: "Server error, please try again later.",
      });
    }
  };

  // NEW: Create User method
  CreateUser = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "Email and password are required.",
        });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res
          .status(400)
          .json({ status: false, message: "Email is already taken." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        activated: true,
      });

      const savedUser = await newUser.save();

      // Optionally send a welcome email or notification to the newly created user
      const welcomeEmailContent = `
                <h1>Welcome to Practice Finder!</h1>
                <p>Dear ${firstName || 'User'},</p>
                <p>An account has been created for you on Practice Finder with the email: <strong>${email}</strong> and the password you provided.</p>
                <p>You can now log in and explore. If you have any questions, feel free to reach out.</p>
                <p>Thank you!</p>
            `;

      const mailgunService = new MailgunService();
      await mailgunService.sendEmail(
        email,
        "Your Practice Finder Account is Ready!",
        welcomeEmailContent
      );

      return res.status(201).json({
        status: true,
        message: "User created successfully.",
        payload: {
          user: {
            _id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            activated: savedUser.activated,
            role: savedUser.role,
          },
        },
      });
    } catch (error) {
      console.error("Error creating user:", error); // Log the error for debugging
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
      });
    }
  };

  // NEW: Delete User method
  DeleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const userToDelete = await User.findById(id);

      if (!userToDelete) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }

      // Optional: Prevent deleting the currently logged-in admin user if desired
      // if (req.body.userId && String(userToDelete._id) === req.body.userId) {
      //     return res.status(403).json({ status: false, message: "Cannot delete your own account." });
      // }

      await User.findByIdAndDelete(id);

      // Optionally send a notification email to the deleted user (if possible)
      // or to the admin that a user has been deleted.
      const deletionNotificationContent = `
                <h1>Your Practice Finder Account Has Been Deleted</h1>
                <p>Dear ${userToDelete.firstName || 'User'},</p>
                <p>This is to inform you that your Practice Finder account associated with ${userToDelete.email} has been deleted.</p>
                <p>If you believe this was in error, please contact our support team.</p>
            `;
      const mailgunService = new MailgunService();
      await mailgunService.sendEmail(
        userToDelete.email,
        "Your Practice Finder Account Deleted",
        deletionNotificationContent
      );


      return res.status(200).json({
        status: true,
        message: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error); // Log the error for debugging
      return res.status(500).json({
        status: false,
        message: "Server error, please try again later.",
      });
    }
  };
}