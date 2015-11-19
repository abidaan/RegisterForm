# RegisterForm
Repo for CSC-591 Milestone 3.

###Group Members
1. Abidaan Nagawkar (ajnagawk)
2. Shivaji Vidhale (savidhal)
3. Sushil Ganesh (sganesh4)

###Automatic Configuration of Production Envrionment using Docker
We have used Docker in order to configure the production envrionment for our application automatically. Basically, what we have done is, as soon as any changes are pushed to the repository, the project is automatically build on jenkins (Milestone 1). Once this is successful, the project is tested and the various analyses are conducted (Milestone 2). Only when this is successful, we create a container (on the build server itself) using our custom Dockerfile. This Dockerfile contains the configuration parameters for our application. Once the container is successfully created, we push this container to DockerHub. All these steps are performed automatically by a script (postBuildScript.sh).

####Screencast: Part 1: Auto configure production environment using Docker
[![Part1](http://img.youtube.com/vi/QKxJuHocNfs/0.jpg)](https://www.youtube.com/watch?v=QKxJuHocNfs)

###Automatic Deployment
Once the containers are created and pushed to the DockerHub, we ssh into production (prod) and canary (staging) virtual machines (which we have provisioned using DigitalOcean). We perform a docker pull in these servers. All this is done automatically using a script (deployScript.sh). Thus, we successfully deploy two versions of our app, one on prod and one on staging.

####Screencast: Part 2: Automatically deploy to prod and staging vms on commit
[![Part2](http://img.youtube.com/vi/5hFxk9XnByA/0.jpg)](https://www.youtube.com/watch?v=5hFxk9XnByA)

###Feature Flags
Feature that we are demonstrating is the email feature in which we send an email to the user when he/she successfully signs up. We are using sendgrid to implement this service. The feature gets switched off when there is some error that occurs while trying to send an email. So, if there is any bug, it will be caught and as a consequence, the feature flag is set to false. And this feature will no longer be implemented.

####Screencast: Part 3: Enable or disable feature flags
[![Part3](http://img.youtube.com/vi/awFn4-5rE98/0.jpg)](https://www.youtube.com/watch?v=awFn4-5rE98)

###Metrics and Alerts
We have used New Relic in order to monitor our application. The first step here is to sign up for an account with New Relic. Once this is complete, we can start monitoring our applications. We have to install a New Relic client (newrelic.js) in the root folder of the app we wish to monitor. We also have to add the following line at the top of our application code: `require('newrelic')`   
Once this is done, our application starts sending metrics to New Relic. Now, we need to configure an alert policy with New Relic for our applications. We have chosen the alert policy as the error rate of the application in the last five minutes and we have set the value to 5%. Basically, if the error rate of the applciation exceeds 5% even once in the last five minutes, then an alert will be raised. We also have to configure an alert channel. The alert channel defines how the alert is sent and to whom. We have set the alert channel to send an email to the concerned persons in case of an alert. We have set certain environment variables for APIKey, APPID, LicenseKey which are fairly straightforward to set up. Please refer to https://github.ncsu.edu/ajoshi5/DevOps-TechTalks for more details on how to set up New Relic.

####Screencast: Part 4: Metrics and Alerts (Monitoring)
[![Part4](http://img.youtube.com/vi/gopkPGvXCSs/0.jpg)](https://www.youtube.com/watch?v=gopkPGvXCSs)

###Canary Releasing
In this part, we are running a proxy server (Proxy/proxy.js) which has three instances of prod(stable) and one instance of staging(canary). It makes use of a global redis server in which this instance list is stored. Whenever a request is made to our application (on the IP address and port exposed by proxy.js), the proxy script automatically routes the request to either prod or staging. 
The second part is monitoring staging. We use Monitor/monitoring.js file to monitor staging every two minutes (cron task). If, during this monitoring, we find that certain parameters (for example: average response time as used in the screencast) exceed custom threshold values, then we update the global redis server to contain only prod instances in the instance list. As a result, any further requests made to our application are routed only to prod by our proxy server. The canary server (staging) does not get any further requests.

####Screencast: Part 5: Canary Release
[![Part4](http://img.youtube.com/vi/qMWjO1-2dac/0.jpg)](https://www.youtube.com/watch?v=qMWjO1-2dac)

####Notes:
For our demonstration we made the following configurations <br />
1. /etc/hosts on machine running proxy server had Digital Ocean droplet IPs with names 'prod' & staging
2. Email credentials were passed to docker image being run using a local file on the 'prod' & 'staging' machines
3. Redis server IP was passed to docker image while running the app
