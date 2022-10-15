import { Iterator } from "./Iterator";
export class StringTokenizer {
    private text: string;
    private separator : string;
    private returnSeparator : boolean;
    
    constructor(text: string,separator: string = " \n",returnSeparator: boolean = false) {
        this.text = text;
        this.separator = separator;
        this.returnSeparator = returnSeparator;
    }

    private indexOf(txt: string) : [number,string] {
        let index : number = -1;
        let delimiter : string = "";
        for(let i = 0, isz = this.separator.length; i < isz; i++) {
            let ch = this.separator.charAt(i);
            let idx = txt.indexOf(ch);
            if(idx >= 0) {
                if(index == -1 || index > idx) {
                    index = idx;
                    delimiter = ch;
                }
            }
        }
        return [index,delimiter];
    }

    public tokenize() : string[] {
        let result : string[] = [];
        let txt = this.text;
        let found = false;
        do {
            found = false;
            let [index, delimiter] = this.indexOf(txt);
            if(index>=0) {
                let str = txt.substring(0,index);
                result.push(str);
                if(this.returnSeparator) {
                    result.push(delimiter);
                }
                txt = txt.substring(index+1);
                found = true;
            }
        } while(found);
        if(txt!="") result.push(txt);
        return result;
    }
    
    public iterator() : Iterator<string> {
        return new Iterator<string>(this.tokenize());
    }

}
