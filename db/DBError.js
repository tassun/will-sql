"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBError = void 0;
class DBError extends Error {
    constructor(message, state) {
        super(message);
        this.state = state;
        Object.setPrototypeOf(this, DBError.prototype);
    }
}
exports.DBError = DBError;
