import express from "express";
import {
    postDeliveryInfo,getDeliveryInfo,getStoreInfo
} from "../controllers/consumerController";

const consumerRouter = express.Router();

consumerRouter.post('/postDeliveryInfo', postDeliveryInfo)
consumerRouter.post('/getDeliveryInfo', getDeliveryInfo)
consumerRouter.post('/getStoreInfo', getStoreInfo)

export default consumerRouter;
