# ChatGPT Whatsapp Chat Bot

This project is a WhatsApp bot that uses OpenAI's ChatGPT to respond to user inputs.
It also includes a cron that you can setup to allow ChatGPT to generate messages and send to recipients at periodic intervals.

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

### 3. Create `.env` file and update the update the OpenAI API keys.

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

### 5. Scan the QR Code with Whatsapp (Link a device)

### 6. Now you're ready to go :)

## Usage

The bot will now respond to all messages you receive.

To use the bot in group chats, simply mention the bot's name or any of the prefixes listed below in your message.

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
  "zappy,",
  "Zappy,",
  "ZAPPY,",
  "zappy?",
  "Zappy?",
  "ZAPPY?",
  "zappy!",
```

To change the prefixes, update the array located inside `src/configs/constants.config.ts`

## Example

`zappy What is the meaning of life?`
<br/>
`bot What is the meaning of life?`

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
