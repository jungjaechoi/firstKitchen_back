import express from "express";
import {
    postDeliveryInfo,getDeliveryInfo,getAllStore, getStoreInfo, getMenuInfo, getCartMenu,
    getProceedingDelivery,getFinishedDelivery
} from "../controllers/consumerController";

const consumerRouter = express.Router();

consumerRouter.post('/postDeliveryInfo', postDeliveryInfo)
consumerRouter.post('/getDeliveryInfo', getDeliveryInfo)
consumerRouter.post('/getAllStore', getAllStore)
consumerRouter.post('/getStoreInfo', getStoreInfo)
consumerRouter.post('/getMenuInfo',getMenuInfo);
consumerRouter.post('/getCartMenu',getCartMenu);
consumerRouter.post('/getProceedingDelivery',getProceedingDelivery);
consumerRouter.get('/getFinishedDelivery',getFinishedDelivery);

export default consumerRouter;
