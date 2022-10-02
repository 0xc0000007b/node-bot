let token = '5672659719:AAGpD8BJKR9FfziO3vpAbrRUTGRH8HMKCt8'
let botApi = require('node-telegram-bot-api')
const {gameOptions, againOpts} = require('./options')
const sequelize = require('./db')
const UserModel = require('./moddels')


const bot = new botApi(token, {polling: true})
let chats = {}





let startGame = async(chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифиру, а тебе треба ее отгадать')
    const randNums = Math.floor(Math.random() * 10)
    chats[chatId] = randNums;
    await bot.sendMessage(chatId, 'Отгадай', gameOptions)

}

bot.setMyCommands([
    {command: '/start', description: 'is a Hello command'},
    {command: '/info', description: 'not use this command, please'},
    {command: '/game', description: 'starting a game'},
])
const start = async () => {
        try {
            await sequelize.authenticate()
            await sequelize.sync()
        } catch (e) {
            console.log('Подключение к бд сломалось', e)
        }




        bot.on('message', async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;

            try {
                if (text === '/start') {
                    await UserModel.create({chatId})
                    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
                    return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот SillyText`);
                }
                if (text === '/info') {
                    const user = await UserModel.findOne({chatId})
                    return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, в игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}`);
                }
                if (text === '/game') {
                    return startGame(chatId);
                }
                if (text === '/khuy') {
                    await  bot.sendMessage(chatId, `Очень смешная шутка,  друг мой. Но ладно, я с Тиллем договорился, лови.`);
                    return  bot.sendVideo(chatId, `https://vod2ren.cdnvideo.ru/ren/2018/12.18/04.12.18/%D1%88%D0%BD%D1%83%D1%80%D1%82%D0%B8%D0%BB%D1%8C.mp4`);
                }
                return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
            } catch (e) {
                return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
            }

        })

        bot.on('callback_query', async msg => {
            const data = msg.data;
            const chatId = msg.message.chat.id;
            if (data === '/again') {
                return startGame(chatId)
            }
            const user = await UserModel.findOne({chatId})
            if (data == chats[chatId]) {
                user.right += 1;
                await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOpts);
            } else {
                user.wrong += 1;
                await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOpts);
            }
            await user.save();
        })
}
start()