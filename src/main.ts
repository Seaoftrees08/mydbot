//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message } from 'discord.js'
import dotenv from 'dotenv'
import { MentionBot } from './mentionBot'

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

//!メイン処理
client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return

    //mentionBot
    if (message.content.startsWith('$mention')) {
        const limit = 10
        MentionBot.repeatMention(limit, message)

    //roleMaster
    }else if(message.content.startsWith('$role')){

    }
})

//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)