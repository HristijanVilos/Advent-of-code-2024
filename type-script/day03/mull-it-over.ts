import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day03/input.txt", { encoding: "utf-8" });

function part1(str: string): number {
    const pattern: RegExp = /mul\((\d+,\d+)\)/g
    const regExIterator: RegExpStringIterator<RegExpExecArray> = getMatchesForMultiplying(str, pattern);
    let result: number = 0;
    for (const reg of regExIterator) {
        result += reg[1].split(",").map(x => Number(x)).reduce((a, b) => Number(a) * Number(b));
    }
    return result;
}

function part2(str: string): number {
    const pattern: RegExp = /do\(\)|don't\(\)|mul\((\d+,\d+)\)/g
    const regExIterator: RegExpStringIterator<RegExpExecArray> = getMatchesForMultiplying(str, pattern);
    let result: number = 0;
    let enabled: boolean = true;
    for (const reg of regExIterator) {
        if (reg[0] === 'do()') {
            enabled = true;
        } else if (reg[0] === "don't()") {
            enabled = false;
        } else if (enabled) {
            result += reg[1].split(",").map(x => Number(x)).reduce((a, b) => Number(a) * Number(b));
        }
    }
    return result;
}

function getMatchesForMultiplying(str: string, pattern: RegExp): RegExpStringIterator<RegExpExecArray> {
    return str.matchAll(pattern);
}

console.log("Part 1:", part1(f));
console.log("Part 2:", part2(f));
