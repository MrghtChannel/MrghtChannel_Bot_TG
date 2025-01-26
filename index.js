require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const web = require('./modules/web');
const notifications = require('./modules/notifications');

const ua = require('./language/ua');
const en = require('./language/en');
const de = require('./language/de');

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.ADMIN_ID;
const bot = new TelegramBot(token, { polling: true }); 

const languageMap = {
    '🇺🇦 Українська мова': ua,
    '🇬🇧 English': en,
    '🇩🇪 Deutsch': de,
};
const userLanguage = {};
const users = new Set();

function mainKeyboard(lang) {
    return {
        reply_markup: {
            keyboard: [
                [
                    { text: lang.mainMenu.about },
                    { text: lang.mainMenu.projects },
                ],
                [
                    { text: lang.mainMenu.news },
                    { text: lang.mainMenu.changeLanguage },
                ],
                [
                    {
                        text: '🌐 Open Web App',
                        ...web.getWebAppMenuOption(), 
                    },
                ],
            ],
            resize_keyboard: true,
        },
    };
}

const languageKeyboard = {
    reply_markup: {
        keyboard: [
            [
                { text: '🇺🇦 Українська мова' },
                { text: '🇬🇧 English' },
                { text: '🇩🇪 Deutsch' },
            ],
        ],
        resize_keyboard: true,
    },
};

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    users.add(chatId);

    if (messageText === '/start') {
        bot.sendMessage(
            chatId,
            '🌍 Виберіть мову / Select your language / Wählen Sie Ihre Sprache:',
            languageKeyboard
        );
        return;
    }

    if (languageMap[messageText]) {
        userLanguage[chatId] = languageMap[messageText];
        bot.sendMessage(
            chatId,
            userLanguage[chatId].languageSelected,
            mainKeyboard(userLanguage[chatId])
        );
        return;
    }

    const lang = userLanguage[chatId] || en;

    if (messageText === lang.mainMenu.about) {
        const aboutText = `${lang.aboutSection.title}\n\n` +
                          `${lang.aboutSection.links.website}\n` +
                          `${lang.aboutSection.links.discord}\n` +
                          `${lang.aboutSection.links.facebook}\n` +
                          `${lang.aboutSection.links.twitter}\n` +
                          `${lang.aboutSection.links.reddit}`;
        bot.sendMessage(chatId, aboutText);
    } else if (messageText === lang.mainMenu.projects) {
        const projectsText = `${lang.projectsSection.title}\n\n` +
                             `${lang.projectsSection.description}\n\n` +
                             `${lang.projectsSection.links.github}\n` +
                             `${lang.projectsSection.links.gitlab}`;
        bot.sendMessage(chatId, projectsText);
    } else if (messageText === lang.mainMenu.news) {
        bot.sendMessage(chatId, `${lang.newsSection.title}\n\n${lang.newsSection.message}`);
    } else if (messageText === lang.mainMenu.changeLanguage) {
        bot.sendMessage(
            chatId,
            '🌍 Виберіть іншу мову / Select a different language / Wählen Sie eine andere Sprache:',
            languageKeyboard
        );
    } else if (notifications.isAdminCommand(chatId, messageText)) {
        notifications.sendNotifications(bot, users, messageText);
        bot.sendMessage(chatId, '✅ Повідомлення успішно надіслано всім користувачам.');
    } else {
        bot.sendMessage(chatId, lang.errors.unknownCommand);
    }
});

