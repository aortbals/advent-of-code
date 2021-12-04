import fs from "fs/promises";
import { exit } from "process";

export async function readInput(fileName: string) {
  return (await fs.readFile(fileName))
    .toString()
    .split("\n")
    .filter(Boolean)
    .map((s) => Array.from(s).map((s) => parseInt(s, 10)));
}

function average(array: number[]) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

/**
 * For a given number of bits, return the max possible decimal value.
 */
function maxBits(numBits: number) {
  return (1 << numBits) - 1;
}

async function part1(input: number[][]) {
  // Transpose the 2D array, using the columns of binary values for computing averages
  const transposed = input[0].map((_, colIndex) =>
    input.map((row) => row[colIndex])
  );

  const gamma = parseInt(
    transposed.map((bits) => Math.round(average(bits))).join(""),
    2
  );
  const bitmask = maxBits(transposed.length);
  // Use an XOR bitmask to flip all bits. Alternatively, substract the
  // gamma value from the max possible value for a given number of bits
  // (the above bitmask) to compute epsilon
  const epsilon = gamma ^ bitmask;

  return gamma * epsilon;
}

async function findPart2Rating(
  input: number[][],
  bitIndex = 0,
  leastCommon = false
): Promise<number[][]> {
  const column = input.map((row) => row[bitIndex]);

  const bit = leastCommon
    ? average(column) < 0.5
      ? 1
      : 0
    : average(column) >= 0.5
    ? 1
    : 0;

  let nextInput = input.filter((row) => row[bitIndex] === bit);

  if (nextInput.length === 1) {
    return nextInput;
  } else {
    return findPart2Rating(nextInput, bitIndex + 1, leastCommon);
  }
}

async function part2(input: number[][]) {
  const oxygen = parseInt((await findPart2Rating(input))[0].join(""), 2);
  const co2 = parseInt((await findPart2Rating(input, 0, true))[0].join(""), 2);
  return oxygen * co2;
}

const fileName = process.argv.slice(2)[0];

if (!fileName) {
  console.log("Example usage: npx ts-node src/lib/days/03 src/input/03.txt");
  exit(1);
}

async function main() {
  const input = await readInput(fileName);
  console.log(`Day 3 - Part 1: ${await part1(input)}`);
  console.log(`Day 3 - Part 2: ${await part2(input)}`);
}

main();
