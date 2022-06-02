import express from "express";
import {
    postAuthorizationMsg
} from "../controllers/loginController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const loginRouter = express.Router();

loginRouter.post('/postAuthorizationMsg',postAuthorizationMsg);


export default loginRouter;
