var redis = require('redis')
var http = require('http');
var httpProxy = require('http-proxy');
var express = require('express')
var fs      = require('fs')
var app = express()

// REDIS
var client = redis.createClient(6379, "redis_server", {})
client.set("key", "value");
client.set("emailFeature", true);
client.get("emailFeature", function(err,value){ console.log(value)});
var list = {};
var host;

var options = {}
var proxy   = httpProxy.createProxyServer(options);
//Server instances
var instance1 = 'http://prod:5001';
var instance2  = 'http://staging:5001';
var instances = {};
client.lpush("instances",instance1);
client.lpush("instances",instance1);
client.lpush("instances",instance1);
client.lpush("instances",instance2);

var server  = http.createServer(function(req, res)
	{
		client.rpoplpush("instances","instances",function(err,TARGET){
	  		proxy.web( req, res, {target: TARGET } );
		});
	});
server.listen(8000);
