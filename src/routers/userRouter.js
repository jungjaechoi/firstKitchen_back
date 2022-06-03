import express from "express";
import { verify } from "jsonwebtoken";
import { getDeliveryInfo } from "../controllers/consumerController";
import {
  getLogin, postLogin, getHome, getNavibar,getEarning, getDeliveryStatus,changeStatus
  ,getEarningForDeliveryApp,getRealtimesales, getPaymenthistory,
  getPaymentList,getDeliveryById, postRefund, postDelete, getStartend, isOpen, open, close, getOpenRecords, getSetting,
  setAutoEndTime,getAutoEndTime,autoEndStore, getAllAutoEndTime
} from "../controllers/userController";
import {postVerifyToken} from "./middlewares/authorization.js"

const userRouter = express.Router();

userRouter.route("/").get(getLogin);
userRouter.route("/home").get(getHome);
userRouter.get('/navibar',getNavibar);
userRouter.get('/realtimesales',getRealtimesales);
userRouter.get('/paymenthistory',getPaymenthistory);
userRouter.get('/startend',getStartend);
userRouter.get('/settings',getSetting);
userRouter.post('/getEarning',postVerifyToken,getEarning);
userRouter.post('/getDeliveryStatus',postVerifyToken,getDeliveryStatus);
userRouter.post('/changeStatus',postVerifyToken,changeStatus);
userRouter.post('/getEarningForDeliveryApp',postVerifyToken,getEarningForDeliveryApp);
userRouter.post('/getPaymentList',postVerifyToken,getPaymentList);
userRouter.post('/getDeliveryById',postVerifyToken,getDeliveryById);
userRouter.post('/refund',postVerifyToken,postRefund);
userRouter.post('/delete',postVerifyToken,postDelete);
userRouter.post('/open',postVerifyToken,open);
userRouter.post('/close',postVerifyToken,close);
userRouter.post('/isOpen',postVerifyToken,isOpen);
userRouter.post('/getOpenRecords',postVerifyToken,getOpenRecords);
userRouter.post('/setAutoEndTime',postVerifyToken,setAutoEndTime);
userRouter.post('/getAutoEndTime',postVerifyToken,getAutoEndTime);
userRouter.post('/autoEndStore',autoEndStore);
userRouter.get('/getAllAutoEndTime',getAllAutoEndTime);

export default userRouter;
