import { cleanEnv, str } from "envalid";
import "dotenv/config";

export const env = cleanEnv(process.env, {
  MONGODB_CONNECTION_STRING: str(),
  AUTH0_AUDIENCE: str(),
  AUTH0_ISSUER_BASE_URL: str(),
});
