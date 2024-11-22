# Use an official Node runtime as a parent image
FROM node:18
#FROM us-docker.pkg.dev/grafanalabs-global/docker-grafana-opentelemetry-java-prod/grafana-opentelemetry-java:2.8.0-beta.2 AS agent

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install
#RUN npm install swagger-ui-express swagger-jsdoc express @opentelemetry/sdk-metrics @opentelemetry/resources @opentelemetry/api @opentelemetry/semantic-conventions @opentelemetry/sdk-node @opentelemetry/sdk-trace-node @pyroscope/nodejs

# Bundle app source
COPY . .
#COPY instrumentations.js .

#APM method https://opentelemetry.io/docs/zero-code/js/
RUN npm install --save @opentelemetry/auto-instrumentations-node
ENV NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"

# Expose the port on which the app runs
EXPOSE 3000

# Command to run the app
CMD ["node", "-r", "./instrumentations.js", "app.js"]


