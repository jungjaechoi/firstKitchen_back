import { Agent, Store } from "../../models";
import jwt from 'jsonwebtoken';
import {secretKey} from "../../config/secretkey.js"

export const getLogin = (req, res) => {
  return res.render("login/login.html");
};

export const postLogin = async(req,res) => {

  const {tel} = req.body;

  const exists = await Agent.findOne({
    where: {tel}
  });
  
  if(exists){
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
    console.log(token);
    return res.json({token})
  }
  else{
    res.write("<script>alert(\"You need to join.\")</script>");
  }

}