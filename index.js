const TelegramBot = require('node-telegram-bot-api');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Клавиатура с выбором языка и флагами
const languageKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: '🇺🇦 Українська мова' }, { text: '🇬🇧 Englisch' }, { text: '🇩🇪 Deutsch' }],
        ],
        resize_keyboard: true,
    },
};

// Функция для создания кнопки "Выбрать другой язык"
function changeLanguageButton(lang) {
    switch (lang) {
        case '🇺🇦 Українська мова':
            return { text: 'Змінити мову 🔄' };
        case '🇬🇧 Englisch':
            return { text: 'Change language 🔄' };
        case '🇩🇪 Deutsch':
            return { text: 'Sprache ändern 🔄' };
        default:
            return { text: 'Change language 🔄' };
    }
}

// Клавиатура с основными действиями и кнопкой "Выбрать другой язык"
function mainKeyboard(lang) {
    let aboutText, projectsText;
    switch (lang) {
        case '🇺🇦 Українська мова':
            aboutText = 'Про нас';
            projectsText = 'Проєкти';
            break;
        case '🇬🇧 Englisch':
            aboutText = 'About us';
            projectsText = 'Projects';
            break;
        case '🇩🇪 Deutsch':
            aboutText = 'Über uns';
            projectsText = 'Projekte';
            break;
        default:
            aboutText = 'About us';
            projectsText = 'Projects';
            break;
    }
    return {
        reply_markup: {
            keyboard: [
                [{ text: aboutText }, { text: projectsText }],
                [{ text: 'News' }, changeLanguageButton(lang)],
            ],
            resize_keyboard: true,
        },
    };
}

// Обработчик команд и текстовых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (messageText === '/start') {
        bot.sendMessage(chatId, 'Виберіть мову:', languageKeyboard);
    } else if (messageText === '🇺🇦 Українська мова' || messageText === '🇬🇧 Englisch' || messageText === '🇩🇪 Deutsch') {
        bot.sendMessage(chatId, 'Мова обрана: ' + messageText, mainKeyboard(messageText));
    } else if (messageText === 'Про нас' || messageText === 'About us' || messageText === 'Über uns') {
        bot.sendMessage(chatId, 'Website:https://mrghtchannel.github.io/Website-MrghtChannel/\n\Discord:https://discord.gg/XnXJCQhwyv\n\Facebook:https://www.facebook.com/profile.php?id=100089807778533\n\Twitter:https://twitter.com/MrghtChannel\n\Reddit:https://www.reddit.com/user/MrghtChannel/');
    } else if (messageText === 'Проєкти' || messageText === 'Projects' || messageText === 'Projekte') {
        bot.sendMessage(chatId, 'Тут ви знайдете наші open-source проєкти\n\Here you will find our open-source projects\n\Hier finden Sie unsere Open-Source-Projekte/:\n- https://github.com/MrghtChannel\n- https://gitlab.com/MrghtChannel');
    } else if (messageText === 'News') {
        bot.sendPhoto(chatId, 'https://sitechecker.pro/wp-content/uploads/2023/06/404-status-code.png', { caption: 'Наразі ми працюємо над оновленням новин. Будь ласка, зайдіть пізніше.\n\nWe are currently working on updating the news. Please come back later.\n\nWir arbeiten derzeit an der Aktualisierung der Neuigkeiten. Bitte komme später zurück.' });
    } else if (messageText === 'Змінити мову 🔄' || messageText === 'Change language 🔄' || messageText === 'Sprache ändern 🔄') {
        bot.sendMessage(chatId, 'Виберіть іншу мову:', languageKeyboard);
    } else {
        bot.sendMessage(chatId, 'Я не розумію вашого повідомлення.');
    }
});
