
const stringSimilarity = require("string-similarity");
import { APP_NAME } from ".."
import { api } from "../configs/chatAPI"
import data from "../../data.json"
import { validateResponse } from "./validateResponse";

export const handler = async (message: any, prompt: any) => {
    try {
        const start = Date.now()
            
        console.log(`[${APP_NAME}] Received prompt from ` + message.from + ": " + prompt)

        const wordMatch = {
            index: -1,
            value: 0
        }

        data.forEach((res: any, index: number) => { 
            const {question} = res
            const similarity = stringSimilarity.compareTwoStrings(question, prompt)

            if (similarity > wordMatch.value) {
                wordMatch.index = index
                wordMatch.value = similarity
            }
        })

        if (wordMatch.value > 0.5) { 
            const dataMessage = data[wordMatch.index]
            
            const { answers } = dataMessage
            const randomAnswer = answers[Math.floor(Math.random() * answers.length)]

            console.log(`[${APP_NAME}] Answer to ${message.from}: ${randomAnswer}`)

            message.reply(randomAnswer)
            return
        }

        const response = await api.sendMessage(prompt)

        console.log(`[${APP_NAME}] Answer to ${message.from}: ${response.response}`)

        const end = Date.now() - start

        console.log(`[${APP_NAME}] ChatGPT took ` + end + "ms")

        const { response: responseMessage } = response

        const isValid = validateResponse(responseMessage)

        if (!isValid) return
        
        // Send the response to the chat
        message.reply(response.response)
    } catch (error: any) {
        console.error(`[${APP_NAME}] Failed to send message to ChatGPT API: ` + error)
        // message.reply("I'm sorry, I'm not available at the moment to reply. I will as soon as possible.")
    }  
}

