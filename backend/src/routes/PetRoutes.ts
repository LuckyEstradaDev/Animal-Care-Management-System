import express from "express";
import {
  createPetController,
  deletePetController,
  getAllPetsController,
  getPetByIdController,
  getPetsByOwnerController,
  updatePetController,
} from "../controllers/PetController.js";
const router = express.Router();

router.post("/", createPetController);
router.get("/", getAllPetsController);
router.get("/owner/:ownerId", getPetsByOwnerController);
router.get("/:id", getPetByIdController);
router.put("/:id", updatePetController);
router.delete("/:id", deletePetController);

export default router;
