//Created by Abidaan
var needle = require('needle')
var redis = require('redis')

//Create Redis client
var client = redis.createClient(6379, 'redis_server', {})

//Define the New Relic API Key and the App ID of the application(s) that we wish to monitor
var apiKey = process.env.NewRelicAPIKey;
var appID = process.env.StagingAppID;

//The header data to send to New Relic
var headers = {
	'X-Api-Key':apiKey,
	'X-Request-Start':Date.now()
};

//Request end point URL.
var request = "https://api.newrelic.com/v2/applications/"+appID+"/metrics/data.json"

//The monitoring period which is currently set to the last five minutes.
var startdate = new Date();
var currentdate = new Date();
startdate.setMinutes(currentdate.getMinutes() - 5);
var startDateTime = "\""+startdate.getFullYear()+"-"+(startdate.getMonth()+1)+"-"+startdate.getDate()+"T"
				+startdate.getHours()+":"+startdate.getMinutes()+":"+startdate.getSeconds()+"+00:00\"";
var endDateTime = "\""+currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+currentdate.getDate()+"T"
				+currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds()+"+00:00\"";


//The data to be sent to New Relic to retrieve the average response time of the application(s) that is(are) being monitored
var avgResponseTimeData = {
	'names':'HttpDispatcher',
	"values":'average_call_time',
	"from":'2015-11-17T00:00:00+00:00',
	"to":endDateTime,
	"summarize":'true'
}

//API call for average response time
needle.post(request,avgResponseTimeData,{headers:headers},function(req, res){
	//You can set the redis key-value pair here or in the second metric (see below)
	var avg_response_time = JSON.stringify(res.body.metric_data.metrics[0].timeslices[0].values.average_call_time)
	console.log(avg_response_time)
})

//The data to be sent to New Relic to retrieve the application throughput values of the application(s) that is(are) being monitored
var errorRateData = {
	'names':'HttpDispatcher',
	"values":'call_count',
	"from":"2015-11-17T00:00:00+00:00",
	"to":endDateTime,
	"summarize":'true'
}

//API call for error count
needle.post(request,errorRateData,{headers:headers},function(req, res){

//You can set the redis key-value pair here.
var error_count = JSON.stringify(res.body.metric_data.metrics[0].timeslices[0].values.call_count);
console.log(error_count)
if(error_count != 0)
	client.set("canaryDead",true);
})






