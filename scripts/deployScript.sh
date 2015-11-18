#!/bin/bash
image=""
if [ $HOSTNAME == "prod" ]
then
    image="sganesh4/regform:stable"
else
   image="sganesh4/regform:latest"
fi
docker pull $image
running_apps=`sudo docker ps -a|grep -w webform`
if [ $running_apps -ne 0 ]
then
    docker stop webform
    docker rm webform
fi
image_count=`sudo docker images|grep current|wc -l`
if [ $image_count -ne 0 ]
then
    docker rmi current
fi
docker images -q --filter "dangling=true" |xargs docker rmi
docker tag $image current
docker run -p 5001:3000 -d --add-host="redis_server:104.236.26.43" --env-file ~/email_cred --name webform current
