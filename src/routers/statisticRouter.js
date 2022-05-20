import express from "express";
import {
    getSalesCalendar,getTotalEarningByDay
} from "../controllers/statisticController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const statisticRouter = express.Router();

statisticRouter.get('/salescalendar',getSalesCalendar);
statisticRouter.get('/getTotalEarningByDay',getVerifyToken,getTotalEarningByDay);

export default statisticRouter;
