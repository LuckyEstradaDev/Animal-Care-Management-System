import {UserModel} from "../models/UserModel.js";
import {HTTPError} from "../utils/HttpError.js";

export const FetchUserById = async (id: string) => {
  const user = await UserModel.findOne({_id: id});
  if (!user) throw new HTTPError("User does not exist", 404);
  return {user};
};
