export class DBError extends Error {
    public readonly state : number;
    constructor(message: string, state: number) {
        super(message);
        this.state = state;
        Object.setPrototypeOf(this, DBError.prototype);
    }
}
