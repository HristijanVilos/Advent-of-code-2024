import * as fs from "fs";
import { CustomSet, Node } from "../utils";

const f: string = fs.readFileSync("../inputs/day15/input.txt", { encoding: "utf-8" });
const input: string[] = f.trim().split("\n\n");
const warehouseMap: string[][] = input[0].trim().split("\n").map(x => x.trim().split(""));
const movments: string[] = input[1].trim().split("").filter(x => x !== "\n");
const MOVE: Map<string, [number, number]> = new Map([
    [">", [0, 1]],
    ["<", [0, -1]],
    ["^", [-1, 0]],
    ["v", [1, 0]]
]);

function part1(warehouseMap: string[][], movments: string[]): number {
    const walls: CustomSet<Node> = new CustomSet();
    const boxes: CustomSet<Node> = new CustomSet();
    let robot: Node = constructWallsBoxesAndPosOfRobot(warehouseMap, walls, boxes);

    for (const move of movments) {
        const dir: [number, number] = MOVE.get(move)!;
        const nextNode: Node = new Node(robot.i + dir[0], robot.j + dir[1]);
        if (walls.has(nextNode)) {
            continue;
        } else if (boxes.has(nextNode)) {
            robot = boxesMove(warehouseMap, walls, boxes, robot, dir, move, nextNode);
        } else {
            robot = nextNode;
        }
    }
    let result: number = 0;
    for (const box of boxes) {
        result += box.i * 100 + box.j
    }
    return result;
}

function part2(warehouseMap: string[][], movments: string[]): number {
    let newWarehouseMap: string[][] = constructNewMap(warehouseMap);
    const walls: CustomSet<Node> = new CustomSet();
    const boxes: CustomSet<Box> = new CustomSet();
    let robot: Node = constructWallsBigBoxesAndPosOfRobot(newWarehouseMap, walls, boxes);
    for (const move of movments) {
        const dir: [number, number] = MOVE.get(move)!;
        const nextNode: Node = new Node(robot.i + dir[0], robot.j + dir[1]);
        const boxChech: Box = new Box(nextNode, "");
        if (walls.has(nextNode)) {
            continue;
        } else if (boxes.has(boxChech)) {
            robot = bigBoxesMove(newWarehouseMap, walls, boxes, robot, dir, move, nextNode);
        } else {
            robot = nextNode;
        }
    }

    let result: number = 0;
    for (const box of boxes) {
        if (box.type === "[") {
            result += box.node.i * 100 + box.node.j;
        }
    }
    return result;
}

function bigBoxesMove(warehouseMap: string[][], walls: CustomSet<Node>, boxes: CustomSet<Box>, robot: Node, dir: [number, number], move: string, nextNode: Node): Node {
    if (bigBoxCanMove(walls, boxes, robot, dir, move)) {
        if (move === ">") {
            let idx: number = 0
            for (let j = robot.j + 1; j < warehouseMap[0].length; j++) {
                const prev: Node = new Node(nextNode.i, j);
                const prevBox: Box = new Box(prev, "");
                boxes.delete(prevBox);
                const next: Node = new Node(robot.i, j + 1);
                const nextBox: Box = new Box(next, "");
                if (!boxes.has(nextBox)) {
                    idx = j + 1;
                    break;
                }

            }
            for (let j = idx; j > robot.j + 1; j -= 2) {
                const next: Node = new Node(robot.i, j);
                const nextBox: Box = new Box(next, "]");
                const next2: Node = new Node(robot.i, j - 1);
                const nextBox2: Box = new Box(next2, "[");
                boxes.add(nextBox);
                boxes.add(nextBox2);
            }
        } else if (move === "<") {
            let idx: number = 0
            for (let j = robot.j - 1; j > 0; j--) {
                const prev: Node = new Node(nextNode.i, j);
                const prevBox: Box = new Box(prev, "");
                boxes.delete(prevBox);
                const next: Node = new Node(robot.i, j - 1);
                const nextBox: Box = new Box(next, "");
                if (!boxes.has(nextBox)) {
                    idx = j - 1;
                    break;
                }

            }
            for (let j = idx; j < robot.j - 1; j += 2) {
                const next: Node = new Node(robot.i, j);
                const nextBox: Box = new Box(next, "[");
                const next2: Node = new Node(robot.i, j + 1);
                const nextBox2: Box = new Box(next2, "]");
                boxes.add(nextBox);
                boxes.add(nextBox2);
            }
        } else if (move === "v") {
            const boxesToBeRemoved: CustomSet<Box> = boxesToBeMoved(boxes, nextNode, +1);
            moveBoxes(boxesToBeRemoved, boxes, +1);

        } else if (move === "^") {
            const boxesToBeRemoved: CustomSet<Box> = boxesToBeMoved(boxes, nextNode, -1);
            moveBoxes(boxesToBeRemoved, boxes, -1);
        }
        return nextNode;
    }
    return robot;
}

