export class Node {
    i: number;
    j: number;

    constructor(i: number, j: number) {
        this.i = i;
        this.j = j;
    }

    equals(other: Node): boolean {
        return other instanceof Node && this.i === other.i && this.j === other.j;
    }

    hashCode(): string {
        return `${this.i},${this.j}`;
    }

    toSort(other: Node): number {
        if (this.i !== other.i) {
            return this.i - other.i;
        }
        return this.j - other.j;
    }

    toString(): string {
        return `${this.i},${this.j}`
    }
}

type Primitive = string | number | boolean

export function arraysOfPrimitivesEqual(a: Primitive[], b: Primitive[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

interface Hashable {
    hashCode(): string;
}

export class CustomSet<T extends Hashable> {
    private map: Map<string, T> = new Map();

    add(item: T): void {
        const hash = item.hashCode();
        if (!this.map.has(hash)) {
            this.map.set(hash, item);
        }
    }

    has(item: T): boolean {
        const hash = item.hashCode();
        return this.map.has(hash);
    }

    delete(item: T): boolean {
        const hash = item.hashCode();
        return this.map.delete(hash);

    }

    get size(): number {
        return this.map.size;
    }

    get(item: T): T | undefined {
        return this.map.get(item.hashCode());
    }

    [Symbol.iterator](): Iterator<T> {
        return this.map.values();
    }
}

export class Tuple<T> {
    first: T;
    second: T;

    constructor(first: T, second: T) {
        this.first = first;
        this.second = second;
    }

    hashCode(): string {
        return `${this.first}:${this.second}`;
    }

    equals(other: Tuple<T>): boolean {
        return other instanceof Tuple && this.first === other.first && this.second === other.second;
    }

    toString(): string {
        return `${this.first},${this.second}`
    }
}
