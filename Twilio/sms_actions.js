/**
 * Created by Shivaji on 11/30/2015.
 */
var express = require('express');
var client1 = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var bodyParser = require('body-parser');
var sleep = require('sleep')
var do_client = require('./digital_ocean');
var app = express();
var redis = require('redis')
var exec = require('exec')
var name = "sganesh4-hw1-droplet";
var region = "nyc1"; // Fill one in from #1
var image = "ubuntu-14-04-x64"; // Fill one in from #2
var client = redis.createClient(6379, 'redis_server', {})
app.get('/hello', function(req, res) {
  var ques = req.query.Body;
  var action = ques.split(" ");
  var respM = 'Invalid action'
  if(action[0]==='enable'){
     client.set(action[1], true)
     respM='enabled feature: '+action[1]
  }
  else if(action[0]==='disable'){
    client.set(action[1], false)
    respM='disabled feature: '+action[1]
  }
  else if(action[0]==='scale'){
    var status =''
    name=action[1]
    respM='added new instance: '+name
    var dropletIP = ''
   do_client.client.createDroplet(name, region, image, function(err, resp, body)
    {
       if(!err && resp.statusCode == 202)
       {
          dropletId=body.droplet.id;
          console.log('Creation of droplet started, ID='+dropletId)
          status= body.droplet.status
          console.log('Droplet status: '+status)
       }
    })
     setTimeout(function(){
          do_client.client.listDropletById(dropletId, function(error, response, resp_body){
            if(!error)
            {
              console.log(response.statusCode)
              console.log('Creation Status: '+resp_body.droplet.status)
              status = resp_body.droplet.status
              dropletIP=resp_body.droplet.networks.v4[0].ip_address
            }
            else{
              console.log(error)
            }
            console.log(dropletIP)
            exec('bash ~/test.sh '+dropletIP, function (err, stdout, stderr) {
                //console.log('stdout: ' + stdout);
                //console.log('stderr: ' + stderr);
                //console.log('error: '+err)
                if (!stderr) {
                  var instance = 'http://'+dropletIP+':5001';
                  //console.log(instance);
                  client.lpush("instances",instance);
                }
            });
          })
     }, 120000)
  }
  //console.log(ques)
  //client.set("emailFeature", false);
  sendMessage(respM, req);

});
var sendMessage = function(msg, req){
		console.log("In send message ",req.query.From," ",req.query.To);
		var To=req.query.From;
		var From=req.query.To;
		client1.messages.create({
			to:To,
			from:From,
			body:msg
			}, function(err, text) {
				console.log( JSON.stringify(err, null, 4));
		});
	};

app.listen(8888,'107.170.94.149')

