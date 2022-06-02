import ExcelJS from 'exceljs';

const createXlsx = async (data: any) => {

    const { dirname } = require('path');
    const appDir = dirname(require.main.filename);
    let filename = `${appDir}/report.xlsx`;
    const workbookWriter = new ExcelJS.stream.xlsx.WorkbookWriter({
        filename,
        useStyles: true
    })

    const result = new Promise((resolve, reject) => {
        try {
            const salarySheet = workbookWriter.addWorksheet('salary Report')
            salarySheet.columns = [{ header: 'date', key: 'date' }, { header: 'day', key: 'day' }];

            if (data[0]) {
                data[0].forEach((record: any) => {
                    salarySheet.addRow(record);
                })
            }
            salarySheet.commit()
            const bonusSheet = workbookWriter.addWorksheet('Bonus Report');
            bonusSheet.columns = [
                { header: 'date', key: 'date' },
                { header: 'Actual Day on 15th ', key: 'day' },
                { header: 'reason', key: 'reason' }];

            data[1].forEach((record: any) => {
                bonusSheet.addRow(record);
            })

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
        return 'Please enter valid date with YYYY-MM-DD format.';
    }
    return true;
}

export { createXlsx, addMonths, getDayName, validateDate };