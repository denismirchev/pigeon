import dotenv from 'dotenv';
import find from 'find';
import Jasmine from 'jasmine';
import { parse } from 'ts-command-line-args';
import logger from 'jet-logger';
import * as process from "node:process";


// **** Types **** //

interface IArgs {
  testFile: string;
}


// **** Setup **** //

// ** Init ** //

// NOTE: MUST BE FIRST!! Load env vars
const result2 = dotenv.config({
  path: './env/test.env',
});
if (result2.error) {
  throw result2.error;
}

const result1 = dotenv.config({
  path: './.env',
});
if (result1.error) {
  throw result1.error;
}

// Setup command line options.
const args = parse<IArgs>({
  testFile: {
    type: String,
    defaultValue: '',
  },
});


// ** Start Jasmine ** //

// Init Jasmine
const jasmine = new Jasmine();
jasmine.exitOnCompletion = false;

// Set location of test files
jasmine.loadConfig({
  random: true,
  spec_dir: 'spec',
  spec_files: [
    './tests/**/*.spec.ts',
  ],
  stopSpecOnExpectationFailure: false,
});

// Run all or a single unit-test
let execResp: Promise<jasmine.JasmineDoneInfo> | undefined;
if (args.testFile) {
  const testFile = args.testFile;
  find.file(testFile + '.spec.ts', './spec', (files: string[]) => {
    if (files.length === 1) {
      jasmine.execute([files[0]]);
    } else {
      logger.err('Test file not found!');
    }
  });
} else {
  execResp = jasmine.execute();
}

// Wait for tests to finish
(async () => {
  if (!!execResp) {
    const info = await execResp;
    if (info.overallStatus === 'passed') {
      logger.info('All tests have passed :)');
      // eslint-disable-next-line no-process-exit
      process.exit(0);
    } else {
      logger.err('At least one test has failed :(');
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  }
})();
