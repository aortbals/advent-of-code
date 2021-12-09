/**
 * This day's challenge uses the [Deno](https://deno.land/) runtime!
 */

async function readInput(fileName: string) {
  const text = await Deno.readTextFile(fileName);
  return text
    .split(",")
    .filter(Boolean)
    .map((v) => parseInt(v, 10));
}

function median(numbers: number[]) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function average(array: number[]) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

function compound(num: number) {
  let count = 0;

  for (let i = 1; i <= num; i++) {
    count += i;
  }

  return count;
}

function part1(positions: number[]) {
  const m = median(positions);
  return positions.reduce((fuel, position) => {
    fuel = fuel + Math.abs(position - m);
    return fuel;
  }, 0);
}

function part2(positions: number[]) {
  const avg = average(positions);
  const center = [Math.floor(avg), Math.ceil(avg)];

  const options = center.map((i) =>
    positions.reduce((fuel, position) => {
      fuel = fuel + compound(Math.abs(position - i));
      return fuel;
    }, 0)
  );

  return Math.min(...options);
}

if (!Deno.args[0]) {
  console.log(
    "Example usage: deno run --allow-read src/lib/days/07.ts src/input/07.txt"
  );
  Deno.exit(1);
}

async function main() {
  console.log(`Day 7 - Part 1: ${part1(await readInput(Deno.args[0]))}`);
  console.log(`Day 7 - Part 2: ${part2(await readInput(Deno.args[0]))}`);
}

main();
