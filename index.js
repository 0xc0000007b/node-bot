let token = '5672659719:AAGpD8BJKR9FfziO3vpAbrRUTGRH8HMKCt8'
let botApi = require('node-telegram-bot-api')
const {gameOptions, againOpts} = require('./options')

const bot = new botApi(token, {polling: true})
let chats = {}




bot.setMyCommands([
    {command: '/start', description: 'is a Hello command'},
    {command: '/test', description: 'is a test command'},
    {command: '/khuy', description: 'Лидеманн поздравит тебя с новыс годом'},
    {command: '/game', description: 'starting a game'},
])

let startGame = async(id) => {
    await bot.sendMessage(id, 'Я загадаю цифиру, а тебе треба ее отгадать')
    const randNums = Math.floor(Math.random() * 10)
    chats[id] = randNums;
    await bot.sendMessage(id, 'Отгадай', gameOptions)

}

const start = () => {

    bot.on('message',async (msg) => {
        const id = msg.chat.id;
        const text = msg.text;
        if(text.toLowerCase() === '/start'){
           return bot.sendMessage(id, "you re started the bot")
        }
        if(text.toLowerCase() === '/test'){
          return  bot.sendMessage(id, "that are test command")
        }
        if(text.toLowerCase() === '/khuy'){
           await bot.sendVideo(id, 'https://vod2ren.cdnvideo.ru/ren/2018/12.18/04.12.18/%D1%88%D0%BD%D1%83%D1%80%D1%82%D0%B8%D0%BB%D1%8C.mp4')
           return bot.sendMessage(id, "Really funny joke")
        }
        if(text === '/game'){
            return  startGame(id)
        }


        return bot.sendMessage(id, 'i dont understood you')
        })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const id = msg.message.chat.id

        if(data === '/again') {
            return startGame(id)
        }

        if(data === chats[id]) {
            return bot.sendMessage(id, `Поздравляю, ты угадал, я загадал цифру: ${chats[id]} `, againOpts)
        } else {
             return bot.sendMessage(id, `Ты не угадал, я загадал цифру: ${chats[id]} `, againOpts)

        }



    })
}

start();