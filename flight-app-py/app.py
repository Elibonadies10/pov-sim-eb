from flask import Flask, jsonify
from flasgger import Swagger
from utils import get_random_int

from opentelemetry import trace

import logging
logging.basicConfig(level=logging.INFO)

# from Logs docs https://github.com/open-telemetry/opentelemetry-python/blob/main/docs/examples/logs/example.py
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import (
    OTLPLogExporter,
)
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource

logger_provider = LoggerProvider(
    resource=Resource.create(
        {
            "service.name": "flight-app-py",
        }
    ),
)
set_logger_provider(logger_provider)

exporter = OTLPLogExporter(insecure=True)
logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
handler = LoggingHandler(level=logging.NOTSET, logger_provider=logger_provider)

# Attach OTLP handler to root logger
logging.getLogger().addHandler(handler)

# Create different namespaced loggers
# It is recommended to not use the root logger with OTLP handler
# so telemetry is collected only for the application
logger1 = logging.getLogger("myapp.area1")

# End of Logs docs


#metrics doc https://opentelemetry.io/docs/languages/python/instrumentation/
from opentelemetry import metrics
#from opentelemetry.sdk.metrics import Histogram
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import (
    ConsoleMetricExporter,
    PeriodicExportingMetricReader,
)
metric_reader = PeriodicExportingMetricReader(ConsoleMetricExporter())
provider = MeterProvider(metric_readers=[metric_reader])
# Sets the global default meter provider
metrics.set_meter_provider(provider)

# Acquire a meter.
meter = metrics.get_meter("my.meter.name")

#end of metrics

# Acquire a tracer
tracer = trace.get_tracer("my.tracer.name")

call_counter = meter.create_counter(
    "root.requests.py",
    description = "number of time the root url was called"
)

rand_int_spread = meter.create_histogram(
        "rand_int_spread_py",
        description = "describes random int from flights",
        unit="ms",
        #value_type=float
    )

import pyroscope
pyroscope.configure(
    application_name = "flight-app-py",
    server_address = "https://profiles-prod-003.grafana.net",
    basic_auth_username = '453067',
    basic_auth_password = 'glc_eyJvIjoiNzA1MzkxIiwibiI6InN0YWNrLTQ1MzA2Ny1ocC13cml0ZS1wb3Ytc2ltLXBybyIsImsiOiJIMjQ0NHU5NDdOR0JhMElYcTIzR1RGZ20iLCJtIjp7InIiOiJ1cyJ9fQ==',
    tags = {
        "namespace": "prod"
    }
    # Optional Pyroscope tenant ID (only needed if using multi-tenancy). Not needed for Grafana Cloud.
    # tenant_id = "<TenantID>",
)

app = Flask(__name__)
Swagger(app)

AIRLINES = ["AA", "UA", "DL"]

@app.route("/")
def home():
    """No-op home endpoint
    ---
    responses:
      200:
        description: Returns ok
    """
    with tracer.start_as_current_span("custom_span_py") as testspan:
        testspan.set_attribute("custom_span_py.value", 5)
        call_counter.add(1,{"custom_span_py.value":2})
        logger1.info("Message for home endpoint")
        return jsonify({"message": "ok"})


@app.route("/airlines/<err>")
def get_airlines(err=None):
    """Get airlines endpoint. Set err to "raise" to trigger an exception.
    ---
    parameters:
      - name: err
        in: path
        type: string
        enum: ["raise"]
        required: false
    responses:
      200:
        description: Returns a list of airlines
    """
    if err == "raise":
        logger1.error("ERROR GETTING AIRLINES!")
        raise Exception("Raise test exception")
    return jsonify({"airlines": AIRLINES})

@app.route("/flights/<airline>/<err>")
def get_flights(airline, err=None):
    """Get flights endpoint. Set err to "raise" to trigger an exception.
    ---
    parameters:
      - name: airline
        in: path
        type: string
        enum: ["AA", "UA", "DL"]
        required: true
      - name: err
        in: path
        type: string
        enum: ["raise"]
        required: false
    responses:
      200:
        description: Returns a list of flights for the selected airline
    """
    if err == "raise":
        logger1.error("ERROR GETTING FLIGHTS!!")
        raise Exception("Raise test exception")
    random_int = get_random_int(100, 999)
    rand_int_spread.record(random_int,{"type":"histo"})
    return jsonify({airline: [random_int]})

if __name__ == "__main__":
    app.run(debug=True)
