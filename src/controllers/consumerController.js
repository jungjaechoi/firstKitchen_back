import { Order_proceeding,Order_completed,Delivery_completed, Delivery_proceeding, ProductOption, ProductUnit, ProductSet, Store } from "../../models";


export const postDeliveryInfo = async(req,res) => {
    console.log(req.body);
    const {store_id,user_id,user_nickname,deliveryApp,receptionType,orderTime,
        jibunAddress,roadAddress,addressDetail,memo,request,
        tel,payType,totalPaidPrice,totalPrice,
        discountPrice,deliveryPrice,orders} = req.body.data;
   
    var checkArr = new Array(store_id,user_id,user_nickname,deliveryApp,receptionType,orderTime,
        addressDetail,
        tel,payType,totalPaidPrice,totalPrice,
        discountPrice,deliveryPrice,orders);
    console.log(user_nickname);
    var nameArr = new Array('store_id','user_id','user_nickname','deliveryApp','receptionType','orderTime',
        'addressDetail',
        'tel','payType','totalPaidPrice','totalPrice',
        'discountPrice','deliveryPrice','orders');

    for (var i = 0; i<checkArr.length ; i++){
        if(checkArr[i] == null){
            const letter = "need " + nameArr[i]
            console.log(letter);
            return res.send(letter)
        }
    }

    try{
        const delivery = await Delivery_proceeding.create({
            store_id,user_id,user_nickname,deliveryApp,receptionType,orderTime,
            jibunAddress,roadAddress,addressDetail,memo,request,
            tel,payType,totalPaidPrice,totalPrice,
            discountPrice,deliveryPrice
        });
        

        for (var i = 0; i<orders.length ; i++){
            if(orders[i].menu_type == 0){
                const order = await Order_proceeding.create({
                    delivery_id: delivery.id,
                    productUnit_id:orders[i].menu_id,
                    quantity: orders[i].quantity
                })
                console.log(order.id + " is saved")
            }
        }

        const id =  delivery.id

        console.log("Insert into Delivery_proceeding: " + id);
        return res.json({id})

    } catch(err){
        console.log("Error on creating: " + err)
        return res.send("error")
    }
}

export const getDeliveryInfo = async(req,res) => {
    const {id} = req.body;

    try{
        
        const isProceeding = await Delivery_proceeding.findOne({
            where: {id}
        })

        if(isProceeding){
            const deliveryInfo = isProceeding
            console.log("delivery_proceeding " + deliveryInfo.id + " is inquired")
            return res.json({deliveryInfo})
        }
        else{
            const isCompleted = await Delivery_completed.findOne({
                where: {id}
            })
            if(isCompleted){
                const deliveryInfo = isCompleted
                console.log("delivery_completed " + deliveryInfo.id + " is inquired")
                return res.json({deliveryInfo})
            }
            else{
                console.log("Info which not exist is inquired");
                return res.send("no Info")
            }
        }

    } catch(err){
        console.log("Error on inquiring deliveryInfo: " + err)
        return res.send("error")
    }
}

export const getAllStore = async(req,res) => {
    //나중에는 위치정보 받아서 가까운 가게 res해야함.
    try{
        const store = await Store.findAll({attributes: ['id','storeName','storeAddress','isOpen','deliveryPrice']})
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

// export const getCartMenu = async(req,res) => {
//     const {incart} = req.body.data;
//     var menu = new Array();

//     for(var i = 0; i < incart.length ; i++){
//         if(incart[i].menu_type == 0){

//         }
//         else if(incart[i].menu_type == 1){

//         }
//         else if(incart[i].menu_type == 2){
            
//         }
//         menu.push()
//     }
    
// }