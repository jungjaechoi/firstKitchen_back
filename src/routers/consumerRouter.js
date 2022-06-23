import express from "express";
import {
    postDeliveryInfo,getDeliveryInfo,getAllStore, getStoreInfo, getMenuInfo, getCartMenu,
    getProceedingDelivery,getFinishedDelivery,getLikeStore
} from "../controllers/consumerController";

const consumerRouter = express.Router();

consumerRouter.post('/postDeliveryInfo', postDeliveryInfo)
consumerRouter.get('/getDeliveryInfo', getDeliveryInfo)
consumerRouter.post('/getAllStore', getAllStore)
consumerRouter.post('/getStoreInfo', getStoreInfo)
consumerRouter.post('/getMenuInfo',getMenuInfo);
consumerRouter.post('/getCartMenu',getCartMenu);
consumerRouter.post('/getProceedingDelivery',getProceedingDelivery);
consumerRouter.get('/getFinishedDelivery',getFinishedDelivery);
consumerRouter.get('/getLikeStore',getLikeStore);

export default consumerRouter;
