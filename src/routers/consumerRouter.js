import express from "express";
import {
    postDeliveryInfo,getDeliveryInfo,getAllStore, getStoreInfo, getMenuInfo, getCartMenu,
    getProceedingDelivery,getFinishedDelivery,getLikeStore
} from "../controllers/consumerController";

const consumerRouter = express.Router();

consumerRouter.post('/postDeliveryInfo', postDeliveryInfo)
consumerRouter.get('/getDeliveryInfo', getDeliveryInfo)
consumerRouter.get('/getAllStore', getAllStore)
consumerRouter.get('/getStoreInfo', getStoreInfo)
consumerRouter.get('/getMenuInfo',getMenuInfo);
consumerRouter.get('/getCartMenu',getCartMenu);
consumerRouter.get('/getProceedingDelivery',getProceedingDelivery);
consumerRouter.get('/getFinishedDelivery',getFinishedDelivery);
consumerRouter.get('/getLikeStore',getLikeStore);

export default consumerRouter;
