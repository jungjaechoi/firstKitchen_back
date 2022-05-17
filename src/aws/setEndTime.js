const axios = require("axios");
const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    // TODO implement
    
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello Lambda!'),
    };
    
    try{
        const result = await axios.get('https://d23d-59-5-187-53.jp.ngrok.io/user/getAllAutoEndTime');
        let times = result.data;
        times = JSON.parse(times);
        
        let time_dict = {}
        
        for(var i = 0 ; i<times.length ; i++){
            if(times[i].autoEndTime in time_dict){
                time_dict[times[i].autoEndTime].push(times[i].id);
            } 
            else{
                time_dict[times[i].autoEndTime] = [times[i].id];
            }
        }
        
        
        const time_keys = Object.keys(time_dict);
        
        for(var i = 0 ; i < time_keys.length ; i++){
            
            const eventBridge = new AWS.EventBridge();
            const lambda = new AWS.Lambda();
            
            const hour = time_keys[i].split(":")[0];
            const minute = time_keys[i].split(":")[1];
            
            const ruleName = `rule${hour}${minute}`;
            
            
            const ruleParams = {
                Name: ruleName,
                ScheduleExpression: `cron(${minute} ${hour} * * ? *)`,
            };

            const rule = await eventBridge.putRule(ruleParams).promise();
            
            const permissionParams = {
                Action: 'lambda:InvokeFunction',
                FunctionName: 'autoEndStore',
                Principal: 'events.amazonaws.com',
                StatementId: ruleName,
                SourceArn: rule.RuleArn,
            }
        
            await lambda.addPermission(permissionParams).promise();
            
            

            const targetParams = {
                Rule: ruleName,
                Targets: [
                  {
                    Id: `${ruleName}-target`,
                    Arn: 'arn:aws:lambda:us-west-1:640446638768:function:autoEndStore',
                  },
                ],
              };
            
              const result = await eventBridge.putTargets(targetParams).promise();

        }
        
    }
    catch(err){
        console.log(err);
    }
    

    return response;
};
