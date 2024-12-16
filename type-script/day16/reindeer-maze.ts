import * as fs from "fs";
import { CustomSet, Node, MinHeap } from "../utils";

const f: string = fs.readFileSync("../inputs/day16/input.txt", { encoding: "utf-8" });
const input: string[][] = f.trim().split("\n").map(x => x.trim().split(""));
const DIR_CHANGE: Map<string, string[]> = new Map([
    ["^", ["^", "<", ">"]], ["v", ["v", "<", ">"]], [">", [">", "v", "^"]], ["<", ["<", "v", "^"]]
]);
const DIR: Map<string, [number, number]> = new Map([
    ["^", [-1, 0]], ["v", [1, 0]], [">", [0, 1]], ["<", [0, -1]]
]);

function part1(input: string[][]): number {
    const walls: CustomSet<Node> = findWalls(input);

    const [startPos, endingPos]: [Node, Node] = findStartEnd(input);
    const startingPos: PosDir = new PosDir(startPos, ">", 0, null);

    const queue: MinHeap<PosDir> = new MinHeap();
    queue.insert(startingPos);
    const seen: CustomSet<PosDir> = new CustomSet();

    while (queue.length > 0) {
        const pos: PosDir = queue.pop()!;

        if (seen.has(pos)) {
            continue;
        }
        if (pos.node.equals(endingPos)) {
            return pos.distance;
        }
        seen.add(pos);

        moveReindeer(pos, queue, walls);
    }
    return -1;
}

function part2(input: string[][]): number {
    const finalDistance: number = part1(input);
    const walls: CustomSet<Node> = findWalls(input);

    const [startPos, endingPos]: [Node, Node] = findStartEnd(input);
    const startingPos: PosDir = new PosDir(startPos, ">", 0, null);
    
    const bestSeats: CustomSet<Node> = new CustomSet();

    findPath(startingPos, walls, bestSeats, endingPos, finalDistance);

    for (let i = 0; i < bestSeats.size; i++) {
        const seat: Node = Array.from(bestSeats)[i];
        if (seat.equals(startPos)) {
            continue;
        } else if (seat.equals(endingPos)) {
            break;
        }

        walls.add(seat);
        findPath(startingPos, walls, bestSeats, endingPos, finalDistance);

        walls.delete(seat);
    }
    return bestSeats.size + 1;
}

function findPath(startingPos: PosDir, walls: CustomSet<Node>, bestSeats: CustomSet<Node>, endingPos: Node, finalDistance: number): number {
    const queue: MinHeap<PosDir> = new MinHeap();
    queue.insert(startingPos);

    const seen: CustomSet<PosDir> = new CustomSet();
    while (queue.length > 0) {
        const pos: PosDir = queue.pop()!;

        if (seen.has(pos)) {
            continue;
        }

        if (pos.node.equals(endingPos) && finalDistance === pos.distance) {
            getPath(pos, bestSeats);
            return pos.distance;
        }

        seen.add(pos);
        moveReindeer(pos, queue, walls);
    }
    return -1;
}

function moveReindeer(pos: PosDir, queue: MinHeap<PosDir>, walls: CustomSet<Node>): void {
    const directions: string[] = DIR_CHANGE.get(pos.direcion)!;
    for (const dir of directions) {
        const move: [number, number] = DIR.get(dir)!;
        const x: number = pos.node.i + move[0];
        const y: number = pos.node.j + move[1];
        const newNode: Node = new Node(x, y);

        if (!walls.has(newNode)) {
            let dis: number = 1;
            if (dir !== pos.direcion) {
                dis += 1000;
            }
            const newPos: PosDir = new PosDir(newNode, dir, pos.distance + dis, pos);
            queue.insert(newPos);
        }
    }
}

function findWalls(input: string[][]): CustomSet<Node> {
    const walls: CustomSet<Node> = new CustomSet();
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            if (input[i][j] === "#") {
                walls.add(new Node(i, j));
            }
        }
    }
    return walls;
}

function findStartEnd(input: string[][]): [Node, Node] {
    let startPos: Node = new Node(-1, -1);
    let endingPos: Node = new Node(-1, -1);
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            if (input[i][j] === "S") {
                startPos.i = i;
                startPos.j = j;
            } else if (input[i][j] === "E") {
                endingPos.i = i;
                endingPos.j = j;
            }
        }
    }
    return [startPos, endingPos];
}

function getPath(finalPos: PosDir, seats: CustomSet<Node>): void {
    let pos = finalPos;
    while (pos.prev !== null) {
        seats.add(pos.prev.node);
        pos = pos.prev;
    }
}

function debugPrint(input: string[][], bestSeats: CustomSet<Node>): void {
    for (let i = 0; i < input.length; i++) {
        let row: string = ""
        for (let j =0; j < input[0].length; j++) {
            const test: Node = new Node(i, j);
            if (bestSeats.has(test)) {
                row+= "O";
                continue;
            }
            row += input[i][j];
        }
        console.log(row)
    }
}

class PosDir {
    node: Node;
    direcion: string;
    distance: number;
    prev: PosDir | null;
    constructor(node: Node, direction: string, distance: number, prev: PosDir | null) {
        this.node = node;
        this.direcion = direction;
        this.distance = distance;
        this.prev = prev;
    }

    hashCode(): string {
        return `${this.node.hashCode()}-${this.direcion}`;
    }

    valueOf(): number {
        return this.distance;
    }
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
