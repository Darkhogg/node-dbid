const TWO_TO_32 = (1 << 16) * (1 << 16);

const initHrtime = process.hrtime();
const initMillis = Date.now();


module.exports = function microtime () {
  const [diffSec, diffNano] = process.hrtime(initHrtime);

  const time = Math.floor((initMillis * 1e3) + (diffSec * 1e6) + (diffNano * 1e-3));

  const timeHigh = Math.floor(time / TWO_TO_32);
  const timeLow = time % TWO_TO_32;

  return [timeHigh, timeLow];
};
