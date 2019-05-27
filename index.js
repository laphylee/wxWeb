const { Wechaty } = require('wechaty')
const express = require('express')
const app = express()


function onScan (qrcode, status) {
  require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

function onLogin (user) {
  console.log(`${user} login`)
}

function onLogout(user) {
  console.log(`${user} logout`)
}

async function onMessage (msg) {
  var text = msg.text();
  console.log(`From: ${msg.from().name()} To: ${msg.to().name()} Message: ${text}`);
  if(text=="ding") {
      await msg.say("dong");
      
  }
}

const bot = new Wechaty()

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))

app.get('/', (req, res) => {
    (async () => {
        const name = req.query.n;
        const message = req.query.m;

        const contact = await bot.Contact.find({ name: name} )
        if(contact == null) {
            res.send(`contact <${name}> not found`);
        } else {
            contact.say(message);
            res.send("message sent");
    }
    })();


});

var port = 8000;
app.listen(port, () => console.log("App listening on port %d!", port))