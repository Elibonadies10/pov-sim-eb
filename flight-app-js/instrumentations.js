/*instrumentation.js*/
// Require dependencies
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} = require('@opentelemetry/semantic-conventions');

const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');

const {
  LoggerProvider,
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} = require('@opentelemetry/sdk-logs');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);
//import { logs, SeverityNumber } from '@opentelemetry/api-logs';

//logs.setGlobalLoggerProvider(loggerProvider);

const resource = new Resource({[ATTR_SERVICE_NAME]: 'flight-app-js',[ATTR_SERVICE_VERSION]: '0.1.0',
});

const sdk = new NodeSDK({
  resource: resource,
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});


//const { trace, metrics } = opentelemetry;
//module.exports = { trace, metrics };

/*old
const myServiceMeterProvider = new MeterProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'flight-app-js',
    [ATTR_SERVICE_VERSION]: '0.1.0',
  }),
  readers: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
});
*/

// Set this MeterProvider to be global to the app being instrumented.


sdk.start();