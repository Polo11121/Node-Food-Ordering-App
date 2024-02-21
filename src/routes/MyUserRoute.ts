import { myUserController } from "../controllers/myUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";
import express from "express";

export const myUserRoute = express.Router();

myUserRoute
  .post("/", jwtCheck, myUserController.createCurrentUser)
  .put(
    "/",
    jwtCheck,
    jwtParse,
    validateMyUserRequest,
    myUserController.updateCurrentUser
  );
