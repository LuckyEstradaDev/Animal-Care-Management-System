import type {IUserInterface, IUserLoginInterface} from "../interfaces/IUser.js";
import {UserModel} from "../models/UserModel.js";
import {AuthRepository} from "../repositories/AuthRepository.js";
import {HTTPError} from "../utils/HttpError.js";
import bcrypt from "bcrypt";
import jwt, {type Secret} from "jsonwebtoken";

let authRepository = new AuthRepository();

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function getJwtSecret(): Secret {
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not configured.");
  }
  return secret;
}

function sanitizeUser(user: any) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: user.role,
  };
}

function validatePassword(password: string) {
  if (!PASSWORD_REGEX.test(password)) {
    throw new HTTPError(
      "Password must be at least 8 characters and include a letter, a number, and a special character.",
      400,
    );
  }
}

export const registerService = async (data: IUserInterface) => {
  data.email = data.email.trim().toLowerCase();
  validatePassword(data.rawPassword);
  const existingUser = await authRepository.findByEmail(data.email);

  if (existingUser) {
    throw new HTTPError("Email already used.", 409);
  }

  const user = await authRepository.register(data);
  const token = jwt.sign(
    {_id: user.id, email: user.email},
    getJwtSecret(),
    {expiresIn: "1h"},
  );

  return {token, user: sanitizeUser(user)};
};

export const loginService = async (data: IUserLoginInterface) => {
  data.email = data.email.trim().toLowerCase();
  const user = await authRepository.findByEmail(data.email);
  if (!user) throw new HTTPError("Email does not exist", 404);

  const isMatch = await bcrypt.compare(data.rawPassword, user.hashedPassword);

  if (!isMatch) throw new HTTPError("Incorrect password", 401);

  const token = jwt.sign(
    {_id: user.id, email: user.email},
    getJwtSecret(),
    {expiresIn: "1h"},
  );

  return {token, user: sanitizeUser(user)};
};

export const verifyMe = async (id: string) => {
  const user = await authRepository.findUserById(id);
  if (!user) throw new HTTPError("User does not exist", 404);
  return {user: sanitizeUser(user)};
};

export const ensureDefaultAdmin = async () => {
  const email = (
    process.env.DEFAULT_ADMIN_EMAIL || "admin@animalcare.test"
  ).trim().toLowerCase();
  const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";

  validatePassword(rawPassword);

  await authRepository.ensureAdminExists({
    firstName: "Admin",
    lastName: "User",
    email,
    rawPassword,
    role: "admin",
  });
};
