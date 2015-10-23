#!/bin/bash
node main.js
coverage=$(node_modules/.bin/istanbul cover test.js | grep 'Branch' | cut -d: -f 2 | cut -d% -f 1)
echo $coverage
if [ "$coverage" < "$90" ]
then exit 1
fi
