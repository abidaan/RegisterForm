#!/bin/bash
#start redis server if not running 
redis_count=`ps -aef |grep redis-server|grep -v grep|wc -l`
if [ $redis_count -eq 0 ]
then
    echo "starting redis-server"
    sudo redis-server &
fi
proxy_server_count=`ps -aef |grep proxy.js|grep -v grep|wc -l`
if [ $proxy_server_count -eq 0 ]
then    
    echo "starting proxy server"
    cd Proxy/
    npm install
    node proxy.js &
    cd -
fi
sudo docker build -t regform .
build_status=$?
if [ $build_status -ne 0 ]
then
  echo "docker build failed"
  exit 1
fi
sudo docker rmi sganesh4/regform:latest
sudo docker tag regform sganesh4/regform:latest
sudo docker push sganesh4/regform:latest
if [ $? -ne 0 ]
then
   echo "docker image push failed"
   exit 2
fi
ssh root@prod "bash -s" < ./scripts/deployScript.sh
