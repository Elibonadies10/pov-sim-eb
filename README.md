# 🚀 POV Flight Simulator 🚀

Welcome to the POV Flight Simulator.

This repo holds the starting points for you to complete the assigned tasks.

# Links

- [POV Sim spreadsheet](https://docs.google.com/spreadsheets/d/1NjyNKgT0HVhAmHKodApmUdZshkA_ccwRApL3aE1Hw8M/edit?gid=2099201327#gid=2099201327)

# About

Included in this repo are uninstrumented sample applications that serve as starting points for you to add instrumentation as specified in the instructions of select tasks.

The following applications, which are configured to run in Docker containers, expose identical API interfaces but are implemented in different languages:
- `flight-app-js` - Express.js backend application
- `flight-app-py` - Python Flask backend application

# Getting Up and Running

## Prerequisites

- Install [Docker](https://docs.docker.com/engine/install/) on your local machine
- Clone this repo to your local machine

```
git clone https://github.com/aninamu/pov-sim.git
```

## Running flight-app-js

From the `flight-app-js` directory:

Build the app
```
make build
```

Run the app
```
make run
```

Alternatively, use a single command to both build and run the app:
```
make start
```

The app should now be up and running at http://localhost:3000/

Navigate to http://localhost:3000/api-docs/ to view the API interface and make requests

## Running flight-app-py

From the `flight-app-py` directory:

Build the app
```
make build
```

Run the app
```
make run
```

Alternatively, use a single command to both build and run the app:
```
make start
```

The app should now be up and running at http://127.0.0.1:5000/

Navigate to http://127.0.0.1:5000/apidocs/ to view the API interface and make requests

## Cleanup

The Makefiles included with each application include additional commands to stop running containers and to clean up stopped containers.

To stop a container, run the following command from the app root:
```
make stop
```

To remove a container, run the following command from the app root:
```
make clean
```

## Running both apps at once (Recommended)

From the project root:

Run the apps
```
make up
```

- The Express app will run on http://localhost:3000/ with Swagger docs at http://localhost:3000/api-docs/

- The Flask app will run on http://127.0.0.1:5000/ with Swagger docs at http://127.0.0.1:5000/apidocs/


Stop the running apps
```
make down
```

# Batch Requests

This repo includes a shell script in `batch_requests.sh` that allows you to make batch requests to an endpoint to generate higher volumes of traffic.

Note: You may need to run the following command to make the script executable:
```
chmod +x batch_requests.sh
```

## Usage
Running the script entails executing a shell command of this format from the base root of the repo:
```
./batch_requests.sh <endpoint> <num_requests>
```

### Example - Ping GET airlines endpoint 100 times
```
./batch_requests.sh http://localhost:3000/airlines 100
```

### Example - Trigger error on GET airlines endpoint 100 times
```
./batch_requests.sh http://localhost:3000/airlines/raise 100
```

### Example - Ping GET flights endpoint 100 times:
```
./batch_requests.sh http://localhost:3000/flights/AA 100
```

### Example - Trigger error on GET flights endpoint 100 times
```
./batch_requests.sh http://localhost:3000/flights/AA/raise 100
```

_Note: These sample commands assume the application you wish to ping is running locally at http://localhost:3000. Replace with the proper value as needed._


# Deploying a Helm chart

You may wish to deploy a Helm chart to complete one of the tasks. This repo contains an example Helm chart that can be used for a sample Kubernetes deployment.

Included is a recommended approach for using [Minikube](https://minikube.sigs.k8s.io/docs/) to deploy a local Kubernetes cluster.

## Prerequisites

- Install minikube https://minikube.sigs.k8s.io/docs/start/
- Install helm https://helm.sh/docs/intro/install/

## Getting up and running

Start your cluster
```
minikube start
```

Option to view the local Kubernetes dashboard
```
minikube dashboard
```

Install the sample Helm chart
```
helm install sample-chart helm-charts/sample-chart
```

Confirm the pod is up and running
```
kubectl get pods
```
