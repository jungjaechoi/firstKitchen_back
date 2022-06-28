import express from "express";
import { verify } from "jsonwebtoken";
import { getDeliveryInfo } from "../controllers/consumerController";
import {
  getLogin, getHome, getNavibar,getEarning, getDeliveryStatus,changeStatus
  ,getEarningForDeliveryApp,getRealtimesales, getPaymenthistory,
  getPaymentList,getDeliveryById, postRefund, postDelete, getStartend, isOpen, open, close, getOpenRecords, getSetting,
  setAutoEndTime,getAutoEndTime,autoEndStore, getAllAutoEndTime
} from "../controllers/userController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const userRouter = express.Router();

userRouter.get("/", getLogin);
userRouter.get("/home", getHome);
userRouter.get('/navibar',getNavibar);
userRouter.get('/realtimesales',getRealtimesales);
userRouter.get('/paymenthistory',getPaymenthistory);
userRouter.get('/startend',getStartend);
userRouter.get('/settings',getSetting);
userRouter.get('/getEarning',getVerifyToken,getEarning);
userRouter.get('/getDeliveryStatus',getVerifyToken,getDeliveryStatus);
userRouter.post('/changeStatus',postVerifyToken,changeStatus);
userRouter.get('/getEarningForDeliveryApp',getVerifyToken,getEarningForDeliveryApp);
userRouter.get('/getPaymentList',getVerifyToken,getPaymentList);
userRouter.get('/getDeliveryById',getVerifyToken,getDeliveryById);
userRouter.post('/refund',postVerifyToken,postRefund);
userRouter.post('/delete',postVerifyToken,postDelete);
userRouter.post('/open',postVerifyToken,open);
userRouter.post('/close',postVerifyToken,close);
userRouter.get('/isOpen',getVerifyToken,isOpen);
userRouter.get('/getOpenRecords',getVerifyToken,getOpenRecords);
userRouter.post('/setAutoEndTime',postVerifyToken,setAutoEndTime);
userRouter.get('/getAutoEndTime',getVerifyToken,getAutoEndTime);
userRouter.post('/autoEndStore',autoEndStore);
userRouter.get('/getAllAutoEndTime',getAllAutoEndTime);

export default userRouter;
