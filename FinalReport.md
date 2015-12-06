#DevOps Continuous Integration Pipeline

##Members
1. Abidaan Nagawkar (ajnagawk)
2. Shivaji Vidhale (savidhal)
3. Sushil Ganesh (sganesh4)



##Overview
This project consists of implementing the entire DevOps Continuous Integration Pipeline for a sample application. The application that we have built the pipeline for, is a simple registration web form which optionally sends an email notification on successful registration. We have set up the pipeline such that it automates the entire end-to-end process.

![Pipeline](https://raw.githubusercontent.com/sganesh4/RegisterForm/master/ReportImages/Pipeline.png)

####Screencast: DevOps Continuous Integration Pipeline
[![Build](http://img.youtube.com/vi/px2otcyOfpA/0.jpg)](https://www.youtube.com/watch?v=px2otcyOfpA)

##Milestone 1: Build

####Description
The build step of the pipeline is depicted below.

![Build](https://raw.githubusercontent.com/sganesh4/RegisterForm/master/ReportImages/Build.png)

A Digital Ocean droplet is used to host the Jenkins Server. We have configured Jenkins such that as soon as any changes are pushed to the project repository, Jenknins automatically pulls these changes from the repository and runs a build job. The build job is basically a build script which installs all the necessary dependencies for the project. The Jenkins server sends an email notification to all the developers on each successful or failed build. 

####Screencast: Build
[![Build](http://img.youtube.com/vi/Cnm4u82uVIc/0.jpg)](https://www.youtube.com/watch?v=Cnm4u82uVIc)

##Milestone 2: Testing and Analysis

####Desription
We have configured Jenkins such that, it automatically runs tests on the project as an extension to the build step. Once Jenkins install all the necessary dependencies and completes all tasks listed in the build script, it runs several scripts that test various components of the project. We have used constraint based testing in order to generate test cases automatically. We have also used Mocha in order to run unit tests. The analysis phase consits of a base analysis using JSLint and an extendend analysis where we analyze the code to comment ratio. If any of these tests or analyses produce unsatisfactory results (values below thresholds defined by developers), then the build fails and a notification is sent to the developers. We have also set up git hooks to check for any secret keys/access tokens, etc. which may have been hard-coded. If any such values are found, the code will not get pushed to the repository.

####Screencast: Details of the App and demonstration of Security Gate
[![AppDetails](http://img.youtube.com/vi/b9jQ2Wia8rw/0.jpg)](https://www.youtube.com/watch?v=b9jQ2Wia8rw)

####Screencast: Unit Testing, Coverage and Testing Gate
[![Test](http://img.youtube.com/vi/drQ1fLJktCk/0.jpg)](https://www.youtube.com/watch?v=drQ1fLJktCk)

####Screencast: Base Analysis, Extended Analysis and Analysis Gate
[![Analysis](http://img.youtube.com/vi/MMOrcloQWig/0.jpg)](https://www.youtube.com/watch?v=MMOrcloQWig)

##Milestone 3: Deployment

####Description
The deployment step of the pipeline is depicted below.
![Deployment](https://raw.githubusercontent.com/sganesh4/RegisterForm/master/ReportImages/Deployment.png)

This is the third step in the Continuous Integration Pipeline. Once Jenkins has built the project and all the tests and analyses are successful, Jenkins builds a Docker container. This container is basically an environment for the application. It contains all the dependencies and configurations that are required by the application to run. The purpose of building a container is portability. If we wish to change the physical server that the application is deployed on, we just have to move this container to the new server and our application will be deployed on that server. Once the container is built (using a Dockerfile), Jenkins pushes this container to Docker Hub. Docker Hub is a remote repository for docker containers.   
Once the container is pushed to Docker Hub, Jenkins connects to the two application servers, one of which is labelled 'Production' and the other is labelled 'Staging'. Both these servers are Digital Ocean droplets. The production server hosts the stable version of the application whereas the staging server hosts the latest version (which might be unstable). Once Jenkins connects to each individual server, the respective Docker containers are pulled from Docker Hub. Now the application is running on both servers.   
We have a Global Redis Store running on the same droplet as our Jenkins server. This store contains valuable information which will be used for request routing and feature flag setting/unsetting. We also have a Proxy server running on this same droplet. This is the endpoint which is visible to clients, that is, the server to which clients will make requests for our application.   
The Proxy server queries the Redis Store whenever it receieves a client request. The Redis Store responds with the IP Address of the server to which this particular request should be routed (either Production or Staging based on a 3:1 ratio). The Proxy server then redirects the client request to that particular server.   
The application running on both servers also query the Redis Store. This query is made for the purpose of understanding whether the email notification feature should be turned on. Based on the response sent by the Redis Store, the email notification feature is either set or unset.   
We also have a New Relic client monitoring the status of our application constantly. If the agent finds that the application (Staging only) is not performing as required (for example if response time is higher than an acceptable threshold value), then it updates the Redis Store. This update basically informs the Redis Store that the Staging server is down. When the Proxy server queries the Redis Store for any new requests, the Redis Store will never return the IP Address of the Staging server, till the Staging Server is running again.

####Screencast - Part 1: Auto configure production environment using Docker
[![Part1](http://img.youtube.com/vi/QKxJuHocNfs/0.jpg)](https://www.youtube.com/watch?v=QKxJuHocNfs)

####Screencast - Part 2: Automatically deploy to prod and staging vms on commit
[![Part2](http://img.youtube.com/vi/5hFxk9XnByA/0.jpg)](https://www.youtube.com/watch?v=5hFxk9XnByA)

####Screencast - Part 3: Enable or disable feature flags
[![Part3](http://img.youtube.com/vi/awFn4-5rE98/0.jpg)](https://www.youtube.com/watch?v=awFn4-5rE98)

####Screencast - Part 4: Metrics and Alerts (Monitoring)
[![Part4](http://img.youtube.com/vi/gopkPGvXCSs/0.jpg)](https://www.youtube.com/watch?v=gopkPGvXCSs

####Screencast - Part 5: Canary Release
[![Part4](http://img.youtube.com/vi/qMWjO1-2dac/0.jpg)](https://www.youtube.com/watch?v=qMWjO1-2dac)