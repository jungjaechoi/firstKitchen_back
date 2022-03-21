import express from "express";
import {
  getLogin, postLogin, getHome, getNavibar
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/").get(getLogin).post(postLogin);
userRouter.route("/home").get(getHome);
userRouter.get('/navibar',getNavibar)

export default userRouter;
