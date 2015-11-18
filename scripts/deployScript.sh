#!/bin/bash
image=""
if [ $HOSTNAME == "prod" ]
then
    image="sganesh4/regform:stable"
else
   image="sganesh4/regform:latest"
fi
docker pull $image
docker stop webform
docker rm webform
docker rmi currnet
docker tag $image current
docker run -p 5001:3000 -d --add-host="redis_server:104.236.26.43" --name webform current
