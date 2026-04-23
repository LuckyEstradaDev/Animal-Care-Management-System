import express from "express";
import {
  createPetController,
  getAllPetsController,
} from "../controllers/PetController.js";
const router = express.Router();

router.post("/", createPetController);
router.get("/", getAllPetsController);

export default router;
