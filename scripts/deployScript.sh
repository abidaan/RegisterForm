#!/bin/bash
image=""
if [ $HOSTNAME == "prod" ]
then
    image="sganesh4/regform:stable"
else
   image="sganesh4/regform:latest"
fi
docker pull $image
running_apps=`docker ps -a|grep -w webform|wc -l`
echo $running_apps
if [ $running_apps -ne 0 ]
then
    docker stop webform
    docker rm webform
fi
image_count=`docker images|grep current|wc -l`
docker images
if [ $image_count -ne 0 ]
then
    echo $image_count
    docker rmi current
fi
docker images -q --filter "dangling=true" |xargs docker rmi
docker tag $image current
docker images
echo `hostname`
docker run -p 5001:3000 -d --add-host="redis_server:$1" --env-file ~/email_cred --name webform current
