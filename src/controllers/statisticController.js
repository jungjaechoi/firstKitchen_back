import { Agent, Store, Delivery, Order, ProductUnit, ProductSet, ProductOption, OpenRecord } from "../../models";
import jwt from 'jsonwebtoken';
import {secretKey} from "../../config/secretkey.js"
import axios from "axios";
import db from "../../models";
const Sequelize = require('sequelize');

export const getSalesCalendar = async(req,res) => {

    return res.render("statistic/salescalendar.html");

}

export const getTotalEarningByDay = async(req,res) => {

    const store_id = res.locals.store_id

    try{

        const query1 = `select left(createdAt,10) as date, sum(totalPaidPrice) as dayEarning from deliveries where store_id = ${store_id} and (status = 0 or status = 1 or status = 2 or status = 3)  group by(left(createdAt,10));`;
        let dayEarning = await db.sequelize.query(query1);

        const query2 = `select left(createdAt,10) as date, sum(totalPaidPrice-deliveryPrice) as dayRefund from deliveries where store_id = ${store_id} and (status = 4 or status = 5)  group by(left(createdAt,10));`;
        let dayRefund = await db.sequelize.query(query2);

        return res.json({dayEarning,dayRefund});

    }
    catch(err){

    }

}