import {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
} from "../services/pet.service.js";
import type {Request, Response} from "express";

export const createPetController = async (req: Request, res: Response) => {
  try {
    const pet = await createPet(req.body);
    return res.status(200).json({message: "Pet created successfully.", pet});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const getAllPetsController = async (req: Request, res: Response) => {
  try {
    const pets = await getAllPets();
    return res
      .status(200)
      .json({message: "Pets retrieved successfully.", pets});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const getPetByIdController = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }
    const pet = await getPetById(req.params.id);
    if (!pet) {
      return res.status(404).json({message: "Pet not found."});
    }
    return res.status(200).json({message: "Pet retrieved successfully.", pet});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const updatePetController = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }
    const pet = await updatePet(req.params.id, req.body);
    if (!pet) {
      return res.status(404).json({message: "Pet not found."});
    }
    return res.status(200).json({message: "Pet updated successfully.", pet});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const deletePetController = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }
    await deletePet(req.params.id);
    return res.status(200).json({message: "Pet deleted successfully."});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};
