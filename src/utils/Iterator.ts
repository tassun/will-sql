export class Iterator<T> {
    private index: number = 0;
    constructor(private values: T[]) {
    }
    public hasNext(): boolean {
        return this.values.length > this.index;
    }
    public next(): T {
        return this.values[this.index++];
    }
}
