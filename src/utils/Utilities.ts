import path from 'path';
export class Utilities {
    public static getWorkingDir(dir: string) : string {
        let basename = path.basename(dir);
        if(basename=="src" || basename=="dist") {
            dir = path.dirname(dir);
        }
        return dir;
    }

	public static getDateNow(now?: Date) : string { 
		if(!now) now  = new Date(); 
		return this.formatDate(now,false);
	} 

	public static getTimeNow(now?: Date) : string { 
		if(!now) now = new Date(); 
		let hh = now.getHours(); 
		let mm = now.getMinutes(); 
		let ss = now.getSeconds(); 
		let result = ((hh < 10) ? "0":"") + hh; 
		result += ((mm < 10) ? ":0" : ":") + mm; 
		result += ((ss < 10) ? ":0" : ":") + ss; 
		return result; 
	} 

	public static getDateTimeNow(now?: Date) : string {
		if(!now) now = new Date(); 
		return this.getDateNow(now)+" "+this.getTimeNow(now);
	}

	public static getYMD(now?: Date) : string {
		return this.formatDate(now,true);
	}

	public static getDMY(now?: Date) : string {
		return this.formatDate(now,false);
	}

	public static formatDate(now?: Date, ymd: boolean = false) : string { 
		if(!now) return "";
		let dd = now.getDate(); 
		let mm = now.getMonth()+1; 
		let yy = now.getFullYear(); 
		let result = "";
		if(ymd) {
			result = ""+yy;
			result += ((mm < 10) ? "-0" : "-") + mm; 
			result += ((dd < 10) ? "-0" : "-") + dd; 
		} else {
			result = ((dd < 10) ? "0" : "") + dd; 
			result += ((mm < 10) ? "/0" : "/") + mm; 
			result += "/"+yy; 	
		}
		return result; 
	} 

	public static getHMS(now?: Date) : string {
		if(!now) return "";
		return ""+now;
	}

	public static currentDate(now?: Date) : string { 
		if(!now) now  = new Date(); 
		let dd = now.getDate(); 
		let mm = now.getMonth()+1; 
		let yy = now.getFullYear(); 
		let result = ""+yy;
		result += ((mm < 10) ? "-0" : "-") + mm; 
		result += ((dd < 10) ? "-0" : "-") + dd; 
		return result; 
	} 

	public static currentTime(now?: Date) : string { 
		if(!now) now = new Date(); 
		let hh = now.getHours(); 
		let mm = now.getMinutes(); 
		let ss = now.getSeconds(); 
		let result = ((hh < 10) ? "0":"") + hh; 
		result += ((mm < 10) ? ":0" : ":") + mm; 
		result += ((ss < 10) ? ":0" : ":") + ss; 
		return result; 
	} 

	public static currentDateTime(now?: Date) : string { 
		if(!now) now  = new Date(); 
		return this.currentDate(now)+" "+this.currentTime(now);
	}

	public static currentTimeMillis(now?: Date) : number {
		if(!now) now = new Date();
		return now.getTime();
	}

	public static addDays(days: number, date?: Date) : Date {
		if(!date) date = new Date();
		let result = new Date(date);
		result.setDate(result.getDate() + days)
		return result;
	}

	public static compareDate(adate?: Date, bdate?: Date) : number {
		if(!adate && !bdate) return 0;
		let astr = this.formatDate(adate,true);
		let bstr = this.formatDate(bdate,true);
		return this.compareString(astr,bstr);
	}

	public static compareString(astr?: string, bstr?: string) : number {
		if(!astr && !bstr) return 0;
		if(!astr && bstr) return -1;
		if(astr && !bstr) return 1;
		let text = ""+astr;	
		return text.localeCompare(bstr as string, undefined, { sensitivity: 'accent' });
	}

	public static equalsIgnoreCase(astr?: string, bstr?: string) : boolean {
		return this.compareString(astr,bstr)==0;
	}

	public static isString(value: any) : boolean {
		return typeof value === 'string' || value instanceof String;
	}

    public static parseNumber(defaultValue: number, dataValue?: any) : number {
        if(dataValue) {
            if(this.isString(dataValue)) {
                return parseInt(""+dataValue);
            } else {
                return dataValue as number;
            }
        }
        return defaultValue;
    }

	public static hasAttributes = <T extends string> ( element: unknown,  attributes: T[]) : element is Record<T, unknown>  => {
		if(element === undefined || element === null) return false;
		return attributes.every((attribute) => {
			return Object.prototype.hasOwnProperty.call(element, attribute);
		});
	}
	
}