function moveBoxes(boxesToBeRemoved: CustomSet<Box>, boxes: CustomSet<Box>, move: number) {
    const boxesToBeAdded: CustomSet<Box> = new CustomSet();
    for (const box of boxesToBeRemoved) {
        boxes.delete(box);
        boxesToBeAdded.add(new Box(new Node(box.node.i + move, box.node.j), box.type));
    }
    for (const box of boxesToBeAdded) {
        boxes.add(box);
    }
}

function boxesToBeMoved(boxes: CustomSet<Box>, nextNode: Node, move: number): CustomSet<Box> {
    const boxesToBeRemoved: CustomSet<Box> = new CustomSet();
    const startingBox: Box = boxes.get(new Box(nextNode, ""))!;
    let second: Box;
    if (startingBox.type === "]") {
        second = boxes.get(new Box(new Node(nextNode.i, nextNode.j - 1), "["))!;
    } else {
        second = boxes.get(new Box(new Node(nextNode.i, nextNode.j + 1), "]"))!;
    }
    const queue: Box[] = [startingBox, second];

    while (queue.length > 0) {
        const box = queue.shift()!;

        if (boxesToBeRemoved.has(box)) {
            continue;
        }

        boxesToBeRemoved.add(box);
        const adjBox: Box | undefined = boxes.get(new Box(new Node(box.node.i + move, box.node.j), ""));
        if (adjBox) {
            if (adjBox.type == "[") {
                const newAdjBox: Box = new Box(new Node(adjBox.node.i, adjBox.node.j + 1), "]");
                queue.push(newAdjBox);
            } else {
                const newAdjBox: Box = new Box(new Node(adjBox.node.i, adjBox.node.j - 1), "[");
                queue.push(newAdjBox);
            }
            queue.push(adjBox);
        }
    }
    return boxesToBeRemoved;
}

function bigBoxCanMove(walls: CustomSet<Node>, boxes: CustomSet<Box>, prev: Node, dir: [number, number], move: string): boolean {
    const nextNode: Node = new Node(prev.i + dir[0], prev.j + dir[1]);
    const boxCheck = new Box(nextNode, "");
    if (move === "^" || move === "v") {
        if (walls.has(nextNode)) {
            return false;
        } else if (!boxes.has(boxCheck)) {
            return true;
        }
        const nextBox: Box = boxes.get(boxCheck)!;
        if (nextBox.type === "]") {
            const otherNode: Node = new Node(nextNode.i, nextNode.j - 1);
            return (bigBoxCanMove(walls, boxes, nextNode, dir, move)
                && bigBoxCanMove(walls, boxes, otherNode, dir, move));
        } else {
            const otherNode: Node = new Node(nextNode.i, nextNode.j + 1);
            return (bigBoxCanMove(walls, boxes, nextNode, dir, move)
                && bigBoxCanMove(walls, boxes, otherNode, dir, move));
        }

    } else {
        if (walls.has(nextNode)) {
            return false;
        } else if (!boxes.has(boxCheck)) {
            return true;
        }
        return bigBoxCanMove(walls, boxes, nextNode, dir, move)
    }
}

function boxesMove(warehouseMap: string[][], walls: CustomSet<Node>, boxes: CustomSet<Node>, robot: Node, dir: [number, number], move: string, nextNode: Node): Node {
    if (boxCanMove(walls, boxes, robot, dir)) {
        if (move === ">") {
            const prev: Node = nextNode;
            boxes.delete(prev);
            for (let j = robot.j + 1; j < warehouseMap[0].length; j++) {
                const next: Node = new Node(robot.i, j + 1);
                if (!boxes.has(next)) {
                    boxes.add(next);
                    break;
                }
                boxes.add(next);
            }
        } else if (move === "<") {
            const prev: Node = nextNode;
            boxes.delete(prev);
            for (let j = robot.j - 1; j > 0; j--) {
                const next: Node = new Node(robot.i, j - 1);
                if (!boxes.has(next)) {
                    boxes.add(next);
                    break;
                }
                boxes.add(next);
            }
        } else if (move === "v") {
            const prev: Node = nextNode;
            boxes.delete(prev);
            for (let i = robot.i + 1; i < warehouseMap.length; i++) {
                const next: Node = new Node(i + 1, robot.j);
                if (!boxes.has(next)) {
                    boxes.add(next);
                    break;
                }
                boxes.add(next);
            }
        } else if (move === "^") {
            const prev: Node = nextNode;
            boxes.delete(prev);
            for (let i = robot.i - 1; i > 0; i--) {
                const next: Node = new Node(i - 1, robot.j);
                if (!boxes.has(next)) {
                    boxes.add(next);
                    break;
                }
                boxes.add(next);
            }
        }
        return nextNode;
    }
    return robot;
}

