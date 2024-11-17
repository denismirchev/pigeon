import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/common/EnvVars';
import server from './server';
import cron from 'node-cron';

// **** Run **** //

const SERVER_START_MSG = ('Express server started on port: ' + 
  EnvVars.Port.toString());

server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));

// **** Cron Job **** //

// Schedule a job to run every 10 seconds
cron.schedule('*/10 * * * * *', () => {
  console.log('Cron: Hello World');
});