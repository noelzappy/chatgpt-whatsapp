
import { APP_NAME } from ".."
import { api } from "../configs/chatAPI"

export const handler = async (message: any, prompt: any) => {
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

