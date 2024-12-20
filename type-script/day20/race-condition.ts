import * as fs from "fs";
import { CustomSet, MinHeap, Node } from "../utils";

const f: string = fs.readFileSync("../inputs/day20/input.txt", { encoding: "utf-8" });
const input: string[][] = f.trim().split("\n").map(x => x.trim().split(""));


function solution(input: string[][], cheat: number, picoseconds: number): number {
    const walls: CustomSet<Node> = createWalls(input);
    const [startingPosition, endindPosition]: [Node, Node] = findStartingAndEndingPos(input);
    const distanceFromS: Map<string, PosDis> = pathsToAllNodes(input, walls, startingPosition);
    const distanceFromE: Map<string, PosDis> = pathsToAllNodes(input, walls, endindPosition)
    const distance: number = distanceFromS.get(endindPosition.hashCode())!.dis;
    
    let result: number = 0;
    // if any two valid points are equal or lass than "cheat" distance apppart
    // and the culminitive result is less than actual dis minus picoseconds
    for (const pos of distanceFromS.values()) {
        for (const pos2 of distanceFromE.values()) {
            if (absDistanceLessThanCheatDistance(pos, pos2, cheat)
                && culminitiveResultIsLessThanDisMinusPicoseconds(distanceFromS, pos, pos2, distanceFromE, distance, picoseconds)) {
                result++;
            }
        }
    }
    return result;
}

function culminitiveResultIsLessThanDisMinusPicoseconds(distanceFromS: Map<string, PosDis>, pos: PosDis, pos2: PosDis, distanceFromE: Map<string, PosDis>, distance: number, picoseconds: number) {
    return distanceFromS.get(pos.node.hashCode())!.dis
        + Math.abs(pos.node.i - pos2.node.i)
        + Math.abs(pos.node.j - pos2.node.j)
        + distanceFromE.get(pos2.node.hashCode())!.dis
        <= distance - picoseconds;
}

function absDistanceLessThanCheatDistance(pos: PosDis, pos2: PosDis, cheat: number) {
    return (Math.abs(pos.node.i - pos2.node.i) + Math.abs(pos.node.j - pos2.node.j)) <= cheat;
}

function pathsToAllNodes(input: string[][], walls: CustomSet<Node>, sPos: Node): Map<string, PosDis> {
    const startingPositon: PosDis = new PosDis(sPos, 0);
    const queue: MinHeap<PosDis> = new MinHeap();
    queue.insert(startingPositon);
    const seen: Map<string, PosDis> = new Map();
    const height: number = input.length;
    const width: number = input[0].length;
    while (queue.length > 0) {
        const posDis: PosDis = queue.pop()!;

        if (seen.has(posDis.node.hashCode())) {
            continue;
        }

        seen.set(posDis.node.hashCode(), posDis);

        move(posDis, queue, height, width, walls);
    }
    return seen;
}

function move(posDis: PosDis, queue: MinHeap<PosDis>,
    height: number, width: number,
    walls: CustomSet<Node>): void {
    const posibleMoves: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const move of posibleMoves) {
        const x: number = posDis.node.i + move[0];
        const y: number = posDis.node.j + move[1];
        const check: Node = new Node(x, y);
        if (inBounds(height, width, x, y) && !walls.has(check)) {
            const dis: number = posDis.dis + 1;
            const newPosDis: PosDis = new PosDis(check, dis);
            queue.insert(newPosDis);
        }
    }
}

function inBounds(height: number, width: number, x: number, y: number): boolean {
    return (x >= 0 && x < height && y >= 0 && y < width);
}

function findStartingAndEndingPos(input: string[][]): [Node, Node] {
    const startingPosition: Node = new Node(-1, -1);
    const endindPosition: Node = new Node(-1, -1);
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            if (input[i][j] === "S") {
                startingPosition.i = i;
                startingPosition.j = j;
            } else if (input[i][j] === "E") {
                endindPosition.i = i;
                endindPosition.j = j;
            }
        }
    }
    return [startingPosition, endindPosition];
}

function createWalls(input: string[][]): CustomSet<Node> {
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

class PosDis {
    node: Node;
    dis: number;

    constructor(node: Node, dis: number, cheat: number = 0, cheating: boolean = false, start: Node | null = null, end: Node | null = null) {
        this.node = node;
        this.dis = dis;
    }

    valueOf(): number {
        return this.dis;
    }

    hashCode(): string {
        return `${this.node.hashCode()}`;
    }
}

console.log("Part 1:", solution(input, 2, 100));
console.log("Part 2:", solution(input, 20, 100));
