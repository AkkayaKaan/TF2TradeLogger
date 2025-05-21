require('dotenv').config();
const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamTotp = require('steam-totp');

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en',
    useAccessToken: true
});

let initialized = false;

client.logOn({
    accountName: process.env.STEAM_USERNAME,
    password: process.env.STEAM_PASSWORD,
    twoFactorCode: SteamTotp.generateAuthCode(process.env.SHARED_SECRET)
});

client.on('loggedOn', () => {
    console.log('✅ Logged into Steam successfully.');
    client.setPersona(SteamUser.EPersonaState.Online);
});

client.on('webSession', (sessionID, cookies) => {
    if (initialized) return;
    initialized = true;

    manager.setCookies(cookies);
    community.setCookies(cookies);
    console.log('🍪 Web session established. TradeOfferManager is active.');

    const logTrade = require('./core/trade_logger');

    // 🔁 Our bot sent the offer → got accepted
    manager.on('sentOfferChanged', (offer, oldState) => {
        if (offer.state === TradeOfferManager.ETradeOfferState.Accepted) {
            console.log('📤 Outgoing trade accepted. Logging...');
            logTrade(offer);
        }
    });

    // 🔁 We received an offer → accepted
    manager.on('receivedOfferChanged', (offer, oldState) => {
        if (offer.state === TradeOfferManager.ETradeOfferState.Accepted) {
            console.log('📥 Incoming trade accepted. Logging...');
            logTrade(offer);
        }
    });
});
