# ChatGPT Whatsapp Chat Bot

This project is a WhatsApp bot that uses OpenAI's ChatGPT to respond to user inputs.
It also includes a cron that you can setup to allow ChatGPT to generate messages and send to recipients at periodic intervals.


# ![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) [ChatGPT](https://chat.openai.com) Is facing server overload issues at the moment and this bot may not work well until that is resolved by OpenAI. You can visit [ChatGPT](https://chat.openai.com) to track the status of the issue.




![photo_2023-01-06 20 06 27](https://user-images.githubusercontent.com/38583057/211094028-9c512d9c-56df-4195-b21b-f588a33a7d79.jpeg)


## Requirements

- Node.js (18.x)
- A recent version of npm
- An OpenAI Account
- A Whatsapp Account

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/noelzappy/chatgpt-whatsapp.git
```
```bash
cd chatgpt-whatsapp
```
 
 ### 2. Install depedencies
 ```bash
 yarn install
 ```
 
 ### 3. Create `.env` file and update the email and passwords with OpenAI credentials
 If your account is Google SignedIn, then the password should be your Google Account's pssword.
 Also based on whether your account is Google SignIn or not, check the `src/configs/chatAPI.config.ts` 
 and update the `isGoogleLogin` option passed do the `ChatGPTAPIBrowser`.
 
 ```bash
 cp .env.example .env
 ```
 ```bash
  nano .env # opens the `.env` file for you to update the details
  ```
  
  ### 4. Start the Bot.
  Please check the `src/data` folder and update the values stored in the `recipients.json` 
  and the `responses.json` files to your preferences.
  ```bash
  yarn start
  ```
  
### 5. A browser opens, complete the captcha and click login
### 6. Scan the QR Code with Whatsapp (Link a device)
### 7. Now you're ready to go :)

## Usage

To use the bot, simply send a message with one of the prefixes below followed by your question or message.

```
  "Zappy",
  "ZappyBot",
  "Zappy-Bot",
  "Zappy Bot",
  "zappy",
  "zappybot",
  "zappy-bot",
  "zappy bot",
  "gpt",
  "GPT",
  "gpt3",
  "GPT3",
  "gpt-3",
  "GPT-3",
  "bot",
  "Bot",
  "BOT",
  ".",
  "!",
  "?",
  "z",
  "Z",
  "zap",
  "Zap",
  "ZAP",
```

To change the prefixes, update the array located inside `src/configs/constants.config.ts`

## Example

`zappy What is the meaning of life?`
<br/>
`. What is the meaning of life?`

The bot only responds to messages that are received by you, not sent. It will also work with group messages.

# Crons
The crons are used to schedule periodic messages to contacts defined inside the `src/data/recipients.json` file.
Currently it includes one cron that will generate a good morning text from ChatGPT and send that message your recipients every Tuesday at `9:10AM`
You can find the service located in `src/services/message.service.ts`. You can add as many crons that fit your need.


# Troubleshooting
Incase you get an `sqlite` related error, Ensure you have a folder called `db` created at the root of the project,
at the same level as the `src` folder. This is used to store an `sqlite` database that is used to store a conversation's context
which will enable you to ask follow up questions to the ChatGPT





## Used libraries

- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/transitive-bullshit/chatgpt-api
