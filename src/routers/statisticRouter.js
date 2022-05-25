import express from "express";
import {
    getSalesCalendar,getTotalEarningByDay,getDayDeliveredList,getEarningAnalysis , getEarningAnalysisData
} from "../controllers/statisticController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const statisticRouter = express.Router();

statisticRouter.get('/salescalendar',getSalesCalendar);
statisticRouter.get('/earninganalysis',getEarningAnalysis);
statisticRouter.get('/getTotalEarningByDay',getVerifyToken,getTotalEarningByDay);
statisticRouter.get('/getDayDeliveredList',getVerifyToken,getDayDeliveredList);
statisticRouter.get('/getEarningAnalysisData',getVerifyToken,getEarningAnalysisData);

export default statisticRouter;
