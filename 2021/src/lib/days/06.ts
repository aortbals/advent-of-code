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

function part1(fish: number[], days = 80) {
  for (let i = 0; i < days; i++) {
    fish.forEach((f, i) => {
      if (f === 0) {
        fish[i] = 6;
        fish.push(8);
      } else {
        --fish[i];
      }
    });
  }

  return fish.length;
}

function part2(input: number[], days = 256) {
  // The number of fish at a given timer value is stored at the corresponding array index.
  // BigInt isn't stricly necessary - included as a PoC (result will be the same using a standard number)
  let fish = Array.from({ length: 9 }, () => BigInt(0));

  input.forEach((f) => {
    fish[f] = fish[f] + 1n;
  });

  for (let i = 0; i < days; i++) {
    const next = [...fish];

    // New fish
    next[8] = fish[0];
    // Reset fish
    next[6] = fish[7] + fish[0];
    // Remaining fish timers decrement
    [7, ...Array.from(Array(6).keys())].forEach((i) => {
      next[i] = fish[i + 1];
    });

    fish = next;
  }

  return fish.reduce((c, v) => BigInt(c) + v, 0n);
}

if (!Deno.args[0]) {
  console.log(
    "Example usage: deno run --allow-read src/lib/days/06.ts src/input/06.txt"
  );
  Deno.exit(1);
}

async function main() {
  console.log(
    `Day 6 - Part 1: ${part1(
      await readInput(Deno.args[0]),
      Deno.args[1] ? parseInt(Deno.args[1], 10) : undefined
    )}`
  );
  console.log(
    `Day 6 - Part 2: ${part2(
      await readInput(Deno.args[0]),
      Deno.args[1] ? parseInt(Deno.args[1], 10) : undefined
    )}`
  );
}

main();
