import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day02/test_input.txt", { encoding: "utf-8" });
const reports: number[][] = f.trim().split("\n").map(x => x.trim().split(/\s+/).map(y => Number(y)));

function part1(reports: number[][]): number {
    let result: number = 0;
    for (const report of reports) {
        let safe: boolean = true;
        const increaseOrder: boolean = (report[0] - report[1]) < 0;
        for (let i = 0; i < report.length - 1; i++) {
            if (increaseOrder !== (report[i] - report[i + 1]) < 0) {
                safe = false;
                break;
            }
            const diff: number = Math.abs(report[i] - report[i + 1]);
            if (diff < 1 || diff > 3) {
                safe = false;
                break
            }
        }
        if (safe) {
            result += 1;
        }
    }
    return result;
}

function part2(reports: number[][]): number {
    // > 264  307< 
    // [ 44, 42, 39, 35, 33, 29 ]
    let result: number = 0;
    return result;
}

console.log("Part 1:", part1(reports));
console.log("Part 2:", part2(reports));
