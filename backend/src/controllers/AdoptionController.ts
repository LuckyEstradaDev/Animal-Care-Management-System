import type {Request, Response} from "express";
import {
  createAdoption,
  deleteAdoption,
  getAdoptionById,
  getAllAdoptions,
  getAdoptionsByUser,
  updateAdoption,
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

export const getAllAdoptionsController = async (req: Request, res: Response) => {
  try {
    const adoptions = await getAllAdoptions();
    return res.status(200).json({
      message: "Adoption requests retrieved successfully.",
      adoptions,
    });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const getAdoptionByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }

    const adoption = await getAdoptionById(req.params.id);
    if (!adoption) {
      return res.status(404).json({message: "Adoption request not found."});
    }

    return res.status(200).json({
      message: "Adoption request retrieved successfully.",
      adoption,
    });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const updateAdoptionController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }

    const adoption = await updateAdoption(req.params.id, req.body);
    if (!adoption) {
      return res.status(404).json({message: "Adoption request not found."});
    }

    return res.status(200).json({
      message: "Adoption request updated successfully.",
      adoption,
    });
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const deleteAdoptionController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({message: "Invalid request."});
    }

    const adoption = await deleteAdoption(req.params.id);
    if (!adoption) {
      return res.status(404).json({message: "Adoption request not found."});
    }

    return res
      .status(200)
      .json({message: "Adoption request deleted successfully."});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};
