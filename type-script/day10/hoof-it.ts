import * as fs from "fs";
import { Node, CustomSet, Tuple } from "../utils";

const f: string = fs.readFileSync("../inputs/day10/input.txt", { encoding: "utf-8" });
const trails: number[][] = f.trim().split("\n").map(x => x.trim().split("").map(y => Number(y)));

function part1(trails: number[][]): number {
    const bfs: Array<HikingNode> = new Array();
    addStartingPoinnts(trails, bfs);
    let result: number = 0;
    let seenStartingPoints: CustomSet<Tuple<Node>> = new CustomSet();
    while (bfs.length > 0) {
        const current: HikingNode = bfs.shift()!;

        if (current.value === 9) {
            const tuple: Tuple<Node> = new Tuple(current.startingPoint, current.node);
            if (seenStartingPoints.has(tuple)) {
                continue;
            }
            seenStartingPoints.add(tuple);
            result++;
            continue;
        }

        addNextSteps(current, trails, bfs);
    }
    return result;
}

function part2(trails: number[][]): number {
    const bfs: Array<HikingNode> = new Array();
    addStartingPoinnts(trails, bfs);
    let result: number = 0;
    while (bfs.length > 0) {
        const current: HikingNode = bfs.shift()!;

        if (current.value === 9) {
            result++;
            continue;
        }

        addNextSteps(current, trails, bfs);
    }
    return result;
}

function addNextSteps(current: HikingNode, trails: number[][], bfs: Array<HikingNode>): void {
    const nextSteps: number[][] = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (const step of nextSteps) {
        const x: number = current.node.i + step[0];
        const y: number = current.node.j + step[1];
        if (inBounds(trails, x, y) && trails[x][y] === (current.value + 1)) {
            const newNode: Node = new Node(x, y);
            const newHikingNode: HikingNode = new HikingNode(newNode, trails[x][y], current.startingPoint);
            bfs.push(newHikingNode);
        }
    }
}

function inBounds(trails: number[][], x: number, y: number): boolean {
    return (x >= 0 && x < trails.length && y >= 0 && y < trails[0].length);
}

function addStartingPoinnts(trails: number[][], bfs: Array<HikingNode>): void {
    for (let i = 0; i < trails.length; i++) {
        for (let j = 0; j < trails[0].length; j++) {
            if (trails[i][j] === 0) {
                const newNode: Node = new Node(i, j);
                const newHikNode: HikingNode = new HikingNode(newNode, trails[i][j], newNode);
                bfs.push(newHikNode);
            }
        }
    }
}

class HikingNode {
    node: Node;
    value: number;
    startingPoint: Node;

    constructor(node: Node, value: number, startingPoint: Node) {
        this.node = node;
        this.value = value;
        this.startingPoint = startingPoint;
    }
}

console.log("Part 1:", part1(trails));
console.log("Part 2:", part2(trails));
