const b64lex = require('base64-lex');
const {machineIdSync} = require('node-machine-id');

const TWO_TO_16 = (1 << 16);
const TWO_TO_32 = TWO_TO_16 * TWO_TO_16;

function nextRandom () {
  return Math.floor(Math.random() * TWO_TO_32);
}

function timeParts () {
  const time = Date.now();

  const high = Math.floor(time / TWO_TO_32) % TWO_TO_16;
  const low = time % TWO_TO_32;

  return [high, low]
}

function collapseIntToUInt16 (int) {
  let num = int;
  let result = 0;

  while (num !== 0) {
    result ^= num % TWO_TO_16;
    num = Math.floor(num / TWO_TO_16);
  }

  return result;
}

function collapseBufferToInt32 (buf) {
  let result = 0;
  for (let i = 0; i < buf.length; i += 4) {
    result ^= buf.readUInt32BE(i);
  }
  return result;
}

const pid = collapseIntToUInt16(process.pid)
const machine = collapseBufferToInt32(Buffer.from(machineIdSync(), 'hex'));


module.exports = function dbid () {
  const buf = Buffer.alloc(16, 0xFF);

  const [timeHigh, timeLow] = timeParts();

  const randomValue = nextRandom();

  buf.writeUInt16BE(timeHigh, 0);
  buf.writeUInt32BE(timeLow, 2);
  buf.writeInt32BE(machine, 6);
  buf.writeUInt16BE(pid, 10);
  buf.writeUInt32BE(randomValue, 12);

  return b64lex.encode(buf).replace(/-+/g, '');
};
