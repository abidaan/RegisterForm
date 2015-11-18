#!/bin/bash
#start redis server if not running 
redis_count=`ps -aef |grep redis-server|grep -v grep|wc -l`
if [ $redis_count -eq 0 ]
    echo "starting redis-server"
    sudo redis-server &
fi
proxy_server_count=`ps -aef |grep redis-server|grep -v grep|wc -l`
if [ $proxy_server_count -eq 0 ]
    echo "starting proxy server"
#    node proxy.js &
fi
sudo docker build -t regform .
build_status=$?
if [ $build_status -ne 0 ]
  echo "docker build failed"
  exit 1
fi
sudo docker tag regform sganesh4/regform:latest
sudo docker push sganesh4/regform:stable
if [ $? -ne 0 ]
   echo "docker image push failed"
   exit 2
fi
ssh root@prod << 'scripts/deployScript.sh'
