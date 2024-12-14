import * as fs from "fs";
import { CustomSet, Node } from "../utils";

const f: string = fs.readFileSync("../inputs/day14/input.txt", { encoding: "utf-8" });

function part1(f: string, width: number, height: number): number {
    const robots: Robot[] = f.trim().split("\n").map(x => Robot.constructRobotFromString(x));
    for (let robot of robots) {
        for (let i = 0; i < 100; i++) {
            robot.position.i = wrapAround(robot.position.i, robot.velocities[0], width);
            robot.position.j = wrapAround(robot.position.j, robot.velocities[1], height);
        }
    }
    const i: number = Math.floor(width / 2);
    const j: number = Math.floor(height / 2);
    let first: number = 0;
    let second: number = 0;
    let third: number = 0;
    let four: number = 0;
    for (let robot of robots) {
        if (robot.position.i < i) {
            if (robot.position.j < j) {
                first++;
            } else if (robot.position.j > j) {
                second++;
            }
        } else if (robot.position.i > i) {
            if (robot.position.j < j) {
                third++;
            } else if (robot.position.j > j) {
                four++;
            }
        }
    }
    return first * second * third * four;
}

function part2(f: string, width: number, height: number): number {
    const robots: Robot[] = f.trim().split("\n").map(x => Robot.constructRobotFromString(x));
    for (let i = 1; i < 10_000; i++) {
        const seen: CustomSet<Node> = new CustomSet();
        for (let robot of robots) {
            robot.position.i = wrapAround(robot.position.i, robot.velocities[0], width);
            robot.position.j = wrapAround(robot.position.j, robot.velocities[1], height);
            seen.add(robot.position);
        }
        if (atLeastMultipleGrouped(seen)) {
            // this was guessing game, but it is obvious once it is printed
            print(seen, width, height, i);
            return i;
        }
    }
    return -1;
}

function print(seen: CustomSet<Node>, width: number, height: number, frame: number): void {
    for (let i = 0; i < width; i++) {
        let row = "";
        for (let j = 0; j < height; j++) {
            if (seen.has(new Node(i, j))) {
                row += "█";
            } else {
                row += " ";
            }
        }
        console.log(row);
    }
    console.log("=====", frame);
}

function atLeastMultipleGrouped(nodes: CustomSet<Node>): boolean {
    const seen: CustomSet<Node> = new CustomSet();
    for (let node of nodes) {
        const startingNode: Node = node;
        const queue: Node[] = [startingNode];
        let together: number = 0;
        while (queue.length > 0) {
            const n: Node = queue.shift()!;

            if (together > 50) {
                // this is just guessing
                return true;
            }

            if (seen.has(n)) {
                continue;
            }

            seen.add(n);
            together += findAdj(n, nodes, queue);
        }

    }
    return false;
}

function findAdj(node: Node, nodes: CustomSet<Node>, queue: Node[]): number {
    const posibleMoves: number[][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let result: number = 0;
    for (let move of posibleMoves) {
        const x: number = node.i + move[0];
        const y: number = node.j + move[1];
        const adjNode: Node = new Node(x, y);
        if (nodes.has(adjNode)) {
            result++;
            queue.push(adjNode);

        }
    }
    return result > 0 ? 1 : 0;
}

function wrapAround(pos: number, velocitie: number, width: number): number {
    const x: number = (pos + velocitie) % width >= 0 ? (pos + velocitie) % width : width + ((pos + velocitie) % width);
    return x;
}

class Robot {
    position: Node;
    velocities: number[];

    constructor(position: Node, velocities: number[]) {
        this.position = position;
        this.velocities = velocities
    }

    static constructRobotFromString(robot: string): Robot {
        const splitPos: string[] = robot.trim().split(/\s+/);
        const position: number[] = splitPos[0].split("=")[1].trim().split(",").map(x => Number(x));
        const velocities: number[] = splitPos[1].split("=")[1].trim().split(",").map(x => Number(x));
        const node: Node = new Node(position[0], position[1]);
        return new Robot(node, velocities);
    }
}

console.log("Part 1:", part1(f, 101, 103));
console.log("Part 2:", part2(f, 101, 103));
