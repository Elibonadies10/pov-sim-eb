const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const utils = require('./utils.js');
const Pyroscope = require('@pyroscope/nodejs');
const { logs, SeverityNumber } = require('@opentelemetry/api-logs');
//otel api
const opentelemetry = require('@opentelemetry/api');
const { trace, metrics } = require('./instrumentations.js');
//const tracer = trace.getTracer('dice-server', '0.1.0');

const tracer = opentelemetry.trace.getTracer('flight-js');
//const tracer = trace.getTracer('flight-js');

const myMeter = opentelemetry.metrics.getMeter(
  'instrumentation-scope-name',
  'instrumentation-scope-version',
);

//const meter = metrics.getMeter('flight-js', '0.1.0');

const counter = myMeter.createCounter('root.counter.js');
const histogram = myMeter.createHistogram('rand.int.hist.js');

const logger = logs.getLogger('example', '1.0.0');

Pyroscope.init({
  serverAddress: 'https://profiles-prod-003.grafana.net',
  appName: 'flight-app-js',
  tags: {
    namespace: 'prod'
  },
  basicAuthUser: '453067',
  basicAuthPassword: 'glc_eyJvIjoiNzA1MzkxIiwibiI6InN0YWNrLTQ1MzA2Ny1ocC13cml0ZS1wb3Ytc2ltLXBybyIsImsiOiJIMjQ0NHU5NDdOR0JhMElYcTIzR1RGZ20iLCJtIjp7InIiOiJ1cyJ9fQ==',
  // Optional Pyroscope tenant ID (only needed if using multi-tenancy). Not needed for Grafana Cloud.
  // tenantID: ENV['PYROSCOPE_TENANT_ID'],
});

Pyroscope.start()

const AIRLINES = ['AA', 'UA', 'DL'];

const app = express();

const swaggerDocs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flight App',
      version: '1.0.0',
      description: 'A simple Express Flight App',
    },
  },
  apis: ['app.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: No-op home endpoint
 *     responses:
 *       200:
 *         description: Returns ok
 */

/* original
app.get('/', (req, res) => {

  res.send({'message': 'ok'});
});
*/

app.get('/', (req, res) => {
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: 'INFO',
    body: 'root url was visited',
    attributes: { 'log.type': 'custom' },
  });
  return tracer.startActiveSpan('js-custom-span', (span) => {

    counter.add(1);
    res.send({'message': 'ok'});
    span.end();
  })
  
});

/**
 * @swagger
 * /airlines/{err}:
 *   get:
 *     summary: Get airlines endpoint. Set err to "raise" to trigger an exception.
 *     parameters:
 *       - in: path
 *         name: err
 *         type: string
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - raise
 *     responses:
 *       200:
 *         description: Returns a list of airlines
 */
app.get('/airlines/:err?', (req, res) => {
  if (req.params.err === 'raise') {
    logger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: 'ERROR',
      body: 'error with /airlines',
      attributes: { 'log.type': 'custom' },
    });
    throw new Error('Raise test exception');
    
  }
  res.send({'airlines': AIRLINES});
});

/**
 * @swagger
 * /flights/{airline}/{err}:
 *   get:
 *     summary: Get flights endpoint. Set err to "raise" to trigger an exception.
 *     parameters:
 *       - in: path
 *         name: airline
 *         type: string
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - AA
 *             - UA
 *             - DL
 *       - in: path
 *         name: err
 *         type: string
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - raise
 *     responses:
 *       200:
 *         description: Returns a list of airlines
 */
app.get('/flights/:airline/:err?', (req, res) => {
  if (req.params.err === 'raise') {
    logger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: 'ERROR',
      body: 'error with /flights/airlines',
      attributes: { 'log.type': 'custom' },
    });
    throw new Error('Raise test exception');
  }
//start span
  //const span = tracer.startSpan('random_int');

  const randomInt = utils.getRandomInt(100, 999);
  histogram.record(randomInt);
  //end span
  //span.end;
  res.send({[req.params.airline]: [randomInt]});
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
