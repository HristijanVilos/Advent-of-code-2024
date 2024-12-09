import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day09/input.txt", { encoding: "utf-8" });
const input: number[] = f.trim().split("").map(x => Number(x));

function part1(input: number[]): number {
    const diskSpace: number[] = constructFileSystem(input);
    for (let i = 0; i < diskSpace.length; i++) {
        if (Number.isNaN(diskSpace[i])) {
            for (let j = diskSpace.length - 1; j > i; j--) {
                if (!Number.isNaN(diskSpace[j])) {
                    diskSpace[i] = diskSpace[j];
                    diskSpace[j] = NaN;
                    break;
                }
            }
        }
    }

    let result: number = 0;
    for (let i = 0; i < diskSpace.length; i++) {
        if (Number.isNaN(diskSpace[i])) {
            break;
        }
        result += diskSpace[i] * i;
    }
    return result;
}

function part2(input: number[]): number {
    const diskSpace: number[] = constructFileSystem(input);
    for (let j = diskSpace.length - 1; j >= 0; j--) {
        const fileSize: number = calcFileSize(diskSpace, j);
        if (fileSize === 0) continue;

        for (let i = 0; i < j; i++) {
            const freeSpace: number = calcFreeSpace(diskSpace, i, j);
            if (freeSpace >= fileSize) {
                let idx = 0;
                while (fileSize > idx) {
                    diskSpace[i + idx] = diskSpace[j - idx];
                    diskSpace[j - idx] = NaN;
                    idx++;
                }
                break;
            }
        }
        j -= (fileSize - 1);
    }


    let result: number = 0;
    for (let i = 0; i < diskSpace.length; i++) {
        if (Number.isNaN(diskSpace[i])) {
            continue;
        }
        result += diskSpace[i] * i;
    }
    return result;
}

function constructFileSystem(input: number[]): number[] {
    const diskSpace: number[] = [];
    let fileBlockIdx: number = 0;
    for (let i = 0; i < input.length; i++) {
        if (i % 2 === 0) {
            for (let j = 0; j < input[i]; j++) {
                diskSpace.push(fileBlockIdx);
            }
            fileBlockIdx++;
        } else {
            for (let j = 0; j < input[i]; j++) {
                diskSpace.push(Number("#"));
            }
        }
    }
    return diskSpace;
}

function calcFileSize(diskSpace: number[], j: number): number {
    let fileSize: number = 0;
    if (!Number.isNaN(diskSpace[j])) {
        for (let k = j; k >= 0; k--) {
            if (diskSpace[k] !== diskSpace[j]) {
                fileSize = j - k;
                break;
            }
        }
    }
    return fileSize
}

function calcFreeSpace(diskSpace: number[], i: number, j: number): number {
    let freeSpace: number = 0;
    if (Number.isNaN(diskSpace[i])) {
        for (let z = i; z < j; z++) {
            if (!Number.isNaN(diskSpace[z])) {

                freeSpace = z - i;
                break;
            }
        }
    }
    return freeSpace;
}



console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
