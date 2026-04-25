import express from "express";
import {
  createAdoptionController,
  getAdoptionsByUserController,
} from "../controllers/AdoptionController.js";

const router = express.Router();

router.post("/", createAdoptionController);
router.get("/user/:userId", getAdoptionsByUserController);

export default router;
