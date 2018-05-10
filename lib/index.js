const b64lex = require('base64-lex');
const microtime = require('./microtime');
const {machineIdSync} = require('node-machine-id');

const TWO_TO_32 = (1 << 16) * (1 << 16);

const COUNTER_MAX = 1 << 16;
let globalCounter = Math.floor(Math.random() * COUNTER_MAX);

function nextCounter () {
  globalCounter = (globalCounter + 1) % COUNTER_MAX;
  return globalCounter;
}

function collapse32 (buf) {
  let result = 0;
  for (let i = 0; i < buf.length; i += 4) {
    result ^= buf.readUInt32BE(i);
  }
  return result;
}

/* calculate PID by collapsing two 32-bit halves with XOR for >16bit PIDs */
const pid = (process.pid % TWO_TO_32)
  ^ Math.floor(process.pid / TWO_TO_32) % TWO_TO_32;

/* calculate MachineID by collapsing an UUID into 32bits */
const machine = collapse32(Buffer.from(machineIdSync(), 'hex'));

module.exports = function dbid () {
  const buf = Buffer.alloc(16);

  const [timeHigh, timeLow] = microtime();

  const counter = nextCounter();

  buf.writeUInt32BE(timeHigh, 0);
  buf.writeUInt32BE(timeLow, 4);
  buf.writeInt32BE(machine, 8);
  buf.writeUInt16BE(pid, 12);
  buf.writeUInt16BE(counter, 14);

  return b64lex.encode(buf).replace(/-+/g, '');
};
