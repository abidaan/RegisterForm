//*/2 * * * * /bin/sh /var/lib/jenkins/monitor_cron.sh >> crontab.log

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
	'X-Api-Key':apiKey
};

//Request end point URL.
var request = "https://api.newrelic.com/v2/applications/"+appID+"/metrics/data.json"

//The monitoring period which is currently set to the last five minutes.
var startdate = new Date();
var currentdate = new Date();
currentdate.setHours(currentdate.getHours()+5)
startdate.setHours(currentdate.getHours())
startdate.setMinutes(currentdate.getMinutes() - 30);
var startDateTime = "\""+startdate.getFullYear()+"-"+(startdate.getMonth()+1)+"-"+startdate.getDate()+"T"
				+startdate.getHours()+":"+startdate.getMinutes()+":"+startdate.getSeconds()+"+00:00\"";
var endDateTime = "\""+currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+currentdate.getDate()+"T"
				+currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds()+"+00:00\"";
console.log("State Time: "+startDateTime+" End Time: "+endDateTime)

//The data to be sent to New Relic to retrieve the average response time of the application(s) that is(are) being monitored
var avgResponseTimeData = {
	"names":'HttpDispatcher',
	"values":'average_call_time',
	"from":startDateTime,
	"to":endDateTime,
	"summarize":'true'
}

//API call for average response time
needle.post(request,avgResponseTimeData,{headers:headers},function(req, res){
	//You can set the redis key-value pair here or in the second metric (see below)
	var avg_response_time = JSON.stringify(res.body.metric_data.metrics[0].timeslices[0].values.average_call_time)
	if(avg_response_time > 50){
		// Load the twilio module
		var twilio = require('twilio');

// Create a new REST API client to make authenticated requests against the
// twilio back end
		var twilio_client = new twilio.RestClient('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
		twilio_client.sms.messages.create({
			to:'+19199855965',
			from:'+12813774461',
			body:'Average response tis more than expected'
		}, function(error, message) {
			// The HTTP request to Twilio will run asynchronously. This callback
			// function will be called when a response is received from Twilio
			// The "error" variable will contain error information, if any.
			// If the request was successful, this value will be "falsy"
			if (!error) {
				// The second argument to the callback will contain the information
				// sent back by Twilio for the request. In this case, it is the
				// information about the text messsage you just sent:
				console.log('Success! The SID for this SMS message is:');
				console.log(message.sid);

				console.log('Message sent on:');
				console.log(message.dateCreated);
			} else {
				console.log('Oops! There was an error.');
			}
		});
	}
		//client.set("canaryDead",true);
	console.log("Average Response Time: "+avg_response_time)
})

//The data to be sent to New Relic to retrieve the application throughput values of the application(s) that is(are) being monitored
//HttpDispatcher
var httpDispatcherData = {
	"names":'HttpDispatcher',
	"values":'call_count',
	"from":startDateTime,
	"to":endDateTime,
	"summarize":'true'
}

//Errors/all
var errorCountData = {
	"names":'Errors/all',
	"values":'error_count',
	"from":startDateTime,
	"to":endDateTime,
	"summarize":'true'
}

//OtherTransactions/all
var otherTransactionData = {
	"names":'OtherTransaction/all',
	"values":'call_count',
	"from":startDateTime,
	"to":endDateTime,
	"summarize":'true'
}

//API call for httpDispatcherCallCount
needle.post(request,httpDispatcherData,{headers:headers},function(req, res){
	if(res.headers.status == "200 OK")
		var httpDispatcherCallCount = JSON.stringify(res.body.metric_data.metrics[0].timeslices[0].values.call_count)
	//API call for errorCountData
	needle.post(request,errorCountData,{headers:headers},function(req, res){
		if(res.headers.status == "200 OK")
			var errorsAllErrorCount = JSON.stringify(res.body.metric_data.metrics[0].timeslices[0].values.error_count)
		//API call for OtherTransactionData
		needle.post(request,otherTransactionData,{headers:headers},function(req, res){
			if(res.headers.status == "200 OK")
				var otherTransactionDataCallCount = JSON.stringify(res.body.metric_data.metrics[0].timeslices[0].values.call_count)
			//Calculate the error rate of the application
			if(isNaN(httpDispatcherCallCount))
				httpDispatcherCallCount = 0;
			if(isNaN(errorsAllErrorCount))
				errorsAllErrorCount = 0
			if(isNaN(otherTransactionDataCallCount))
				otherTransactionDataCallCount = 0
			error_rate = (parseInt(errorsAllErrorCount)/(parseInt(httpDispatcherCallCount) + parseInt(otherTransactionDataCallCount)))*100
			console.log("Error Rate: "+error_rate)
			if(error_rate > 30){
				client.set("canaryDead",true);
				client.quit();
			}else
				client.quit();
		})
	})
})
