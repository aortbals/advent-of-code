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

if (!Deno.args[0]) {
  console.log(
    "Example usage: deno run --allow-read src/lib/days/08.ts src/input/08.txt"
  );
  Deno.exit(1);
}

async function main() {
  console.log(`Day 9 - Part 1: ${part1(await readInput(Deno.args[0]))}`);
}

main();
