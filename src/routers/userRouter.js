import express from "express";
import {
  getLogin, postLogin
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/").get(getLogin).post(postLogin);

export default userRouter;
