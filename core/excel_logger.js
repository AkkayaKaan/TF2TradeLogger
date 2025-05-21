const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const EXCEL_FILE = path.join(__dirname, '../logs/trade_log.xlsx');

function saveToExcel(entry) {
    const headers = [
        'Date', 'Type', 'Item', 'Key(s)', 'Scrap', 'Reclaimed', 'Refined',
        'Buy Value (ref)', 'Sell Value (ref)', 'Profit (ref)'
    ];

    const row = [
        entry.date,
        entry.type,
        entry.item || (entry.received?.[0]?.name || entry.given?.[0]?.name || 'N/A'),
        entry.key || 0,
        entry.metal?.scrap || 0,
        entry.metal?.rec || 0,
        entry.metal?.ref || 0,
        entry.buy_value ?? '',
        entry.sell_value ?? '',
        entry.profit ?? ''
    ];

    let workbook, worksheet;
    if (fs.existsSync(EXCEL_FILE)) {
        workbook = XLSX.readFile(EXCEL_FILE);
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const existing = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        existing.push(row);
        const updated = XLSX.utils.aoa_to_sheet(existing);
        workbook.Sheets[workbook.SheetNames[0]] = updated;
    } else {
        const data = [headers, row];
        worksheet = XLSX.utils.aoa_to_sheet(data);
        workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Trades');
    }

    const LOG_DIR = path.join(__dirname, '../logs');
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

    XLSX.writeFile(workbook, EXCEL_FILE);
}

module.exports = { saveToExcel };
