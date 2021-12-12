import { writeAllSync } from "https://deno.land/std@0.117.0/streams/conversion.ts";

async function readInput(fileName: string) {
  const text = await Deno.readTextFile(fileName);
  return text
    .split("\n")
    .filter(Boolean)
    .map((l) => l.split("").map((v) => parseInt(v, 10)));
}

function part1(input: number[][]) {
  const lowPoints = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const v = input[i][j];

      const adjacent = [
        i > 0 ? input[i - 1][j] : undefined, // top
        i + 1 < input.length ? input[i + 1][j] : undefined, // bottom
        j > 0 ? input[i][j - 1] : undefined, // left
        j + 1 < input[i].length ? input[i][j + 1] : undefined, // right
      ].filter((v): v is number => v !== undefined);

      if (adjacent.every((p) => v < p)) {
        lowPoints.push(v);
      }
    }
  }

  return lowPoints.reduce((risk, p) => {
    return risk + p + 1;
  }, 0);
}

function _print(matrix: string[][]) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      writeAllSync(Deno.stdout, new TextEncoder().encode(` ${matrix[i][j]}`));
    }
    console.log();
  }
}

function part2(input: number[][]) {
  // Basin map where each point contains the basin key
  const basinMatrix: string[][] = new Array(input.length)
    .fill(undefined)
    .map(() => new Array(input[0].length).fill(undefined));

  /**
   * Recursively spread the basin until edges are hit, or the point has already been evaluated
   */
  function spreadBasin(i: number, j: number, basinKey: string) {
    const v = input[i][j];

    if (v === 9) {
      // Mark the edge as visited, don't continue
      basinMatrix[i][j] = "EDGE";
      return;
    }

    basinMatrix[i][j] = basinKey;

    const adjacentCoords = [
      i > 0 && !basinMatrix[i - 1][j] ? [i - 1, j] : undefined, // top
      i + 1 < input.length && !basinMatrix[i + 1][j] ? [i + 1, j] : undefined, // bottom
      j > 0 && !basinMatrix[i][j - 1] ? [i, j - 1] : undefined, // left
      j + 1 < input[i].length && !basinMatrix[i][j + 1]
        ? [i, j + 1]
        : undefined, // right
    ].filter((v): v is number[] => v !== undefined);

    adjacentCoords.forEach(([x, y]) => {
      spreadBasin(x, y, basinKey);
    });
  }

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const v = input[i][j];

      const adjacent = [
        i > 0 ? input[i - 1][j] : undefined, // top
        i + 1 < input.length ? input[i + 1][j] : undefined, // bottom
        j > 0 ? input[i][j - 1] : undefined, // left
        j + 1 < input[i].length ? input[i][j + 1] : undefined, // right
      ].filter((n): n is number => n !== undefined);

      if (adjacent.every((p) => v < p)) {
        // A low point has been found, fill it
        spreadBasin(i, j, `${i},${j}`);
      }
    }
  }

  return Object.values(
    basinMatrix.reduce((counts: { [key: string]: number }, row) => {
      return row.reduce((counts, v) => {
        if (v && v !== "EDGE") counts[v] = counts[v] ? counts[v] + 1 : 1;
        return counts;
      }, counts);
    }, {})
  )
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((c, v) => c * v, 1);
}

if (!Deno.args[0]) {
  console.log(
    "Example usage: deno run --allow-read src/lib/days/09.ts src/input/09.txt"
  );
  Deno.exit(1);
}

async function main() {
  console.log(`Day 9 - Part 1: ${part1(await readInput(Deno.args[0]))}`);
  // console.log(`Day 9 - Part 2: ${part2(await readInput(Deno.args[0]))}`);
  console.log(`Day 9 - Part 2: ${part2(await readInput(Deno.args[0]))}`);
}

main();
