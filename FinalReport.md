#DevOps Pipeline

###Members
1. Abidaan Nagawkar (ajnagawk)
2. Shivaji Vidhale (savidhal)
3. Sushil Ganesh (sganesh4)

###Overview
This project consists of implementing the entire DevOps pipeline for a sample application. The application that we have built the pipeline for is a simple registration web form which optionally sends an email notification on successful registration. We have set up the pipeline such that it automates the entire end-to-end process.

![Pipeline](https://raw.githubusercontent.com/sganesh4/RegisterForm/master/ReportImages/Pipeline.png)

###Build

#####Description
The build step of the pipeline is depicted below.

![Build](https://raw.githubusercontent.com/sganesh4/RegisterForm/master/ReportImages/Build.png)

A Digital Ocean droplet is used to host the Jenkins Server. We have configured Jenkins such that as soon as any changes are pushed to the project repository, Jenknins automatically pulls these changes from the repository and runs a build job. The build job is basically a build script which installs all the necessary dependencies for the project. The Jenkins server sends an email notification to all the developers on each successful or failed build. 

#####Screencast: Build
[![Build](http://img.youtube.com/vi/Cnm4u82uVIc/0.jpg)](https://www.youtube.com/watch?v=Cnm4u82uVIc)

###Testing and Analysis

#####Desription
We have configured Jenkins such that, it automatically runs tests on the project as an extension to the build step. Once Jenkins install all the necessary dependencies and completes all tasks listed in the build script, it runs several scripts that test various components of the project. We have used constraint based testing in order to generate test cases automatically. We have also used Mocha in order to run unit tests. The analysis phase consits of a base analysis using JSLint and an extendend analysis where we analyze the code to comment ratio. If any of these tests or analyses produce unsatisfactory results (values below thresholds defined by developers), then the build fails and a notification is sent to the developers. We have also set up git hooks to check for any secret keys/access tokens, etc. which may have been hard-coded. If any such values are found, the code will not get pushed to the repository.

#####Screencast: Details of the App and demonstration of Security Gate
[![AppDetails](http://img.youtube.com/vi/b9jQ2Wia8rw/0.jpg)](https://www.youtube.com/watch?v=b9jQ2Wia8rw)

#####Screencast: Unit Testing, Coverage and Testing Gate
[![Test](http://img.youtube.com/vi/drQ1fLJktCk/0.jpg)](https://www.youtube.com/watch?v=drQ1fLJktCk)

#####Screencast: Base Analysis, Extended Analysis and Analysis Gate
[![Analysis](http://img.youtube.com/vi/MMOrcloQWig/0.jpg)](https://www.youtube.com/watch?v=MMOrcloQWig)