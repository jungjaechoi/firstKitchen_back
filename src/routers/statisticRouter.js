import express from "express";
import {
    getSalesCalendar,getTotalEarningByDay,getDayDeliveredList,getEarningAnalysis , getEarningAnalysisData,
    getConsumerAnalysis, getConsumerRank,getConsumerData
} from "../controllers/statisticController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const statisticRouter = express.Router();

statisticRouter.get('/salescalendar',getSalesCalendar);
statisticRouter.get('/earninganalysis',getEarningAnalysis);
statisticRouter.get('/consumeranalysis',getConsumerAnalysis);
statisticRouter.get('/getTotalEarningByDay',getVerifyToken,getTotalEarningByDay);
statisticRouter.get('/getDayDeliveredList',getVerifyToken,getDayDeliveredList);
statisticRouter.get('/getEarningAnalysisData',getVerifyToken,getEarningAnalysisData);
statisticRouter.get('/getConsumerRank',getVerifyToken,getConsumerRank);
statisticRouter.get('/getConsumerData',getVerifyToken,getConsumerData);

export default statisticRouter;
