import * as Excel from 'exceljs';
import { OrtoReport } from '../bean/models/listings';

export type excelRow = {
  header: string;
  key: string;
  width: number;
}

export const exportDataToExcel = (data: OrtoReport[], columns: excelRow[], filename: string) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Report Data');

  worksheet.columns = columns;

  data.forEach(item => {
    worksheet.addRow(item);
  });

  workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  });
};
