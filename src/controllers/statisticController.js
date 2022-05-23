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

        const query2 = `select left(createdAt,10) as date, sum(-1*(totalPaidPrice-deliveryPrice)) as dayRefund from deliveries where store_id = ${store_id} and (status = 4 or status = 5)  group by(left(createdAt,10));`;
        let dayRefund = await db.sequelize.query(query2);

        return res.json({dayEarning,dayRefund});

    }
    catch(err){
        console.log("Error on getTotalEarningByDay" + err)
        res.send("error");
    }

}

export const getDayDeliveredList = async (req,res) => {

    const store_id = res.locals.store_id;
    const {date} = req.query;
    const Op = Sequelize.Op
    let start = new Date(date + "T00:00:00");
    let end = new Date(date + "T23:59:59");

    try{
        
        const delivery = await Delivery.findAll({
            where:{
              store_id,
              [Op.and]: [
                {createdAt: {[Op.lte]: end}},
                {createdAt: {[Op.gte]: start}}
              ]
            }
        });

        let answer = []

        for(var i = 0 ; i<delivery.length ; i++){

            const orders = await Order.findAll({
                where:{
                  delivery_id: delivery[i].dataValues.id
                }
            });
          
            var orderList = [];
        
            for (var j = 0; j<orders.length ; j++){
                if (orders[j].dataValues.productUnit_id != null){
                    var product = await ProductUnit.findOne({
                    where:{
                        id: orders[j].dataValues.productUnit_id
                    }
                    });
                    orderList.push(new Array(product.dataValues.name, orders[j].dataValues.quantity, product.dataValues.price));
                }
                else if(orders[j].dataValues.productSet_id != null){
                    var product = await ProductSet.findOne({
                    where:{
                        id: orders[j].dataValues.productSet_id
                    }
                    });
                    orderList.push(new Array(product.dataValues.name, orders[j].dataValues.quantity, product.dataValues.price));
                }
                else if(orders[j].dataValues.productOption_id != null){
                    var product = await ProductOption.findOne({
                    where:{
                        id: orders[j].dataValues.productOption_id
                    }
                    });
                    orderList.push(new Array(product.dataValues.name, orders[j].dataValues.quantity, product.dataValues.price));
                }
            }

            let temp = [delivery[i],orderList]
            answer.push(temp);

        }
        
        return res.json({answer})
    
    }
    catch(err){
        console.log("Error on getDayDeliveredList" + err)
        res.send("error");
    }

}