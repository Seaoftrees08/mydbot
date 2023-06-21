import { Interaction, Message } from 'discord.js'

/**
 * メンションを繰り返すクラス
 * 
 * @param limit メンションの回数の上限
 * @param message Discordから送られてきたメッセージ
 */
export class MentionBot{

    private static limit: Number = 10
    private static ms: number = 500

    static set everyMilliSecond(ms: number){ this.ms = ms }

    /**
     * mentionを繰り返すメソッド
     * 
     * @param message Discordから送られてきたメッセージ
     */
    static async repeatMention(message: Message){
        //メッセージの前処理
        const mentionedRoles = message.mentions.roles
        const mentionedUsers = message.mentions.users
        const isMentioned = mentionedRoles.size + mentionedUsers.size > 0
        const literals = message.content.split(" ")
        const times = literals.length>=2 ? parseInt(literals[1]) : Number.NaN

        if (!isMentioned || literals.length != 4 || Number.isNaN(times)) {
            message.channel.send(
                "構文が間違っています。\n" +
                "構文：`$mention <回数> <メッセージ> <ロールに対するメンション>`\n" +
                "使用例：`$mention 5 起きなさい！ @role` -> 「起きなさい！ @role」と5回メンションをする"
            )
        }else{
            if(times>10){
                message.channel.send("回数は${limit}以下としてください.")
            }else{
                for(let i=0; i<times; i++){
                    if(mentionedRoles.size>0){
                        message.channel.send(`${literals[2]} ${mentionedRoles.first()}`)
                    }else if(mentionedUsers.size>0){
                        message.channel.send(`${literals[2]} ${mentionedUsers.first()}`)
                    }else{
                        message.channel.send('ERROR! Even though the sum of "mentioned" exceeded 1, ' +
                            'both roles and users did not exceed 0! Couse in mentioBot.ts')
                            return
                    }
                    await new Promise(resolve => setTimeout(resolve, this.ms))
                }
            }
        }
    }

    /**
     * メンションの間隔を設定するメソッド
     * 
     * @param message Discordから送られてきたメッセージ
     */
    static setMilliSecond(message: Message){
        const literals = message.content.split(" ")
        const time = literals.length>=2 ? parseInt(literals[1]) : Number.NaN
        console.log(`len: ${literals.length}, time: ${time}}, litelal[1] is ${literals[1]}`)
        if(literals.length>=2 && !Number.isNaN(time)){
            this.ms = time
            message.reply(`メンションの感覚時間を${time}msに設定しました.`)
        }else{
            message.reply(
                "構文が間違っています。\n" +
                "構文：`$settime <整数>`\n" +
                "使用例：`$settime 500` -> メンションの間隔を500ミリ秒に設定する"
            )
        }
    }
}