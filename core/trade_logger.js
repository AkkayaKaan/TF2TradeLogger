const fs = require('fs');
const path = require('path');
const { analyzeProfit } = require('./profit_analyzer');
const { saveToExcel } = require('./excel_logger');

const DATA_DIR = path.join(__dirname, '../data');
const LOG_FILE = path.join(DATA_DIR, 'trade_logs.json');

// 🛡️ Her şey garanti altına alınıyor
function ensureLogFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, JSON.stringify([]));
    }
}

// 📦 JSON log
function logTrade(entry) {
    ensureLogFile(); // 🔁 Her seferde güvence
    const logs = JSON.parse(fs.readFileSync(LOG_FILE));
    logs.push(entry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

module.exports = function processTrade(offer) {
    try {
        const theirItems = offer.itemsToReceive;
        const myItems = offer.itemsToGive;

        const received = parseItems(theirItems);
        const given = parseItems(myItems);
        const type = isBuying(given) ? 'buy' : 'sell';

        const entry = {
            date: new Date().toISOString(),
            partner: offer.partner.getSteamID64(),
            received,
            given,
            type,
            metal: countMetals([...theirItems, ...myItems]),
            key: countKeys([...theirItems, ...myItems]),
            profit: null
        };

        if (type === 'sell') {
            const result = analyzeProfit(entry);
            if (result) {
                console.log(`💰 ${result.itemName} sold | Buy: ${result.buyValue} → Sell: ${result.sellValue} | Profit: +${result.profit} ref`);
            } else {
                console.log(`❓ Sell logged, but no matching buy found.`);
            }
        }

        logTrade(entry);
        saveToExcel(entry);
        console.log(`📦 Trade logged. Type: ${type}`);
    } catch (err) {
        console.error("❌ Logging error:", err);
    }
};

function parseItems(items) {
    return items.map(item => ({
        name: item.market_hash_name
    }));
}

function countMetals(items) {
    let scrap = 0, rec = 0, ref = 0;

    for (const item of items) {
        const name = item.name.toLowerCase();
        if (name.includes('scrap')) scrap += 1;
        else if (name.includes('reclaimed')) rec += 1;
        else if (name.includes('refined')) ref += 1;
    }

    return { scrap, rec, ref };
}

function countKeys(items) {
    return items.filter(item => item.name.toLowerCase().includes('mann co. supply crate key')).length;
}

function isBuying(givenItems) {
    return givenItems.some(item => {
        const name = item.name.toLowerCase();
        return name.includes('scrap') || name.includes('reclaimed') || name.includes('refined') || name.includes('key');
    });
}
