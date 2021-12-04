import fs from "fs/promises";
import { exit } from "process";

enum Direction {
  Forward = "forward",
  Down = "down",
  Up = "up",
}

interface Command {
  direction: string;
  units: number;
}

export async function readInput(fileName: string): Promise<Array<Command>> {
  return (await fs.readFile(fileName))
    .toString()
    .split("\n")
    .filter(Boolean)
    .map((s) => {
      const [direction, units] = s.split(" ");
      return {
        direction,
        units: parseInt(units, 10),
      };
    });
}

async function part1(input: Array<Command>) {
  const result = input.reduce(
    (result, command) => {
      if (command.direction === Direction.Forward) {
        return {
          depth: result.depth,
          horizontal: result.horizontal + command.units,
        };
      }

      if (command.direction === Direction.Up) {
        return {
          depth: result.depth - command.units,
          horizontal: result.horizontal,
        };
      }

      if (command.direction === Direction.Down) {
        return {
          depth: result.depth + command.units,
          horizontal: result.horizontal,
        };
      }

      return result;
    },
    {
      depth: 0,
      horizontal: 0,
    }
  );

  return result.horizontal * result.depth;
}

async function part2(input: Array<Command>) {
  const result = input.reduce(
    (result, command) => {
      if (command.direction === Direction.Forward) {
        return {
          ...result,
          depth: result.depth + result.aim * command.units,
          horizontal: result.horizontal + command.units,
        };
      }

      if (command.direction === Direction.Up) {
        return {
          ...result,
          aim: result.aim - command.units,
        };
      }

      if (command.direction === Direction.Down) {
        return {
          ...result,
          aim: result.aim + command.units,
        };
      }

      return result;
    },
    {
      depth: 0,
      horizontal: 0,
      aim: 0,
    }
  );

  return result.horizontal * result.depth;
}

const fileName = process.argv.slice(2)[0];

if (!fileName) {
  console.log("Example usage: npx ts-node src/lib/days/02 src/input/02.txt");
  exit(1);
}

async function main() {
  const input = await readInput(fileName);
  console.log(`Day 2 - Part 1: ${await part1(input)}`);
  console.log(`Day 2 - Part 2: ${await part2(input)}`);
}

main();
