import { Order, Delivery, ProductOption, ProductUnit, ProductSet, Store } from "../../models";
import axios from "axios";
const Sequelize = require('sequelize');


const REST_API_KEY = "b513516c12938a946355be879e3dd35c";
const fullAddress = "서울특별시 안암동3가";

function kakao(){
    axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(fullAddress)}`, {
            headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
        }).then(res => {
            console.log(res.data.documents[0].address.x,res.data.documents[0].address.y);
        }).catch(function (error){
            console.log(error);
        })
}

function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) { 
    function deg2rad(deg) { 
        return deg * (Math.PI/180) 
    } 
    
    var R = 6371; // Radius of the earth in km 
    var dLat = deg2rad(lat2-lat1); // deg2rad below 
    var dLon = deg2rad(lng2-lng1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km 
    return d; 
}

export const postDeliveryInfo = async(req,res) => {
    console.log('#####################주문들어옴##########################');
    console.log(req.body);
    const {store_id,user_id,user_nickname,deliveryApp,receptionType,orderTime,
        jibunAddress,roadAddress,addressDetail,memo,request,
        tel,payType,orders} = req.body.data;
   
    var checkArr = new Array(store_id,user_id,user_nickname,deliveryApp,receptionType,orderTime,
        addressDetail,
        tel,payType,orders);
    
    var nameArr = new Array('store_id','user_id','user_nickname','deliveryApp','receptionType','orderTime',
        'addressDetail',
        'tel','payType','orders');

    for (var i = 0; i<checkArr.length ; i++){
        if(checkArr[i] == null){
            const letter = "need " + nameArr[i]
            console.log(letter);
            return res.send(letter)
        }
    }

    try{

        const store = await Store.findOne({
            where:{
                id: store_id
            }
        });

        const deliveryPrice = store.dataValues.deliveryPrice;
        const discountPrice = 0

        var totalPrice = 0
        
        for (var i = 0; i<orders.length ; i++){
            if(orders[i].menu_type == 0){
                const menu = await ProductUnit.findOne({
                    where:{
                        id: orders[i].menu_id
                    }
                });
                totalPrice += menu.dataValues.price * orders[i].quantity
            }
            else if(orders[i].menu_type == 1){
                const menu = await ProductSet.findOne({
                    where:{
                        id: orders[i].menu_id
                    }
                });
                totalPrice += menu.dataValues.price * orders[i].quantity
            }
            else if(orders[i].menu_type == 2){
                const menu = await ProductOption.findOne({
                    where:{
                        id: orders[i].menu_id
                    }
                });
                totalPrice += menu.dataValues.price * orders[i].quantity
            }
        }

        const totalPaidPrice = totalPrice - discountPrice + deliveryPrice;

        const delivery = await Delivery.create({
            store_id,user_id,user_nickname,deliveryApp,receptionType,orderTime,
            jibunAddress,roadAddress,addressDetail,memo,request,
            tel,payType,totalPaidPrice,totalPrice,
            discountPrice,deliveryPrice
        });
        

        for (var i = 0; i<orders.length ; i++){
            if(orders[i].menu_type == 0){
                const order = await Order.create({
                    delivery_id: delivery.id,
                    productUnit_id:orders[i].menu_id,
                    quantity: orders[i].quantity
                })
                
            }
        }

        const id =  delivery.id

        console.log("Insert into Delivery: " + id);
        return res.json({id})

    } catch(err){
        console.log("Error on creating: " + err)
        return res.send("error")
    }
}

export const getDeliveryInfo = async(req,res) => {

    const {id} = req.body.data;

    try{
        
        const deliveryInfo = await Delivery.findOne({
            where: {id}
        })

        return res.json({deliveryInfo})

    } catch(err){
        console.log("Error on inquiring deliveryInfo: " + err)
        return res.send("error")
    }
}

export const getAllStore = async(req,res) => {
    
    const {x,y} = req.body.data;

    try{

        const store = await Store.findAll({attributes: ['id','storeName','storeAddress','longitude','latitude','isOpen','deliveryPrice']});

        var answer = new Array();       

        for(var i = 0 ; i < store.length ; i++){
            if (getDistanceFromLatLonInKm(y,x,store[i].dataValues.latitude,store[i].dataValues.longitude) <= 5){
                answer.push(store[i])
            }
        }

        return res.json({answer});

    } catch(err){

        console.log("Error on inquiring AllStore: " + err)
        return res.send("error")

    }
}

export const getStoreInfo = async(req,res) => {
    const {store_id} = req.body.data;
    try{

        const store = await Store.findOne({
            where:{
                id:store_id
            },
            attributes:['id','storeName','storeAddress','tel','isOpen','deliveryPrice']
        });

        const productUnit = await ProductUnit.findAll({
            where:{
                store_id
            }
        });

        const productSet = await ProductSet.findAll({
            where:{
                store_id
            }
        });

        const productOption = await ProductOption.findAll({
            where:{
                store_id
            }
        });

        const result_arr = new Array(store,productUnit,productSet,productOption);
        const result = JSON.stringify(result_arr)

        return res.json({result});

    }catch(err){
        console.log("Error on inquiring StoreInfo: " + err)
        return res.send("error")
    }
}

export const getMenuInfo = async(req,res) => {
    const {store_id, menu_id,menu_type} = req.body.data;

    try{
        if(menu_type == 0){
            const menu = await ProductUnit.findOne({
                where:{
                    id: menu_id
                }
            });
            return res.json({menu});
        }
        else if(menu_type == 1){
            const menu = await ProductSet.findOne({
                where:{
                    id: menu_id
                }
            });
            return res.json({menu});
        }
        else{
            const menu = await ProductOption.findOne({
                where:{
                    id: menu_id
                }
            });
            return res.json({menu});
        }

    }catch(err){
        console.log("Error on inquiring MenuInfo: " + err)
        return res.send("error")
    }
} 

export const getCartMenu = async(req,res) => {
    var incarts = req.body.data;
    try{
        for(var i = 0; i < incarts.length ; i++){
            if(incarts[i].menu_type == 0){
                var temp_menu = await ProductUnit.findOne({
                    where:{
                        id: incarts[i].menu_id
                    }
                })
                var temp_store = await Store.findOne({
                    where:{
                        id: incarts[i].store_id
                    }
                })
    
                incarts[i].menu_name = temp_menu.dataValues.name;
                incarts[i].price = temp_menu.dataValues.price;
                incarts[i].store_name = temp_store.dataValues.storeName;
    
            }
            else if(incarts[i].menu_type == 1){
                var temp_menu = await ProductSet.findOne({
                    where:{
                        id: incarts[i].menu_id
                    }
                })
                var temp_store = await Store.findOne({
                    where:{
                        id: incarts[i].store_id
                    }
                })
    
                incarts[i].menu_name = temp_menu.dataValues.name;
                incarts[i].price = temp_menu.dataValues.price;
                incarts[i].store_name = temp_store.dataValues.storeName;
            }
            else if(incarts[i].menu_type == 2){
                var temp_menu = await ProductOption.findOne({
                    where:{
                        id: incarts[i].menu_id
                    }
                })
                var temp_store = await Store.findOne({
                    where:{
                        id: incarts[i].store_id
                    }
                })
    
                incarts[i].menu_name = temp_menu.dataValues.name;
                incarts[i].price = temp_menu.dataValues.price;
                incarts[i].store_name = temp_store.dataValues.storeName;
            }
        }
    
        incarts = JSON.stringify(incarts);
        return res.json({incarts});
    }
    catch(err){
        console.log("Error on inquiring Cart: " + err)
        return res.send("error")
    }
}

export const getProceedingDelivery = async (req,res) => {

    const {user_id} = req.body.data;
    const Op = Sequelize.Op

    try{
        const deliveries = await Delivery.findAll({
            order:[
                ['createdAt','DESC']
            ],
            where:{
                user_id,
                status: {
                    [Op.or]: [0,1]
                }
            }
        });
        
        var result = new Array();

        for(var i = 0 ; i < deliveries.length ; i++){

            var temp_dict = {}

            const store = await Store.findOne({
                where:{
                    id: deliveries[i].dataValues.store_id
                }
            });

            temp_dict['store_name'] = store.dataValues.storeName;

            const orders = await Order.findAll({
                where:{
                    delivery_id: deliveries[i].dataValues.id
                }
            });

            var orderList = new Array();
            var total_price = 0

            for (var j = 0; j<orders.length ; j++){
                if (orders[j].dataValues.productUnit_id != null){
                  var product = await ProductUnit.findOne({
                    where:{
                      id: orders[j].dataValues.productUnit_id
                    }
                  });
                  orderList.push({"menu_name":product.dataValues.name, "menu_quantity":orders[j].dataValues.quantity});
                  total_price += product.dataValues.price;
                }
                else if(orders[j].dataValues.productSet_id != null){
                  var product = await ProductSet.findOne({
                    where:{
                      id: orders[j].dataValues.productSet_id
                    }
                  });
                  orderList.push({"menu_name":product.dataValues.name, "menu_quantity":orders[j].dataValues.quantity});
                  total_price += product.dataValues.price;
                }
                else if(orders[j].dataValues.productOption_id != null){
                  var product = await ProductOption.findOne({
                    where:{
                      id: orders[j].dataValues.productOption_id
                    }
                  });
                  orderList.push({"menu_name":product.dataValues.name, "menu_quantity":orders[j].dataValues.quantity});
                  total_price += product.dataValues.price;
                }
              }

            temp_dict['menu'] = orderList;
            temp_dict['total_price'] = total_price;
            temp_dict['status'] = deliveries[i].dataValues.status;

            result.push(temp_dict);
        }

        result = JSON.stringify(result);
        return res.json({result});

    }
    catch(err){

        console.log("Error on getProceedingDelivery: " + err)
        return res.send("error")

    }
}

export const getFinishedDelivery = async (req,res) => {

    console.log(req.query);

    const {user_id} = req.query;
    const Op = Sequelize.Op

    try{
        const deliveries = await Delivery.findAll({
            order:[
                ['createdAt','DESC']
            ],
            where:{
                user_id,
                status: {
                    [Op.or]: [2,3,4,5]
                }
            }
        });
        
        var result = new Array();

        for(var i = 0 ; i < deliveries.length ; i++){

            var temp_dict = {}

            const store = await Store.findOne({
                where:{
                    id: deliveries[i].dataValues.store_id
                }
            });

            temp_dict['store_name'] = store.dataValues.storeName;

            const orders = await Order.findAll({
                where:{
                    delivery_id: deliveries[i].dataValues.id
                }
            });

            var orderList = new Array();
            var total_price = 0

            for (var j = 0; j<orders.length ; j++){
                if (orders[j].dataValues.productUnit_id != null){
                  var product = await ProductUnit.findOne({
                    where:{
                      id: orders[j].dataValues.productUnit_id
                    }
                  });
                  orderList.push({"menu_name":product.dataValues.name, "menu_quantity":orders[j].dataValues.quantity});
                  total_price += product.dataValues.price;
                }
                else if(orders[j].dataValues.productSet_id != null){
                  var product = await ProductSet.findOne({
                    where:{
                      id: orders[j].dataValues.productSet_id
                    }
                  });
                  orderList.push({"menu_name":product.dataValues.name, "menu_quantity":orders[j].dataValues.quantity});
                  total_price += product.dataValues.price;
                }
                else if(orders[j].dataValues.productOption_id != null){
                  var product = await ProductOption.findOne({
                    where:{
                      id: orders[j].dataValues.productOption_id
                    }
                  });
                  orderList.push({"menu_name":product.dataValues.name, "menu_quantity":orders[j].dataValues.quantity});
                  total_price += product.dataValues.price;
                }
              }

            temp_dict['menu'] = orderList;
            temp_dict['total_price'] = total_price;
            temp_dict['status'] = deliveries[i].dataValues.status;
            temp_dict['delivery_id'] = deliveries[i].dataValues.id;

            result.push(temp_dict);
        }

        console.log(result);

        result = JSON.stringify(result);
        return res.json({result});

    }
    catch(err){

        console.log("Error on getFinishedDelivery: " + err)
        return res.send("error")

    }
}