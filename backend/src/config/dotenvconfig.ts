import dotenv from "dotenv";
import fs from "fs";

const preferredPath =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({
  path: fs.existsSync(preferredPath) ? preferredPath : ".env",
});
