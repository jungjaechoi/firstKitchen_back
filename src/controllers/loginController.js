import { Agent, Store, Delivery, Order, ProductUnit, ProductSet, ProductOption, OpenRecord } from "../../models";
import jwt from 'jsonwebtoken';
import {secretKey} from "../../config/secretkey.js"
import axios from "axios";
import db from "../../models";
const Sequelize = require('sequelize');

// sms로 인증번호 보냄
export const postAuthorizationMsg = async(req,res) => {

    const {mobile} = req.body;
    const client = req.cache;

    try{
        const tel = mobile.substr(0,3) + '-' + mobile.substr(3,4) + '-' + mobile.substr(7,4);

        const exists =await Agent.findOne({
            where: {tel}
        });
        
        if(exists!=null){
            const rand = Math.ceil(Math.random()*1000000)

            const result = await axios
                .post("http://163.152.3.50:21000/sendSMS", 
                {
                    msg: `[FirstKitchen] 인증번호 [${rand}]를 입력해 주세요.`,
                    mobile: mobile
                });
            
            await client.set(mobile, rand);

            console.log(mobile+', 인증번호: '+ rand);

            if(result.status = 200){
                return res.send("success");
            }
            else{
                return res.send('error on 24cafe');
            }
            
        }
        else{
            return res.send("notJoined");
        } 
    }
    catch(err){
        console.log("Error on postAuthorizationMsg: " + err)
        return res.send("error")
    }
    
}

// 인증번호 비교 후 맞으면 jwt 토큰 발급
export const getAuthorizatoin = async(req,res)=> {

    const {mobile,authNum} = req.body;
    const client = req.cache;

    try{
        const value = await client.get(mobile);
        
        const tel = mobile.substr(0,3) + '-' + mobile.substr(3,4) + '-' + mobile.substr(7,4);

        if(value == authNum){

            const agent =await Agent.findOne({
                where: {tel}
            });
              
            const store = await Store.findOne({
                where: {
                agent_id: agent.dataValues.id
                }
            });

            const token = String(jwt.sign({
                    store_id : store.dataValues.id,
                    agent_id : agent.dataValues.id
                }, secretKey,{
                    expiresIn : '1h'
            }));
        
            const storeName = store.dataValues.storeName;
        
            return res.json({token, storeName});
        }
        else{
            if(value==null){
                return res.json({token:"sessionEnd"});
            }
            return res.json({token:"fail"});
        }

    }
    catch(err){
        console.log("Error on getAuthorizatoin: " + err)
        return res.send("error")
    }
}

// 토큰 인증 후 통과되면 login 처리
export const login = async(req,res) => {
    return res.send("success");
}
