import express from "express";
import {
    postDeliveryInfo,getDeliveryInfo,getAllStore
} from "../controllers/consumerController";

const consumerRouter = express.Router();

consumerRouter.post('/postDeliveryInfo', postDeliveryInfo)
consumerRouter.post('/getDeliveryInfo', getDeliveryInfo)
consumerRouter.post('/getAllStore', getAllStore)

export default consumerRouter;
