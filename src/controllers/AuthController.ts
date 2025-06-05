import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@models/User";
import { MailgunService } from "@services/mailgun";
import { EXPIRE_IN } from "@constants/index";
import { NPIService } from "@services/npi";
import { GoogleService } from "@services/google";
import AuthProvider from "@models/AuthProvider";

export class AuthController {
  SignIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found!" });
      }

      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid credentials!" });
      }

      if (!user.activated) {
        return res
          .status(400)
          .json({ status: false, message: "User is not activated yet!" });
      }

      const payload = {
        id: user._id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + EXPIRE_IN,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY || "", {
        algorithm: "HS256",
      });

      return res.status(200).json({
        status: true,
        payload: {
          token: token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            npi: user.npi,
            activated: user.activated,
            role: user.role,
            hasPassword: !!user.password,
          },
        },
        message: "Login successful!",
      });
    } catch (error) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  SignUp = async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        npi,
        uid,
        phone,
        specialty,
        needFinancing,
      } = req.body;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res
          .status(400)
          .json({ status: false, message: "Email is already taken." });
      }

      const npiService = new NPIService();
      const valid = await npiService.validateNPI(npi);
      if (!valid) {
        return res.status(400).json({ status: false, message: "Invalid NPI." });
      }

      let hashedPassword = "";
      if (!uid) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        phone: phone,
        specialty: specialty,
        needFinancing: needFinancing,
        password: uid ? undefined : hashedPassword,
        npi: npi,
      });

      const savedUser: any = await newUser.save();

      if (uid) {
        const newAuthProvider = new AuthProvider({
          user: savedUser._id,
          uid: uid,
          provider: "Google",
        });

        await newAuthProvider.save();
      }

      const welcomeEmailContent = `
        <h1>Welcome to Practice Finder</h1>
        <p>Thanks for signing up! We will notify you as soon as your account is approved and created.</p>
      `;

      const adminNotificationContent = `
        <h1>New User Registered</h1>
        <p>Here is the information for the new user:</p>
        <ul>
            <li>First Name: ${firstName}</li>
            <li>Last Name: ${lastName}</li>
            <li>Email: ${email}</li>
            <li>NPI: ${npi}</li>
        </ul>
      `;

      const mailgunService = new MailgunService();
      await mailgunService.sendEmail(
        email,
        "Welcome To Practice Finder",
        welcomeEmailContent
      );

      await mailgunService.sendEmail(
        process.env.ADMIN_EMAIL || "",
        "[ACTION REQUIRED] New Account Created",
        adminNotificationContent
      );

      return res.status(200).json({
        status: true,
        message: "Signed Up successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  GoogleAuth = async (req: Request, res: Response) => {
    try {
      const { token, isLogin } = req.body;

      const googleService = new GoogleService();
      const payload = await googleService.GoogleAuth(token);

      if (isLogin) {
        const user = await User.findOne({ email: payload.email.toLowerCase() });
        if (user) {
          const authProvider = await AuthProvider.findOne({
            uid: payload.uid,
            user: user._id,
          });

          if (authProvider) {
            if (!user.activated) {
              return res
                .status(400)
                .json({ status: false, message: "User is not activated yet!" });
            }

            const payload = {
              id: user._id,
              role: user.role,
              exp: Math.floor(Date.now() / 1000) + EXPIRE_IN,
            };

            const token = jwt.sign(payload, process.env.SECRET_KEY || "", {
              algorithm: "HS256",
            });

            return res.status(200).json({
              status: true,
              payload: {
                token: token,
                user: {
                  id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  npi: user.npi,
                  activated: user.activated,
                  role: user.role,
                  hasPassword: !!user.password,
                },
              },
              message: "Google Login successful!",
            });
          } else {
            return res.status(404).json({
              status: false,
              message: "Google option is not available.",
            });
          }
        } else {
          return res
            .status(404)
            .json({ status: false, message: "User not found!" });
        }
      } else {
        return res.status(200).json({
          status: true,
          payload: {
            userInfo: payload,
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

  GetCurrentUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const user: any = await User.findById(userId);

      if (user) {
        return res.status(200).json({
          status: true,
          message: "Authenticated User fetched successful",
          payload: {
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              npi: user.npi,
              activated: user.activated,
              role: user.role,
              phone: user.phone,
              specialty: user.specialty,
              needFinancing: user.needFinancing,
              hasPassword: !!user.password,
            },
          },
        });
      } else {
        return res
          .status(404)
          .json({ statu: false, message: "User not Found" });
      }
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };

  ChangePassword = async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword, userId } = req.body;
      const user: any = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }

      if (oldPassword) {
        const isPasswordCorrect = await bcrypt.compare(
          oldPassword,
          user.password
        );

        if (!isPasswordCorrect) {
          return res
            .status(401)
            .json({ status: false, message: "Incorrect old password." });
        }
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(userId, { password: hashedNewPassword });
      const passwordChangeEmailContent = `
            <h1>Your Practice Finder Password Has Been Changed</h1>
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Your account password has been successfully changed.</p>
            <p>If you did not make this change or if you have any questions, please contact our support team immediately.</p>
            <p>Thank you for using Practice Finder!</p>
        `;

      const mailgunService = new MailgunService();
      await mailgunService.sendEmail(
        user.email,
        "Password Changed",
        passwordChangeEmailContent
      );

      return res.status(200).json({
        status: true,
        message: "Password changed successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        statu: false,
        message: "Server error, please try again later.",
      });
    }
  };
}
