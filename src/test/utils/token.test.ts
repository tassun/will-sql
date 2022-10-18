//import {describe, expect, test} from '@jest/globals';
import { StringTokenizer } from "../../utils/StringTokenizer";

describe('Test Utilities', () => {
    it("StringTokenizer sql1",() => {
        let sql1 = "select * from table1 where p1 = ?p1 and p2=?p2 ";
        let ans1 = [
            'select', ' ',    '*',
            ' ',      'from', ' ',
            'table1', ' ',    'where',
            ' ',      'p1',   ' ',
            '=',      ' ',    '',
            '?',      'p1',   ' ',
            'and',    ' ',    'p2=',
            '?',      'p2',   ' '
          ];
          let tok = new StringTokenizer(sql1,"?), \n",true);
          expect(tok.tokenize()).toStrictEqual(ans1);
    });
    it("StringTokenizer sql2",() => {
        let sql2 = "insert into table1 values(?p1,?p2)";
        let ans2 = [
            'insert',  ' ',
            'into',    ' ',
            'table1',  ' ',
            'values(', '?',
            'p1',      ',',
            '',        '?',
            'p2',      ')'
          ];
        let tok = new StringTokenizer(sql2,"?), \n",true);
        expect(tok.tokenize()).toStrictEqual(ans2);
    });
    it("StringTokenizer sql3",() => {
        let sql3 = "update p1=?p1, p2=?p2 , p3=?p3 where p4=?p4";
        let ans3 = [
            'update', ' ', 'p1=', '?',
            'p1',     ',', '',    ' ',
            'p2=',    '?', 'p2',  ' ',
            '',       ',', '',    ' ',
            'p3=',    '?', 'p3',  ' ',
            'where',  ' ', 'p4=', '?',
            'p4'
          ];
        let tok = new StringTokenizer(sql3,"?), \n",true);
        expect(tok.tokenize()).toStrictEqual(ans3);
    });
    it("StringTokenizer sql4",() => {
        let sql4 = "select * from table1 \n";
        sql4 += "where p1 = ?p1\n";
        sql4 += " and p2=?p2 ";   
        let ans4 = [
            'select', ' ',  '*',      ' ',
            'from',   ' ',  'table1', ' ',
            '',       '\n', 'where',  ' ',
            'p1',     ' ',  '=',      ' ',
            '',       '?',  'p1',     '\n',
            '',       ' ',  'and',    ' ',
            'p2=',    '?',  'p2',     ' '
          ];     
        let tok = new StringTokenizer(sql4,"?), \n",true);
        expect(tok.tokenize()).toStrictEqual(ans4);
    });
});
