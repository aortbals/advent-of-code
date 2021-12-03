import fs from "fs/promises";
import { exit } from "process";

export async function readInput(fileName: string) {
  return (await fs.readFile(fileName))
    .toString()
    .split("\n")
    .filter(Boolean)
    .map((s) => parseInt(s, 10));
}

async function part1(input: number[]) {
  return input.reduce((result, measurement, index) => {
    if (index === 0) {
      return result;
    }

    return measurement > input[index - 1] ? result + 1 : result;
  }, 0);
}

function sum(array: number[]) {
  return array.reduce((a, b) => a + b, 0);
}

async function part2(input: number[], windowSize = 3) {
  return input.reduce((result, _measurement, index) => {
    if (index + windowSize >= input.length) {
      return result;
    }

    const window = input.slice(index, index + windowSize);
    const nextWindow = input.slice(index + 1, index + 1 + windowSize);

    return sum(nextWindow) > sum(window) ? result + 1 : result;
  }, 0);
}

const fileName = process.argv.slice(2)[0];

if (!fileName) {
  console.log("Example usage: npx ts-node src/lib/days/01 src/input/01.txt");
  exit(1);
}

async function main() {
  const input = await readInput(fileName);
  console.log(`Day 1 - Part 1: ${await part1(input)}`);
  console.log(`Day 1 - Part 2: ${await part2(input)}`);
}

main();
