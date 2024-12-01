import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day01/input.txt", { encoding: "utf-8" });
const lists: number[][] = f.trim().split("\n").map(x => x.trim().split(/\s+/).map(y => Number(y)));

function part1(lists: number[][]): number {
    const leftList: number[] = [];
    const rightList: number[] = [];
    for (let i = 0; i < lists.length; i++) {
        leftList.push(lists[i][0]);
        rightList.push(lists[i][1]);
    }

    leftList.sort((a, b) => a - b);
    rightList.sort((a, b) => a - b);

    let result = 0;
    for (let i = 0; i < lists.length; i++) {
        result += Math.abs(leftList[i] - rightList[i]);
    }
    return result;
}

function part2(lists: number[][]): number {
    const leftList: number[] = [];
    const rightMap: Map<number, number> = new Map();
    for (let i = 0; i < lists.length; i++) {
        leftList.push(lists[i][0]);
        if (rightMap.get(lists[i][1])) {
            rightMap.set(lists[i][1], rightMap.get(lists[i][1])! + 1);
        } else {
            rightMap.set(lists[i][1], 1);
        }
    }

    let result = 0;
    for (const num of leftList) {
        const appearsTimes: number = rightMap.get(num) || 0;
        result += appearsTimes * num;
    }
    return result;
}

console.log("Part 1:", part1(lists));
console.log("Part 2:", part2(lists));
