import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { User } from "../models/user";
import { env } from "../lib/env";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

export const jwtCheck = auth({
  audience: env.AUTH0_AUDIENCE,
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decodedToken.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
  } catch (error) {
    console.log(error);
    return res.status(401).send("Unauthorized");
  }
  next();
};
