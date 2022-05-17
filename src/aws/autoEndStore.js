const axios = require("axios");
const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    // TODO implement
    
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('autoEndStore!'),
    };
    
    try{
        const result = await axios.post('https://d23d-59-5-187-53.jp.ngrok.io/user/autoEndStore');
        console.log(result.data);
    }
    catch(err){
        console.log(err);
    }
    
    return response;
};