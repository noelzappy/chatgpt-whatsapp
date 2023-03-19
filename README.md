# Project Description

This project is a WhatsApp bot that uses OpenAI's ChatGPT (GPT-4) to respond to user inputs.

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

### 3. Create `.env` file and update the update the OpenAI API keys and Organization ID

```bash
cp .env.example .env
```

```bash
 nano .env # opens the `.env` file for you to update the details
```

### 4. Start the Bot.

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

To change the prefixes, update the array located inside `src/configs/constants.ts`

## Example

`What is the meaning of life?`
<br/>
`bot What is the meaning of life?`

The bot only responds to messages that are received by you, not sent. It will also work with group messages.
The bot will respond to all private messages you receive and only messages with the prefixes in group chats.
To change the OpenAI model being used, update the `OPENAI_MODEL` variable in the `config/constants.ts` file.

## Used libraries

- https://github.com/pedroslopez/whatsapp-web.js
