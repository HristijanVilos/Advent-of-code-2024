import * as fs from "fs";
import { Node, arraysOfPrimitivesEqual, CustomSet } from "../utils";

const f: string = fs.readFileSync("../inputs/day06/input.txt", { encoding: "utf-8" });
const input: string[][] = f.trim().split("\n").map(x => x.trim().split(""));
const direction: Map<string, [number, number]> = new Map([
    ["^", [-1, 0]],
    ["v", [1, 0]],
    [">", [0, 1]],
    ["<", [0, -1]]
]);

function part1(inp: string[][], direction: Map<string, [number, number]>): number {
    const input = JSON.parse(JSON.stringify(inp));
    const node: Node = findStartingPosition(input);
    const dir: [number, number] = direction.get(input[node.i][node.j])!;
    let guard: Guard = new Guard(node, dir);
    let inBounds: boolean = true;
    while (inBounds) {
        [guard, inBounds] = moveGuard(input, guard);
    }
    return countVisitedPositions(input);
}

function part2(inp: string[][], direction: Map<string, [number, number]>): number {
    let result: number = 0;
    for (let i = 0; i < inp.length; i++) {
        for (let j = 0; j < inp[0].length; j++) {
            const input = JSON.parse(JSON.stringify(inp));
            if (input[i][j] !== ".") {
                continue;
            }
            input[i][j] = "#";

            const node: Node = findStartingPosition(input);
            const dir: [number, number] = direction.get(input[node.i][node.j])!;
            let guard: Guard = new Guard(node, dir);
            let inBounds: boolean = true;
            const seen: CustomSet<Guard> = new CustomSet();
            while (inBounds) {
                if (seen.has(guard)) {
                    // inf loop detected
                    result++;
                    break;
                }
                seen.add(guard);
                [guard, inBounds] = moveGuard(input, guard);
            }
        }
    }
    return result;
}

function findStartingPosition(input: string[][]): Node {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            if ("><v^".indexOf(input[i][j]) > -1) {
                return new Node(i, j);
            }
        }
    }
    return new Node(-1, -1);
}

function moveGuard(input: string[][], guard: Guard): [Guard, boolean] {
    const node: Node = guard.position;
    const dir: [number, number] = guard.direction;
    const x: number = node.i + dir[0];
    const y: number = node.j + dir[1];
    if (x < 0 || x >= input.length || y < 0 || y >= input[0].length) {
        input[node.i][node.j] = "X";
        return [guard, false];
    } else if (input[x][y] === "#") {
        input[node.i][node.j] = "X";
        const newDir: [number, number] = rotate(dir);
        return [new Guard(node, newDir), true];
    } else {
        input[node.i][node.j] = "X";
        const newPos: Node = new Node(x, y);
        return [new Guard(newPos, dir), true];
    }
}

function rotate(dir: [number, number]): [number, number] {
    if (arraysOfPrimitivesEqual(dir, [-1, 0])) {
        return [0, 1];
    } else if (arraysOfPrimitivesEqual(dir, [0, 1])) {
        return [1, 0];
    } else if (arraysOfPrimitivesEqual(dir, [1, 0])) {
        return [0, -1];
    } else if (arraysOfPrimitivesEqual(dir, [0, -1])) {
        return [-1, 0];
    }
    return [0, 0]; // somtehing is wrong if here
}

function countVisitedPositions(input: string[][]): number {
    let result: number = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input.length; j++) {
            if (input[i][j] === "X") {
                result++;
            }
        }
    }
    return result;
}

class Guard {
    position: Node;
    direction: [number, number];

    constructor(pos: Node, dir: [number, number]) {
        this.position = pos;
        this.direction = dir;
    }

    equals(other: Guard): boolean {
        return other instanceof Guard && this.position === other.position && arraysOfPrimitivesEqual(this.direction, other.direction);
    }

    hashCode(): string {
        return `${this.position.hashCode()}-${this.direction}`;
    }
}

console.log("Part 1:", part1(input, direction));
console.log("Part 2:", part2(input, direction));
