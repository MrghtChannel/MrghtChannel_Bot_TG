require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: false }); 

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const json = req.body;

    try {
      await bot.handleUpdate(json);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
