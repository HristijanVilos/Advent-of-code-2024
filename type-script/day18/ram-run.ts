import * as fs from "fs";
import { CustomSet, Node } from "../utils";

const f: string = fs.readFileSync("../inputs/day18/input.txt", { encoding: "utf-8" });
const input: number[][] = f.trim().split("\n").map(x => x.split(",").map(y => Number(y)));


function part1(input: number[][], width: number, bytes: number): number {
    const startingPos: Node = new Node(0, 0);
    const endingPos: Node = new Node(width - 1, width - 1);
    const coruptedMemory: CustomSet<Node> = constructCoruptedMemory(input, bytes);
    const start: PosDis = new PosDis(startingPos, 0);
    const queue: PosDis[] = [start];
    const seen: CustomSet<Node> = new CustomSet();

    while (queue.length > 0) {
        const posDis: PosDis = queue.shift()!;

        if (seen.has(posDis.node)) {
            continue;
        }

        seen.add(posDis.node);

        if (posDis.node.equals(endingPos)) {
            return posDis.dis;
        }

        move(posDis, queue, width, coruptedMemory);
    }
    return -1;
}


function part2(input: number[][], width: number): number[] {
    const startingPos: Node = new Node(0, 0);
    const endingPos: Node = new Node(width - 1, width - 1);
    const coruptedMemory: CustomSet<Node> = new CustomSet();

    for (const corupted of input) {
        const coruptedNode: Node = new Node(corupted[0], corupted[1]);
        coruptedMemory.add(coruptedNode);

        if (!exitIsPosible(startingPos, endingPos, coruptedMemory, width)) {
            return corupted;
        }

    }
    return [-1, -1];
}

function exitIsPosible(startingPos: Node, endingPos: Node, coruptedMemory: CustomSet<Node>, width: number): boolean {
    const start: PosDis = new PosDis(startingPos, 0);
    const queue: PosDis[] = [start];
    const seen: CustomSet<Node> = new CustomSet();
    while (queue.length > 0) {
        const posDis: PosDis = queue.shift()!;

        if (seen.has(posDis.node)) {
            continue;
        }

        seen.add(posDis.node);

        if (posDis.node.equals(endingPos)) {
            return true;
        }

        move(posDis, queue, width, coruptedMemory);
    }
    return false
}


function move(posDis: PosDis, queue: PosDis[], width: number, coruptedMemory: CustomSet<Node>): void {
    const posibleMoves: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const move of posibleMoves) {
        const x: number = posDis.node.i + move[0];
        const y: number = posDis.node.j + move[1];
        const check: Node = new Node(x, y);
        if (inBounds(width, x, y) && !coruptedMemory.has(check)) {
            const dis: number = posDis.dis + 1;
            const newPosDis: PosDis = new PosDis(check, dis);
            queue.push(newPosDis);
        }
    }
}

function inBounds(width: number, x: number, y: number): boolean {
    return (x >= 0 && x < width && y >= 0 && y < width);
}

function constructCoruptedMemory(input: number[][], bytes: number): CustomSet<Node> {
    const coruptedMemory: CustomSet<Node> = new CustomSet();
    for (let i = 0; i < bytes; i++) {
        const corupted: Node = new Node(input[i][0], input[i][1]);
        coruptedMemory.add(corupted);
    }
    return coruptedMemory;
}

class PosDis {
    node: Node;
    dis: number;

    constructor(node: Node, dis: number) {
        this.node = node;
        this.dis = dis;
    }
}

console.log("Part 1:", part1(input, 71, 1024));
console.log("Part 2:", part2(input, 71));
