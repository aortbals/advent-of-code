/**
 * This day's challenge uses the [Deno](https://deno.land/) runtime!
 */

async function readInput(fileName: string) {
  const text = await Deno.readTextFile(fileName);
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) =>
      line
        .split("->")
        .map((s) => s.trim())
        .map((s) => s.split(",").map((s) => parseInt(s, 10)))
    );
}

function part1(segments: number[][][]) {
  const points = segments.reduce(
    (points: { [key: string]: number }, segment) => {
      const [[x1, y1], [x2, y2]] = segment;

      // Skip the segment if it's not horizontal or vertical
      if (x1 !== x2 && y1 !== y2) {
        return points;
      }

      const isX = x1 !== x2;
      const [p1, p2] = [isX ? x1 : y1, isX ? x2 : y2].sort((a, b) => a - b);

      for (let i = p1; i <= p2; i++) {
        const key = isX ? `${i},${y1}` : `${x1},${i}`;
        points[key] = points[key] ? points[key] + 1 : 1;
      }

      return points;
    },
    {}
  );

  return Object.values(points).filter((v) => v > 1).length;
}

function part2(segments: number[][][]) {
  const points = segments.reduce(
    (points: { [key: string]: number }, segment) => {
      const [[x1, y1], [x2, y2]] = segment.sort((a, b) => a[0] - b[0]);

      // Diagonal lines
      if (x1 !== x2 && y1 !== y2) {
        for (let i = 0; i <= x2 - x1; i++) {
          const key = `${x1 + i},${y2 > y1 ? y1 + i : y1 - i}`;
          points[key] = points[key] ? points[key] + 1 : 1;
        }
        return points;
      }

      const isX = x1 !== x2;
      const [p1, p2] = [isX ? x1 : y1, isX ? x2 : y2].sort((a, b) => a - b);

      for (let i = p1; i <= p2; i++) {
        const key = isX ? `${i},${y1}` : `${x1},${i}`;
        points[key] = points[key] ? points[key] + 1 : 1;
      }

      return points;
    },
    {}
  );

  return Object.values(points).filter((v) => v > 1).length;
}

const fileName = Deno.args[0];

if (!fileName) {
  console.log(
    "Example usage: deno run --allow-read src/lib/days/05.ts src/input/05.txt"
  );
  Deno.exit(1);
}

async function main() {
  console.log(`Day 5 - Part 1: ${part1(await readInput(fileName))}`);
  console.log(`Day 5 - Part 2: ${part2(await readInput(fileName))}`);
}

main();
