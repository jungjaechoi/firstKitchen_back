import express from "express";
import {
    getSalesCalendar,getTotalEarningByDay,getDayDeliveredList,getEarningAnalysis , getEarningAnalysisData,
    getConsumerAnalysis, getConsumerRank,getConsumerData, getItemAnalysis,getItemRank,getSalesAnalysis,
    getSalesAnalysisData
} from "../controllers/statisticController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const statisticRouter = express.Router();

statisticRouter.get('/salescalendar',getSalesCalendar);
statisticRouter.get('/earninganalysis',getEarningAnalysis);
statisticRouter.get('/consumeranalysis',getConsumerAnalysis);
statisticRouter.get('/itemanalysis',getItemAnalysis);
statisticRouter.get('/salesanalysis',getSalesAnalysis);
statisticRouter.get('/getTotalEarningByDay',getVerifyToken,getTotalEarningByDay);
statisticRouter.get('/getDayDeliveredList',getVerifyToken,getDayDeliveredList);
statisticRouter.get('/getEarningAnalysisData',getVerifyToken,getEarningAnalysisData);
statisticRouter.get('/getConsumerRank',getVerifyToken,getConsumerRank);
statisticRouter.get('/getConsumerData',getVerifyToken,getConsumerData);
statisticRouter.get('/getItemRank',getVerifyToken,getItemRank);
statisticRouter.get('/getSalesAnalysisData',getVerifyToken,getSalesAnalysisData);

export default statisticRouter;
