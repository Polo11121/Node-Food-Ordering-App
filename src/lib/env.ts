import { cleanEnv, str } from "envalid";
import "dotenv/config";

export const env = cleanEnv(process.env, {
  MONGODB_CONNECTION_STRING: str(),
  AUTH0_AUDIENCE: str(),
  AUTH0_ISSUER_BASE_URL: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  STRIPE_API_KEY: str(),
  FRONTEND_URL: str(),
});
