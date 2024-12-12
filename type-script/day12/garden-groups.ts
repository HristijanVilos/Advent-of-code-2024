import * as fs from "fs";
import crypto from "crypto"
import { UUID } from "crypto";

import { CustomSet, DiffTuple, Node, Tuple } from "../utils";

const f: string = fs.readFileSync("../inputs/day12/input.txt", { encoding: "utf-8" });
const input: string[][] = f.trim().split("\n").map(x => x.trim().split(""));

function part1(input: string[][]): number {
    const regions: Map<string, Tuple<number>> = new Map();
    const seen: CustomSet<Node> = new CustomSet();

    constructRegions(seen, input, regions);
    let result: number = 0;
    for (const areaPerimetar of regions.values()) {
        result += areaPerimetar.first * areaPerimetar.second;
    }
    return result;
}

function part2(input: string[][]): number {
    const regions: Map<string, DiffTuple<number, CustomSet<EdgeNode>>> = new Map();
    const seen: CustomSet<Node> = new CustomSet();

    constructRegions2(seen, input, regions);
    let result: number = 0;
    for (let reg of regions.values()) {
        const area: number = reg.first;
        const edgesSet: CustomSet<EdgeNode> = reg.second;
        let perimetar: number = 0;
        for (let edge of edgesSet) {
            perimetar += numberOfUniqueEdges(edge, edgesSet);
            edge.calculated = true;
        }
        result += area * perimetar;
    }
    return result;
}

function numberOfUniqueEdges(edge: EdgeNode, edgesSet: CustomSet<EdgeNode>): number {
    const posibleMoves: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const check: string[] = [];
    let calculatedNeighbour: number = 0;
    let numberOfEdges: number = 0;
    for (let move of posibleMoves) {
        const x: number = edge.node.i + move[0];
        const y: number = edge.node.j + move[1];
        const checkEdge: EdgeNode = new EdgeNode(new Node(x, y), []);
        if (edgesSet.has(checkEdge) && edgesSet.get(checkEdge)?.calculated) {
            calculatedNeighbour++;
            check.push(...edgesSet.get(checkEdge)!.edges);
        }
    }
    if (calculatedNeighbour === 0) {
        numberOfEdges = edge.edges.length;
    } else {
        // if 2 neighboursh but not a corner
        // RRRRX
        // RRRRX
        // XXRRR
        // XXRXX
        // This case R on positon 2, 3
        numberOfEdges = edge.edges.filter(x => !check.includes(x)).length || 0;
    }
    return numberOfEdges;
}

function constructRegions2(seen: CustomSet<Node>, input: string[][], regions: Map<string, DiffTuple<number, CustomSet<EdgeNode>>>): void {
    if (seen.size === (input[0].length * input.length)) {
        return;
    }

    const startingNode: Node = findFirstAreaNotInSeen(seen, input);
    if (startingNode.i === -1) {
        return;
    }

    const uuid: UUID = crypto.randomUUID();
    const queue: Node[] = [startingNode];

    while (queue.length > 0) {
        const node: Node = queue.shift()!;

        if (seen.has(node)) {
            continue;
        }
        seen.add(node);

        moveToSameRegion2(input, node, queue, regions, uuid);
    }
    constructRegions2(seen, input, regions);
}

function moveToSameRegion2(
    input: string[][], currentNode: Node, queue: Node[], regions: Map<string, DiffTuple<number, CustomSet<EdgeNode>>>, uuid: UUID): void {
    const posibleMoves: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let perimetar: number = 4;
    const edgneNode: EdgeNode = new EdgeNode(currentNode, []);
    for (const move of posibleMoves) {
        const x: number = currentNode.i + move[0];
        const y: number = currentNode.j + move[1];
        if (inBounds(input, x, y) && input[currentNode.i][currentNode.j] === input[x][y]) {
            const newNode: Node = new Node(x, y);
            queue.push(newNode);
            perimetar--;
        } else {
            if (x > currentNode.i) {
                edgneNode.edges.push("^");
            } else if (x < currentNode.i) {
                edgneNode.edges.push("v");
            } else if (y < currentNode.j) {
                edgneNode.edges.push("<");
            } else if (y > currentNode.j) {
                edgneNode.edges.push(">");
            }
        }
    }
    if (regions.has(input[currentNode.i][currentNode.j] + "-" + uuid)) {
        const areaPerimetar: DiffTuple<number, CustomSet<EdgeNode>> = regions.get(input[currentNode.i][currentNode.j] + "-" + uuid)!;
        areaPerimetar.first++; // first is Area
        if (edgneNode.edges.length > 0) {
            areaPerimetar.second.add(edgneNode)
        }
    } else {
        regions.set(input[currentNode.i][currentNode.j] + "-" + uuid, new DiffTuple(1, new CustomSet()));
        if (edgneNode.edges.length > 0) {
            const areaPerimetar: DiffTuple<number, CustomSet<EdgeNode>> = regions.get(input[currentNode.i][currentNode.j] + "-" + uuid)!;
            areaPerimetar.second.add(edgneNode)
        }
    }
}

function constructRegions(seen: CustomSet<Node>, input: string[][], regions: Map<string, Tuple<number>>): void {
    if (seen.size === (input[0].length * input.length)) {
        return;
    }

    const startingNode: Node = findFirstAreaNotInSeen(seen, input);
    if (startingNode.i === -1) {
        return;
    }

    const uuid: UUID = crypto.randomUUID();
    const queue: Node[] = [startingNode];

    while (queue.length > 0) {
        const node: Node = queue.shift()!;

        if (seen.has(node)) {
            continue;
        }
        seen.add(node);

        moveToSameRegion(input, node, queue, regions, uuid);
    }
    constructRegions(seen, input, regions);
}

function findFirstAreaNotInSeen(seen: CustomSet<Node>, input: string[][]): Node {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            const node: Node = new Node(i, j);
            if (seen.has(node)) {
                continue;
            }
            return node;
        }
    }
    return new Node(-1, -1);
}

function moveToSameRegion(
    input: string[][], currentNode: Node, queue: Node[], regions: Map<string, Tuple<number>>, uuid: UUID): void {
    const posibleMoves: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let perimetar: number = 4;
    for (const move of posibleMoves) {
        const x: number = currentNode.i + move[0];
        const y: number = currentNode.j + move[1];
        if (inBounds(input, x, y) && input[currentNode.i][currentNode.j] === input[x][y]) {
            const newNode: Node = new Node(x, y);
            queue.push(newNode);
            perimetar--;
        }
    }
    adjustAreaAndPerimetar(regions, input, currentNode, uuid, perimetar);
}

function adjustAreaAndPerimetar(
    regions: Map<string, Tuple<number>>, input: string[][], currentNode: Node, uuid: string, perimetar: number): void {
    if (regions.has(input[currentNode.i][currentNode.j] + "-" + uuid)) {
        const areaPerimetar: Tuple<number> = regions.get(input[currentNode.i][currentNode.j] + "-" + uuid)!;
        areaPerimetar.first++; // first is Area
        areaPerimetar.second += perimetar; // second is Perimetar
    } else {
        regions.set(input[currentNode.i][currentNode.j] + "-" + uuid, new Tuple(1, perimetar));
    }
}

function inBounds(input: string[][], x: number, y: number): boolean {
    return (x >= 0 && x < input.length && y >= 0 && y < input[0].length);
}

class EdgeNode {
    node: Node;
    edges: string[];
    calculated: boolean = false;

    constructor(node: Node, edges: string[]) {
        this.node = node;
        this.edges = edges;
    }

    hashCode(): string {
        return `${this.node}`;
    }
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
