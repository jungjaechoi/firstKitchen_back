import { Agent, Store, Delivery_completed, Delivery_proceeding, Order_proceeding,Order_completed, ProductUnit, ProductSet, ProductOption } from "../../models";
import jwt from 'jsonwebtoken';
import {secretKey} from "../../config/secretkey.js"
import axios from "axios";
const Sequelize = require('sequelize');

export const getLogin = (req, res) => {
  return res.render("login/login.html");
};

export const getHome = (req,res) => {
  return res.render("home/home.html");
}
 
export const getNavibar = (req,res) => {
  return res.render("navibar.html");
}

export const getRealtimesales = (req,res) => {
  return res.render("home/realtimesales.html");
}

export const getSaleslist = (req,res) => {
  return res.render("home/saleslist.html");
}

export const getPaymenthistory = (req,res) => {
  return res.render("home/paymenthistory.html");
}

export const postLogin = async(req,res) => {

  const {tel} = req.body;
  
  try{

    const exists =await Agent.findOne({
      where: {tel}
    });

    if(exists!=null){
    
      const store = await Store.findOne({
        where: {
          agent_id: exists.dataValues.id
        }
      });
      const token = String(jwt.sign({
            store_id : store.dataValues.id,
            agent_id : exists.dataValues.id
        }, secretKey,{
            expiresIn : '1h'
        }));
  
      const storeName = store.dataValues.storeName;
  
      return res.json({token, storeName});
    }
    else{
      return res.json({token:"notJoined"});
    } 
  }catch(err){
      const token = ""
      console.log('로그인 과정에서 error 발생')
      return res.json({token,err})
    }
  
}


export const getEarning = async(req,res) => {
  const store_id = res.locals.store_id

  try{
    
    const delivery_completed = await Delivery_completed.findAll({
      where:{
        store_id
      }
    })

    const delivery_proceeding = await Delivery_proceeding.findAll({
      where:{
        store_id
      }
    })

    var earning = 0

    for (var i = 0; i<delivery_completed.length ; i++){
      if(delivery_proceeding[i].dataValues.status != 3){
        earning += delivery_completed[i].dataValues.totalPrice - delivery_completed[i].dataValues.discountPrice; 
      }
    }

    for (var i = 0; i<delivery_proceeding.length ; i++){
      if(delivery_proceeding[i].dataValues.status != 2 && delivery_proceeding[i].dataValues.status != 3){
        earning += delivery_proceeding[i].dataValues.totalPrice - delivery_proceeding[i].dataValues.discountPrice;
      } 
    }

    console.log("user inquire earningInfo", earning);
    return res.json({earning})

  } catch(err){
    
    console.log("Error on inquiring earningInfo: " + err)
    return res.send("error")

  }
}


export const getDeliveryStatus = async(req,res) => {
  
  const store_id = res.locals.store_id;

  try{
    var delivery = await Delivery_proceeding.findAll({
      where:{
        store_id
      }
    })
    
    var wait = new Array();
    var receipt = new Array();
    var completed = new Array();


    for (var i = 0; i<delivery.length ; i++){
      
      var temp_arr = new Array();
      temp_arr.push(delivery[i].dataValues.id);

      var orders = await Order_proceeding.findAll({
        where:{
          delivery_id: delivery[i].dataValues.id
        }
      });
      
      for (var j = 0; j<orders.length ; j++){
        if (orders[j].dataValues.productUnit_id != null){
          var product = await ProductUnit.findOne({
            where:{
              id: orders[j].dataValues.productUnit_id
            }
          });
          temp_arr.push(new Array(product.dataValues.name, orders[j].dataValues.quantity));
        }
        else if(orders[j].dataValues.productSet_id != null){
          var product = await ProductSet.findOne({
            where:{
              id: orders[j].dataValues.productSet_id
            }
          });
          temp_arr.push(new Array(product.dataValues.name, orders[j].dataValues.quantity));
        }
        else if(orders[j].dataValues.productOption_id != null){
          var product = await ProductOption.findOne({
            where:{
              id: orders[j].dataValues.productOption_id
            }
          });
          temp_arr.push(new Array(product.dataValues.name, orders[j].dataValues.quantity));
        }
      }
      
      if (delivery[i].dataValues.status == 0){
        wait.push(temp_arr);
      }
      else if(delivery[i].dataValues.status == 1){
        receipt.push(temp_arr);
      }
      else{
        completed.push(temp_arr);
      }
    }

    const result_arr = new Array(wait, receipt, completed);
    
    const result = JSON.stringify(result_arr)
    console.log(result)
    return res.json({result});

  }catch(err){
    console.log("Error on inquiring DeliveryStatus: " + err)
    return res.send("error")
  }
}

