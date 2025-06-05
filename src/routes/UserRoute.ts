import express from "express";
import { UserController } from "@controllers/UserController";
import { Auth, OnlyAdmin } from "@middleware/index";

const router = express.Router();
const userController = new UserController();

router.get("/list", OnlyAdmin as any, userController.GetUserList as any);
router.get("/:id/activate", OnlyAdmin as any, userController.Activate as any);
router.patch("/:id/update", Auth as any, userController.UpdateUser as any);

export default router;
