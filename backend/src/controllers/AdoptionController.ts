import type {Request, Response} from "express";
import {
  createAdoption,
  getAdoptionsByUser,
} from "../services/adoption.service.js";

export const createAdoptionController = async (req: Request, res: Response) => {
  try {
    const adoption = await createAdoption(req.body);
    return res.status(201).json({
      message: "Adoption request submitted successfully.",
      adoption,
    });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const getAdoptionsByUserController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({message: "Invalid request."});
    }

    const adoptions = await getAdoptionsByUser(req.params.userId);
    return res.status(200).json({
      message: "Adoption requests retrieved successfully.",
      adoptions,
    });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};
