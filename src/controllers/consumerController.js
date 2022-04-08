import { Order, Delivery, ProductOption, ProductUnit, ProductSet, Store } from "../../models";


export const postDeliveryInfo = async(req,res) => {
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
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        console.log(deliveryPrice);
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
                console.log(order.id + " is saved")
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
    const {id} = req.body;

    try{
        
        const deliveryInfo = await Delivery.findOne({
            where: {id}
        })

        console.log("delivery " + deliveryInfo.id + " is inquired")
        return res.json({deliveryInfo})

    } catch(err){
        console.log("Error on inquiring deliveryInfo: " + err)
        return res.send("error")
    }
}

export const getAllStore = async(req,res) => {
    //나중에는 위치정보 받아서 가까운 가게 res해야함.
    try{
        const store = await Store.findAll({attributes: ['id','storeName','storeAddress','isOpen','deliveryPrice']})
        console.log(store);
        return res.json({store});
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