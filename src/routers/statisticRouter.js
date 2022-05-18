import express from "express";
import {
    getSalesCalendar
} from "../controllers/statisticController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const statisticRouter = express.Router();

statisticRouter.get('/salescalendar',getVerifyToken,getSalesCalendar);

export default statisticRouter;
