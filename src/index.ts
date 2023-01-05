const process = require("process")
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
import { ChatGPTAPIBrowser } from 'chatgpt'

// Environment variables
require("dotenv").config()

// Prefix check
const prefixEnabled = true
const prefix = ["Zappy", "ZappyBot", "Zappy-Bot", "Zappy Bot", "zappy", "zappybot", "zappy-bot", "zappy bot"]
const APP_NAME = "Zappy BOT"

// Whatsapp Client
const client = new Client({
     authStrategy: new LocalAuth(),
})

// ChatGPT Client
const api = new ChatGPTAPIBrowser(
    {
    email: process.env.OPENAI_EMAIL,
    password: process.env.OPENAI_PASSWORD,
    isGoogleLogin: true
  }
)

// Entrypoint
const start = async () => {
    // Ensure the API is properly authenticated
    try {
        await api.initSession()
    } catch (error: any) {
        console.error(`[${APP_NAME}] Failed to authenticate with the ChatGPT API: ` + error.message)
        process.exit(1)
    }

    // Whatsapp auth
    client.on("qr", (qr: string) => {
        console.log(`[${APP_NAME}] Scan this QR code in whatsapp to log in:`)
        qrcode.generate(qr, { small: true });
    })

    // Whatsapp ready
    client.on("ready", () => {
        console.log(`[${APP_NAME}] Client is ready!`);
    })

    // Whatsapp message
    client.on("message", async (message: any) => {
        if (message.body.length == 0) return
        if (message.from == "status@broadcast") return

        if (prefixEnabled) {
            // get first word of message
            const messagePrefix =  message.body.split(" ")[0]
            const isPrefix = prefix.includes(messagePrefix)

            if (isPrefix) {
                // Get the rest of the message
                const prompt = message.body.substring(messagePrefix.length);
                await handleMessage(message, prompt)
            }
        } else {
            await handleMessage(message, message.body)
        }
    })

    client.initialize()
}

const handleMessage = async (message: any, prompt: any) => {
    try {
        const start = Date.now()
            
        console.log(`[${APP_NAME}] Received prompt from ` + message.from + ": " + prompt)
        const response = await api.sendMessage(prompt)

        console.log(`[${APP_NAME}] Answer to ${message.from}: ${response.response}`)

        const end = Date.now() - start

        console.log(`[${APP_NAME}] ChatGPT took ` + end + "ms")

        // Send the response to the chat
        message.reply(response.response)
    } catch (error: any) {
        console.error(`[${APP_NAME}] Failed to send message to ChatGPT API: ` + error)
        message.reply("I'm sorry, I'm not available at the moment to reply. I will as soon as possible.")
    }  
}

start()
