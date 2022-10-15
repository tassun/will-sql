"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilities = void 0;
const path_1 = __importDefault(require("path"));
class Utilities {
    static getWorkingDir(dir) {
        let basename = path_1.default.basename(dir);
        if (basename == "src" || basename == "dist") {
            dir = path_1.default.dirname(dir);
        }
        return dir;
    }
    static getDateNow(now) {
        if (!now)
            now = new Date();
        return Utilities.formatDate(now, false);
    }
    static getTimeNow(now) {
        if (!now)
            now = new Date();
        let hh = now.getHours();
        let mm = now.getMinutes();
        let ss = now.getSeconds();
        let result = ((hh < 10) ? "0" : "") + hh;
        result += ((mm < 10) ? ":0" : ":") + mm;
        result += ((ss < 10) ? ":0" : ":") + ss;
        return result;
    }
    static getDateTimeNow(now) {
        if (!now)
            now = new Date();
        return Utilities.getDateNow(now) + " " + Utilities.getTimeNow(now);
    }
    static getYMD(now) {
        return Utilities.formatDate(now, true);
    }
    static getDMY(now) {
        return Utilities.formatDate(now, false);
    }
    static formatDate(now, ymd = false) {
        if (!now)
            return "";
        let dd = now.getDate();
        let mm = now.getMonth() + 1;
        let yy = now.getFullYear();
        let result = "";
        if (ymd) {
            result = "" + yy;
            result += ((mm < 10) ? "-0" : "-") + mm;
            result += ((dd < 10) ? "-0" : "-") + dd;
        }
        else {
            result = ((dd < 10) ? "0" : "") + dd;
            result += ((mm < 10) ? "/0" : "/") + mm;
            result += "/" + yy;
        }
        return result;
    }
    static getHMS(now) {
        if (!now)
            return "";
        return "" + now;
    }
    static currentDate(now) {
        if (!now)
            now = new Date();
        let dd = now.getDate();
        let mm = now.getMonth() + 1;
        let yy = now.getFullYear();
        let result = "" + yy;
        result += ((mm < 10) ? "-0" : "-") + mm;
        result += ((dd < 10) ? "-0" : "-") + dd;
        return result;
    }
    static currentTime(now) {
        if (!now)
            now = new Date();
        let hh = now.getHours();
        let mm = now.getMinutes();
        let ss = now.getSeconds();
        let result = ((hh < 10) ? "0" : "") + hh;
        result += ((mm < 10) ? ":0" : ":") + mm;
        result += ((ss < 10) ? ":0" : ":") + ss;
        return result;
    }
    static currentDateTime(now) {
        if (!now)
            now = new Date();
        return Utilities.currentDate(now) + " " + Utilities.currentTime(now);
    }
    static currentTimeMillis(now) {
        if (!now)
            now = new Date();
        return now.getTime();
    }
    static addDays(days, date) {
        if (!date)
            date = new Date();
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    static compareDate(adate, bdate) {
        if (!adate && !bdate)
            return 0;
        let astr = Utilities.formatDate(adate, true);
        let bstr = Utilities.formatDate(bdate, true);
        return Utilities.compareString(astr, bstr);
        //return astr.localeCompare(bstr as string, undefined, { sensitivity: 'accent' });
    }
    static compareString(astr, bstr) {
        if (!astr && !bstr)
            return 0;
        if (!astr && bstr)
            return -1;
        if (astr && !bstr)
            return 1;
        let text = "" + astr;
        return text.localeCompare(bstr, undefined, { sensitivity: 'accent' });
    }
    static equalsIgnoreCase(astr, bstr) {
        return this.compareString(astr, bstr) == 0;
    }
    static isString(value) {
        return typeof value === 'string' || value instanceof String;
    }
    static parseNumber(defaultValue, dataValue) {
        if (dataValue) {
            if (Utilities.isString(dataValue)) {
                return parseInt("" + dataValue);
            }
            else {
                return dataValue;
            }
        }
        return defaultValue;
    }
}
exports.Utilities = Utilities;
