#!/bin/bash
docker build .
date=$(date +"%Y-%m-%d_%H%M")
project="image-server"
build_name=$date-$project

npm install

mkdir images
#Build and tag it with current date
if docker build -f Dockerfile -t $build_name .; then
  echo "Build succeeded"
  current_instance=$(docker ps | grep $project | head -n1 | awk '{print $1;}')
  echo $current_instance
  docker kill $current_instance

  new_instance=$(docker run -it -d -p 8888:8888
--name $build_name \
   --mount type=bind,source="$(pwd)"/images,target=/storage/images \
   ba055e1ab76e \
   thumbor  --conf /thumbor.conf \
  --log-level debug)
  echo "Deployment succeeded : "$new_instance
#   docker logs -f $new_instance
else
  echo "Build failed"
fi
