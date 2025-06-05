import express from "express";
import { AuthController } from "@controllers/AuthController";
import { Auth } from "@middleware/index";

const router = express.Router();
const authController = new AuthController();

router.post("/signin", authController.SignIn as any);
router.post("/signup", authController.SignUp as any);
router.get("/current-user", Auth as any, authController.GetCurrentUser as any);
router.post('/change-password', Auth as any, authController.ChangePassword as any);
router.post("/google", authController.GoogleAuth as any);

export default router;
