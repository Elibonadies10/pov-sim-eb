# Use the official Python 3.8 image as the base image
FROM python:3.8-slim-buster

# Set the working directory inside the container
WORKDIR /python-docker

# Copy the requirements file into the container
COPY requirements.txt requirements.txt

# Install the required dependencies
RUN pip3 install -r requirements.txt

# Copy the rest of your application code into the container
COPY . .

#zero code instrumentation https://opentelemetry.io/docs/zero-code/python/

RUN pip install opentelemetry-distro opentelemetry-exporter-otlp pyroscope-io
RUN opentelemetry-bootstrap -a install


# Specify the command to run your Flask app
CMD ["opentelemetry-instrument", "python3", "-m", "flask", "run", "--host=0.0.0.0"]