export const changeStatus = async(req,res) => {
  
  const {delivery_id} = req.body;
  try{

    const delivery = await Delivery_proceeding.findOne({
      where:{
        id:delivery_id
      }
    })
    
    var status = delivery.dataValues.status;

    if(status == 0){

      var sendingParams = {"delivery_id": delivery_id,"status":1}

      axios
      .post(`http://192.168.100.60:4000/user/status`, {
        data: sendingParams,
      })

      Delivery_proceeding.update(
        {status: 1},
        {where: {id: delivery_id}, returning: true}).then(function(result) {
             res.send("success");
        }).catch(function(err) {
          console.log("Error on changing Status: " + err)
            res.send("error");
        });

    }
    else if(status == 1){

      const delivery_completed = await Delivery_completed.create({
        store_id : delivery.dataValues.store_id,
        user_id: delivery.dataValues.user_id ,
        user_nickname: delivery.dataValues.user_nickname,
        deliveryApp: delivery.dataValues.deliveryApp,
        receptionType: delivery.dataValues.receptionType,
        orderTime: delivery.dataValues.orderTime,
        jibunAddress: delivery.dataValues.jibunAddress,
        roadAddress: delivery.dataValues.roadAddress,
        addressDetail: delivery.dataValues.addressDetail,
        memo: delivery.dataValues.memo,
        request: delivery.dataValues.request,
        tel: delivery.dataValues.tel,
        payType: delivery.dataValues.payType,
        totalPaidPrice: delivery.dataValues.totalPaidPrice,
        totalPrice: delivery.dataValues.totalPrice,
        discountPrice: delivery.dataValues.discountPrice,
        deliveryPrice: delivery.dataValues.deliveryPrice,
        status: 2
    });

    var sendingParams = {"delivery_id": delivery_id,"status":2}

    axios
    .post(`http://192.168.100.60:4000/user/status`, {
      data: sendingParams,
    })

    console.log(delivery_completed + " is saved.")

    const orders = await Order_proceeding.findAll({
      where:{
        delivery_id
      }
    })

    for (var i = 0; i<orders.length ; i++){
      const order = await Order_completed.create({
          delivery_id: delivery_completed.dataValues.id,
          productUnit_id:orders[i].dataValues.productUnit_id,
          productSet_id:orders[i].dataValues.productSet_id,
          productOption_id:orders[i].dataValues.productOption_id,
          quantity: orders[i].dataValues.quantity
      })
      console.log(order.id + " is saved")
    }

    Delivery_proceeding.update(
      {status: 2},
      {where: {id: delivery_id}, returning: true}).then(function(result) {
           res.send("success");
      }).catch(function(err) {
        console.log("Error on changing Status: " + err)
          res.send("error");
      });
    
    }
    else if(status == 2){
      await Delivery_proceeding.destroy({where: {id:delivery_id}});
      return res.send("success");
    }
  }
  catch(err){
    console.log("Error on changing Status: " + err)
    res.send("error");
  }

}

export const getEarningForDeliveryApp = async(req,res) => {
  
  const store_id = res.locals.store_id;

  try{
    
    const delivery_completeds = await Delivery_completed.findAll({
      where:{
        store_id
      }
    });
    const delivery_proceedings = await Delivery_proceeding.findAll({
      where:{
        store_id
      }
    });
    
    var kind_app = new Set();

    for(var i = 0; i < delivery_completeds.length ; i++){
      kind_app.add(delivery_completeds[i].dataValues.deliveryApp)
    }
    for(var i = 0; i < delivery_proceedings.length ; i++){
      kind_app.add(delivery_proceedings[i].dataValues.deliveryApp)
    }

    kind_app = Array.from(kind_app)
    var count_earning_dict = {}

    for(var i = 0; i < kind_app.length; i++){
      count_earning_dict[kind_app[i]] = [0,0]
    }

    for(var i = 0; i < delivery_completeds.length ; i++){
      if (delivery_proceedings[i].dataValues.status != 3){
        count_earning_dict[delivery_completeds[i].dataValues.deliveryApp][0] += 1;
        count_earning_dict[delivery_completeds[i].dataValues.deliveryApp][1] += delivery_completeds[i].dataValues.totalPaidPrice
      }
    }
    for(var i = 0; i < delivery_proceedings.length ; i++){
      if (delivery_proceedings[i].dataValues.status != 2 && delivery_proceedings[i].dataValues.status != 3){
        count_earning_dict[delivery_proceedings[i].dataValues.deliveryApp][0] += 1;
        count_earning_dict[delivery_proceedings[i].dataValues.deliveryApp][1] += delivery_proceedings[i].dataValues.totalPaidPrice
      }
    }

    var earning = new Array();

    for(var key in count_earning_dict){
      earning.push([key,count_earning_dict[key][0],count_earning_dict[key][1]])
    }
    earning = JSON.stringify(earning);
    return res.json({earning});
  }
  catch(err){
    console.log("Error on inquiring Earing for App: " + err)
    res.send("error");
  }
}

export const getPaymentList = async(req,res) =>{
  
  const Op = Sequelize.Op

  const store_id = res.locals.store_id;
  var {start,end} = req.body;
  start = new Date(start);
  end = new Date(end);

  try{
    var paymentList = new Array();
    
    var completed_payment = await Delivery_completed.findAll({
      where:{
        store_id,
        [Op.and]: [
          {createdAt: {[Op.lte]: end}},
          {createdAt: {[Op.gte]: start}}
        ]
      }
    });

    paymentList.push(completed_payment);

    var proceeding_payment = await Delivery_proceeding.findAll({
      where:{
        store_id,
        [Op.and]: [
          {createdAt: {[Op.lte]: end}},
          {createdAt: {[Op.gte]: start}}
        ]
      }
    });

    paymentList.push(proceeding_payment);

    return res.json({paymentList});

  }
  catch(err){
    console.log("Error on inquiring PaymentList: " + err)
    res.send("error");
  }

}