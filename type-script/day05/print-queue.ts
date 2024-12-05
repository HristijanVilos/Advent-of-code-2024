import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day05/input.txt", { encoding: "utf-8" });
const input: string[] = f.trim().split("\n\n");

const pageOrdering: string[] = input[0].trim().split("\n");
const updated: number[][] = input[1].trim().split("\n").map(x => x.trim().split(",").map(y => Number(y)));

const beforePages: Map<number, number[]> = new Map();
const afterPages: Map<number, number[]> = new Map();

for (let pages of pageOrdering) {
    const numbers: number[] = pages.split("|").map(x => Number(x));
    if (beforePages.has(numbers[0])) {
        beforePages.get(numbers[0])?.push(numbers[1]);
    } else {
        beforePages.set(numbers[0], [numbers[1]]);
    }

    if (afterPages.has(numbers[1])) {
        afterPages.get(numbers[1])?.push(numbers[0]);
    } else {
        afterPages.set(numbers[1], [numbers[0]]);
    }
}

function part1(): number {
    let result: number = 0;
    for (const up of updated) {
        let before: boolean = true;
        let after: boolean = true;
        for (let i = 0; i < up.length; i++) {
            before = correctAfterPageOrdering(i, up, afterPages);
            if (!before) {
                break;
            }
            after = correctBeforePageOrdering(i, up, beforePages);
            if (!after) {
                break;
            }
        }
        if (before && after) {
            const midNum: number = Math.floor(up.length / 2);
            result += up[midNum];
        }
    }
    return result;
}

function part2(): number {
    let result: number = 0;
    for (const up of updated) {
        let before: boolean = true;
        let after: boolean = true;
        let reordered: boolean = false;
        for (let i = 0; i < up.length; i++) {

            before = correctAfterPageOrderingWithSwap(i, up, afterPages);
            if (!before) {
                reordered = true;
                i = -1;
            }
            after = correctBeforePageOrderingWithSwap(i, up, beforePages);
            if (!after) {
                reordered = true;
                i = -1;
            }
        }
        if (reordered) {
            const midNum: number = Math.floor(up.length / 2);
            result += up[midNum];
        }
    }
    return result;
}

function correctAfterPageOrdering(i: number, listNum: number[], afterPages: Map<number, number[]>): boolean {
    const num: number[] | undefined = afterPages.get(listNum[i]);
    if (num === undefined) {
        return true;
    }
    for (let j = i; j < listNum.length; j++) {
        if (num.includes(listNum[j])) {
            return false;
        }
    }
    return true;
}

function correctBeforePageOrdering(i: number, listNum: number[], afterPages: Map<number, number[]>): boolean {
    const num: number[] | undefined = afterPages.get(listNum[i]);
    if (num === undefined) {
        return true;
    }
    for (let j = i; j > 0; j--) {
        if (num.includes(listNum[j])) {
            return false;
        }
    }
    return true;
}

function correctBeforePageOrderingWithSwap(i: number, listNum: number[], afterPages: Map<number, number[]>): boolean {
    const num: number[] | undefined = afterPages.get(listNum[i]);
    if (num === undefined) {
        return true;
    }
    for (let j = i; j > 0; j--) {
        if (num.includes(listNum[j])) {
            const temp: number = listNum[i];
            listNum[i] = listNum[j];
            listNum[j] = temp;
            return false;
        }
    }
    return true;
}

function correctAfterPageOrderingWithSwap(i: number, listNum: number[], afterPages: Map<number, number[]>): boolean {
    const num: number[] | undefined = afterPages.get(listNum[i]);
    if (num === undefined) {
        return true;
    }
    for (let j = i; j < listNum.length; j++) {
        if (num.includes(listNum[j])) {
            const temp: number = listNum[i];
            listNum[i] = listNum[j];
            listNum[j] = temp;
            return false;
        }
    }
    return true;
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());
