import * as fs from "fs";
import { Node } from "../utils";

const f: string = fs.readFileSync("../inputs/day13/input.txt", { encoding: "utf-8" });
const input: string[] = f.trim().split("\n\n");
const machines: string[][] = input.map(x => x.trim().split("\n"));

function solution(machines: string[][], part2: boolean): number {
    const clawMachines: ClawMachine[] = createClawMachines(machines, part2);
    let result: number = 0;
    for (const claw of clawMachines) {
        const diveder: number = claw.buttonA.i * claw.buttonB.j - claw.buttonB.i * claw.buttonA.j;
        const x: number = Math.floor(((claw.prize.i * claw.buttonB.j) - (claw.prize.j * claw.buttonB.i)) / diveder);
        const y: number = Math.floor((-(claw.buttonA.j * claw.prize.i) + (claw.buttonA.i * claw.prize.j)) / diveder);
        if ((x * claw.buttonA.i + y * claw.buttonB.i === claw.prize.i) && (x * claw.buttonA.j + y * claw.buttonB.j === claw.prize.j)) {
            result += x * 3 + y;
        }
    }
    return result;
}

function createClawMachines(machines: string[][], part2: boolean = false) {
    const clawMachines: ClawMachine[] = [];
    for (const machine of machines) {
        const pattern: RegExp = /\+\d+/g;
        const cordinates: number[] = machine[0].match(pattern)?.map(match => parseInt(match.slice(1)))!;
        const buttonA: Node = new Node(cordinates[0], cordinates[1]);
        const cordinatesB: number[] = machine[1].match(pattern)?.map(match => parseInt(match.slice(1)))!;
        const buttonB: Node = new Node(cordinatesB[0], cordinatesB[1]);
        const patternPrize: RegExp = /\=\d+/g;
        const cordinatesPrize: number[] = machine[2].match(patternPrize)?.map(match => parseInt(match.slice(1)))!;
        let prize: Node
        if (part2) {
            prize = new Node(cordinatesPrize[0] + 10_000_000_000_000, cordinatesPrize[1] + 10_000_000_000_000);
        } else {
            prize = new Node(cordinatesPrize[0], cordinatesPrize[1]);
        }
        clawMachines.push(new ClawMachine(buttonA, buttonB, prize));
    }
    return clawMachines;
}

class ClawMachine {
    buttonA: Node;
    buttonB: Node;
    prize: Node;

    constructor(buttonA: Node, buttonB: Node, prize: Node) {
        this.buttonA = buttonA;
        this.buttonB = buttonB;
        this.prize = prize;
    }
}


console.log("Part 1:", solution(machines, false));
console.log("Part 2:", solution(machines, true));
