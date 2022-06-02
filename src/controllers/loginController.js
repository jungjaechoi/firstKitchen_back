import { Agent, Store, Delivery, Order, ProductUnit, ProductSet, ProductOption, OpenRecord } from "../../models";
import jwt from 'jsonwebtoken';
import {secretKey} from "../../config/secretkey.js"
import axios from "axios";
import db from "../../models";
const Sequelize = require('sequelize');

export const postAuthorizationMsg = async(req,res) => {

    const {msg,mobile} = req.body;
    console.log(msg,mobile);

    try{

        const result = await axios
            .post("http://163.152.3.50:21000/sendSMS", 
            {
                msg: msg,
                mobile: mobile
            });
        console.log('-----------------------------------------------------');
        
        if(result.status = 200){
            return res.send('success');
        }
        else{
            return res.send('error on 24cafe');
        }
    }
    catch(err){
        console.log("Error on postAuthorizationMsg: " + err)
        return res.send("error")
    }
    
}

