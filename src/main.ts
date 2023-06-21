//必要なパッケージをインポートする
import { GatewayIntentBits, Client, Partials, Message } from 'discord.js'
import dotenv from 'dotenv'
import { MentionBot } from './mentionBot'
import { MyRoleManager } from './myRoleManager'

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
client.once('ready', async () => {
    console.log('Ready!')

    const roleCmd = [
        {
            name: 'give-role',
            description: 'ロールをもらいます',
        },
        {
            name: 'remove-role',
            description: 'ロールを消します',
        }
    ];

    //await client.application?.commands.set(roleCmd, process.env.TEST_SERVER_ID!);//Test Server
    await client.application?.commands.set(roleCmd, process.env.INTEGRATION_GROUP_ID!);//Test Server

    if(client.user){
        console.log(client.user.tag)
    }
})

//メッセージの処理
client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return

    //mentionBot
    if (message.content.startsWith('$mention')) {
        MentionBot.repeatMention(message)

    //mention-settime
    }else if(message.content.startsWith('$settime')){
        MentionBot.setMilliSecond(message)

    //roleMaster
    }else if(message.content.startsWith('$role')){

    //help
    }else if(message.content.startsWith("$help")){

    }
})

//スラッシュコマンドの処理
client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return

    if(interaction.commandName === 'give-role'){
        MyRoleManager.addRoleCommand(interaction)
    }else if(interaction.commandName === 'remove-role'){
        MyRoleManager.removeRoleCommand(interaction)
    }
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isRoleSelectMenu()) return

    if(interaction.applicationId == client.application?.id){
        MyRoleManager.roleSelected(interaction)
    }
})



//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN)