#!/bin/bash
docker build -t regform .
docker tag regform sganesh4/regform:stable
