import ExcelJS, { Worksheet } from 'exceljs';

const createXlsx = async (data: any, fileName:string) => {

    const { dirname } = require('path');
    const appDir = dirname(require.main.filename);
    let filename = `${appDir}/${fileName}.xlsx`;
    const workbookWriter = new ExcelJS.stream.xlsx.WorkbookWriter({
        filename,
        useStyles: true
    })

    const result = new Promise((resolve, reject) => {
        try {
            const salarySheet = workbookWriter.addWorksheet('salary Report')
            salarySheet.columns = [{ header: 'date', key: 'date', width:30  }, 
            { header: 'Actual Day on Salary Day', key: 'dayName',width:30  }];
            data[0].forEach((record: any) => {
                let row =   salarySheet.addRow(record);
            })
            styleSheet(salarySheet);
            salarySheet.commit()
            const bonusSheet = workbookWriter.addWorksheet('Bonus Report');
            bonusSheet.columns = [
                { header: 'date', key: 'date',width:30 },
                { header: 'Actual Day on 15th ', key: 'day',width:30 },
                { header: 'reason', key: 'reason',width:60 }];
            data[1].forEach((record: any) => {
               let row =  bonusSheet.addRow(record);
            })
            styleSheet(bonusSheet);
            bonusSheet.commit()

            workbookWriter.commit().then(data => {
                resolve({ filename: filename });
            }).catch((err) => console.error(err))
            } catch (error) {
                reject(error)
            }

    });
    return result;
}

const addMonths = (date: any, months: any) => {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}

const getDayName = (day: number) => {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
}

const validateDate = (dateStr: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateStr.match(regex) === null) {
        return 'Please enter date with YYYY-MM-DD format.';
    }

    const date = new Date(dateStr);

    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return 'Please enter valid date with YYYY-MM-DD format.';
    }

    return true;
}

const styleSheet = (sheet:Worksheet)=>{
    return   sheet.eachRow({ includeEmpty: false }, function(row: any, rowNumber:number){
        row.eachCell(function(cell:any, colNumber:number){
         cell.font = {
           name: 'Arial',
           family: 2,
           bold: true,
           size: 10,
         };
         cell.alignment = {
           vertical: 'middle', horizontal: 'center'
         };
        row.height = 20;
        if (rowNumber >= 1) {
           for (var i = 1; i < 4 ; i++) {
             if (rowNumber == 1) {
               row.getCell(i).fill = {
                 type: 'pattern',
                 pattern:'solid',
                 fgColor:{argb:'C7C7C7'}
               };
             }
             row.getCell(i).border = {
             top: {style:'thin'},
             left: {style:'thin'},
             bottom: {style:'thin'},
             right: {style:'thin'}
           };
         }
        }
       });
    });

}

export { createXlsx, addMonths, getDayName, validateDate };