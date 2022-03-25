import express from "express";
import {
  getLogin, postLogin, getHome, getNavibar,getEarning
} from "../controllers/userController";
import {verifyToken} from "./middlewares/authorization.js"

const userRouter = express.Router();

userRouter.route("/").get(getLogin).post(postLogin);
userRouter.route("/home").get(getHome);
userRouter.get('/navibar',getNavibar);
userRouter.post('/getEarning',verifyToken,getEarning);

export default userRouter;
