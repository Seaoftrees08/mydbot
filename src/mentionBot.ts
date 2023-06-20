import { Message } from 'discord.js'

/**
 * メンションを繰り返すクラス
 * 
 * @param limit メンションの回数の上限
 * @param message Discordから送られてきたメッセージ
 */
export class MentionBot{
    static repeatMention(limit: Number, message: Message){
        //メッセージの前処理
        const mentionedRoles = message.mentions.roles
        const mentionedUsers = message.mentions.users
        const isMentioned = mentionedRoles.size + mentionedUsers.size > 0
        const literals = message.content.split(" ")
        const times = literals.length>2 ? parseInt(literals[1]) : Number.NaN

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
                        message.channel.send(literals[2] + " " + mentionedRoles.first())
                    }else if(mentionedUsers.size>0){
                        message.channel.send(literals[2] + " " + mentionedUsers.first())
                    }else{
                        message.channel.send('ERROR! Even though the sum of "mentioned" exceeded 1, ' +
                            'both roles and users did not exceed 0! Couse in mentioBot.ts')
                    }
                }
            }
        }
    }
}