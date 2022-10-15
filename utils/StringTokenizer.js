"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTokenizer = void 0;
const Iterator_1 = require("./Iterator");
class StringTokenizer {
    constructor(text, separator = " \n", returnSeparator = false) {
        this.text = text;
        this.separator = separator;
        this.returnSeparator = returnSeparator;
    }
    indexOf(txt) {
        let index = -1;
        let delimiter = "";
        for (let i = 0, isz = this.separator.length; i < isz; i++) {
            let ch = this.separator.charAt(i);
            let idx = txt.indexOf(ch);
            if (idx >= 0) {
                if (index == -1 || index > idx) {
                    index = idx;
                    delimiter = ch;
                }
            }
        }
        return [index, delimiter];
    }
    tokenize() {
        let result = [];
        let txt = this.text;
        let found = false;
        do {
            found = false;
            let [index, delimiter] = this.indexOf(txt);
            if (index >= 0) {
                let str = txt.substring(0, index);
                result.push(str);
                if (this.returnSeparator) {
                    result.push(delimiter);
                }
                txt = txt.substring(index + 1);
                found = true;
            }
        } while (found);
        if (txt != "")
            result.push(txt);
        return result;
    }
    iterator() {
        return new Iterator_1.Iterator(this.tokenize());
    }
}
exports.StringTokenizer = StringTokenizer;
