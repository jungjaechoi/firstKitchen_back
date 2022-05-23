import express from "express";
import {
    getSalesCalendar,getTotalEarningByDay,getDayDeliveredList
} from "../controllers/statisticController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const statisticRouter = express.Router();

statisticRouter.get('/salescalendar',getSalesCalendar);
statisticRouter.get('/getTotalEarningByDay',getVerifyToken,getTotalEarningByDay);
statisticRouter.get('/getDayDeliveredList',getVerifyToken,getDayDeliveredList)

export default statisticRouter;
