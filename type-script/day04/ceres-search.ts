import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day04/input.txt", { encoding: "utf-8" });
const input: string[][] = f.trim().split("\n").map(x => x.trim().split(""));

function part1(input: string[][]): number {
    let result: number = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            if (input[i][j] === "X") {
                result += findXMAS(input, i, j);
            }
        }
    }
    return result;
}

function part2(input: string[][]): number {
    let result: number = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            if (input[i][j] === "A") {
                result += findXMas(input, i, j);
            }
        }
    }
    return result;
}

function findXMAS(input: string[][], i: number, j: number): number {
    let result: number = 0;
    const direction: number[][] = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (const dir of direction) {
        result += checkForWord(input, i, j, dir);
    }
    return result;
}

function findXMas(input: string[][], i: number, j: number): number {
    const oneDiagonal: number[][] = [[1, 1], [-1, -1]];
    const secondDiagonal: number[][] = [[1, -1], [-1, 1]];
    if (!checkDiagonal(input, i, j, oneDiagonal)) {
        return 0;
    }
    if (!checkDiagonal(input, i, j, secondDiagonal)) {
        return 0;
    }
    return 1;
}

function checkDiagonal(input: string[][], i: number, j: number, diagonal: number[][]): boolean {
    const opposite = new Map([["M", "S"], ["S", "M"]]);
    let prev: string = "";
    for (const dir of diagonal) {
        const x: number = i + dir[0];
        const y: number = j + dir[1];
        if (!inBounds(input, x, y) || "MS".indexOf(input[x][y]) === -1) {
            return false;
        }
        if (prev && opposite.get(input[x][y]) !== prev) {
            return false;
        }
        prev = input[x][y];
    }
    return true;
}

function checkForWord(input: string[][], i: number, j: number, dir: number[]): number {
    let x: number = i + dir[0];
    let y: number = j + dir[1];
    if (!inBounds(input, x, y) || input[x][y] !== "M") return 0;
    x += dir[0];
    y += dir[1];
    if (!inBounds(input, x, y) || input[x][y] !== "A") return 0;
    x += dir[0];
    y += dir[1];
    if (!inBounds(input, x, y) || input[x][y] !== "S") return 0;
    return 1;
}

function inBounds(input: string[][], x: number, y: number): boolean {
    if (x < 0 || x >= input.length || y < 0 || y >= input[0].length) {
        return false;
    }
    return true;
}

console.log("Part 1:", part1(input))
console.log("Part 2:", part2(input))
