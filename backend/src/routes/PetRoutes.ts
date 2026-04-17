import express from "express";
import {createPetController} from "../controllers/PetController.js";
const router = express.Router();

router.post("/", createPetController);

export default router;