function boxCanMove(walls: CustomSet<Node>, boxes: CustomSet<Node>, prev: Node, dir: [number, number]): boolean {
    const nextNode: Node = new Node(prev.i + dir[0], prev.j + dir[1]);
    if (walls.has(nextNode)) {
        return false;
    } else if (!boxes.has(nextNode)) {
        return true;
    }
    return boxCanMove(walls, boxes, nextNode, dir)
}

function constructWallsBoxesAndPosOfRobot(warehouseMap: string[][], walls: CustomSet<Node>, boxes: CustomSet<Node>): Node {
    const robot: Node = new Node(-1, -1);
    for (let i = 0; i < warehouseMap.length; i++) {
        for (let j = 0; j < warehouseMap[0].length; j++) {
            if (warehouseMap[i][j] === "#") {
                const wall: Node = new Node(i, j);
                walls.add(wall);
            } else if (warehouseMap[i][j] === "O") {
                const box: Node = new Node(i, j);
                boxes.add(box);
            } else if (warehouseMap[i][j] === "@") {
                robot.i = i;
                robot.j = j;
            }
        }
    }
    return robot;
}

function constructWallsBigBoxesAndPosOfRobot(warehouseMap: string[][], walls: CustomSet<Node>, boxes: CustomSet<Box>): Node {
    const robot: Node = new Node(-1, -1);
    for (let i = 0; i < warehouseMap.length; i++) {
        for (let j = 0; j < warehouseMap[0].length; j++) {
            if (warehouseMap[i][j] === "#") {
                const wall: Node = new Node(i, j);
                walls.add(wall);
            } else if (warehouseMap[i][j] === "[") {
                const box: Box = new Box(new Node(i, j), "[");
                boxes.add(box);
                const box2: Box = new Box(new Node(i, j + 1), "]");
                boxes.add(box2);
            } else if (warehouseMap[i][j] === "@") {
                robot.i = i;
                robot.j = j;
            }
        }
    }
    return robot;
}

function constructNewMap(warehouseMap: string[][]): string[][] {
    const newMap: string[][] = [];
    for (let i = 0; i < warehouseMap.length; i++) {
        const newRow: string[] = [];
        for (let j = 0; j < warehouseMap[0].length; j++) {
            if (warehouseMap[i][j] === "#") {
                newRow.push("#");
                newRow.push("#");
            } else if (warehouseMap[i][j] === "O") {
                newRow.push("[");
                newRow.push("]");
            } else if (warehouseMap[i][j] === "@") {
                newRow.push("@");
                newRow.push(".");
            } else {
                newRow.push(".");
                newRow.push(".");
            }
        }
        newMap.push(newRow);
    }
    return newMap;
}


function debugPrint(width: number, height: number, walls: CustomSet<Node>, boxes: CustomSet<Node>, robot: Node): void {
    for (let i = 0; i < width; i++) {
        let row: string = "";
        for (let j = 0; j < height; j++) {
            const testNode: Node = new Node(i, j);
            if (walls.has(testNode)) {
                row += "#";
            } else if (boxes.has(testNode)) {
                row += "O";
            } else if (testNode.equals(robot)) {
                row += "@";
            } else {
                row += "."
            }
        }
        console.log(row);
    }
    console.log();
}

function debugPrint2(width: number, height: number, walls: CustomSet<Node>, boxes: CustomSet<Box>, robot: Node): void {
    for (let i = 0; i < width; i++) {
        let row: string = "";
        for (let j = 0; j < height; j++) {
            const testNode: Node = new Node(i, j);
            const testBox: Box = new Box(testNode, "");
            if (walls.has(testNode)) {
                row += "#";
            } else if (boxes.has(testBox)) {
                row += boxes.get(testBox)?.type;
            } else if (testNode.equals(robot)) {
                row += "@";
            } else {
                row += "."
            }
        }
        console.log(row);
    }
    console.log();
}

class Box {
    node: Node;
    type: string;

    constructor(node: Node, type: string) {
        this.node = node;
        this.type = type;
    }

    hashCode(): string {
        return this.node.hashCode();
    }
}

console.log("Part 1:", part1(warehouseMap, movments));
console.log("Part 2:", part2(warehouseMap, movments));
