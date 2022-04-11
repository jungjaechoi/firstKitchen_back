import { Agent, Store,Delivery, Order, ProductUnit, ProductSet, ProductOption, OpenRecord } from "../../models";
import jwt from 'jsonwebtoken';
import {secretKey} from "../../config/secretkey.js"
import axios from "axios";
const Sequelize = require('sequelize');
const deliveryApp_IP = "http://192.168.100.65:4000";


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

export const getPaymenthistory = (req,res) => {
  return res.render("home/paymenthistory.html");
}

export const getStartend = (req,res) => {
  return res.render("home/startend.html");
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
      console.log('error on postLogin' + err)
      return res.json({token,err})
    }
  
}


export const getEarning = async(req,res) => {
  const store_id = res.locals.store_id

  try{

    const delivery = await Delivery.findAll({
      where:{
        store_id
      }
    })

    var earning = 0

    for (var i = 0; i<delivery.length ; i++){
      if(delivery[i].dataValues.status != 4 && delivery[i].dataValues.status != 5){
        earning += delivery[i].dataValues.totalPrice - delivery[i].dataValues.discountPrice;
      } 
    }

    console.log("user inquire earningInfo", earning);
    return res.json({earning})

  } catch(err){
    
    console.log("Error on getEarning " + err)
    return res.send("error")

  }
}


export const getDeliveryStatus = async(req,res) => {
  
  const store_id = res.locals.store_id;

  try{
    var delivery = await Delivery.findAll({
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

      var orders = await Order.findAll({
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
      else if(delivery[i].dataValues.status == 2){
        completed.push(temp_arr);
      }
    }

    const result_arr = new Array(wait, receipt, completed);
    
    const result = JSON.stringify(result_arr)
    return res.json({result});

  }catch(err){
    console.log("Error on getDeliveryStatus" + err)
    return res.send("error")
  }
}

export const changeStatus = async(req,res) => {
  
  const {delivery_id} = req.body;
  try{

    const delivery = await Delivery.findOne({
      where:{
        id:delivery_id
      }
    })
    
    var status = delivery.dataValues.status;

    if(status == 0){

      var sendingParams = {"delivery_id": delivery_id,"status":1}

      axios
      .post(`${deliveryApp_IP}/user/status`, {
        data: sendingParams,
      })

      await delivery.update({status:1});

      return res.send("success");

    }
    else if(status == 1){

      var sendingParams = {"delivery_id": delivery_id,"status":2}

      axios
      .post(`${deliveryApp_IP}/user/status`, {
        data: sendingParams,
      })

      await delivery.update({status:2});

      return res.send("success");
    
    }
    else if(status == 2){

      await delivery.update({status:3});

      return res.send("success");
    }
  }
  catch(err){
    console.log("Error on changeStatus" + err)
    res.send("error");
  }

}

export const getEarningForDeliveryApp = async(req,res) => {
  
  const store_id = res.locals.store_id;

  try{

    const deliverys = await Delivery.findAll({
      where:{
        store_id
      }
    });
    
    var kind_app = new Set();

    for(var i = 0; i < deliverys.length ; i++){
      kind_app.add(deliverys[i].dataValues.deliveryApp)
    }

    kind_app = Array.from(kind_app)
    var count_earning_dict = {}

    for(var i = 0; i < kind_app.length; i++){
      count_earning_dict[kind_app[i]] = [0,0]
    }

    for(var i = 0; i < deliverys.length ; i++){
      if (deliverys[i].dataValues.status != 2){
        count_earning_dict[deliverys[i].dataValues.deliveryApp][0] += 1;
        count_earning_dict[deliverys[i].dataValues.deliveryApp][1] += deliverys[i].dataValues.totalPrice - deliverys[i].dataValues.discountPrice 
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
    console.log("Error on getEarningForDeliveryApp" + err)
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

    const paymentList = await Delivery.findAll({
      where:{
        store_id,
        [Op.and]: [
          {createdAt: {[Op.lte]: end}},
          {createdAt: {[Op.gte]: start}}
        ]
      }
    });

    return res.json({paymentList});

  }
  catch(err){
    console.log("Error on getPaymentList" + err)
    res.send("error");
  }

}

export const getDeliveryById = async(req,res) => {
  var {delivery_id} = req.body;
  
  try{
    
    const delivery = await Delivery.findOne({
      where:{
        id:delivery_id
      }
    })
    
    const orders = await Order.findAll({
      where:{
        delivery_id
      }
    })

    var orderList = new Array();

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
    
    return res.json({delivery,orderList})
  
  }
  catch(err){
    console.log("Error on getDeliveryById" + err)
    res.send("error");
  }

}

export const postRefund = async (req,res) => {
  var {delivery_id} = req.body;

  try{

    const delivery = await Delivery.findOne({
      where:{
        id:delivery_id
      }
    });

    var sendingParams = {"delivery_id": delivery_id,"status":4}

    axios
    .post(`${deliveryApp_IP}/user/status`, {
      data: sendingParams,
    })

    await delivery.update({status:4});

    return res.json({delivery_id});

  }catch(err){

    console.log("Error on refund: " + err)
    res.send("error");

  }

}

export const postDelete = async(req,res) => {
  var {delivery_id} = req.body;
  try{
    const delivery = await Delivery.findOne({
      where:{
        id: delivery_id
      }
    })
    await delivery.update({status:5});
    return res.send("success");

  }
  catch(err){
    console.log("Error on delete: " + err)
    res.send("error");
  }
}

export const start = async (req,res) =>{

  const store_id = res.locals.store_id

  try{

    const store = await Store.fidnOne({
      where:{
        id: store_id
      }
    })

    await delivery.update({isOpen:1});

    let today = new Date(); 

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let dates = today.getDate();  // 날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초

    const start_time = year + " " + month + " " + dates + " " + hours + " " + minutes + " " + seconds

    await OpenRecord.create({
      store_id,
      start_time
    })

    return res.send("success");
    
  }
  catch(err){
    console.log("Error on start: " + err)
    res.send("error");
  }

}