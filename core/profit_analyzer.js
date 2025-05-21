const fs = require('fs');
const path = require('path');

const METAL_REF = {
    scrap: 0.11,
    rec: 0.33,
    ref: 1.00
};

const LOG_FILE = path.join(__dirname, '../data/trade_logs.json');

function loadLogs() {
    if (!fs.existsSync(LOG_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
}

function saveLogs(logs) {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

function computeValue(entry) {
    const metal = entry.metal;
    const key = entry.key;
    return +(metal.scrap * METAL_REF.scrap + metal.rec * METAL_REF.rec + metal.ref + key).toFixed(2);
}

function analyzeProfit(sellEntry) {
    const logs = loadLogs();

    const itemName = sellEntry.given?.[0]?.name;
    if (!itemName) return null;

    const buyEntryIndex = logs.findIndex(e =>
        e.type === 'buy' &&
        e.received?.[0]?.name === itemName &&
        e.profit === null
    );

    if (buyEntryIndex === -1) return null;

    const buyEntry = logs[buyEntryIndex];
    const buyValue = computeValue(buyEntry);
    const sellValue = computeValue(sellEntry);
    const profit = +(sellValue - buyValue).toFixed(2);

    logs[buyEntryIndex].profit = 0;
    sellEntry.profit = profit;
    sellEntry.buy_value = buyValue;
    sellEntry.sell_value = sellValue;
    sellEntry.item = itemName;

    saveLogs(logs);

    return { profit, itemName, buyValue, sellValue };
}

module.exports = { analyzeProfit };
