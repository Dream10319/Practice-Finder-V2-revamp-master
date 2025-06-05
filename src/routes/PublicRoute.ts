import express from "express";
import { PublicController } from "@controllers/PublicController";

const router = express.Router();
const publicController = new PublicController();

router.post("/contact-us", publicController.contactUs as any);
router.post("/validate-npi", publicController.validateNPI as any);
router.post("/check-email", publicController.checkEmail as any);

export default router;
