import express from "express";
import {
    postAuthorizationMsg,getAuthorizatoin,login
} from "../controllers/loginController";
import {postVerifyToken,getVerifyToken} from "./middlewares/authorization.js"

const loginRouter = express.Router();

loginRouter.post('/postAuthorizationMsg',postAuthorizationMsg);
loginRouter.post('/getAuthorizatoin',getAuthorizatoin);
loginRouter.get('/login',getVerifyToken,login);


export default loginRouter;
