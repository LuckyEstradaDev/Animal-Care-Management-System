export interface IUserInterface {
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "other";
  profilePicture?: string;
  email: string;
  rawPassword: string;
  phoneNumber?: string;
  role: "pet_owner" | "admin";
}

export interface IUserLoginInterface {
  email: string;
  rawPassword: string;
}
