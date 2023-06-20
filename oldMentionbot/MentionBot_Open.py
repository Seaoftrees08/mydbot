import discord
import time

def isInteger(value):
   try:
      i = int(value)
      return True
   except:
      return False


client = discord.Client(intents=discord.Intents.all())
TOKEN = 'token'

@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    literal = message.content
    if literal.startswith('$mention'):
        mlist = message.mentions
        role = message.role_mentions
        mens = len(mlist)==1 or len(role)==1
        args = literal.split(" ")
        if(not mens or len(args)!=4 or not isInteger(args[1])):
            await message.channel.send(
                "構文が間違っています。\n" +
                "構文：`$mention <回数> <メッセージ> <ロールに対するメンション>`\n" +
                "使用例：`$mention 5 起きなさい！ @role` -> 「起きなさい！ @role」と5回メンションをする"
            )
        elif(int(args[1])>10):
            await message.channel.send("回数は10以下としてください。")
        else:
            for i in range(int(args[1])):
                if len(mlist)==1:
                    await message.channel.send(args[2] + " " + mlist[0].mention)
                else:
                    await message.channel.send(args[2] + " " + role[0].mention)
                time.sleep(0.1)

client.run(TOKEN)