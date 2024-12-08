import * as fs from "fs";
import { Node, CustomSet } from "../utils";

const f: string = fs.readFileSync("../inputs/day08/input.txt", { encoding: "utf-8" });
const inputMap: string[][] = f.trim().split("\n").map(x => x.trim().split(""));

function part1(input: string[][]): number {
    const mapOfAnntenas: Map<string, Node[]> = new Map();
    addAllAntenas(input, mapOfAnntenas);
    const setOfAntiNodes: CustomSet<Node> = new CustomSet();
    createAntiNodes(setOfAntiNodes, mapOfAnntenas, input[0].length, input.length);
    return setOfAntiNodes.size;
}

function part2(input: string[][]): number {
    const mapOfAnntenas: Map<string, Node[]> = new Map();
    addAllAntenas(input, mapOfAnntenas);
    const setOfAntiNodes: CustomSet<Node> = new CustomSet();
    createAntiNodes2(setOfAntiNodes, mapOfAnntenas, input[0].length, input.length);
    return setOfAntiNodes.size;
}

function addAllAntenas(input: string[][], mapOfAnntenas: Map<string, Node[]>): void {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            const key: string = input[i][j];
            if (key !== ".") {
                const newNode: Node = new Node(i, j)
                if (mapOfAnntenas.has(key)) {
                    mapOfAnntenas.get(key)!.push(newNode);
                } else {
                    mapOfAnntenas.set(key, [newNode]);
                }
            }
        }
    }
}

function createAntiNodes(setOfAntiNodes: CustomSet<Node>, mapOfAnntenas: Map<string, Node[]>, maxHeight: number, maxWidth: number): void {
    for (const values of mapOfAnntenas.values()) {
        for (let i = 0; i < values.length; i++) {
            for (let j = i + 1; j < values.length; j++) {
                const x: number = Math.abs(values[j].i - values[i].i);
                const y: number = Math.abs(values[j].j - values[i].j);

                const firstXPos: number = values[i].i - x;
                const secondXPos: number = values[j].i + x;

                const { firstYPos, secondYPos }: { firstYPos: number; secondYPos: number; } = yPositonAndDirection(values[i].j, values[j].j, y);

                addAntiNodeIfInBounds(firstXPos, firstYPos, maxHeight, maxWidth, setOfAntiNodes);
                addAntiNodeIfInBounds(secondXPos, secondYPos, maxHeight, maxWidth, setOfAntiNodes);
            }
        }
    }
}

function createAntiNodes2(setOfAntiNodes: CustomSet<Node>, mapOfAnntenas: Map<string, Node[]>, maxHeight: number, maxWidth: number): void {
    for (const values of mapOfAnntenas.values()) {
        for (let i = 0; i < values.length; i++) {
            for (let j = i + 1; j < values.length; j++) {
                const x: number = Math.abs(values[j].i - values[i].i);
                const y: number = Math.abs(values[j].j - values[i].j);
                let oneInBounds: boolean = true;
                let x1 = x;
                let y1 = y;
                setOfAntiNodes.add(values[i]);
                setOfAntiNodes.add(values[j]);

                while (oneInBounds) {
                    const firstXPos: number = values[i].i - x1;
                    const secondXPos: number = values[j].i + x1;
                    
                    const { firstYPos, secondYPos }: { firstYPos: number; secondYPos: number; } = yPositonAndDirection(values[i].j, values[j].j, y1);

                    addAntiNodeIfInBounds(firstXPos, firstYPos, maxHeight, maxWidth, setOfAntiNodes);
                    addAntiNodeIfInBounds(secondXPos, secondYPos, maxHeight, maxWidth, setOfAntiNodes);

                    x1 += x;
                    y1 += y;
                    oneInBounds = inBounds(firstXPos, firstYPos, maxHeight, maxWidth) || inBounds(secondXPos, secondXPos, maxHeight, maxWidth)
                }
            }
        }
    }
}

function addAntiNodeIfInBounds(xPosition: number, yPosition: number, maxHeight: number, maxWidth: number, setOfAntiNodes: CustomSet<Node>): void {
    if (inBounds(xPosition, yPosition, maxHeight, maxWidth)) {
        const newNode: Node = new Node(xPosition, yPosition);
        setOfAntiNodes.add(newNode);
    }
}

function yPositonAndDirection(iNodePos: number, jNodePos: number, y: number): { firstYPos: number, secondYPos: number } {
    let firstYPos: number = 0;
    let secondYPos: number = 0;
    if (iNodePos > jNodePos) {
        firstYPos = iNodePos + y;
        secondYPos = jNodePos - y;
    } else {
        firstYPos = iNodePos - y;
        secondYPos = jNodePos + y;
    }
    return { firstYPos, secondYPos };
}

function inBounds(x: number, y: number, maxHeight: number, maxWidth: number): boolean {
    return (x >= 0 && x < maxHeight && y >= 0 && y < maxWidth);
}

console.log("Part 1:", part1(inputMap));
console.log("Part 2:", part2(inputMap));
