import { Agent, Store, Delivery, Order, ProductUnit, ProductSet, ProductOption, OpenRecord } from "../../models";
import jwt from 'jsonwebtoken';
import {secretKey} from "../../config/secretkey.js"
import axios from "axios";
import db from "../../models";
const Sequelize = require('sequelize');

export const getSalesCalendar = async(req,res) => {
    return res.render("statistic/salescalendar.html");
}

export const getEarningAnalysis = async(req,res) => {
    return res.render("statistic/earninganalysis.html");
}

export const getConsumerAnalysis = async(req,res) => {
    return res.render("statistic/consumeranalysis.html");
}

export const getItemAnalysis = async(req,res) => {
    return res.render("statistic/itemanalysis.html");
}

export const getSalesAnalysis = async(req,res) => {
    return res.render("statistic/salesanalysis.html");
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
    let {start,end} = req.query;
    const Op = Sequelize.Op
    start = new Date(start + "T00:00:00");
    end = new Date(end + "T23:59:59");

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

export const getEarningAnalysisData = async (req,res) => {

    const store_id = res.locals.store_id;
    let {start,end} = req.query;
    const Op = Sequelize.Op
    console.log(start);
    start = new Date(start + "T00:00:00");
    end = new Date(end + "T23:59:59");
    
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
        
        return res.json({delivery});
    }
    catch(err){
        console.log("Error on getEarningAnalysisData" + err)
        res.send("error");
    }
}

export const getConsumerRank = async (req,res) => {
    const store_id = res.locals.store_id;
    let {start,end} = req.query;
    const Op = Sequelize.Op
    start = new Date(start + "T00:00:00");
    end = new Date(end + "T23:59:59");
    try{

        const delivery = await Delivery.findAll({
            attributes: ['tel', [Sequelize.fn('sum', (Sequelize.col('totalPaidPrice'))), 'paid'],[Sequelize.fn('count', Sequelize.col('tel')), 'visitedNum']],
            group: ['user_id'],
            where: {
                store_id,
                [Op.and]: [
                    {createdAt: {[Op.lte]: end}},
                    {createdAt: {[Op.gte]: start}},
                    {status: {[Op.not]: 4}},
                    {status: {[Op.not]: 5}},
                  ]   
            },
            order: [
                [Sequelize.fn('sum', Sequelize.col('totalPaidPrice')), 'DESC']
              ],
            limit: 10
        })

        return res.json({delivery});
    }
    catch(err){
        console.log("Error on getConsumerRank" + err)
        res.send("error");
    }
}

export const getConsumerData = async (req,res) => {

    const store_id = res.locals.store_id;
    const Op = Sequelize.Op
    
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var month = date.getFullYear() + '-' + Number(date.getMonth()+1) + '-' + 1;

    try{
        const accumNum = await Delivery.findAll({
            attributes: [[Sequelize.fn('count', Sequelize.col('tel')), 'visitedNum']],
            group: ['user_id'],
            where: {
                store_id,
            }
        });

        const monthNum = await Delivery.findAll({
            attributes: [[Sequelize.fn('count', Sequelize.col('tel')), 'visitedNum']],
            group: ['user_id'],
            where: {
                store_id,
                [Op.and]: [
                    {createdAt: {[Op.lte]: lastDay}},
                    {createdAt: {[Op.gte]: firstDay}},
                  ]   
            }
        });

        const query = `select count(distinct user_id) as newConNum from deliveries where store_id = ${store_id} and user_id not in (select distinct user_id from deliveries where createdAt < '${month}'and store_id=${store_id});`
        let monthNewConNum = await db.sequelize.query(query);

        return res.json({accumNum, monthNum, monthNewConNum});

    }
    catch(err){
        console.log("Error on getConsumerData" + err)
        res.send("error");
    }
}

export const getItemRank = async (req,res) => {
    const store_id = res.locals.store_id;
    let {start,end} = req.query;
    const Op = Sequelize.Op
    start = new Date(start + "T00:00:00");
    end = new Date(end + "T23:59:59");

    try{
        
        const delivery = await Delivery.findAll({
            attributes: [[Sequelize.fn('sum', (Sequelize.col('Orders.quantity'))), 'quantity']],
            include: [
                { 
                    model: Order, 
                    as: "Orders", 
                    attributes: ["quantity"],
                    include: [
                        {model: ProductUnit, as: "ProductUnit"}
                    ]
                },
            ],
            group: ['name'],
            where: {
                store_id,
                [Op.and]: [
                    {createdAt: {[Op.lte]: end}},
                    {createdAt: {[Op.gte]: start}},
                    {status: {[Op.not]: 4}},
                    {status: {[Op.not]: 5}},
                  ]   
            },
            order: [
                [Sequelize.fn('sum', Sequelize.col('Orders.quantity')), 'DESC']
              ],
        })
        
        return res.json({delivery});
    }
    catch(err){
        console.log("Error on getItemRank" + err)
        res.send("error");
    }
}

export const getSalesAnalysisData = async(req,res) => {

    const store_id = res.locals.store_id;
    let {start,end} = req.query;
    const Op = Sequelize.Op
    start = new Date(start + "T00:00:00");
    end = new Date(end + "T23:59:59");

    try{

        const delivery = await Delivery.findAll({
            attributes: ['totalPaidPrice','createdAt'],
            where:{
              store_id,
              [Op.and]: [
                {createdAt: {[Op.lte]: end}},
                {createdAt: {[Op.gte]: start}}
              ]
            }
        });

        let numForHour = []
        let paidForHour = []

        for(let i = 0; i < 24; i++){
            numForHour.push(0)
            paidForHour.push(0)
        }

        for(let i = 0 ; i < delivery.length ; i++){

            let hour = delivery[i].dataValues.createdAt.getHours();
        
            numForHour[hour] += 1
            paidForHour[hour] += delivery[i].dataValues.totalPaidPrice;
        }
        
        return res.json({numForHour,paidForHour});
    }
    catch(err){
        console.log("Error on getSalesAnalysisData" + err);
        res.send("error");
    }

}