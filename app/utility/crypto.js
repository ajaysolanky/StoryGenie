import SHA1 from "./SHA1";

export const intToBoolRand = (int, chance, seed) => {
  const fullStr = int.toString() + seed;
  const hashStr = SHA1(fullStr);
  const hashInt = parseInt(hashStr, 16);
  const magnifyFactor = 100000; // seems necessary because parsing the int loses precision
  const numBuckets = Math.floor(1.0 / chance) * magnifyFactor;
  return hashInt % numBuckets < magnifyFactor;
};

// function range(start, end) {
//   return Array(end - start + 1)
//     .fill()
//     .map((_, idx) => start + idx);
// }

// let n_samples = 10000.0;
// console.log(
//   range(0, n_samples)
//     .map((e) => intToBoolRand(e, 0.5, ""))
//     .filter((e) => e === true).length / n_samples
// );
