const qrcode = require("qrcode-terminal");
import { api } from "./configs/chatAPI";
import { wClient as client } from "./configs/wClient";
import { handler as handleMessage  } from "./controllers/handleMessage";


// Prefix check
const prefixEnabled = false
const prefix = ["Zappy", "ZappyBot", "Zappy-Bot", "Zappy Bot", "zappy", "zappybot", "zappy-bot", "zappy bot"]
export const APP_NAME = "Zappy BOT"

// Entrypoint
const start = async () => {
    // Ensure the API is properly authenticated
    try {
        await api.initSession()
    } catch (error: any) {
        console.error(`[${APP_NAME}] Failed to authenticate with the ChatGPT API: ` + error.message)
        api.closeSession()
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

start()
