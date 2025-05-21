# 📦 TF2 Trade Logger

A fully automated Node.js-based TF2 trade logging system that tracks every buy/sell transaction, calculates profit in refined metal, and logs data into both `.json` and `.xlsx` formats. Built for real traders who care about every scrap.

---

## 🚀 Features

- ✅ Automatically logs every accepted trade
- ✅ Distinguishes between **buy** and **sell** transactions
- ✅ Tracks **Scrap**, **Reclaimed**, **Refined**, and **Keys**
- ✅ Calculates exact profit in `ref`
- ✅ FIFO matching system (first-buy, first-sell profit match)
- ✅ Logs to:
  - `data/trade_logs.json`
  - `logs/trade_log.xlsx`

---

## 📁 Project Structure

```
TF2TradeLogger/
├── Core/
│   ├── trade_logger.js
│   ├── profit_analyzer.js
│   └── excel_logger.js
├── data/
│   └── trade_logs.json       ← created automatically
├── logs/
│   └── trade_log.xlsx        ← created automatically
├── main.js
├── .env
└── README.md
```

---

## ⚙️ Requirements

- Node.js v18+  
- A TF2 account with:
  - `username`
  - `password`
  - `shared_secret` (for 2FA)

Install dependencies:
```bash
npm install steam-user steamcommunity steam-tradeoffer-manager steam-totp dotenv xlsx
```

---

## 📄 .env Format

```
STEAM_USERNAME=your_username
STEAM_PASSWORD=your_password
SHARED_SECRET=your_shared_secret
```

> ❗ Make sure `.env` is in your `.gitignore`

---

## 🧪 How It Works

1. Start the bot:
   ```bash
   node main
   ```

2. Every accepted trade is logged:
   - `buy` = bot gives metal, receives item
   - `sell` = bot gives item, receives metal
3. If a sold item was previously bought, profit is calculated automatically.

---

## 📊 Excel Output Example

| Date       | Type | Item               | Key(s) | Scrap | Rec | Ref | Buy Value | Sell Value | Profit |
|------------|------|--------------------|--------|-------|-----|-----|------------|-------------|--------|
| 2025-05-21 | Buy  | Taunt: Most Wanted | 1      | 1     | 0   | 2   | –          | –           | –      |
| 2025-05-22 | Sell | Taunt: Most Wanted | 1      | 0     | 2   | 2   | 3.11       | 3.66        | 0.55   |

---

## 🛡️ Notes

- No API key required
- Keys are counted as 1:1, not converted to ref
- All profit calculations follow TF2 pricing conventions:
  - `1 scrap = 0.11 ref`
  - `1 rec = 0.33 ref`
  - `1 ref = 1.00 ref`

---

## ✅ TODO (Optional Enhancements)

- [ ] Discord webhook integration
- [ ] GUI dashboard (Electron or Web)
- [ ] Item-specific profit leaderboard

---

## 👨‍💻 Author

**Kaan Akkaya**  
Built for precision trading.  
GitHub: [@kaanakkaya](https://github.com/AkkayaKaan)---

## ⚠️ Disclaimer

This project was developed and completed in a short period of time. While fully functional, it may contain edge case bugs, unexpected behaviors, or unhandled exceptions.

Please test thoroughly before deploying in a production or trade-critical environment.

Pull requests and issue reports are welcome.