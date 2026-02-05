import express from "express";
import {
  placeBid,
  getMyBids,
  getReceivedBids,
  updateBidStatus,
} from "../controllers/bidController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Worker routes - for placing and viewing bids
router.post("/", protect, authorizeRoles("helper"), placeBid);
router.get("/my-bids", protect, authorizeRoles("helper"), getMyBids);

// Hirer routes - for viewing and managing bids
router.get("/received", protect, authorizeRoles("hirer"), getReceivedBids);
router.put("/:id", protect, authorizeRoles("hirer"), updateBidStatus);

export default router;
