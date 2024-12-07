import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day07/input.txt", { encoding: "utf-8" });
const operations: string[][] = f.trim().split("\n").map(x => x.trim().split(":"));
const evaluationMap: Map<number, number[]> = new Map();

for (const op of operations) {
    if (evaluationMap.has(Number(op[0]))) {
        throw Error("Duplicate")
    }
    evaluationMap.set(Number(op[0]), op[1].trim().split(/\s+/).map(x => Number(x)));
}

function part1(evaluationMap: Map<number, number[]>): number {
    let result: number = 0;
    const mapOfCombinations: Map<number, string[]> = new Map();
    for (const [res, numbers] of evaluationMap.entries()) {
        const lenOfSymbols: number = numbers.length - 1;
        if (!mapOfCombinations.has(lenOfSymbols)) {
            mapOfCombinations.set(lenOfSymbols, constructCombinations(lenOfSymbols, 2));
        }
        result += evaluateOperations(numbers, res, mapOfCombinations.get(lenOfSymbols)!);
    }
    return result;
}

function part2(evaluationMap: Map<number, number[]>): number {
    let result: number = 0;
    const mapOfCombinations: Map<number, string[]> = new Map();
    for (const [res, numbers] of evaluationMap.entries()) {
        const lenOfSymbols: number = numbers.length - 1;
        if (!mapOfCombinations.has(lenOfSymbols)) {
            mapOfCombinations.set(lenOfSymbols, constructCombinations(lenOfSymbols, 3));
        }
        result += evaluateOperations(numbers, res, mapOfCombinations.get(lenOfSymbols)!);
    }
    return result;
}

function constructCombinations(lenOfSymbols: number, base: number): string[] {
    const listOfSymbols: string[] = [];
    const variations: number = Math.pow(base, lenOfSymbols);
    for (let i = 0; i < variations; i++) {
        listOfSymbols.push(i.toString(base).padStart(lenOfSymbols, '0'));
    }
    return listOfSymbols;
}

function evaluateOperations(numbers: number[], res: number, listOfSymbols: string[]): number {
    for (const symbols of listOfSymbols) {
        let evaluation: number = 0;
        for (let i = 0; i < numbers.length; i++) {
            if (i === 0) {
                evaluation += numbers[i];
                continue;
            }

            if (symbols[i - 1] === "0") {
                evaluation += numbers[i];
            } else if (symbols[i - 1] === "1") {
                evaluation *= numbers[i];
            } else {
                evaluation = Number(evaluation.toString() + numbers[i].toString());
            }
        }
        if (evaluation === res) {
            return evaluation;
        }
    }
    return 0;
}

console.log("Part 1:", part1(evaluationMap));
console.log("Part 2:", part2(evaluationMap));


