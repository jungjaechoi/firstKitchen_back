import express from "express";
import { getDeliveryInfo } from "../controllers/consumerController";
import {
  getLogin, postLogin, getHome, getNavibar,getEarning, getDeliveryStatus,changeStatus
  ,getEarningForDeliveryApp,getRealtimesales, getPaymenthistory,
  getPaymentList,getDeliveryById, postRefund, postDelete, getStartend
} from "../controllers/userController";
import {verifyToken,getVerifyToken} from "./middlewares/authorization.js"

const userRouter = express.Router();

userRouter.route("/").get(getLogin).post(postLogin);
userRouter.route("/home").get(getHome);
userRouter.get('/navibar',getNavibar);
userRouter.get('/realtimesales',getRealtimesales);
userRouter.get('/paymenthistory',getPaymenthistory);
userRouter.get('/startend',getStartend);
userRouter.post('/getEarning',verifyToken,getEarning);
userRouter.post('/getDeliveryStatus',verifyToken,getDeliveryStatus);
userRouter.post('/changeStatus',verifyToken,changeStatus);
userRouter.post('/getEarningForDeliveryApp',verifyToken,getEarningForDeliveryApp);
userRouter.post('/getPaymentList',verifyToken,getPaymentList);
userRouter.post('/getDeliveryById',verifyToken,getDeliveryById);
userRouter.post('/refund',verifyToken,postRefund);
userRouter.post('/delete',verifyToken,postDelete);


export default userRouter;
