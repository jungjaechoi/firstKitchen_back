import express from "express";
import {
    postDeliveryInfo,getDeliveryInfo,getAllStore, getStoreInfo, getMenuInfo, getCartMenu
} from "../controllers/consumerController";

const consumerRouter = express.Router();

consumerRouter.post('/postDeliveryInfo', postDeliveryInfo)
consumerRouter.post('/getDeliveryInfo', getDeliveryInfo)
consumerRouter.post('/getAllStore', getAllStore)
consumerRouter.post('/getStoreInfo', getStoreInfo)
consumerRouter.post('/getMenuInfo',getMenuInfo);
consumerRouter.post('/getCartMenu',getCartMenu);

export default consumerRouter;
