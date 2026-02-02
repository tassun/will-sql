export class KnDBFault extends Error {
    /**
     * this is error code
     */
    public readonly code: number;
    /**
     * this is error state
     */
    public readonly state? : string;
    constructor(message: string, code: number, state?: string) {
        super(message);
        this.code = code;
        this.state = state;
        Object.setPrototypeOf(this, KnDBFault.prototype);
    }
}
