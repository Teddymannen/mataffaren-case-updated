import { expect } from "chai";
import exp from "constants";
import { readdirSync } from 'fs';

let __exitCode = 0;
let __testsCount = 0;
let __testsPassed = 0;
let __testsFailed = 0;
const env = {};


function describe(title, callback) {
  console.log(colors.bg.blue + 'Describe ' + title + colors.reset);
  try {
    callback();
  } catch (error) {
    console.log(colors.fg.red + 'Describe ' + title + ' failed', error + colors.reset);
    process.exit(1);
  }
}

function test(title, callback) {
  __testsCount++;
  try {
    callback();
    console.log(colors.fg.green + 'Test ' + title + ' passed' + colors.reset);
    __testsPassed++;
  } catch (error) {
    console.log(colors.fg.red + 'Test ' + title + ' failed', error + colors.reset);
    __exitCode = 1;
    __testsFailed++;
    // process.exit(1);
  }
}

async function start() {
  let testFiles = readdirSync('./tests').filter(file => file.endsWith('.test.js'));

  const startTime = performance.now();
  for (let testFile of testFiles) {
    console.log('\nTest file', testFile);
    await import('../' + testFile);
  }
  const endTime = performance.now();
  console.log('All tests finished in', endTime - startTime, 'ms');
  console.log('Tests passed:', __testsPassed);
  console.log('Tests failed:', __testsFailed);
  process.exit(__exitCode);
}


start();

export { describe, test, expect, env };

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
    crimson: "\x1b[38m" // Scarlet
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    gray: "\x1b[100m",
    crimson: "\x1b[48m"
  }
};