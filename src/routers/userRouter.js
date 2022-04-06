import express from "express";
import { getDeliveryInfo } from "../controllers/consumerController";
import {
  getLogin, postLogin, getHome, getNavibar,getEarning, getDeliveryStatus,changeStatus
  ,getEarningForDeliveryApp,getRealtimesales,getSaleslist, getPaymenthistory,
  getPaymentList,getDeliveryById
} from "../controllers/userController";
import {verifyToken} from "./middlewares/authorization.js"

const userRouter = express.Router();

userRouter.route("/").get(getLogin).post(postLogin);
userRouter.route("/home").get(getHome);
userRouter.get('/navibar',getNavibar);
userRouter.get('/realtimesales',getRealtimesales);
userRouter.get('/saleslist',getSaleslist);
userRouter.get('/paymenthistory',getPaymenthistory);
userRouter.post('/getEarning',verifyToken,getEarning);
userRouter.post('/getDeliveryStatus',verifyToken,getDeliveryStatus);
userRouter.post('/changeStatus',verifyToken,changeStatus);
userRouter.post('/getEarningForDeliveryApp',verifyToken,getEarningForDeliveryApp);
userRouter.post('/getPaymentList',verifyToken,getPaymentList)
userRouter.post('/getDeliveryById',verifyToken,getDeliveryById)


export default userRouter;
