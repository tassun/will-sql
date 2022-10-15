"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iterator = void 0;
class Iterator {
    constructor(values) {
        this.values = values;
        this.index = 0;
    }
    hasNext() {
        return this.values.length > this.index;
    }
    next() {
        return this.values[this.index++];
    }
}
exports.Iterator = Iterator;
