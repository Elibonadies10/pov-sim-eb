#!/bin/bash

# USAGE
# 
# This script allows you to make batch requests to one of the sample apps in this repository
#
# Note: You may need to `chmod +x batch_requests.sh` in order to execute the script
#
# To run the script:
# `./batch_requests.sh <endpoint> <num_requests>
#
# Example - Ping GET airlines endpoint 100 times:
# `./batch_requests.sh http://localhost:3000/airlines 100
#
# Example - Trigger errors on GET airlines endpoint 100 times:
# `./batch_requests.sh http://localhost:3000/airlines/raise 100
#
# Example - Ping GET flights endpoint 100 times:
# `./batch_requests.sh http://localhost:3000/flights/AA 100
#
# Example - Trigger errors on GET flights endpoint 100 times:
# `./batch_requests.sh http://localhost:3000/flights/AA/raise 100

EXPECTED_ARGS=2

if [ "$#" -ne "$EXPECTED_ARGS" ]; then
    echo "Error: Exactly $EXPECTED_ARGS arguments are required."
    echo "Usage: $0 <endpoint> <num_requests>"
    exit 1
fi

ENDPOINT=$1
NUM_REQUESTS=$2

echo ENDPOINT: $ENDPOINT
echo NUM_REQUESTS: $NUM_REQUESTS

for i in $(seq 1 $NUM_REQUESTS);
do
    printf "\nRequest #$i: "
    curl $ENDPOINT
done
