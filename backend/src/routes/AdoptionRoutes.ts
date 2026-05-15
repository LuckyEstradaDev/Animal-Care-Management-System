import express from "express";
import {
  createAdoptionController,
  deleteAdoptionController,
  getAdoptionByIdController,
  getAllAdoptionsController,
  getAdoptionsByUserController,
  updateAdoptionController,
} from "../controllers/AdoptionController.js";

const router = express.Router();

router.post("/", createAdoptionController);
router.get("/", getAllAdoptionsController);
router.get("/user/:userId", getAdoptionsByUserController);
router.get("/:id", getAdoptionByIdController);
router.put("/:id", updateAdoptionController);
router.delete("/:id", deleteAdoptionController);

export default router;
