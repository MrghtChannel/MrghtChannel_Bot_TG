module.exports = {
    isAdminCommand(chatId, messageText) {
        const adminId = process.env.ADMIN_ID;
        return chatId.toString() === adminId && messageText.startsWith('/notifications ');
    },

    sendNotifications(bot, users, messageText) {
        const notificationMessage = messageText.replace('/notifications ', '');
        users.forEach((userId) => {
            bot.sendMessage(userId, `📢 ${notificationMessage}`);
        });
    }
};