import express from "express";
import { UserController } from "@controllers/UserController";
import { Auth, OnlyAdmin } from "@middleware/index";

const router = express.Router();
const userController = new UserController();

router.get("/list", OnlyAdmin as any, userController.GetUserList as any);
router.get("/:id/activate", OnlyAdmin as any, userController.Activate as any);
router.patch("/:id/update", Auth as any, userController.UpdateUser as any); // Auth middleware is fine, assuming only the user themselves or an admin can update
router.post("/create", OnlyAdmin as any, userController.CreateUser as any);
router.delete("/:id/delete", OnlyAdmin as any, userController.DeleteUser as any);


export default router;