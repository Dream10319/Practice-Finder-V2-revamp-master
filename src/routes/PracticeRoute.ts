import express from "express";
import { PracticeController } from "@controllers/PracticeController";
import { Auth } from "@middleware/index";

const router = express.Router();
const practiceController = new PracticeController();

router.post("/list", Auth as any, practiceController.GetPracticeList as any);
router.get("/:id/detail", Auth as any, practiceController.GetPracticeById as any);
router.get("/:id/like", Auth as any, practiceController.LikePractice as any);
router.post("/local-areas", practiceController.GetLocalAreas as any);
router.get("/states-listings-count", practiceController.GetStatesListingCount as any);
router.post("/state-listings-count", practiceController.GetStateListingsCount as any);
router.get("/likes", Auth as any, practiceController.GetLikedListings as any);
router.get("/:id/liked-listings", Auth as any, practiceController.GetLikedListingsByUserId as any);
router.post("/state-description", practiceController.GetStateDescription as any);
router.get("/total-count", practiceController.GetTotalPracticeCount as any);
router.get("/:state/listing-images", practiceController.GetListingImages as any);
export default router;
