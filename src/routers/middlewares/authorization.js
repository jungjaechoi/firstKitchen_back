import jwt from "jsonwebtoken"
import {secretKey} from "../../../config/secretkey.js"

export const verifyToken = (req, res, next) => {
    try {
        const {token}= req.body;
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded.agent_id,decoded.store_id)
        if (decoded) {
            res.locals.agent_id = decoded.agent_id;
            res.locals.store_id = decoded.store_id;
            next();
        } 
        else {
            res.json({ error: 'unauthorized' });
        }
    } catch (err) {
        console.log(err);
        res.json({ error: 'token expired' });
    }
};

