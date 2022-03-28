import { Agent, Store, Delivery_completed, Delivery_proceeding, Order_proceeding, ProductUnit, ProductSet, ProductOption } from "../../models";
import jwt from 'jsonwebtoken';
import {secretKey} from "../../config/secretkey.js"

export const getLogin = (req, res) => {
  return res.render("login/login.html");
};

export const getHome = (req,res) => {
  return res.render("home/home.html");
}
 
export const getNavibar = (req,res) => {
  return res.render("navibar.html");
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
    const delivery = await Delivery_completed.findAll({
      where:{
        store_id
      }
    })
    var earning = 0
    for (var i = 0; i<delivery.length ; i++){
      earning += delivery[i].dataValues.totalPrice - delivery[i].dataValues.discountPrice; 
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
    console.log(result_arr);
    const result = JSON.stringify(result_arr)
    return res.json({result});

  }catch(err){
    console.log("Error on inquiring DeliveryStatus: " + err)
    return res.send("error")
  }

}