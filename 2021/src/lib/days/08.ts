async function readInput(fileName: string) {
  const text = await Deno.readTextFile(fileName);
  return text
    .split("\n")
    .filter(Boolean)
    .map((l) =>
      l.split("|").map((v) =>
        v
          .trim()
          .split(/\s+/)
          .map((s) => s.split(""))
      )
    );
}

const UniqueSegments = new Set([2, 4, 3, 7]); // Digits 1, 4, 7, 8 respectively

function part1(input: string[][][][]) {
  return input.reduce((count, line) => {
    const [, output] = line;

    count += output.reduce((c, v) => {
      c += UniqueSegments.has(v.length) ? 1 : 0;
      return c;
    }, 0);

    return count;
  }, 0);
}

/**
 * Key/Value: Unique Count / Respective Number
 */
const UniqueSegmentMap = new Map([
  [2, 1],
  [4, 4],
  [3, 7],
  [7, 8],
]);

function intersection(d1: string[], d2: string[] = []) {
  return d1.filter((v) => d2.indexOf(v) !== -1);
}

function part2(input: string[][][][]) {
  return input.reduce((result, line) => {
    const [signals, output] = line;

    const digits = signals.reduce((mapping: Map<number, string[]>, v) => {
      const uniqSegment = UniqueSegmentMap.get(v.length);
      if (uniqSegment) {
        mapping.set(uniqSegment, v);
      }
      return mapping;
    }, new Map());

    function setDigit(
      digit: number,
      condition: (signal: string[]) => boolean | undefined
    ) {
      const signal = signals.find(condition);
      if (signal) {
        digits.set(digit, signal);
      }
    }

    setDigit(
      3,
      (s) => s.length === 5 && intersection(s, digits.get(1)).length === 2
    );
    setDigit(
      5,
      (s) =>
        s.length === 5 &&
        s !== digits.get(3) &&
        intersection(s, digits.get(4)).length === 3
    );
    setDigit(
      2,
      (s) => s.length === 5 && s !== digits.get(3) && s !== digits.get(5)
    );
    setDigit(
      9,
      (s) => s.length === 6 && intersection(s, digits.get(4)).length === 4
    );
    setDigit(
      6,
      (s) =>
        s.length === 6 &&
        s !== digits.get(9) &&
        intersection(s, digits.get(7)).length === 2
    );
    setDigit(
      0,
      (s) => s.length === 6 && s !== digits.get(9) && s !== digits.get(6)
    );

    const segments = new Map(
      Array.from(digits).map((pair) => [pair[1].sort().join(""), pair[0]])
    );

    return (
      result +
      parseInt(output.map((v) => segments.get(v.sort().join(""))).join(""), 10)
    );
  }, 0);
}

if (!Deno.args[0]) {
  console.log(
    "Example usage: deno run --allow-read src/lib/days/08.ts src/input/08.txt"
  );
  Deno.exit(1);
}

async function main() {
  console.log(`Day 8 - Part 1: ${part1(await readInput(Deno.args[0]))}`);
  console.log(`Day 8 - Part 2: ${part2(await readInput(Deno.args[0]))}`);
}

main();
