//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message } from 'discord.js'
import dotenv from 'dotenv'

//.envファイルを読み込む
dotenv.config()

//Botで使うGetwayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
})

//Botがきちんと起動したか確認
client.once('ready', () => {
    console.log('Ready!')
    if(client.user){
        console.log(client.user.tag)
    }
})

//!timeと入力すると現在時刻を返信するように
client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return
    console.log(message.content)
    if (message.content.startsWith('!ping')) {
        message.channel.send('Pong!')
    }
})

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)