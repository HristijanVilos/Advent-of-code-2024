import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day02/input.txt", { encoding: "utf-8" });
const reports: number[][] = f.trim().split("\n").map(x => x.trim().split(/\s+/).map(y => Number(y)));

function solution(reports: number[][], tolerance: number): number {
    let result: number = 0;
    for (const report of reports) {
        result += safeOrUnsafe(report, tolerance);
    }
    return result;
}

function safeOrUnsafe(report: number[], tolerance: number): number {
    const increaseOrder: boolean = (report[0] - report[1]) < 0;
    for (let i = 0; i < report.length - 1; i++) {
        const diff: number = Math.abs(report[i] - report[i + 1]);
        if (increaseOrder !== (report[i] - report[i + 1]) < 0
            || (diff < 1 || diff > 3)) {
            let valid: number = 0;
            if (tolerance > 0) {
                tolerance--;
                valid = tryForValidReport(valid, report, i, tolerance);
            }
            return valid;
        }
    }
    return 1;
}

function tryForValidReport(valid: number, report: number[], i: number, tolerance: number) {
    valid = safeOrUnsafe([...report.slice(0, i - 1), ...report.slice(i, report.length)], tolerance);
    if (valid == 0) {
        valid = safeOrUnsafe([...report.slice(0, i), ...report.slice(i + 1, report.length)], tolerance);
    }
    if (valid == 0) {
        valid = safeOrUnsafe([...report.slice(0, i + 1), ...report.slice(i + 2, report.length)], tolerance);
    }
    return valid;
}

console.log("Part 1:", solution(reports, 0));
console.log("Part 2:", solution(reports, 1));
