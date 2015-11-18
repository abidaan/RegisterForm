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
docker rmi current
docker tag $image current
docker run -p 5001:3000 -d --add-host="redis_server:104.236.26.43" --env-file ~/email_cred --name webform current
