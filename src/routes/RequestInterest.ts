// server/routes/requestInterest.routes.ts
import express from "express";
import { RequestInterestController } from "@controllers/RequestController";

const router = express.Router();
const requestInterestController = new RequestInterestController();

router.post("/request-interest", requestInterestController.RequestInterest as any);

export default router;
