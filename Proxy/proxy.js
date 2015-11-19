var redis = require('redis')
var http = require('http');
var httpProxy = require('http-proxy');
var express = require('express')
var fs      = require('fs')
var app = express()

// REDIS
var client = redis.createClient(6379, "redis_server", {})

client.flushall()
client.set("key", "value");
client.set("emailFeature", true);
client.set("canaryDead", false);
client.get("emailFeature", function(err,value){ console.log(value)});
var list = {};
var host;

var options = {}
var proxy   = httpProxy.createProxyServer(options);
//Server instances
//var instance1 = 'http://prod:5001';
var instance1 = 'http://:5001';
//var instance2  = 'http://staging:5001';
var instance2  = 'http://staging:5001';

var instances = {};
client.lpush("instances",instance1);
client.lpush("instances",instance1);
client.lpush("instances",instance1);
client.lpush("instances",instance2);

var server  = http.createServer(function(req, res)
	{
		client.get("canaryDead",function(err,value){
			if(value === "true"){
				client.lrem("instances",instance2,0,function(err, value){
					if(err)
						console.log(err);
				});
			}
			else{
			client.rpoplpush("instances","instances",function(err,TARGET){
	  			proxy.web( req, res, {target: TARGET } );
			});
			}
		});

	});
server.listen(8000);
