import express from "express";
import { getDeliveryInfo } from "../controllers/consumerController";
import {
  getLogin, postLogin, getHome, getNavibar,getEarning, getDeliveryStatus,changeStatus
} from "../controllers/userController";
import {verifyToken} from "./middlewares/authorization.js"

const userRouter = express.Router();

userRouter.route("/").get(getLogin).post(postLogin);
userRouter.route("/home").get(getHome);
userRouter.get('/navibar',getNavibar);
userRouter.post('/getEarning',verifyToken,getEarning);
userRouter.post('/getDeliveryStatus',verifyToken,getDeliveryStatus);
userRouter.post('/changeStatus',verifyToken,changeStatus);


export default userRouter;
