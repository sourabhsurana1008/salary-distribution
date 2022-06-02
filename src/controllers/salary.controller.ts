import { Request, Response } from "express";
import * as Helper from '../helpers/helper';
import * as fs from 'fs';

export class salaryController {
    
   /* Sends the file as binary
   * @param date  (YYYY-MM-DD) format */
   
    public async getReport(req: Request, res: Response) {

        const inputDate = req.params.date;
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if(!inputDate) {
            res.status(400).send('Please enter date with YYYY-MM-DD format.');
        } else if (inputDate.match(regex) === null) { 
            res.status(400).send('Please enter valid date with YYYY-MM-DD format.');
        }

        const listOfMonth = getNext12Month(inputDate);
        const bonusDate = Helper.addMonths(new Date(req.params.date), 1);

        let formatedBonusDate = bonusDate.toISOString().split('T')[0];
        const listOfbonusMonth = getNext12Month(formatedBonusDate);
        const salaryRecord = getSalaryDay(listOfMonth);
        const bonusRecord = getBonusDay(listOfbonusMonth);
        const fileName = `salary record ${inputDate}`;

        await Helper.createXlsx([salaryRecord, bonusRecord],fileName ).then((response: any) => {

            res.download(response.filename, `${fileName}.xlsx`, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlinkSync(response.filename); 
            })
        })
    }
}

function formatDate(date:Date) {
    new Date(date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getBonusDay(listOfMonth: any) {

    let bonusDate: any = [];
    listOfMonth.forEach((element: any) => {
        var date = new Date(Date.UTC(element.year, element.month, 15));
        const d = new Date(new Date(date));
        let day = d.getDay();
       
        if (day !== 0 && day !== 6) {
            bonusDate.push({ date: d.toString().slice(0, 15), day: Helper.getDayName(day), reason: "No change" })
        } else if (day === 0) {
            d.setDate(d.getDate() + 3);
            bonusDate.push({ date: d.toString().slice(0, 15), day: Helper.getDayName(day), reason: "Weekend is there so shifted next wednesday" })
        } else {
            d.setDate(d.getDate() + 4);
            bonusDate.push({ date: d.toString().slice(0, 15), day: Helper.getDayName(day), reason: "Weekend is there so shifted next wednesday" })
        }
    });
    console.log(bonusDate)
    return bonusDate;
}

function getSalaryDay(listOfMonth: any) {
    let response: any = [];

    listOfMonth.forEach((val: any) => {
        var date = new Date(Date.UTC(val.year, val.month, 28));
        var days = [];
        while (date.getUTCMonth() === val.month) {
            const d = new Date(new Date(date));
            let daynumber = d.getDay();
            days.push({ date:  date.toString().slice(0, 15), day: daynumber, dayName: Helper.getDayName(daynumber) });
            date.setUTCDate(date.getUTCDate() + 1);
        }
        let obj = days.reverse();
        let result = obj.filter(val => {
            if (val.day <= 5 && val.day >= 1) {
                return val;
            }
        })
        response.push(result[0])
    })
    return response;

}

function getNext12Month(inputDate: any) {
    var now = new Date(inputDate);
    var month = now.getMonth();
    var year = now.getFullYear();
    var names = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var res = [];
    for (var i = 0; i < 13; ++i) {
        res.push({
            month: month,
            year: year
        })
        if (++month === 12) {
            month = 0;
            ++year;
        }
    }
    return res;
}




