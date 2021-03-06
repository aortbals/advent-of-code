import fs from "fs/promises";
import { exit } from "process";

function chunk<T>(arr: T[], size: number): T[][] {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    const chunk = arr.slice(i, i + size);
    res.push(chunk);
  }
  return res;
}

interface Cell {
  value: number;
  marked: boolean;
}

type Board = Cell[][];

interface Input {
  drawnNumbers: number[];
  boards: Board[];
}

export async function readInput(fileName: string): Promise<Input> {
  const lines = (await fs.readFile(fileName))
    .toString()
    .split("\n")
    .filter(Boolean);

  const [drawnNumbers, ...boardLines] = lines;

  return {
    drawnNumbers: drawnNumbers.split(",").map((n) => parseInt(n, 10)),
    boards: chunk(
      boardLines.map((l) =>
        l
          .trim()
          .split(/\s+/)
          .map((value: string) => ({
            value: parseInt(value, 10),
            marked: false,
          }))
      ),
      5
    ),
  };
}

function checkWin(board: Board) {
  const winningCount = board.length;

  for (let i = 0; i < board.length; i++) {
    let rowWin = 0;
    let colWin = 0;
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].marked) {
        rowWin++;
      }
      if (board[j][i].marked) {
        colWin++;
      }
    }
    if (rowWin === winningCount || colWin === winningCount) {
      return true;
    }
  }
}

function calculateScore(board: Board, lastCalled: number) {
  const unmarkedSum = board.reduce(
    (sum, row) =>
      sum + row.reduce((sum, cell) => sum + (cell.marked ? 0 : cell.value), 0),
    0
  );

  return unmarkedSum * lastCalled;
}

function updateBoard(board: Board, num: number): [Board, boolean] {
  let hit = false;

  const updatedBoard = board.map((row) =>
    row.map((cell) => {
      hit = hit || (!cell.marked && num === cell.value);

      return {
        value: cell.value,
        marked: cell.marked || num === cell.value,
      };
    })
  );

  return [updatedBoard, hit];
}

function prettyPrintBoard(board: Board) {
  return board
    .map((row) =>
      row
        .map((cell) =>
          !cell.marked
            ? `\x1b[2m${cell.value < 10 ? ` ${cell.value}` : cell.value}\x1b[0m`
            : cell.value < 10
            ? ` ${cell.value}`
            : cell.value
        )
        .join(" ")
    )
    .join("\n");
}

function part1({ drawnNumbers, ...input }: Input) {
  // Boards are mutated, make a fresh copy
  const boards = [...input.boards];

  for (const number of drawnNumbers) {
    // Due ot the nature of the challenge, we assume a single winner.
    let winner: Board | undefined = undefined;

    boards.forEach((board, index) => {
      const [nextBoard, hit] = updateBoard(board, number);

      if (hit && checkWin(nextBoard)) {
        winner = nextBoard;
      }

      boards[index] = nextBoard;
    });

    if (winner) {
      console.log(
        `On a draw of ${number}, your winner is:\n\n${prettyPrintBoard(
          winner
        )}\n`
      );

      return calculateScore(winner, number);
    }
  }
}

function part2({ drawnNumbers, ...input }: Input) {
  // Boards are mutated, make a fresh copy
  let boards = [...input.boards];

  for (const number of drawnNumbers) {
    const winners: number[] = [];

    boards.forEach((board, index) => {
      const [nextBoard, hit] = updateBoard(board, number);
      boards[index] = nextBoard;

      if (hit && checkWin(nextBoard)) {
        winners.push(index);
      }
    }, boards);

    if (boards.length === 1 && winners.length === 1) {
      console.log(
        `\nOn a draw of ${number}, your winner is:\n\n${prettyPrintBoard(
          boards[winners[0]]
        )}\n`
      );

      return calculateScore(boards[winners[0]], number);
    }

    boards = boards.filter((_b, i) => winners.indexOf(i) === -1);
  }
}

const fileName = process.argv.slice(2)[0];

if (!fileName) {
  console.log("Example usage: npx ts-node src/lib/days/04 src/input/04.txt");
  exit(1);
}

async function main() {
  const input = await readInput(fileName);
  console.log(`Day 4 - Part 1: ${await part1(input)}`);
  console.log(`Day 4 - Part 2: ${await part2(input)}`);
}

main();
