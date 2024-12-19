import * as fs from "fs";

const f: string = fs.readFileSync("../inputs/day19/test_input.txt", { encoding: "utf-8" });
const input: string[] = f.trim().split("\n\n");
const towels: string[] = input[0].trim().split(",").map(x => x.trim());
const designs: string[] = input[1].trim().split("\n").map(x => x.trim());

function soluton(towels: string[], designs: string[]): [number, number] {
    const cache: Map<string, number> = new Map();
    let resultPart1: number = 0;
    let resultPart2: number = 0;
    for (const desing of designs) {
        if (possible(cache, desing, towels) > 0) {
            resultPart1++;
        }
        resultPart2 += possible(cache, desing, towels);
    }
    return [resultPart1, resultPart2];
}

function possible(cache: Map<string, number>, desing: string, towels: string[]): number {
    if (!cache.has(desing)) {
        if (desing.length === 0) {
            return 1;
        } else {
            let result: number = 0;
            for (const towel of towels) {
                if (desing.startsWith(towel)) {
                    result += possible(cache, desing.substring(towel.length), towels);
                }
            }
            cache.set(desing, result);
        }
    }
    return cache.get(desing)!;
}

const [resPart1, resPart2]: [number, number] = soluton(towels, designs)
console.log("Part 1:", resPart1);
console.log("Part 2:", resPart2);
