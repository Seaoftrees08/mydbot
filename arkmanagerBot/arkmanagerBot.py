import discord
import subprocess

def formatter(str):
    return str.replace("[0;39m", "").replace("[1;32m", "").replace("[1;31m", "")


intents = discord.Intents.default()
intents.message_content = True
token = "とーくん"
running = False

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

@client.event
async def on_message(message):
    global running
    if message.author == client.user:
        return

    args = message.content.split(" ")
    success = False
    if message.content.startswith('$arkmanager') and len(args)==2:
        if args[1] == "start":
            if running:
              await message.channel.send("すでにサーバーが起動しています。")
            else:    
              result = subprocess.run(["arkmanager", "start"], capture_output=True, text=True, encoding="utf-8")
              await message.channel.send("cmdline:")
              await message.channel.send("```" + formatter(result.stdout) + "```")
              running = True
            success = True
        elif args[1] == "stop":
            if running:
              result = subprocess.run(["arkmanager", "stop"], capture_output=True, text=True, encoding="utf-8")
              await message.channel.send("cmdline:")
              await message.channel.send("```" + formatter(result.stdout) + " ```")
              running = False
            else:
                await message.channel.send("すでにサーバーは落ちています")
            success = True
        elif args[1] == "status":
            result = subprocess.run(["arkmanager", "status"], capture_output=True, text=True, encoding="utf-8")
            await message.channel.send("cmdline:")
            await message.channel.send("```" + formatter(result.stdout)[:-2] + "```")
            success = True

    if not success:
        await message.channel.send("コマンドが間違っています")
        await message.channel.send("`$arkmanager start` ark鯖を起動")
        await message.channel.send("`$arkmanager stop` ark鯖を停止")
        await message.channel.send("`$arkmanager status` ark鯖のステータスを確認")

client.run(token)