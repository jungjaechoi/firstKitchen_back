import { Agent, Store } from "../../models";
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

  const exists = await Agent.findOne({
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
      }, secretKey,{
          expiresIn : '1h'
      }));

    const storeName = store.dataValues.storeName;

    return res.json({token, storeName});
  }
  else{
    return res.json({token:"notJoined"});
  }
}

export const verifyToken = async(req,res) => {
  const {token} = req.body;
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  console.log(JSON.parse(atob(base64)).email);
  if(req.body.token==''){
      return res.send('needLogin');
  }
  try{
      
      
      const decoded = jwt.verify(token, secretKey);

      if(decoded){
          return res.send('ok');
      }
      else{
          return res.status(404);
      }
  } catch(err){
      return res.send('tokenExpired');
  }
}