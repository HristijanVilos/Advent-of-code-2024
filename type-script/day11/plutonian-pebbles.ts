import * as fs from "fs";
import { Tuple } from "../utils";

const f: string = fs.readFileSync("../inputs/day11/input.txt", { encoding: "utf-8" });
const input: string[] = f.trim().split(/\s+/);

function solution(input: string[], blinks: number): number {
    const seen: Map<string, number> = new Map();
    let result: number = 0;
    for (const stone of input) {
        result += transformStone(stone, blinks, seen);
    }

    return result;
}

function scoreStone(stone: string): Tuple<string | null> {
    if (stone === '0') {
        return new Tuple("1", null)
    } else if (stone.length % 2 === 0) {
        const firstStone: string = stone.slice(0, stone.length / 2);
        let secondStone: string = stone.slice(stone.length / 2, stone.length);
        return new Tuple(firstStone, removeLeadingZeros(secondStone))
    } else {
        return new Tuple((Number(stone) * 2024).toString(), null);
    }

}

function transformStone(stone: string, blinks: number, seen: Map<string, number>): number {
    const tuple: Tuple<string | null> = scoreStone(stone);

    if (seen.has((stone + "-" + blinks.toString()))) {
        return seen.get((stone + "-" + blinks.toString()))!;
    }

    if (blinks === 1) {
        if (tuple.second !== null) {
            return 2;
        } else {
            return 1;
        }
    } else {
        let output: number = transformStone(tuple.first!, blinks - 1, seen);
        seen.set((tuple.first! + "-" + (blinks - 1).toString()), output);
        if (tuple.second !== null) {
            let output2 = transformStone(tuple.second, blinks - 1, seen);
            seen.set((tuple.second! + "-" + (blinks - 1).toString()), output2);
            output += output2
        }
        return output;
    }

}

function removeLeadingZeros(str: string): string {
    return Number(str).toString();
}

console.log("Part 1:", solution(input, 25));
console.log("Part 2:", solution(input, 75));
